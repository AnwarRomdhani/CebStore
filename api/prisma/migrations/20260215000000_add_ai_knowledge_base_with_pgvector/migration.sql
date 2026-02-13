-- Migration pour ajouter la table ai_knowledge_base avec support pgvector
-- Cette table stocke les embeddings pour la recherche sémantique

-- Créer l'extension pgvector si elle n'existe pas
CREATE EXTENSION IF NOT EXISTS vector;

-- Table pour la base de connaissances AI (RAG)
CREATE TABLE IF NOT EXISTS ai_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    document_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    metadata JSONB DEFAULT '{}',
    embedding vector(1536),  -- Dimension pour text-embedding-ada-002
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la recherche de similarité cosinus
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_embedding 
ON ai_knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Index sur le type de document
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_document_type 
ON ai_knowledge_base (document_type);

-- Index sur la date de mise à jour
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_updated_at 
ON ai_knowledge_base (updated_at DESC);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_ai_knowledge_updated_at ON ai_knowledge_base;
CREATE TRIGGER update_ai_knowledge_updated_at
    BEFORE UPDATE ON ai_knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaire pour la documentation
COMMENT ON TABLE ai_knowledge_base IS 'Base de connaissances pour la recherche sémantique RAG';
COMMENT ON COLUMN ai_knowledge_base.content IS 'Contenu textuel à indexer';
COMMENT ON COLUMN ai_knowledge_base.document_type IS 'Type de document: PRODUCT, CATEGORY, FAQ, POLICY, REVIEW, GENERAL';
COMMENT ON COLUMN ai_knowledge_base.metadata IS 'Métadonnées additionnelles en JSON';
COMMENT ON COLUMN ai_knowledge_base.embedding IS 'Vecteur dembedding généré par OpenAI';

