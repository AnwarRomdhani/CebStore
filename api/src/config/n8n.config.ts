import { registerAs } from '@nestjs/config';

export default registerAs('n8n', () => ({
  /**
   * URL de base du webhook n8n
   * @example https://your-n8n-instance.com/webhook
   */
  webhookUrl: process.env.N8N_WEBHOOK_URL || '',

  /**
   * Clé secrète pour authentifier les webhooks n8n (optionnel)
   */
  webhookSecret: process.env.N8N_WEBHOOK_SECRET || '',

  /**
   * Webhook pour les notifications de commande
   */
  orderWebhook: process.env.N8N_ORDER_WEBHOOK || '',

  /**
   * Webhook pour les notifications de paiement
   */
  paymentWebhook: process.env.N8N_PAYMENT_WEBHOOK || '',

  /**
   * Webhook pour les notifications d'inscription
   */
  userWebhook: process.env.N8N_USER_WEBHOOK || '',

  /**
   * Webhook pour les notifications de review
   */
  reviewWebhook: process.env.N8N_REVIEW_WEBHOOK || '',

  /**
   * Timeout pour les requêtes n8n en millisecondes
   * @default 30000
   */
  timeout: parseInt(process.env.N8N_TIMEOUT || '30000', 10),

  /**
   * Nombre de tentatives de retry pour les webhooks
   * @default 3
   */
  retries: parseInt(process.env.N8N_RETRIES || '3', 10),
}));
