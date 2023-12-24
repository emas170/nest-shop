import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ShopItem extends Document {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  price: number;
  @Prop()
  createdAt: Date;
  @Prop()
  boughtCounter: number;
  @Prop()
  wasEverBought: boolean;
}

export const ShopItemSchema = SchemaFactory.createForClass(ShopItem);
