import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  // Clé API OpenAI
  apiKey: process.env.OPENAI_API_KEY || '',

  // Modèle d'embedding par défaut
  embeddingModel:
    process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',

  // Modèle de chat par défaut
  chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-3.5-turbo',

  // Température pour les réponses du chatbot
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),

  // Nombre maximum de tokens pour les réponses
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),

  // Organisation OpenAI (optionnel)
  organization: process.env.OPENAI_ORG_ID || undefined,
}));
