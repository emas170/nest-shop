import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import {
  AddProductToBasket,
  GetBasketStatsResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
} from '../interface/basket';
import { ShopService } from '../shop/shop.service';
import { ItemInBasketEntity } from './item-in-basket.entity';
import { UserService } from '../user/user.service';
import { getConnection } from 'typeorm';
import { MailService } from '../mail/mail.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
  ) {}

  async add(item: AddProductDto): Promise<AddProductToBasket> {
    const { count, produktId } = item;
    const shopItem = await this.shopService.getOneProduct(produktId);
    if (
      typeof produktId !== 'string' ||
      typeof count !== 'number' ||
      produktId == '' ||
      count < 1 ||
      !shopItem
    ) {
      return {
        isSuccess: false,
      };
    }

    const item = new ItemInBasketEntity();
    item.count = count;
    await item.save();

    item.shopItem = shopItem;
    item.user = user;
    await item.save();

    await this.mailService.sendUserConfirmation(
      user.email,
      'Dziękujemy za dodanie do koszyka',
      `Dodano do koszyka: ${shopItem.description} - ${count} szt.`,
    );
    return {
      isSuccess: true,
      id: item.id,
    };
  }

  async remove(
    ItemInBasketId: string,
    userId: string,
  ): Promise<RemoveProductFromBasketResponse> {
    const user = await this.userService.getOneUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const item = await ItemInBasketEntity.findOne({
      where: { id: ItemInBasketId, user },
    });
    if (item) {
      await item.remove();

      return {
        isSuccess: true,
      };
    }
    return {
      isSuccess: false,
    };
  }
  async getAllForUser(userId: string): Promise<ItemInBasketEntity> {
    const user = await this.userService.getOneUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return (
      await ItemInBasketEntity.find({
        where: { user },
        relations: ['shopItem'],
      })
    ).map((item) => ({
      id: item.id,
      count: item.count,
    }));
  }
  async getAllForAdmin(): Promise<ItemInBasketEntity[]> {
    return ItemInBasketEntity.find({
      relations: ['shopItem', 'user'],
    });
  }

  async clearBasket(userId: string): Promise<void> {
    const user = await this.userService.getOneUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await ItemInBasketEntity.delete({ user });
  }

  async getTotalPrice(userId: string): Promise<GetTotalPriceResponse> {
    const items = await this.getAllForUser(userId);
    if (!this.items.every((item) => this.shopService.hasProduct(item.name))) {
      const alternativeBasket = this.items.filter((item) =>
        this.shopService.hasProduct(item.name),
      );
      return {
        isSuccess: false,
        alternativeBasket,
      };
    }

    return (
      await Promise.all(
        this.items.map(async (item) => item.shopItem.price * item.count * 1.23),
      )
    ).reduce((a, b) => a + b, 0);
  }

  async getStats(): Promise<GetBasketStatsResponse> {
    const { itemInBasketAvgPrice } = await getConnection()
      .createQueryBuilder()
      .select('AVG(itemInBasketEntity.price)', 'itemInBasketAvgPrice')
      .from(ItemInBasketEntity, 'itemInBasketEntity')
      .leftJoinAndSelect('itemInBasketEntity.shopItem', 'shopItem')
      .getRawOne();

    const allItemsInBasket = await this.getAllForAdmin();
    const baskets: { [userId: string]: number } = {};

    for (const oneItemInBasket of allItemsInBasket) {
      baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;
      baskets[oneItemInBasket.user.id] +=
        oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
    }
    const basketValues: number[] = Object.values(baskets);
    return {
      itemInBasketAvgPrice,
      basketAvgTotalPrice:
        basketValues.reduce((a, b) => a + b, 0) / basketValues.length,
    };
  }
  async countPromo(): Promise<number> {
    return (await this.getTotalPrice()) > 10 ? 1 : 0;
  }
}
