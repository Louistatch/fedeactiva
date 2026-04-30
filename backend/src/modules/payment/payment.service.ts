import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from '../order/entities/commande.entity';
import { WebhookLog } from './entities/webhook-log.entity';
import { OrderService } from '../order/order.service';
import { v4 as uuidv4 } from 'uuid';

interface FedaPayWebhookPayload {
  event: string;
  data: {
    id: string;
    status: 'approved' | 'failed' | 'pending';
    amount: number;
    customer: {
      name: string;
      phone_number: string;
      email?: string;
    };
    metadata?: {
      federation_id?: string;
      pack_id?: string;
      commande_id?: string;
    };
  };
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Commande)
    private commandeRepo: Repository<Commande>,
    @InjectRepository(WebhookLog)
    private webhookLogRepo: Repository<WebhookLog>,
    private orderService: OrderService,
  ) {}

  async initPayment(
    federationId: string,
    commandeId: string,
    amount: number,
    customer: { name: string; phone_number: string; email?: string },
    returnUrl: string,
    cancelUrl: string,
  ): Promise<any> {
    // In production, call FedaPay API
    // For demo, return mock payment URL
    const transactionId = `TXN_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
    
    await this.commandeRepo.update(commandeId, {
      transactionId,
      methodePaiement: 'pending',
    });

    return {
      transaction_id: transactionId,
      checkout_url: `https://checkout.fedapay.com/pay/${transactionId}`,
      status: 'pending',
    };
  }

  async handleWebhook(
    federationId: string,
    payload: FedaPayWebhookPayload,
    signature: string,
    ip: string,
  ): Promise<void> {
    // Log webhook
    const log = this.webhookLogRepo.create({
      federationId,
      provider: 'fedapay',
      eventType: payload.event,
      payload,
      signature,
      ipAdresse: ip,
      statut: 'recus',
    });
    await this.webhookLogRepo.save(log);

    try {
      // Validate signature (in production)
      // const isValid = this.validateSignature(payload, signature);

      if (payload.event === 'transaction.completed') {
        if (payload.data.status === 'approved') {
          const commande = await this.commandeRepo.findOne({
            where: { transactionId: payload.data.id },
          });

          if (commande) {
            await this.orderService.confirm(
              commande.id,
              payload.data.id,
              this.detectPaymentMethod(payload.data),
            );
            this.logger.log(`Commande ${commande.id} confirmée`);
          }
        }
      }

      // Update log status
      log.statut = 'traites';
      log.traiteLe = new Date();
      await this.webhookLogRepo.save(log);
    } catch (error) {
      this.logger.error(`Erreur traitement webhook: ${error.message}`);
      log.statut = 'echecs';
      log.messageErreur = error.message;
      await this.webhookLogRepo.save(log);
    }
  }

  async getPaymentStatus(transactionId: string): Promise<any> {
    const commande = await this.commandeRepo.findOne({
      where: { transactionId },
      relations: ['lignes', 'lignes.pack'],
    });

    return {
      transaction_id: transactionId,
      status: commande?.statut || 'unknown',
      amount: commande?.montantTotal,
      reference: commande?.reference,
    };
  }

  async getWebhookLogs(federationId?: string, limit = 100): Promise<WebhookLog[]> {
    const query = this.webhookLogRepo.createQueryBuilder('log')
      .orderBy('log.created_at', 'DESC')
      .limit(limit);

    if (federationId) {
      query.where('log.federation_id = :federationId', { federationId });
    }

    return query.getMany();
  }

  private detectPaymentMethod(data: any): string {
    // In production, detect from FedaPay response
    if (data.customer?.phone_number) {
      return 'mobile_money';
    }
    return 'card';
  }

  private validateSignature(payload: any, signature: string): boolean {
    // In production, validate HMAC signature
    const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
    // Implement signature validation
    return true;
  }
}