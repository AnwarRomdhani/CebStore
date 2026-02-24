/**
 * Service d'optimisation d'images
 * @description Redimensionnement, compression et optimisation des images produits
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const sharp = require('sharp');
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'avif';
}

export interface ImageVariants {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly uploadDir: string;
  private readonly cdnUrl: string;
  private readonly maxFileSize: number;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>(
      'UPLOAD_DIR',
      './uploads/images',
    );
    this.cdnUrl = this.configService.get<string>('CDN_URL', '');
    this.maxFileSize = this.configService.get<number>(
      'MAX_FILE_SIZE',
      5 * 1024 * 1024,
    ); // 5MB

    // Créer le dossier d'upload s'il n'existe pas
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Optimiser une image buffer
   */
  async optimize(
    buffer: Buffer,
    options?: ImageOptions,
  ): Promise<{ buffer: Buffer; size: number; format: string }> {
    const {
      width = 1920,
      height = 1920,
      quality = 80,
      format = 'webp',
    } = options || {};

    try {
      const image = sharp(buffer);

      // Récupérer les métadonnées
      const metadata = await image.metadata();

      // Redimensionner si nécessaire
      let processed = image.resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true,
      });

      // Convertir et compresser
      let resultBuffer: Buffer;

      switch (format) {
        case 'jpeg':
          resultBuffer = await processed.jpeg({ quality }).toBuffer();
          break;
        case 'webp':
          resultBuffer = await processed.webp({ quality }).toBuffer();
          break;
        case 'avif':
          resultBuffer = await processed.avif({ quality }).toBuffer();
          break;
        default:
          resultBuffer = await processed.toBuffer();
      }

      const originalSize = buffer.length;
      const newSize = resultBuffer.length;
      const compressionRatio = ((originalSize - newSize) / originalSize) * 100;

      this.logger.debug(
        `Image optimisée: ${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB (${compressionRatio.toFixed(1)}% réduction)`,
      );

      return {
        buffer: resultBuffer,
        size: newSize,
        format,
      };
    } catch (error) {
      this.logger.error(`Erreur optimisation image: ${error.message}`);
      throw new BadRequestException('Erreur lors de l\'optimisation de l\'image');
    }
  }

  /**
   * Générer plusieurs variantes d'une image
   */
  async generateVariants(
    buffer: Buffer,
    filename: string,
  ): Promise<ImageVariants> {
    const variants: Partial<ImageVariants> = {};

    // Définir les variantes
    const configs = {
      thumbnail: { width: 200, height: 200, quality: 70 },
      medium: { width: 800, height: 800, quality: 75 },
      large: { width: 1920, height: 1920, quality: 80 },
    };

    // Générer chaque variante
    for (const [variant, config] of Object.entries(configs)) {
      const { buffer: optimizedBuffer } = await this.optimize(buffer, config);
      const variantFilename = `${variant}_${filename}.webp`;
      const variantPath = path.join(this.uploadDir, variantFilename);

      await fs.promises.writeFile(variantPath, optimizedBuffer);
      variants[variant as keyof ImageVariants] = this.getUrl(variantFilename);
    }

    // Sauvegarder l'original
    const originalPath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(originalPath, buffer);
    variants.original = this.getUrl(filename);

    return variants as ImageVariants;
  }

  /**
   * Sauvegarder une image
   */
  async save(
    buffer: Buffer,
    filename: string,
    options?: ImageOptions,
  ): Promise<string> {
    try {
      // Vérifier la taille du fichier
      if (buffer.length > this.maxFileSize) {
        throw new BadRequestException(
          `Fichier trop volumineux. Maximum: ${this.maxFileSize / 1024 / 1024}MB`,
        );
      }

      // Optimiser l'image
      const { buffer: optimizedBuffer } = await this.optimize(buffer, options);

      // Sauvegarder
      const filePath = path.join(this.uploadDir, filename);
      await fs.promises.writeFile(filePath, optimizedBuffer);

      this.logger.log(`Image sauvegardée: ${filename}`);
      return this.getUrl(filename);
    } catch (error) {
      this.logger.error(`Erreur sauvegarde image: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer une image
   */
  async remove(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, filename);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`Image supprimée: ${filename}`);
      }

      // Supprimer les variantes
      const baseName = path.basename(filename, path.extname(filename));
      const variants = ['thumbnail_', 'medium_', 'large_'];

      for (const variant of variants) {
        const variantPath = path.join(this.uploadDir, `${variant}${baseName}.webp`);
        if (fs.existsSync(variantPath)) {
          await fs.promises.unlink(variantPath);
        }
      }
    } catch (error) {
      this.logger.error(`Erreur suppression image: ${error.message}`);
    }
  }

  /**
   * Générer un nom de fichier unique
   */
  generateFilename(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}_${random}${ext}`;
  }

  /**
   * Obtenir l'URL d'une image
   */
  private getUrl(filename: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl}/${filename}`;
    }
    return `/uploads/images/${filename}`;
  }

  /**
   * Valider le type MIME d'une image
   */
  isValidImage(mimetype: string): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    return validTypes.includes(mimetype.toLowerCase());
  }

  /**
   * Extraire les métadonnées d'une image
   */
  async getMetadata(buffer: Buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length,
        aspectRatio: metadata.width && metadata.height
          ? (metadata.width / metadata.height).toFixed(2)
          : null,
      };
    } catch (error) {
      this.logger.error(`Erreur lecture métadonnées: ${error.message}`);
      return null;
    }
  }
}
