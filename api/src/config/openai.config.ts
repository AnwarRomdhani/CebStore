import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  /**
   * Clé API OpenAI
   * @example sk-xxxxxxxxxxxxxxxxxxxxxxxx
   */
  apiKey: process.env.OPENAI_API_KEY || '',

  /**
   * Modèle d'embedding par défaut
   * @default text-embedding-ada-002
   */
  embeddingModel:
    process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',

  /**
   * Modèle de chat par défaut
   * @default gpt-3.5-turbo
   */
  chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-3.5-turbo',

  /**
   * Température pour les réponses du chatbot
   * @default 0.7
   */
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),

  /**
   * Nombre maximum de tokens pour les réponses
   * @default 1000
   */
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),

  /**
   * Organisation OpenAI (optionnel)
   */
  organization: process.env.OPENAI_ORG_ID || undefined,
}));
