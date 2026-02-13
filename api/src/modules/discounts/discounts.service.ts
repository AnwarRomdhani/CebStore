/**
 * Service de gestion des codes promo
 * @description Gère la logique métier pour les promotions et remises
 */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto, DiscountType } from './dto/create-discount.dto';
import {
  ApplyDiscountDto,
  ValidateDiscountDto,
} from './dto/apply-discount.dto';
import {
  DiscountResponseDto,
  ApplyDiscountResultDto,
  DiscountValidationDto,
  PaginatedDiscountsResponseDto,
} from './dto/discount-response.dto';
import { Discount, Prisma } from '@prisma/client';

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créer un nouveau code promo
   * @param createDiscountDto Données du code promo
   * @returns Le code promo créé
   */
  async create(
    createDiscountDto: CreateDiscountDto,
  ): Promise<DiscountResponseDto> {
    // Vérifier si le code existe déjà
    const existingDiscount = await this.prisma.discount.findUnique({
      where: { code: createDiscountDto.code.toUpperCase() },
    });

    if (existingDiscount) {
      throw new ConflictException(
        `Le code promo "${createDiscountDto.code}" existe déjà`,
      );
    }

    // Valider la valeur selon le type
    if (
      createDiscountDto.type === DiscountType.PERCENTAGE &&
      createDiscountDto.value > 100
    ) {
      throw new BadRequestException(
        'Le pourcentage de remise ne peut pas dépasser 100%',
      );
    }

    const discount = await this.prisma.discount.create({
      data: {
        code: createDiscountDto.code.toUpperCase(),
        type: createDiscountDto.type,
        value: new Prisma.Decimal(createDiscountDto.value),
        description: createDiscountDto.description,
        expiresAt: new Date(createDiscountDto.expiresAt),
        minAmount: createDiscountDto.minAmount
          ? new Prisma.Decimal(createDiscountDto.minAmount)
          : null,
        maxUses: createDiscountDto.maxUses,
        isActive: createDiscountDto.isActive ?? true,
      },
    });

    return this.formatDiscount(discount);
  }

  /**
   * Récupérer tous les codes promo avec pagination
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page
   * @param isActive Filtrer par statut actif
   * @returns Liste paginée des codes promo
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean,
  ): Promise<PaginatedDiscountsResponseDto> {
    const where: Prisma.DiscountWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const total = await this.prisma.discount.count({ where });

    const discounts = await this.prisma.discount.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: discounts.map((discount) => this.formatDiscount(discount)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupérer un code promo par son ID
   * @param id ID du code promo
   * @returns Le code promo trouvé
   */
  async findOne(id: string): Promise<DiscountResponseDto> {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Code promo non trouvé');
    }

    return this.formatDiscount(discount);
  }

  /**
   * Mettre à jour un code promo
   * @param id ID du code promo
   * @param updateDiscountDto Données de mise à jour
   * @returns Le code promo mis à jour
   */
  async update(
    id: string,
    updateDiscountDto: Partial<CreateDiscountDto>,
  ): Promise<DiscountResponseDto> {
    const existingDiscount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!existingDiscount) {
      throw new NotFoundException('Code promo non trouvé');
    }

    // Vérifier si le nouveau code existe déjà
    if (
      updateDiscountDto.code &&
      updateDiscountDto.code.toUpperCase() !== existingDiscount.code
    ) {
      const codeExists = await this.prisma.discount.findUnique({
        where: { code: updateDiscountDto.code.toUpperCase() },
      });

      if (codeExists) {
        throw new ConflictException(
          `Le code promo "${updateDiscountDto.code}" existe déjà`,
        );
      }
    }

    // Valider la valeur selon le type
    const type = updateDiscountDto.type || existingDiscount.type;
    const value = updateDiscountDto.value ?? Number(existingDiscount.value);

    if (type === 'PERCENTAGE' && value > 100) {
      throw new BadRequestException(
        'Le pourcentage de remise ne peut pas dépasser 100%',
      );
    }

    const updateData: Prisma.DiscountUpdateInput = {};

    if (updateDiscountDto.code) {
      updateData.code = updateDiscountDto.code.toUpperCase();
    }
    if (updateDiscountDto.type) {
      updateData.type = updateDiscountDto.type;
    }
    if (updateDiscountDto.value !== undefined) {
      updateData.value = new Prisma.Decimal(updateDiscountDto.value);
    }
    if (updateDiscountDto.description !== undefined) {
      updateData.description = updateDiscountDto.description;
    }
    if (updateDiscountDto.expiresAt) {
      updateData.expiresAt = new Date(updateDiscountDto.expiresAt);
    }
    if (updateDiscountDto.minAmount !== undefined) {
      updateData.minAmount = updateDiscountDto.minAmount
        ? new Prisma.Decimal(updateDiscountDto.minAmount)
        : null;
    }
    if (updateDiscountDto.maxUses !== undefined) {
      updateData.maxUses = updateDiscountDto.maxUses;
    }
    if (updateDiscountDto.isActive !== undefined) {
      updateData.isActive = updateDiscountDto.isActive;
    }

    const updatedDiscount = await this.prisma.discount.update({
      where: { id },
      data: updateData,
    });

    return this.formatDiscount(updatedDiscount);
  }

  /**
   * Supprimer un code promo
   * @param id ID du code promo
   * @returns Message de confirmation
   */
  async remove(id: string): Promise<{ message: string }> {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Code promo non trouvé');
    }

    await this.prisma.discount.delete({
      where: { id },
    });

    return { message: 'Code promo supprimé avec succès' };
  }

  /**
   * Valider un code promo
   * @param validateDiscountDto Données de validation
   * @returns Résultat de la validation
   */
  async validate(
    validateDiscountDto: ValidateDiscountDto,
  ): Promise<DiscountValidationDto> {
    const discount = await this.prisma.discount.findUnique({
      where: { code: validateDiscountDto.code.toUpperCase() },
    });

    if (!discount) {
      return {
        isValid: false,
        code: validateDiscountDto.code,
        message: 'Code promo invalide',
      };
    }

    // Vérifier si le code est actif
    if (!discount.isActive) {
      return {
        isValid: false,
        code: discount.code,
        message: "Ce code promo n'est plus actif",
      };
    }

    // Vérifier la date d'expiration
    if (new Date() > discount.expiresAt) {
      return {
        isValid: false,
        code: discount.code,
        message: 'Ce code promo a expiré',
      };
    }

    // Vérifier le nombre maximum d'utilisations
    if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
      return {
        isValid: false,
        code: discount.code,
        message: "Ce code promo a atteint sa limite d'utilisations",
      };
    }

    return {
      isValid: true,
      code: discount.code,
      message: 'Code promo valide',
      discount: this.formatDiscount(discount),
    };
  }

  /**
   * Appliquer un code promo à un montant
   * @param applyDiscountDto Données pour l'application
   * @returns Résultat de l'application
   */
  async apply(
    applyDiscountDto: ApplyDiscountDto,
  ): Promise<ApplyDiscountResultDto> {
    const validation = await this.validate({
      code: applyDiscountDto.code,
    });

    if (!validation.isValid || !validation.discount) {
      throw new BadRequestException(validation.message);
    }

    const discount = validation.discount;

    // Vérifier le montant minimum
    if (discount.minAmount && applyDiscountDto.amount < discount.minAmount) {
      throw new BadRequestException(
        `Le montant minimum pour ce code promo est de ${discount.minAmount} TND`,
      );
    }

    // Calculer la remise
    let discountAmount: number;
    const originalAmount = applyDiscountDto.amount;

    if (discount.type === DiscountType.PERCENTAGE) {
      discountAmount = (originalAmount * discount.value) / 100;
    } else {
      discountAmount = Math.min(discount.value, originalAmount);
    }

    const finalAmount = originalAmount - discountAmount;

    // Incrémenter le compteur d'utilisation
    await this.prisma.discount.update({
      where: { id: discount.id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      originalAmount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      message: `Code promo appliqué avec succès ! Vous économisez ${Math.round(discountAmount * 100) / 100} TND`,
    };
  }

  /**
   * Désactiver un code promo
   * @param id ID du code promo
   * @returns Le code promo désactivé
   */
  async deactivate(id: string): Promise<DiscountResponseDto> {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Code promo non trouvé');
    }

    const updatedDiscount = await this.prisma.discount.update({
      where: { id },
      data: { isActive: false },
    });

    return this.formatDiscount(updatedDiscount);
  }

  /**
   * Activer un code promo
   * @param id ID du code promo
   * @returns Le code promo activé
   */
  async activate(id: string): Promise<DiscountResponseDto> {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Code promo non trouvé');
    }

    const updatedDiscount = await this.prisma.discount.update({
      where: { id },
      data: { isActive: true },
    });

    return this.formatDiscount(updatedDiscount);
  }

  /**
   * Récupérer les statistiques des codes promo
   * @returns Statistiques
   */
  async getStats(): Promise<{
    totalCodes: number;
    activeCodes: number;
    expiredCodes: number;
    totalUsage: number;
    mostUsedCode: { code: string; usedCount: number } | null;
  }> {
    const totalCodes = await this.prisma.discount.count();
    const activeCodes = await this.prisma.discount.count({
      where: { isActive: true },
    });
    const expiredCodes = await this.prisma.discount.count({
      where: { expiresAt: { lt: new Date() } },
    });

    const usageResult = await this.prisma.discount.aggregate({
      _sum: {
        usedCount: true,
      },
    });

    const mostUsed = await this.prisma.discount.findFirst({
      orderBy: { usedCount: 'desc' },
      select: { code: true, usedCount: true },
    });

    return {
      totalCodes,
      activeCodes,
      expiredCodes,
      totalUsage: usageResult._sum.usedCount || 0,
      mostUsedCode: mostUsed
        ? { code: mostUsed.code, usedCount: mostUsed.usedCount }
        : null,
    };
  }

  /**
   * Formater un code promo pour la réponse
   * @param discount Code promo
   * @returns Code promo formaté
   */
  private formatDiscount(discount: Discount): DiscountResponseDto {
    return {
      id: discount.id,
      code: discount.code,
      type: discount.type as DiscountType,
      value: Number(discount.value),
      description: discount.description || undefined,
      isActive: discount.isActive,
      expiresAt: discount.expiresAt,
      minAmount: discount.minAmount ? Number(discount.minAmount) : undefined,
      maxUses: discount.maxUses ?? undefined,
      usedCount: discount.usedCount,
      createdAt: discount.createdAt,
      updatedAt: discount.updatedAt,
    };
  }
}
