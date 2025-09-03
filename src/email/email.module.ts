import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './email.schema';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ImapModule } from '../imap/imap.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    ImapModule,
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
