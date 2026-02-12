import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlouciService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generatePayment(amount: number, orderId: string) {
    const publicKey = this.configService.get('FLOUCI_APP_PUBLIC');
    const privateKey = this.configService.get('FLOUCI_APP_SECRET');
    const trackingId = `${orderId}-${Date.now()}`;

    const payload = {
      amount: amount * 1000, // Conversion TND → millimes
      success_link: this.configService.get('FLOUCI_SUCCESS_URL'),
      fail_link: this.configService.get('FLOUCI_FAIL_URL'),
      webhook: this.configService.get('FLOUCI_WEBHOOK_URL'),
      developer_tracking_id: trackingId,
    };

    const { data } = await firstValueFrom(
      this.httpService.post('/generate_payment', payload, {
        headers: {
          Authorization: `Bearer ${publicKey}:${privateKey}`,
        },
      }),
    );

    return {
      paymentId: data.result.payment_id,
      paymentLink: data.result.link,
      trackingId: data.result.developer_tracking_id,
    };
  }

  async getPaymentStatus(developerTrackingId: string) {
    const publicKey = this.configService.get('FLOUCI_APP_PUBLIC');
    const privateKey = this.configService.get('FLOUCI_APP_SECRET');

    const { data } = await firstValueFrom(
      this.httpService.get(
        `/get_pos_transaction_status?developer_tracking_id=${developerTrackingId}`,
        {
          headers: {
            Authorization: `Bearer ${publicKey}:${privateKey}`,
          },
        },
      ),
    );

    return data.transactions[0];
  }
}
