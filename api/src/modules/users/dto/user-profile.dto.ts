import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
  IsEnum,
  IsBoolean,
  IsDateString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

// Genre de l\'utilisateur
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

// Préférences de notification
export class NotificationPreferencesDto {
  @ApiPropertyOptional({
    description: 'Recevoir les emails promotionnels',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  emailPromotions?: boolean;

  @ApiPropertyOptional({
    description: 'Recevoir les notifications SMS',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  smsNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Recevoir les notifications push',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  pushNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Notifications pour les nouvelles commandes',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  orderUpdates?: boolean;

  @ApiPropertyOptional({
    description: 'Notifications pour les avis clients',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  reviewRequests?: boolean;
}

// Adresse de livraison
export class ShippingAddressDto {
  @ApiProperty({
    description: "Nom de l'adresse (ex: Domicile, Bureau)",
    example: 'Domicile',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Rue et numéro',
    example: '123 Avenue Habib Bourguiba',
  })
  @IsString()
  street: string;

  @ApiProperty({
    description: 'Ville',
    example: 'Tunis',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Code postal',
    example: '1001',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'Gouvernorat',
    example: 'Tunis',
  })
  @IsString()
  governorate: string;

  @ApiPropertyOptional({
    description: "Complément d'adresse",
    example: '4ème étage, appartement B4',
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    description: 'Instructions de livraison',
    example: "Sonner à l'interphone B4",
  })
  @IsString()
  deliveryInstructions?: string;

  @ApiProperty({
    description: 'Numéro de téléphone',
    example: '+216 98 765 432',
  })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'Adresse par défaut',
    example: true,
  })
  @IsBoolean()
  isDefault: boolean;
}

// Mise à jour du profil utilisateur
export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'Prénom',
    example: 'Mohamed',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Nom',
    example: 'Ben Ali',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'mohamed@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone',
    example: '+216 98 765 432',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Date de naissance',
    example: '1990-05-15',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Genre',
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Photo de profil URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Biographie',
    example: 'Passionné de technologie',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  bio?: string;
}

// Préférences utilisateur
export class UserPreferencesDto {
  @ApiPropertyOptional({
    description: 'Langue préférée',
    example: 'fr',
  })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional({
    description: 'Devise préférée',
    example: 'TND',
  })
  @IsOptional()
  @IsString()
  preferredCurrency?: string;

  @ApiPropertyOptional({
    description: 'Fuseau horaire',
    example: 'Africa/Tunis',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Préférences de notification',
    type: NotificationPreferencesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notifications?: NotificationPreferencesDto;

  @ApiPropertyOptional({
    description: "Thème de l'interface",
    enum: { LIGHT: 'LIGHT', DARK: 'DARK', SYSTEM: 'SYSTEM' },
    example: 'SYSTEM',
  })
  @IsOptional()
  @IsString()
  theme?: 'LIGHT' | 'DARK' | 'SYSTEM';
}

// Adresse complète avec ID
export class UserAddressDto extends ShippingAddressDto {
  @ApiProperty({
    description: "ID de l'adresse",
    example: 'address-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: string;
}

// Réponse du profil complet
export class UserProfileResponseDto {
  @ApiProperty({
    description: "ID de l'utilisateur",
    example: 'user-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Email',
    example: 'mohamed@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Prénom',
    example: 'Mohamed',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Nom',
    example: 'Ben Ali',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone',
    example: '+216 98 765 432',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Date de naissance',
    example: '1990-05-15',
  })
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Genre',
    enum: Gender,
  })
  gender?: Gender;

  @ApiPropertyOptional({
    description: "URL de l'avatar",
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Biographie',
    example: 'Passionné de technologie',
  })
  bio?: string;

  @ApiProperty({
    description: 'Rôle',
    enum: { USER: 'USER', ADMIN: 'ADMIN' },
    example: 'USER',
  })
  role: string;

  @ApiPropertyOptional({
    description: 'Préférences',
    type: UserPreferencesDto,
  })
  preferences?: UserPreferencesDto;

  @ApiProperty({
    description: 'Adresses de livraison',
    type: [UserAddressDto],
  })
  addresses: UserAddressDto[];

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-01-15T10:00:00Z',
  })
  updatedAt: string;
}
