import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatFeedbackService } from './chat-feedback.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('chat-feedback')
@Controller('chat-feedback')
export class ChatFeedbackController {
  constructor(private readonly chatFeedbackService: ChatFeedbackService) {}

  // Soumettre un feedback (utilisateur)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Soumettre un feedback',
    description: 'Notez la qualité dune réponse du chatbot',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string', example: 'session-123' },
        rating: { type: 'number', example: 5, minimum: 1, maximum: 5 },
        comment: { type: 'string', example: 'Très utile !' },
        helpful: { type: 'boolean', example: true },
      },
      required: ['sessionId', 'rating'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback soumis',
  })
  async submitFeedback(
    @GetUser('id') userId: string,
    @Body()
    body: {
      sessionId: string;
      rating: number;
      comment?: string;
      helpful?: boolean;
    },
  ) {
    return this.chatFeedbackService.submitFeedback(
      body.sessionId,
      userId,
      body.rating,
      body.comment,
      body.helpful,
    );
  }

  // Statistiques de satisfaction (admin)
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Statistiques de satisfaction (Admin)',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month'],
    example: 'week',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
  })
  async getStats(@Query('period') period?: 'day' | 'week' | 'month') {
    return this.chatFeedbackService.getStats(period || 'week');
  }

  // Tendances de satisfaction (admin)
  @Get('trends')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Tendances de satisfaction (Admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tendances sur 7 jours',
  })
  async getTrends() {
    return this.chatFeedbackService.getSatisfactionTrends();
  }

  // Feedbacks récents (admin)
  @Get('recent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Feedbacks récents (Admin)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Feedbacks récents',
  })
  async getRecent(@Query('limit') limit?: number) {
    return this.chatFeedbackService.getRecentFeedbacks(Number(limit) || 20);
  }

  // Commentaires négatifs pour amélioration (admin)
  @Get('improvements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Commentaires négatifs (Admin)',
    description: 'Feedbacks négatifs pour améliorer le chatbot',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Commentaires négatifs',
  })
  async getImprovements(@Query('limit') limit?: number) {
    return this.chatFeedbackService.getNegativeFeedbacks(Number(limit) || 10);
  }
}
