import { Controller, Post, Get, Body, Param, Headers, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('init')
  @ApiOperation({ summary: 'Initier un paiement FedaPay' })
  initPayment(
    @Body() body: {
      federationId: string;
      commandeId: string;
      amount: number;
      customer: { name: string; phone_number: string; email?: string };
      returnUrl: string;
      cancelUrl: string;
    },
  ) {
    return this.paymentService.initPayment(
      body.federationId,
      body.commandeId,
      body.amount,
      body.customer,
      body.returnUrl,
      body.cancelUrl,
    );
  }

  @Post('webhook/fedapay')
  @ApiOperation({ summary: 'Webhook IPN FedaPay' })
  handleWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Ip() ip: string,
  ) {
    // Extract federation ID from metadata
    const federationId = payload?.data?.metadata?.federation_id || 'default';
    return this.paymentService.handleWebhook(federationId, payload, signature, ip);
  }

  @Get('status/:transactionId')
  @ApiOperation({ summary: 'Statut d\'une transaction' })
  getStatus(@Param('transactionId') transactionId: string) {
    return this.paymentService.getPaymentStatus(transactionId);
  }

  @Get('webhooks/:federationId')
  @ApiOperation({ summary: 'Logs des webhooks' })
  getWebhookLogs(@Param('federationId') federationId: string) {
    return this.paymentService.getWebhookLogs(federationId);
  }
}