import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopItemEntity } from '../shop/shop-item.entity';
import { JoinColumn } from 'typeorm/browser';
import { UserEntity } from '../user/user.entity';

export class ItemInBasketEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
  })
  count: number;

  @ManyToOne(
    () => ShopItemEntity,
    (shopItem: ShopItemEntity) => shopItem.itemsInBasket,
  )
  @JoinColumn()
  shopItem: ShopItemEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.itemsInBasket)
  @Column()
  user: UserEntity;
}
