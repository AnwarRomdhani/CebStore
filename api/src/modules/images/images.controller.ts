import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImagesService, ImageVariants } from './images.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

interface UploadedFileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // Uploader une image
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Uploader une image',
    description: 'Upload et optimisation automatique dune image',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPEG, PNG, WebP, GIF)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploadée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Fichier invalide ou trop volumineux',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req: any, file: any, cb: any) => {
        const validTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/gif',
        ];
        if (validTypes.includes(file.mimetype as string)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Type de fichier non autorisé'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(@UploadedFile() file: UploadedFileData): Promise<{
    url: string;
    variants: ImageVariants;
    metadata: Record<string, unknown> | null;
  }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier uploadé');
    }

    const buffer = file.buffer;
    const originalname = file.originalname || 'image.jpg';

    // Générer les variantes
    const filename = this.imagesService.generateFilename(originalname);
    const variants = await this.imagesService.generateVariants(
      buffer,
      filename,
    );

    // Métadonnées
    const metadata = await this.imagesService.getMetadata(buffer);

    return {
      url: variants.original,
      variants,
      metadata,
    };
  }

  // Supprimer une image
  @Delete(':filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer une image',
  })
  @ApiParam({
    name: 'filename',
    description: 'Nom du fichier image',
    example: '1234567890_abc123.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Image supprimée',
  })
  async deleteImage(@Param('filename') filename: string) {
    await this.imagesService.remove(filename);
    return { message: 'Image supprimée avec succès' };
  }
}
