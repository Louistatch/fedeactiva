import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async sendSms(
    utilisateurId: string,
    federationId: string,
    telephone: string,
    message: string,
  ): Promise<Notification> {
    // In production, integrate with Twilio or local SMS aggregator
    const notification = this.notificationRepo.create({
      utilisateurId,
      federationId,
      type: 'sms',
      destinataire: telephone,
      message,
      statut: 'en_attente',
    });

    try {
      // Simulate SMS sending
      // await this.sendViaProvider(telephone, message);
      notification.statut = 'envoye';
      notification.fournisseur = 'simulated';
      notification.referenceExterne = `SMS_${Date.now()}`;
      notification.envoyeLe = new Date();
    } catch (error) {
      notification.statut = 'echoue';
      notification.erreur = error.message;
      this.logger.error(`SMS failed: ${error.message}`);
    }

    return this.notificationRepo.save(notification);
  }

  async sendEmail(
    utilisateurId: string,
    federationId: string,
    email: string,
    subject: string,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      utilisateurId,
      federationId,
      type: 'email',
      destinataire: email,
      message: `[${subject}]\n\n${message}`,
      statut: 'en_attente',
    });

    try {
      // In production, use nodemailer or email service
      notification.statut = 'envoye';
      notification.fournisseur = 'simulated';
      notification.referenceExterne = `EMAIL_${Date.now()}`;
      notification.envoyeLe = new Date();
    } catch (error) {
      notification.statut = 'echoue';
      notification.erreur = error.message;
    }

    return this.notificationRepo.save(notification);
  }

  async sendPurchaseConfirmation(
    utilisateurId: string,
    federationId: string,
    telephone: string,
    email: string | undefined,
    commandeReference: string,
    excelUrl: string,
    wordUrl: string,
  ): Promise<void> {
    // SMS with download links
    const smsMessage = `FedeActiva: Votre pack est prêt!\nReference: ${commandeReference}\nExcel: ${excelUrl}\nWord: ${wordUrl}\nLiens valides 15 min.`;
    await this.sendSms(utilisateurId, federationId, telephone, smsMessage);

    // Email if available
    if (email) {
      const emailMessage = `Bonjour,\n\nVotre commande ${commandeReference} a été confirmée.\n\nCliquez sur les liens ci-dessous pour télécharger vos documents:\n- Excel: ${excelUrl}\n- Word: ${wordUrl}\n\nCordialement,\nFedeActiva`;
      await this.sendEmail(utilisateurId, federationId, email, `Confirmation commande ${commandeReference}`, emailMessage);
    }
  }

  async getByUtilisateur(utilisateurId: string): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { utilisateurId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}