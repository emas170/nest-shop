import { AddProductDto } from '../basket/dto/add-product.dto';

export type AddProductToBasket =
  | {
      isSuccess: true;
      id: string;
    }
  | {
      isSuccess: false;
    };

export interface RemoveProductFromBasketResponse {
  isSuccess: boolean;
}

export interface OneItemInBasket {
  id: string;
  count: number;
}

export type ListProductsInBasketResponse = OneItemInBasket[];

export type GetTotalPriceResponse =
  | number
  | {
      isSuccess: false;
      alternativeBasket: AddProductDto[];
    };

export interface GetBasketStatsResponse {
  itemInBasketAvgPrice: number;
  basketAvgTotalPrice: number;
}
