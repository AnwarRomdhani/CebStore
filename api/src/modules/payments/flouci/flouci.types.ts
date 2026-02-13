/**
 * Configuration pour les types Flouci
 * @description Définitions des types TypeScript pour l'API Flouci
 */

/**
 * Statut de la transaction Flouci
 */
export enum FlouciTransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Type de paiement
 */
export enum FlouciPaymentType {
  CARD = 'CARD',
  WALLET = 'WALLET',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
}

/**
 * Payload pour générer un paiement
 */
export interface FlouciPaymentPayload {
  /** Montant en millimes */
  amount: number;
  /** URL de succès */
  success_link: string;
  /** URL d'échec */
  fail_link: string;
  /** URL du webhook */
  webhook: string;
  /** ID de suivi pour le développeur */
  developer_tracking_id: string;
  /** Raison du paiement (optionnel) */
  payment_reason?: string;
}

/**
 * Réponse de l'API de génération de paiement
 */
export interface FlouciPaymentResponse {
  /** Statut de la réponse */
  status: string;
  /** Message de la réponse */
  message: string;
  /** Données de la réponse */
  result: {
    /** ID du paiement */
    payment_id: string;
    /** Lien de paiement */
    link: string;
    /** Raison du paiement */
    payment_reason: string;
    /** ID de suivi développeur */
    developer_tracking_id: string;
    /** Statut du paiement */
    status: FlouciTransactionStatus;
  };
}

/**
 * Statut de transaction POS
 */
export interface FlouciPosTransactionStatus {
  /** ID de la transaction */
  id: string;
  /** ID du paiement */
  payment_id: string;
  /** ID de suivi développeur */
  developer_tracking_id: string;
  /** Montant */
  amount: number;
  /** Statut */
  status: FlouciTransactionStatus;
  /** Date de création */
  created_at: string;
  /** Date de mise à jour */
  updated_at: string;
}

/**
 * Réponse du statut de transaction
 */
export interface FlouciTransactionStatusResponse {
  /** Statut de la réponse */
  status: string;
  /** Message de la réponse */
  message: string;
  /** Liste des transactions */
  transactions: FlouciPosTransactionStatus[];
}

/**
 * Données du webhook Flouci
 */
export interface FlouciWebhookData {
  /** ID du paiement */
  payment_id: string;
  /** ID de suivi développeur */
  developer_tracking_id: string;
  /** Statut du paiement */
  status: FlouciTransactionStatus;
  /** Montant */
  amount: number;
  /** Raison du paiement */
  payment_reason: string;
  /** Date de création */
  created_at: string;
  /** Signature du webhook */
  signature?: string;
}

/**
 * Configuration de l'application Flouci
 */
export interface FlouciAppConfig {
  /** Clé publique */
  publicKey: string;
  /** Clé secrète */
  secretKey: string;
  /** URL de succès */
  successUrl: string;
  /** URL d'échec */
  failUrl: string;
  /** URL du webhook */
  webhookUrl: string;
  /** Mode sandbox */
  sandbox: boolean;
}

/**
 * Options pour initier un paiement
 */
export interface InitiatePaymentOptions {
  /** Montant en dinars */
  amount: number;
  /** ID de la commande */
  orderId: string;
  /** Raison du paiement */
  reason?: string;
  /** Email du client (optionnel) */
  customerEmail?: string;
  /** Numéro de téléphone du client (optionnel) */
  customerPhone?: string;
  /** Métadonnées additionnelles */
  metadata?: Record<string, unknown>;
}

/**
 * Résultat de l'initialisation du paiement
 */
export interface PaymentInitiationResult {
  /** ID du paiement */
  paymentId: string;
  /** Lien de paiement */
  paymentLink: string;
  /** ID de suivi */
  trackingId: string;
  /** Montant en millimes */
  amountMillimes: number;
  /** Date d'expiration */
  expiresAt: Date;
}

/**
 * Résultat de la vérification du webhook
 */
export interface WebhookVerificationResult {
  /** Valide ou non */
  valid: boolean;
  /** Message d'erreur si invalide */
  error?: string;
  /** Données du webhook si valide */
  data?: FlouciWebhookData;
}

/**
 * Erreurs Flouci
 */
export enum FlouciErrorCode {
  INVALID_PUBLIC_KEY = 'INVALID_PUBLIC_KEY',
  INVALID_SECRET_KEY = 'INVALID_SECRET_KEY',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  PAYMENT_NOT_FOUND = 'PAYMENT_NOT_FOUND',
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
  PAYMENT_ALREADY_PROCESSED = 'PAYMENT_ALREADY_PROCESSED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  WEBHOOK_VERIFICATION_FAILED = 'WEBHOOK_VERIFICATION_FAILED',
}

/**
 * Erreur Flouci
 */
export class FlouciException extends Error {
  code: FlouciErrorCode;
  details?: Record<string, unknown>;

  constructor(code: FlouciErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'FlouciException';
    this.code = code;
    this.details = details;
  }
}

