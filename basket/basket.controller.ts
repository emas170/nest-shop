import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Inject,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import { BasketService } from './basket.service';
import {
  AddProductToBasket,
  GetBasketStatsResponse,
  GetTotalPriceResponse,
  ListProductsInBasketResponse,
  RemoveProductFromBasketResponse,
} from '../interface/basket';
import { PasswordProtectGuard } from '../guards/password-protect.guard';
import { UsePassword } from '../decorators/use-password.decorator';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { UseCacheTimeDecorator } from 'src/decorators/use-cache-time.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  addProductToBasket(
    @Body() item: AddProductDto,
    @UserObj() user: UserEntity,
  ): AddProductToBasket {
    return this.basketService.add(item, user);
  }

  @Delete('/:all/userId')
  clearBasket(@Param('userId') userId: string) {
    return this.basketService.clearBasket(userId);
  }

  @Delete('/:ItemInBasketId/:userId')
  removeProductFromBasket(
    @Param('ItemInBasketId') ItemInBasketId: string,
    @Param('userId') userId: string,
  ): RemoveProductFromBasketResponse {
    return this.basketService.remove(ItemInBasketId, userId);
  }

  @Get('/')
  listProductsInBasket(): ListProductsInBasketResponse {
    return this.basketService.list();
  }
  @Get('/stats')
  @UsePassword('passforstats')
  @UseInterceptors(TimeoutInterceptor, CacheInterceptor)
  @UseCacheTimeDecorator(5)
  getStats(): Promise<GetBasketStatsResponse> {
    return this.basketService.getStats();
  }

  @Get('/total/:userId')
  getTotal(@Param('userId') userId: string): Promise<GetTotalPriceResponse> {
    return this.basketService.getTotal(userId);
  }
  @Get('/:userId')
  getBasket(@Param('userId') userId: string): Promise<GetTotalPriceResponse> {
    return this.basketService.getAllForUser(userId);
  }
  @Get('/admin')
  @UseGuards(PasswordProtectGuard)
  @UsePassword('admin1')
  getBasketForAdmin(): Promise<GetTotalPriceResponse> {
    return this.basketService.getAllForAdmin();
  }
}
