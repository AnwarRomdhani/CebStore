//Statut de la transaction Flouci
export enum FlouciTransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

// Type de paiement
export enum FlouciPaymentType {
  CARD = 'CARD',
  WALLET = 'WALLET',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
}

// Payload pour générer un paiement
export interface FlouciPaymentPayload {
  amount: number;
  success_link: string;
  fail_link: string;
  webhook: string;
  developer_tracking_id: string;
  payment_reason?: string;
}

// Réponse de l'API de génération de paiement
export interface FlouciPaymentResponse {
  status: string;
  message: string;
  result: {
    payment_id: string;
    link: string;
    payment_reason: string;
    developer_tracking_id: string;
    status: FlouciTransactionStatus;
  };
}

// Statut de transaction POS
export interface FlouciPosTransactionStatus {
  id: string;
  payment_id: string;
  developer_tracking_id: string;
  amount: number;
  status: FlouciTransactionStatus;
  created_at: string;
  updated_at: string;
}

// Réponse du statut de transaction
export interface FlouciTransactionStatusResponse {
  status: string;
  message: string;
  transactions: FlouciPosTransactionStatus[];
}

// Données du webhook Flouci
export interface FlouciWebhookData {
  payment_id: string;
  developer_tracking_id: string;
  status: FlouciTransactionStatus;
  amount: number;
  payment_reason: string;
  created_at: string;
  signature?: string;
}

// Alias pour FlouciWebhookData (compatibilité)
export type FlouciWebhookDto = FlouciWebhookData;

// Configuration de l'application Flouci
export interface FlouciAppConfig {
  publicKey: string;
  secretKey: string;
  successUrl: string;
  failUrl: string;
  webhookUrl: string;
  sandbox: boolean;
}

// Options pour initier un paiement
export interface InitiatePaymentOptions {
  amount: number;
  orderId: string;
  reason?: string;
  customerEmail?: string;
  customerPhone?: string;
  metadata?: Record<string, unknown>;
}

// Résultat de l'initialisation du paiement
export interface PaymentInitiationResult {
  paymentId: string;
  paymentLink: string;
  trackingId: string;
  amountMillimes: number;
  expiresAt: Date;
}

// Résultat de la vérification du webhook
export interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
  data?: FlouciWebhookData;
}

// Erreurs Flouci
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

// Erreur Flouci
export class FlouciException extends Error {
  code: FlouciErrorCode;
  details?: Record<string, unknown>;

  constructor(
    code: FlouciErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'FlouciException';
    this.code = code;
    this.details = details;
  }
}
