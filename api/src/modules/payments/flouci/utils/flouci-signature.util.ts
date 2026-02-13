/**
 * Utilitaire pour la signature Flouci
 * @description Génération et vérification des signatures HMAC-SHA256
 */

import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

/**
 * Logger pour les utilitaires de signature
 */
const logger = new Logger('FlouciSignature');

/**
 * Algorithme de signature
 */
const ALGORITHM = 'sha256';

/**
 * Encoder les données en JSON et buffer
 * @param data - Données à encoder
 * @returns Buffer des données JSON
 */
function encodeData(data: Record<string, unknown>): Buffer {
  return Buffer.from(JSON.stringify(data));
}

/**
 * Générer une signature HMAC-SHA256
 * @param data - Données à signer
 * @param secretKey - Clé secrète
 * @returns Signature hexadécimale
 */
export function generateSignature(data: Record<string, unknown>, secretKey: string): string {
  try {
    const payload = encodeData(data);
    const signature = crypto.createHmac(ALGORITHM, secretKey).update(payload).digest('hex');
    return signature;
  } catch (error) {
    logger.error(`Error generating signature: ${error}`);
    throw new Error('Failed to generate signature');
  }
}

/**
 * Vérifier une signature HMAC-SHA256
 * @param data - Données reçues
 * @param signature - Signature à vérifier (hex)
 * @param secretKey - Clé secrète
 * @returns true si la signature est valide
 */
export function verifySignature(
  data: Record<string, unknown>,
  signature: string,
  secretKey: string,
): boolean {
  try {
    const expectedSignature = generateSignature(data, secretKey);

    // Comparaison sécurisée (timing-safe)
    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    logger.error(`Error verifying signature: ${error}`);
    return false;
  }
}

/**
 * Vérifier la signature du webhook Flouci
 * @param payload - Corps du webhook
 * @param receivedSignature - Signature reçue dans le header
 * @param webhookSecret - Clé secrète du webhook
 * @returns Résultat de la vérification
 */
export function verifyFlouciWebhookSignature(
  payload: Record<string, unknown>,
  receivedSignature: string,
  webhookSecret: string,
): { valid: boolean; error?: string } {
  try {
    // Vérifier que la signature est présente
    if (!receivedSignature) {
      return { valid: false, error: 'Missing signature' };
    }

    // Vérifier le format de la signature (sha256=...)
    const signatureParts = receivedSignature.split('=');
    if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
      return { valid: false, error: 'Invalid signature format' };
    }

    const signatureHash = signatureParts[1];

    // Vérifier la signature
    const isValid = verifySignature(payload, signatureHash, webhookSecret);

    if (!isValid) {
      return { valid: false, error: 'Signature verification failed' };
    }

    return { valid: true };
  } catch (error) {
    logger.error(`Error verifying webhook signature: ${error}`);
    return { valid: false, error: 'Signature verification error' };
  }
}

/**
 * Préparer les données de paiement pour la signature
 * @param amount - Montant en millimes
 * @param developerTrackingId - ID de tracking
 * @param successLink - URL de succès
 * @param failLink - URL d'échec
 * @param webhook - URL du webhook
 * @returns Données formatées pour la signature
 */
export function preparePaymentData(
  amount: number,
  developerTrackingId: string,
  successLink: string,
  failLink: string,
  webhook: string,
): Record<string, unknown> {
  return {
    amount,
    developer_tracking_id: developerTrackingId,
    success_link: successLink,
    fail_link: failLink,
    webhook,
  };
}

/**
 * Générer la signature pour l\'initialisation du paiement
 * @param amount - Montant en millimes
 * @param developerTrackingId - ID de tracking
 * @param successLink - URL de succès
 * @param failLink - URL d'échec
 * @param webhook - URL du webhook
 * @param privateKey - Clé privée Flouci
 * @returns Signature générée
 */
export function generatePaymentSignature(
  amount: number,
  developerTrackingId: string,
  successLink: string,
  failLink: string,
  webhook: string,
  privateKey: string,
): string {
  const data = preparePaymentData(
    amount,
    developerTrackingId,
    successLink,
    failLink,
    webhook,
  );
  return generateSignature(data, privateKey);
}

/**
 * Créer l\'en-tête d\'autorisation pour l\'API Flouci
 * @param publicKey - Clé publique
 * @param signature - Signature générée
 * @returns En-tête d\'autorisation formaté
 */
export function createAuthorizationHeader(publicKey: string, signature: string): string {
  return `Bearer ${publicKey}:${signature}`;
}

/**
 * Extraire la signature du header de la requête
 * @param authHeader - En-tête Authorization
 * @returns { publicKey, signature }
 */
export function parseAuthorizationHeader(
  authHeader: string,
): { publicKey: string; signature: string } | null {
  try {
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    const parts = authHeader.substring(7).split(':');
    if (parts.length !== 2) {
      return null;
    }

    return {
      publicKey: parts[0],
      signature: parts[1],
    };
  } catch {
    return null;
  }
}

/**
 * Hacher un mot de passe ou une clé secrète avec salt
 * @param secret - Secret à hacher
 * @param salt - Salt optionnel
 * @returns Hash avec salt
 */
export function hashWithSalt(secret: string, salt?: string): { hash: string; salt: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(secret, usedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: usedSalt };
}

/**
 * Vérifier un secret hashé
 * @param secret - Secret à vérifier
 * @param hash - Hash à comparer
 * @param salt - Salt utilisé
 * @returns true si le secret correspond
 */
export function verifyHashedSecret(secret: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashWithSalt(secret, salt);
  return computedHash === hash;
}

/**
 * Générer un ID de tracking unique
 * @param orderId - ID de la commande
 * @returns ID de tracking unique
 */
export function generateTrackingId(orderId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${orderId}-${timestamp}-${random}`;
}

/**
 * Extraire l\'ID de commande depuis le tracking ID
 * @param trackingId - ID de tracking
 * @returns ID de la commande
 */
export function extractOrderIdFromTrackingId(trackingId: string): string {
  // Format: orderId-timestamp-random
  const parts = trackingId.split('-');
  if (parts.length < 3) {
    throw new Error('Invalid tracking ID format');
  }
  // Les deux premières parties (orderId peut contenir des tirets)
  // On prend tout sauf les 2 dernières parties (timestamp et random)
  return parts.slice(0, -2).join('-');
}

