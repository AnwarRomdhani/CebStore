export interface Embedding {
  values: number[];
  dimension: number;
  model: string;
}

// Résultat d'une recherche de similarité
export interface SimilaritySearchResult {
  id: string;
  score: number;
  content: string;
  metadata: Record<string, unknown>;
}

// Type de document pour la base de connaissances
export enum KnowledgeDocumentType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  FAQ = 'FAQ',
  POLICY = 'POLICY',
  REVIEW = 'REVIEW',
  GENERAL = 'GENERAL',
}

// Type de document (alias pour KnowledgeDocumentType)
export enum DocumentType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  FAQ = 'FAQ',
  POLICY = 'POLICY',
  REVIEW = 'REVIEW',
  GENERAL = 'GENERAL',
}

// Statut de traitement d'un document
export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Configuration pour la recherche sémantique
export interface SemanticSearchConfig {
  limit?: number;
  similarityThreshold?: number;
  includeMetadata?: boolean;
}

// Réponse du chatbot
export interface ChatbotResponse {
  answer: string;
  sources: string[];
  processingTimeMs: number;
  model: string;
  confidenceScore?: number;
}

// Message pour le chatbot
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Session de conversation
export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Configuration pour OpenAI
export interface OpenAIConfig {
  apiKey: string;
  embeddingModel: string;
  chatModel: string;
  temperature: number;
  maxTokens: number;
}

// Type de recommandation de produit
export interface ProductRecommendation {
  productId: string;
  productName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  score: number;
  reason: string;
}

// Résultat de l'analyse de sentiment
export interface SentimentAnalysisResult {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
}

// Configuration pour la génération de description SEO
export interface SEOGenerationConfig {
  keywords: string[];
  targetLength: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'persuasive';
  includeHtmlTags?: boolean;
}

// Paramètres pour la génération d'embeddings en lot
export interface BatchEmbeddingConfig {
  ids: string[];
  contents: string[];
  documentType: KnowledgeDocumentType;
}

// Résultat d'un embedding en lot
export interface BatchEmbeddingResult {
  id: string;
  embedding: Embedding;
  success: boolean;
  error?: string;
}

//Statistiques de la base de connaissances
export interface KnowledgeBaseStats {
  totalDocuments: number;
  documentsByType: Record<KnowledgeDocumentType, number>;
  embeddingDimension: number;
  lastUpdated: Date;
}

// Contexte pour la recherche RAG
export interface RAGContext {
  relevantHistory: string[];
  relevantDocuments: SimilaritySearchResult[];
  userContext?: Record<string, unknown>;
}

// Requête RAG complète
export interface RAGQuery {
  question: string;
  context?: RAGContext;
  searchConfig?: SemanticSearchConfig;
  chatSessionId?: string;
}
