import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FlouciService } from './flouci.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments/flouci')
export class FlouciController {
  constructor(private readonly flouciService: FlouciService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  async initiatePayment(@Body() dto: CreatePaymentDto) {
    const payment = await this.flouciService.generatePayment(
      dto.amount,
      dto.orderId,
    );

    // Stockez payment.paymentId et payment.trackingId dans votre DB via Prisma
    // await this.prisma.payment.create({ ... })

    return {
      success: true,
      paymentLink: payment.paymentLink, // URL de redirection vers Flouci
    };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() _webhookData: unknown): { received: boolean } {
    // Vérifiez la signature du webhook (si fournie par Flouci)
    // Mettez à jour le statut de la commande dans votre DB
    // Déclenchez d'autres événements (email, n8n, etc.)

    return { received: true };
  }
}
