import { forwardRef, Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { BasketModule } from '../basket/basket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopItemSchema } from './shop-item.schema';

@Module({
  imports: [
    forwardRef(() => BasketModule),
    MongooseModule.forFeature([
      {
        name: 'ShopItem',
        schema: ShopItemSchema,
      },
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
