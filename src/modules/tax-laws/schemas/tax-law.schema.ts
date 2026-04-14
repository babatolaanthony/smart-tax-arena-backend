import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaxLawDocument = HydratedDocument<TaxLaw>;

@Schema({ timestamps: true })
export class TaxLaw {
  @Prop({ required: true })
  title!: string;

  @Prop()
  year?: number;

  @Prop()
  description?: string;

  @Prop()
  country?: string;

  @Prop({ default: [] })
  tags!: string[];

  @Prop({ default: 0 })
  totalSections!: number;

  @Prop({ default: true })
  isActive!: boolean;
}

export const TaxLawSchema = SchemaFactory.createForClass(TaxLaw);
