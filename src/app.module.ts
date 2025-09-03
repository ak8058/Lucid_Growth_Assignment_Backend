import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImapModule } from './imap/imap.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
   ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb+srv://GvHxB1xpJExwLT6a@cluster0.avtytow.mongodb.net/'),
    ImapModule,
    EmailModule,
  ],
})
export class AppModule {}


