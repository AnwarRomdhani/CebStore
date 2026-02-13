/**
 * Validation Pipe
 * @description Pipe de validation global avec options personnalisées
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { validate, ValidatorOptions } from 'class-validator';

/**
 * Options personnalisées pour le pipe de validation
 */
export interface CustomValidationPipeOptions extends ValidatorOptions {
  /**
   * Transformer les données automatiquement
   * @default true
   */
  transform?: boolean;

  /**
   *whitelist - Ignorer les propriétés non décorées
   * @default true
   */
  whitelist?: boolean;

  /**
   * Interdire les propriétés non décorées
   * @default true
   */
  forbidNonWhitelisted?: boolean;

  /**
   * Activer la conversion implicite des types
   * @default true
   */
  enableImplicitConversion?: boolean;

  /**
   * Groupes de validation à utiliser
   */
  groups?: string[];

  /**
   * Message d'erreur personnalisé
   */
  message?: string | ((errors: ValidationError[]) => string);
}

/**
 * Pipe de validation par défaut
 */
@Injectable()
export class CustomValidationPipe implements PipeTransform<unknown> {
  private readonly options: CustomValidationPipeOptions;

  constructor(options: CustomValidationPipeOptions = {}) {
    this.options = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      enableImplicitConversion: true,
      ...options,
    };
  }

  /**
   * Valide et transforme les données entrantes
   * @param value - Valeur à valider
   * @param metadata - Métadonnées du paramètre
   * @returns Valeur validée et transformée
   */
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    // Si la valeur est null ou undefined et que le paramètre n'est pas requis, retourner null
    if (value === null || value === undefined) {
      if (metadata.type === 'body' || metadata.type === 'query' || metadata.type === 'param') {
        return value;
      }
    }

    const { metatype } = metadata;

    // Si ce n'est pas une classe, retourner la valeur telle quelle
    if (!metatype || typeof metatype === 'string') {
      return value;
    }

    // Créer une instance de la classe
    const object = this.toValidate(metatype);
    if (!object) {
      return value;
    }

    // Valider l'objet
    const errors = await validate(object as any, this.options as any);

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

    // Si l'option transform est activée, retourner l'objet transformé
    if (this.options.transform) {
      return this.transformValue(object, value);
    }

    return object;
  }

  /**
   * Vérifie si le type doit être validé
   * @param metatype - Type à vérifier
   * @returns boolean
   */
  private toValidate(metatype: new (...args: unknown[]) => unknown): boolean {
    const types: (new (...args: unknown[]) => unknown)[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Transforme la valeur en utilisant les decorators de transformation
   * @param object - Instance de la classe
   * @param value - Valeur brute
   * @returns Valeur transformée
   */
  private transformValue(
    object: unknown,
    value: unknown,
  ): unknown {
    // La transformation est gérée automatiquement par class-transformer
    // Si le value a la méthode toClassOnly, l'utiliser
    if (
      typeof value === 'object' &&
      value !== null &&
      'toClassOnly' in value
    ) {
      return (value as { toClassOnly(): unknown }).toClassOnly();
    }

    return object;
  }

  /**
   * Formate les erreurs de validation en messages lisibles
   * @param errors - Erreurs de validation
   * @returns Tableau de messages d'erreur
   */
  private formatErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        for (const [constraint, message] of Object.entries(error.constraints)) {
          // Formater le message de contrainte
          const formattedMessage = this.formatConstraintMessage(
            message,
            error.property,
            error.value,
          );
          messages.push(formattedMessage);
        }
      }

      // Récursivement traiter les erreurs enfants
      if (error.children && error.children.length > 0) {
        const childMessages = this.formatChildrenErrors(error.children, error.property);
        messages.push(...childMessages);
      }
    }

    return messages;
  }

  /**
   * Formate les messages d'erreur des enfants
   * @param children - Erreurs enfants
   * @param parentProperty - Propriété parente
   * @returns Messages formatés
   */
  private formatChildrenErrors(
    children: ValidationError[],
    parentProperty: string,
  ): string[] {
    const messages: string[] = [];

    for (const child of children) {
      const propertyPath = `${parentProperty}.${child.property}`;

      if (child.constraints) {
        for (const [, message] of Object.entries(child.constraints)) {
          const formattedMessage = this.formatConstraintMessage(
            message,
            propertyPath,
            child.value,
          );
          messages.push(formattedMessage);
        }
      }

      if (child.children && child.children.length > 0) {
        messages.push(...this.formatChildrenErrors(child.children, propertyPath));
      }
    }

    return messages;
  }

  /**
   * Formate un message de contrainte avec le nom de la propriété
   * @param message - Message original
   * @param property - Nom de la propriété
   * @param value - Valeur de la propriété
   * @returns Message formaté
   */
  private formatConstraintMessage(
    message: string,
    property: string,
    value: unknown,
  ): string {
    let formattedMessage = message;

    // Remplacer les placeholders
    formattedMessage = formattedMessage.replace(/{property}/g, property);
    formattedMessage = formattedMessage.replace(/{value}/g, String(value));
    formattedMessage = formattedMessage.replace(
      /{topLevelConstraint}/g,
      property.split('.')[0],
    );

    // Si c'est un message IsInt, IsPositive, etc., le reformater
    if (message.includes('must be a valid number')) {
      formattedMessage = `Le champ "${property}" doit être un nombre valide`;
    } else if (message.includes('must be a valid integer')) {
      formattedMessage = `Le champ "${property}" doit être un entier`;
    } else if (message.includes('must be a positive number')) {
      formattedMessage = `Le champ "${property}" doit être positif`;
    } else if (message.includes('is not a valid email')) {
      formattedMessage = `Le champ "${property}" doit être un email valide`;
    } else if (message.includes('is not longer than')) {
      formattedMessage = `Le champ "${property}" ne doit pas dépasser ${message.match(/\d+/)?.[0]} caractères`;
    } else if (message.includes('is not shorter than')) {
      formattedMessage = `Le champ "${property}" doit avoir au moins ${message.match(/\d+/)?.[0]} caractères`;
    }

    return formattedMessage;
  }
}

/**
 * Pipe pour valider les IDs (UUID, MongoDB ObjectId, etc.)
 */
@Injectable()
export class IdValidationPipe implements PipeTransform<string> {
  private readonly formats: ('uuid' | 'mongoId' | 'cuid')[];

  constructor(formats: ('uuid' | 'mongoId' | 'cuid')[] = ['uuid', 'cuid']) {
    this.formats = formats;
  }

  /**
   * Valide et retourne l'ID
   * @param value - ID à valider
   * @param metadata - Métadonnées du paramètre
   * @returns ID validé
   */
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      throw new BadRequestException(
        `Le paramètre "${metadata.data}" est requis`,
      );
    }

    // Valider le format UUID
    if (this.formats.includes('uuid') && this.isValidUUID(value)) {
      return value;
    }

    // Valider le format CUID (utilisé par Prisma)
    if (this.formats.includes('cuid') && this.isValidCuid(value)) {
      return value;
    }

    // Si aucun format ne correspond, lever une erreur
    throw new BadRequestException(
      `Le paramètre "${metadata.data}" a un format invalide. Formats acceptés: ${this.formats.join(', ')}`,
    );
  }

  /**
   * Vérifie si la valeur est un UUID valide
   * @param value - Valeur à vérifier
   * @returns boolean
   */
  private isValidUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  /**
   * Vérifie si la valeur est un CUID valide
   * @param value - Valeur à vérifier
   * @returns boolean
   */
  private isValidCuid(value: string): boolean {
    // Les CUIDs commencent par 'c' suivi de lettres et chiffres
    const cuidRegex = /^c[0-9a-z]{20,24}$/i;
    return cuidRegex.test(value);
  }
}

