import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Email {
  @Prop()
  subject: string;

  @Prop({ type: Object })
  headers: Record<string, any>;

  @Prop({ type: [String] })
  receivingChain: string[];

  @Prop()
  espType: string;
}

// Create a separate type for the document
export type EmailDocument = Email & Document;

// Export schema
export const EmailSchema = SchemaFactory.createForClass(Email);
