import {
  BaseEntity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemEntity } from './shop-item.entity';

export class ShopSetEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 60,
  })
  name: string;
  @ManyToMany(
    () => ShopItemEntity,
    (shopItem: ShopItemEntity) => shopItem.shopSet,
  )
  items: ShopItemEntity[];
  shopItem: any;
}
