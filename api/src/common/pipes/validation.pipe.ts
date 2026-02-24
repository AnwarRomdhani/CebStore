import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { validate, ValidatorOptions } from 'class-validator';

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

  groups?: string[];

  message?: string | ((errors: ValidationError[]) => string);
}

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
  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    if (value === null || value === undefined) {
      if (
        metadata.type === 'body' ||
        metadata.type === 'query' ||
        metadata.type === 'param'
      ) {
        return value;
      }
    }

    const { metatype } = metadata;

    if (!metatype || typeof metatype === 'string') {
      return value;
    }

    const object = this.toValidateInstance(metatype);
    if (!object) {
      return value;
    }

    const errors = await validate(object as object, this.options);

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }

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
  private toValidateInstance(
    metatype: new (...args: unknown[]) => unknown,
  ): unknown {
    const types: (new (...args: unknown[]) => unknown)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }

  /**
   * Transforme la valeur en utilisant les decorators de transformation
   * @param object - Instance de la classe
   * @param value - Valeur brute
   * @returns Valeur transformée
   */
  private transformValue(object: unknown, value: unknown): unknown {
    if (typeof value === 'object' && value !== null && 'toClassOnly' in value) {
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
        for (const [, message] of Object.entries(error.constraints)) {
          const formattedMessage = this.formatConstraintMessage(
            message,
            error.property,
            error.value,
          );
          messages.push(formattedMessage);
        }
      }

      if (error.children && error.children.length > 0) {
        const childMessages = this.formatChildrenErrors(
          error.children,
          error.property,
        );
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
        messages.push(
          ...this.formatChildrenErrors(child.children, propertyPath),
        );
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

    formattedMessage = formattedMessage.replace(/{property}/g, property);
    formattedMessage = formattedMessage.replace(/{value}/g, String(value));
    formattedMessage = formattedMessage.replace(
      /{topLevelConstraint}/g,
      property.split('.')[0],
    );

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

    if (this.formats.includes('uuid') && this.isValidUUID(value)) {
      return value;
    }

    if (this.formats.includes('cuid') && this.isValidCuid(value)) {
      return value;
    }

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
    const cuidRegex = /^c[0-9a-z]{20,24}$/i;
    return cuidRegex.test(value);
  }
}
