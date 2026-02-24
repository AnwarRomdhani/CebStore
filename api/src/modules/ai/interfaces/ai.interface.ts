export interface Embedding {
  /** Valeurs du vecteur */
  values: number[];
  /** Dimension du vecteur */
  dimension: number;
  /** Modèle utilisé pour générer l'embedding */
  model: string;
}

/**
 * Résultat d'une recherche de similarité
 */
export interface SimilaritySearchResult {
  /** ID de l'enregistrement */
  id: string;
  /** Score de similarité cosinus (0-1) */
  score: number;
  /** Contenu textuel */
  content: string;
  /** Métadonnées associées */
  metadata: Record<string, unknown>;
}

/**
 * Type de document pour la base de connaissances
 */
export enum KnowledgeDocumentType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  FAQ = 'FAQ',
  POLICY = 'POLICY',
  REVIEW = 'REVIEW',
  GENERAL = 'GENERAL',
}

/**
 * Type de document (alias pour KnowledgeDocumentType)
 */
export enum DocumentType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  FAQ = 'FAQ',
  POLICY = 'POLICY',
  REVIEW = 'REVIEW',
  GENERAL = 'GENERAL',
}

/**
 * Statut de traitement d'un document
 */
export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Configuration pour la recherche sémantique
 */
export interface SemanticSearchConfig {
  /** Nombre maximum de résultats */
  limit?: number;
  /** Seuil de similarité minimum */
  similarityThreshold?: number;
  /** Inclure les métadonnées */
  includeMetadata?: boolean;
}

/**
 * Réponse du chatbot
 */
export interface ChatbotResponse {
  /** Réponse générée */
  answer: string;
  /** Sources utilisées */
  sources: string[];
  /** Temps de génération en millisecondes */
  processingTimeMs: number;
  /** Nom du modèle utilisé */
  model: string;
  /** Score de confiance (0-1) */
  confidenceScore?: number;
}

/**
 * Message pour le chatbot
 */
export interface ChatMessage {
  /** Rôle du message */
  role: 'user' | 'assistant' | 'system';
  /** Contenu du message */
  content: string;
  /** Horodatage */
  timestamp: Date;
}

/**
 * Session de conversation
 */
export interface ChatSession {
  /** ID de la session */
  id: string;
  /** ID de l'utilisateur (optionnel pour les utilisateurs anonymes) */
  userId?: string;
  /** Historique des messages */
  messages: ChatMessage[];
  /** Métadonnées de la session */
  metadata: Record<string, unknown>;
  /** Date de création */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt: Date;
}

/**
 * Configuration pour OpenAI
 */
export interface OpenAIConfig {
  apiKey: string;
  embeddingModel: string;
  chatModel: string;
  temperature: number;
  maxTokens: number;
}

/**
 * Type de recommandation de produit
 */
export interface ProductRecommendation {
  /** ID du produit recommandé */
  productId: string;
  /** Nom du produit */
  productName: string;
  /** Description courte */
  description?: string;
  /** Prix */
  price: number;
  /** URL de l'image */
  imageUrl?: string;
  /** Score de recommandation (0-1) */
  score: number;
  /** Raison de la recommandation */
  reason: string;
}

/**
 * Résultat de l'analyse de sentiment
 */
export interface SentimentAnalysisResult {
  /** Score de sentiment (-1 à 1) */
  score: number;
  /** Label du sentiment */
  label: 'positive' | 'neutral' | 'negative';
  /** Confiance de l'analyse (0-1) */
  confidence: number;
  /** Mots-clés positifs détectés */
  positiveKeywords: string[];
  /** Mots-clés négatifs détectés */
  negativeKeywords: string[];
}

/**
 * Configuration pour la génération de description SEO
 */
export interface SEOGenerationConfig {
  /** Mots-clés à inclure */
  keywords: string[];
  /** Longueur souhaitée */
  targetLength: 'short' | 'medium' | 'long';
  /** Ton du contenu */
  tone: 'professional' | 'casual' | 'persuasive';
  /** Inclure les balises HTML */
  includeHtmlTags?: boolean;
}

/**
 * Paramètres pour la génération d'embeddings en lot
 */
export interface BatchEmbeddingConfig {
  /** IDs des documents à traiter */
  ids: string[];
  /** Contenus à encoder */
  contents: string[];
  /** Type de document */
  documentType: KnowledgeDocumentType;
}

/**
 * Résultat d'un embedding en lot
 */
export interface BatchEmbeddingResult {
  /** ID du document */
  id: string;
  /** Embedding généré */
  embedding: Embedding;
  /** Succès ou échec */
  success: boolean;
  /** Message d'erreur en cas d'échec */
  error?: string;
}

/**
 * Statistiques de la base de connaissances
 */
export interface KnowledgeBaseStats {
  /** Nombre total de documents */
  totalDocuments: number;
  /** Nombre de documents par type */
  documentsByType: Record<KnowledgeDocumentType, number>;
  /** Dimension des embeddings */
  embeddingDimension: number;
  /** Dernière mise à jour */
  lastUpdated: Date;
}

/**
 * Contexte pour la recherche RAG
 */
export interface RAGContext {
  /** Historique de conversation pertinent */
  relevantHistory: string[];
  /** Documents pertinents trouvés */
  relevantDocuments: SimilaritySearchResult[];
  /** Métadonnées utilisateur */
  userContext?: Record<string, unknown>;
}

/**
 * Requête RAG complète
 */
export interface RAGQuery {
  /** Question de l'utilisateur */
  question: string;
  /** Contexte additionnel */
  context?: RAGContext;
  /** Configuration de recherche */
  searchConfig?: SemanticSearchConfig;
  /** ID de session de chat */
  chatSessionId?: string;
}
