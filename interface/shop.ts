import { ShopItemEntity } from '../shop/shop-item.entity';

export interface ShopItemInterface {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type GetListOfProductsResponse = ShopItemInterface[];

export type GetOneProductResponse = ShopItemEntity;

export type CreateProductResponse = ShopItemEntity;

export interface GetPaginatedListOfProductsResponse {
  items: ShopItemEntity[];
  pagesCount: number;
}
