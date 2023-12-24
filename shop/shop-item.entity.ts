import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemInterface } from '../interface/shop';
import { ItemInBasketEntity } from '../basket/item-in-basket.entity';
import { ShopItemDetailsEntity } from './shop-item-details.entity';
import { JoinColumn, JoinTable } from 'typeorm/browser';
import { ShopSetEntity } from './shop-set.entity';

@Entity()
export class ShopItemEntity extends BaseEntity implements ShopItemInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    type: 'longtext',
    default: null,
  })
  description: string | null;

  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: 0,
  })
  wasEverBought: boolean;

  @Column({
    default: null,
    nullable: true,
  })
  photoFn: string;

  @OneToOne(() => ShopItemDetailsEntity)
  @JoinColumn()
  details: ShopItemDetailsEntity;

  @OneToMany(() => ItemInBasketEntity, (entity) => entity.shopItem)
  itemsInBasket: ItemInBasketEntity[];
  /**Subprodukt*/
  @ManyToOne(() => ShopItemEntity, (entity) => entity.subShopItems)
  mainShopItem: ShopItemEntity;

  /***Produkt główny*/
  @OneToMany(() => ShopItemEntity, (entity) => entity.mainShopItem)
  subShopItems: ShopItemEntity[];

  @ManyToMany(() => ShopSetEntity, (entity) => entity.shopItem)
  @JoinTable()
  sets: ShopSetEntity[];
  shopSet: any;
}
