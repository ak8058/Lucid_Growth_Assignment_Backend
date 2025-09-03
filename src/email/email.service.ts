import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, EmailDocument } from './email.schema';
import { ImapService } from '../imap/imap.service';
import { detectESP } from '../common/utils';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    private imapService: ImapService,
  ) {}

async processNewEmails() {
  try {
        console.log("📩 processNewEmails triggered");

    const emails = await this.imapService.fetchEmails();
        console.log("Fetched emails:", emails);

    const saved: EmailDocument[] = [];

    for (const e of emails) {
      let receivingChain: string[] = [];
      let espType = 'Unknown';

      if (e.headers && typeof e.headers.get === 'function') {
        // Receiving chain
        const received = e.headers.get('received');
        if (Array.isArray(received)) {
          receivingChain = received.map(r => r.toString());
        } else if (received) {
          receivingChain = [received.toString()];
        }

        // ESP detect
        espType = detectESP(e.headers);
      }

      const headersObj = e.headers
        ? Object.fromEntries(e.headers)
        : {};

      const emailDoc = await this.emailModel.create({
        subject: e.subject || '(no subject)',
        headers: headersObj,
        receivingChain,
        espType,
      });
    console.log("Saved emails:", saved);

      saved.push(emailDoc);
    }

    return saved;
  } catch (error) {
    console.error('Error in processNewEmails:', error);
    throw error;
  }
}




  async getAllEmails() {
  return this.emailModel.find().sort({ _id: -1 }).exec();
}
}
