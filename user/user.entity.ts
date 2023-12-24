import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemInBasketEntity } from '../basket/item-in-basket.entity';
import { JoinColumn } from 'typeorm/browser';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  email: string;

  @Column({
    length: 255,
  })
  pwdHash: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @OneToMany(
    () => ItemInBasketEntity,
    (itemInBasket: ItemInBasketEntity) => itemInBasket.user,
  )
  @JoinColumn()
  itemsInBasket: ItemInBasketEntity[];
}
