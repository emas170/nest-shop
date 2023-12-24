import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  GetListOfProductsResponse,
  GetPaginatedListOfProductsResponse,
  ShopItemInterface,
} from '../interface/shop';
import { BasketService } from '../basket/basket.service';
import { ShopItemEntity } from './shop-item.entity';
import { ShopItemDetailsEntity } from './shop-item-details.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ShopItem } from './shop-item.schema';
import { Model } from 'mongoose';
import { AddProductDto } from './dto/add-product.dto';
import { MulterDiskUploadedFiles } from '../interface/multer';
import * as fs from 'fs';
import * as path from 'path';
import { storageDir } from '../utils/storage';
// import { Between, DataSource, LessThan, Like, Not } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
    @InjectModel(ShopItem.name)
    private readonly shopItemModel: Model<ShopItem>,
  ) {}
  filter(shopItem: ShopItem): ShopItemInterface {
    const { id, price, description, name } = shopItem;
    return { id, price, description, name };
  }
  async getItems(): Promise<ShopItemInterface[]> {
    return (await ShopItem.find()).map(this.filter());
  }
  async getProducts(currentPage: number = 1): Promise<ShopItemInterface[]> {
    // const maxPerPage = 3;
    // const [items, count] = await ShopItemEntity.findAndCount({
    //   relations: ['details', 'sets'],
    //   skip: maxPerPage * (currentPage - 1),
    //   take: maxPerPage,
    // });
    // const pagesCount = Math.ceil(count / maxPerPage);
    // return {
    //   items,
    //   pagesCount,
    // };
    // -----------------------------------------------------------------
    // bazy danych
    const PRODUCT_QUANTITY_PER_PAGE = 2;
    const products = await this.shopItemModel
      .find()
      .limit(PRODUCT_QUANTITY_PER_PAGE)
      .skip(
        (currentPage - 1) * PRODUCT_QUANTITY_PER_PAGE -
          PRODUCT_QUANTITY_PER_PAGE,
      )
      .exec();
    const totalNumber = await this.shopItemModel.countDocuments();
    return {
      items: products,
      pagesCount: Math.round(totalNumber / PRODUCT_QUANTITY_PER_PAGE),
    };
  }
  async hasProduct(name: string): Promise<boolean> {
    return (await this.getProducts()).items.some(
      (item: ShopItemEntity) => item.name === name,
    );
  }
  async getPrice(name: string): Promise<number> {
    return (await this.getProducts()).items.find(
      (item: ShopItemEntity) => item.name === name,
    ).price;
  }

  async getOneProduct(id: string): Promise<ShopItem> {
    // return ShopItemEntity.findOneOrFail(id);
    // ------------------------------------------------------------------
    // bazy danych
    return this.shopItemModel.findById(id).exec();
  }

  async removeProduct(id: string) {
    // return ShopItemEntity.delete(id);
    // ------------------------------------------------------------------
    // bazy danych
    return this.shopItemModel.findByIdAndDelete(id).exec();
    return this.shopItemModel.deleteOne({ name: 'dummy' }).exec();
  }

  async createDummyProduct(): Promise<ShopItemEntity> {
    // const newItem = new ShopItemEntity();
    // newItem.price = 100;
    // newItem.name = 'dummy';
    // newItem.description = 'dummy item';
    //
    // await newItem.save();
    //
    // const details = new ShopItemDetailsEntity();
    // details.color = 'green';
    // details.width = 20;
    // await details.save();
    //
    // newItem.details = details;
    //
    // await newItem.save();
    //
    // return newItem;
    // ---------------------------------------------------------------------
    //  bazy danych
    const newDummyProduct = await this.shopItemModel.create({
      name: 'dummy',
      description: 'dummy item',
      price: 100,
    });
    newDummyProduct.save();
  }
  async addBoughtCounter(id: string) {
    await ShopItemEntity.update(id, {
      wasEverBought: true,
    });
    const item = await ShopItemEntity.findOne(id);
    item.boughtCounter++;
    await item.save(item);
  }

  async findProducts(searchTerm: string): Promise<GetListOfProductsResponse> {
    return await ShopItemEntity.find({
      select: ['id', 'price'],
      // where: [{ description: searchTerm }, { price: 9.99 }],
      // where: { price: Not(LessThan(10)) },
      // where: { price: Between(10, 20) },
      // where: { description: Like(`%${searchTerm}%`) },
      order: {
        description: searchTerm === 'asc' ? 'ASC' : 'DESC',
        price: 'ASC',
      },
    });
  }

  async deleteMany(name: string) {
    await this.shopItemModel.deleteMany({ name });
  }

  async updateProduct(id: string, price: number) {
    await this.shopItemModel.findByIdAndUpdate(id, { price }).exec();
    await this.shopItemModel.updateOne({ _id: id }, { price }).exec();
    await this.shopItemModel.updateMany({ _id: id }, { price }).exec();
  }
  async replaceOne(id: string, name: string) {
    await this.shopItemModel.replaceOne({ _id: id }, { name }).exec();
  }

  async addProduct(
    req: AddProductDto,
    files: MulterDiskUploadedFiles,
  ): Promise<ShopItemInterface> {
    const photo = files?.photo ?? [];
    try {
      const shopItem = new ShopItem();
      shopItem.name = req.name;
      shopItem.description = req.description;
      shopItem.price = req.price;

      if (photo) {
        shopItem.photoFn = photo.filename;
      }
      await shopItem.save();

      return this.filter(shopItem);
    } catch (error) {
      try {
        if (photo) {
          fs.unlinkSync(
            path.join(storageDir(), 'product-photos', photo.filename),
          );
        }
      } catch (error2) {
        throw error;
      }
    }
    async getPhoto(@Param('id')
    id: string, @Res()
    res:any
  )
    {
      try {
        const one = await ShopItem.findOne(id)

        if (!one) {
          throw new Error('Product not found')
        }

        if (!one.photoFn) {
          throw new Error('Photo not found')
        }
        res.sendfile(one.photoFn, { root: path.join(storageDir(), 'product-photos') })
      } catch (e) {
        res.json({ error: e.message })
      }
    }
  }
}
