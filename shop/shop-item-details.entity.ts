import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemEntity } from './shop-item.entity';

@Entity()
export class ShopItemDetailsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    length: 15,
  })
  color: string;

  @Column({
    length: 15,
  })
  width: number;

  @OneToOne(() => ShopItemEntity)
  shopItem: ShopItemEntity;
}
