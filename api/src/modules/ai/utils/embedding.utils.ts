/**
 * Utilitaires pour les embeddings
 * @description Fonctions pour manipuler et calculer les embeddings vectoriels
 */

/**
 * Utilitaires pour les embeddings - logger disponible si besoin de debug
 */

/**
 * Dimension par défaut pour les embeddings OpenAI
 */
export const DEFAULT_EMBEDDING_DIMENSION = 1536;

/**
 * Dimension pour text-embedding-3-small
 */
export const EMBEDDING_3_SMALL_DIMENSION = 1536;

/**
 * Dimension pour text-embedding-3-large
 */
export const EMBEDDING_3_LARGE_DIMENSION = 3072;

/**
 * Encoder un vecteur en base64 pour stockage
 * @param embedding - Vecteur d'embedding
 * @returns Chaîne base64
 */
export function encodeEmbeddingToBase64(embedding: number[]): string {
  // Convertir en Float32Array pour réduire la taille
  const float32Array = new Float32Array(embedding);
  const uint8Array = new Uint8Array(float32Array.buffer);
  return Buffer.from(uint8Array).toString('base64');
}

/**
 * Décoder un base64 en vecteur
 * @param base64 - Chaîne base64
 * @returns Vecteur d'embedding
 */
export function decodeEmbeddingFromBase64(base64: string): number[] {
  const uint8Array = Buffer.from(base64, 'base64');
  const float32Array = new Float32Array(uint8Array.buffer);
  return Array.from(float32Array);
}

/**
 * Calculer la similarité cosinus entre deux vecteurs
 * @param a - Premier vecteur
 * @param b - Second vecteur
 * @returns Score de similarité (0-1)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Normaliser un vecteur
 * @param vector - Vecteur à normaliser
 * @returns Vecteur normalisé
 */
export function normalizeVector(vector: number[]): number[] {
  let norm = 0;
  for (let i = 0; i < vector.length; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  if (norm === 0) {
    return vector;
  }

  return vector.map((val) => val / norm);
}

/**
 * Calculer la distance euclidienne entre deux vecteurs
 * @param a - Premier vecteur
 * @param b - Second vecteur
 * @returns Distance euclidienne
 */
export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Calculer le produit scalaire de deux vecteurs
 * @param a - Premier vecteur
 * @param b - Second vecteur
 * @returns Produit scalaire
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
}

/**
 * Calculer la norme d'un vecteur
 * @param vector - Vecteur
 * @returns Norme du vecteur
 */
export function vectorNorm(vector: number[]): number {
  let sum = 0;
  for (let i = 0; i < vector.length; i++) {
    sum += vector[i] * vector[i];
  }
  return Math.sqrt(sum);
}

/**
 * Tronquer un vecteur à une dimension spécifiée
 * @param vector - Vecteur original
 * @param targetDimension - Dimension cible
 * @returns Vecteur tronqué
 */
export function truncateVector(
  vector: number[],
  targetDimension: number,
): number[] {
  if (targetDimension >= vector.length) {
    return vector;
  }

  return vector.slice(0, targetDimension);
}

/**
 * среднее géométrique pour réduire les dimensions (approximation)
 * @param vectors - Vecteurs à fusionner
 * @param targetDimension - Dimension cible
 * @returns Vecteur fusionné
 */
export function geometricMeanReduction(
  vectors: number[][],
  targetDimension: number,
): number[] {
  if (vectors.length === 0) {
    return new Array(targetDimension).fill(0);
  }

  // Diviser les vecteurs en chunks de la taille cible
  const result = new Array(targetDimension).fill(0);
  const chunkSize = Math.ceil(vectors[0].length / targetDimension);

  for (let d = 0; d < targetDimension; d++) {
    let product = 1;
    let count = 0;

    for (const vector of vectors) {
      const startIdx = d * chunkSize;
      const endIdx = Math.min(startIdx + chunkSize, vector.length);

      for (let i = startIdx; i < endIdx; i++) {
        if (i < vector.length && vector[i] > 0) {
          product *= vector[i];
          count++;
        }
      }
    }

    result[d] = count > 0 ? Math.pow(product, 1 / count) : 0;
  }

  return result;
}

/**
 * Moyenne arithmétique pour fusionner des vecteurs
 * @param vectors - Vecteurs à fusionner
 * @returns Vecteur moyen
 */
export function averageVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) {
    return [];
  }

  const dimension = vectors[0].length;
  const result = new Array(dimension).fill(0);

  for (const vector of vectors) {
    for (let i = 0; i < dimension; i++) {
      result[i] += vector[i];
    }
  }

  return result.map((val) => val / vectors.length);
}

/**
 * Pondérer des vecteurs par importance
 * @param vectors - Vecteurs à pondérer
 * @param weights - Pondérations correspondantes
 * @returns Vecteur pondéré moyen
 */
export function weightedAverage(
  vectors: number[][],
  weights: number[],
): number[] {
  if (vectors.length !== weights.length) {
    throw new Error('Vectors and weights must have the same length');
  }

  if (vectors.length === 0) {
    return [];
  }

  const dimension = vectors[0].length;
  const result = new Array(dimension).fill(0);
  let totalWeight = 0;

  for (let i = 0; i < vectors.length; i++) {
    const weight = Math.max(0, weights[i]);
    for (let d = 0; d < dimension; d++) {
      result[d] += vectors[i][d] * weight;
    }
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    return vectors[0];
  }

  return result.map((val) => val / totalWeight);
}

/**
 * Rechercher les k vecteurs les plus similaires
 * @param queryVector - Vecteur de requête
 * @param vectors - Vecteurs à comparer avec leurs IDs
 * @param topK - Nombre de résultats à retourner
 * @returns Résultats triés par similarité
 */
export function findTopKSimilar(
  queryVector: number[],
  vectors: Array<{ id: string; vector: number[] }>,
  topK: number = 10,
): Array<{ id: string; score: number }> {
  // Calculer les similarités
  const similarities = vectors.map(({ id, vector }) => ({
    id,
    score: cosineSimilarity(queryVector, vector),
  }));

  // Trier par score décroissant et prendre les topK
  return similarities.sort((a, b) => b.score - a.score).slice(0, topK);
}

/**
 * Vérifier si un vecteur est valide
 * @param vector - Vecteur à vérifier
 * @returns true si le vecteur est valide
 */
export function isValidVector(vector: unknown): boolean {
  if (!Array.isArray(vector)) {
    return false;
  }

  if (vector.length === 0) {
    return false;
  }

  return vector.every((val) => typeof val === 'number' && !isNaN(val));
}

/**
 * Compenser le biais de fréquence dans les embeddings
 * @param vector - Vecteur original
 * @param averageVector - Vecteur moyen du corpus
 * @returns Vecteur débiaisé
 */
export function debiasVector(
  vector: number[],
  averageVector: number[],
): number[] {
  if (vector.length !== averageVector.length) {
    throw new Error('Vector and average vector must have the same dimension');
  }

  return vector.map((val, i) => val - averageVector[i]);
}

/**
 * Parser le texte pour préparation à l'embedding
 * @param text - Texte à parser
 * @returns Texte nettoyé
 */
export function preprocessTextForEmbedding(text: string): string {
  // Supprimer les caractères spéciaux excessifs
  let cleaned = text.replace(/[^\w\s\u00C0-\u00FF\-.,!?;:()[\]{}'"]/g, ' ');

  // Normaliser les espaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Supprimer les espaces multiples
  cleaned = cleaned.replace(/  +/g, ' ');

  // Tronquer si trop long (8192 tokens max pour ada-002)
  const maxChars = 8000;
  if (cleaned.length > maxChars) {
    cleaned = cleaned.substring(0, maxChars);
    // Couper à la dernière phrase complète
    const lastPeriod = cleaned.lastIndexOf('.');
    const lastExclamation = cleaned.lastIndexOf('!');
    const lastQuestion = cleaned.lastIndexOf('?');
    const lastBreak = Math.max(lastPeriod, lastExclamation, lastQuestion);

    if (lastBreak > maxChars * 0.8) {
      cleaned = cleaned.substring(0, lastBreak + 1);
    } else {
      cleaned = cleaned.trim() + '...';
    }
  }

  return cleaned.trim();
}

/**
 * Diviser un texte long en chunks pour l'embedding
 * @param text - Texte à diviser
 * @param chunkSize - Taille maximale de chaque chunk
 * @param overlap - Nombre de caractères à chevaucher
 * @returns Tableau de chunks
 */
export function splitTextForEmbedding(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 100,
): string[] {
  if (text.length <= chunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Ne pas dépasser la fin du texte
    if (end >= text.length) {
      end = text.length;
    } else {
      // Essayer de couper à un espace
      const lastSpace = text.lastIndexOf(' ', end);
      if (lastSpace > start + chunkSize * 0.5) {
        end = lastSpace;
      }
    }

    chunks.push(text.substring(start, end).trim());

    // Déplacer le début en tenant compte du chevauchement
    start = end - overlap;

    // Éviter les boucles infinies
    if (start >= text.length - overlap) {
      break;
    }

    // S'assurer de progresser
    if (start <= chunks[chunks.length - 1]?.length) {
      start = chunks[chunks.length - 1]?.length || 0;
    }
  }

  return chunks;
}

/**
 * Générer un résumé condensé pour un texte
 * @param text - Texte à résumer
 * @param maxSentences - Nombre maximum de phrases
 * @returns Texte résumé
 */
export function summarizeForEmbedding(
  text: string,
  maxSentences: number = 3,
): string {
  // Diviser en phrases
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length <= maxSentences) {
    return text;
  }

  // Prendre les premières et dernières phrases
  const firstSentences = sentences.slice(0, Math.ceil(maxSentences / 2));
  const lastSentences = sentences.slice(-Math.floor(maxSentences / 2));

  return [...firstSentences, ...lastSentences].join('. ') + '.';
}

/**
 * Classe utilitaire pour les opérations pgvector
 */
export class PgVectorUtils {
  /**
   * Convertir un vecteur en format SQL pour pgvector
   * @param vector - Vecteur à convertir
   * @returns Représentation SQL
   */
  static toSqlVector(vector: number[]): string {
    return `[${vector.join(',')}]`;
  }

  /**
   * Créer la clause de similarité cosinus pour pgvector
   * @param column - Nom de la colonne
   * @param vector - Vecteur de référence
   * @param threshold - Seuil minimum
   * @returns Clause SQL
   */
  static cosineSimilarityClause(
    column: string,
    vector: number[],
    threshold?: number,
  ): string {
    const vectorStr = this.toSqlVector(vector);
    let clause = `(${column} <=> '${vectorStr}')`;

    if (threshold !== undefined) {
      clause += ` AND ${clause} <= ${1 - threshold}`;
    }

    return clause;
  }

  /**
   * Créer la clause de similarité L2 (euclidienne) pour pgvector
   * @param column - Nom de la colonne
   * @param vector - Vecteur de référence
   * @param limit - Limite de distance
   * @returns Clause SQL
   */
  static euclideanDistanceClause(
    column: string,
    vector: number[],
    limit?: number,
  ): string {
    const vectorStr = this.toSqlVector(vector);
    let clause = `<-> '${vectorStr}'`;

    if (limit !== undefined) {
      clause = `${clause} < ${limit}`;
    }

    return `${column} ${clause}`;
  }
}
