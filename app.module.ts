import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasketModule } from './basket/basket.module';
import { ShopModule } from './shop/shop.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';
import { DiscountCodeModule } from './discount-code/discount-code.module';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [
    BasketModule,
    ShopModule,
    UsersModule,
    TypeOrmModule.forRoot(),
    UserModule,
    CacheModule,
    DiscountCodeModule,
    CronModule,
    MailModule,
    AuthModule,
    ConsoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
