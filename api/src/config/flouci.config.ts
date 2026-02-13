/**
 * Configuration Flouci
 * @description Gère les variables d'environnement pour le paiement Flouci
 */

import { registerAs } from '@nestjs/config';

export default registerAs('flouci', () => ({
  /**
   * Clé publique de l'application Flouci
   */
  appPublicKey: process.env.FLOUCI_APP_PUBLIC || '',

  /**
   * Clé secrète de l'application Flouci
   */
  appSecretKey: process.env.FLOUCI_APP_SECRET || '',

  /**
   * URL de succès après paiement
   * @example https://votre-site.com/payment/success
   */
  successUrl: process.env.FLOUCI_SUCCESS_URL || 'http://localhost:3000/payment/success',

  /**
   * URL d'échec après paiement
   * @example https://votre-site.com/payment/failed
   */
  failUrl: process.env.FLOUCI_FAIL_URL || 'http://localhost:3000/payment/failed',

  /**
   * URL du webhook pour les notifications de paiement
   * @example https://votre-site.com/api/v1/payments/flouci/webhook
   */
  webhookUrl: process.env.FLOUCI_WEBHOOK_URL || 'http://localhost:3001/api/v1/payments/flouci/webhook',

  /**
   * Mode sandbox pour les tests
   * @default true
   */
  sandbox: process.env.FLOUCI_SANDBOX === 'true' || true,

  /**
   * Clé secrète pour vérifier les signatures des webhooks
   */
  webhookSecret: process.env.FLOUCI_WEBHOOK_SECRET || '',

  /**
   * Devise par défaut
   * @default TND
   */
  currency: process.env.FLOUCI_CURRENCY || 'TND',
}));

