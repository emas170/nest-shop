import {
  Body,
  Controller, DefaultValuePipe,
  Delete,
  Get, ImATeapotException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post, Res,
  Scope, UploadedFiles, UseInterceptors
} from "@nestjs/common";
import { ShopService } from "./shop.service";
import {
  CreateProductResponse,
  GetListOfProductsResponse,
  GetPaginatedListOfProductsResponse,
  ShopItemInterface
} from "../interface/shop";
import { CheckAgePipe } from "../pipes/check-age.pipe";
import { AddProductDto } from "./dto/add-product.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { multerStorage, storageDir } from "../utils/storage";
import { MulterDiskUploadedFiles } from "../interface/multer";

@Controller({
  path: 'shop',
  scope: Scope.REQUEST,
})
export class ShopController {
  onModuleInit() {
    console.log('init');
  }
  onApplicationBootstrap() {
    console.log('loaded');
  }
  onModuleDestroy() {
    console.log('destroyed');
  }
  onApplicationShutdown() {
    console.log('shutdown');
  }
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/')
  async getShopList(): Promise<ShopItemInterface[]> {
    await return this.shopService.getProducts()
  }

  @Get('/:pageNumber')
  getListOfProducts(
    @Param('pageNumber') pageNumber: string,
  ): Promise<GetPaginatedListOfProductsResponse> {
    return this.shopService.getProducts(Number(pageNumber));
  }

  @Get('/find/:searchTerm')
  testFindProduct(
    @Param('searchTerm') searchTerm: string,
  ): Promise<GetListOfProductsResponse> {
    return this.shopService.findProducts(searchTerm);
  }

  @Get('/:id')
  async getOneProduct(@Param('id') id: string) {
    return await this.shopService.getOneProduct(id);

  }
  @Delete('/:id')
  removeProduct(@Param('id') id: string) {
    return this.shopService.removeProduct(id);
  }
  @Post('/')
  async createNewProduct(): Promise<CreateProductResponse> {
    return await this.shopService.createDummyProduct();
  }
  @Post('/delete-many')
  async deleteMany(@Body() req:{name: string} ) {
    return await this.shopService.deleteMany(req.name)
  }
  @Patch('/update-price/:id')
  async updateProduct(@Param('id') id: string, @Body() req: {price: number}) {
    await this.shopService.updateProduct(id, req.price);
  }
  @Patch('/replace-one/:id')
  async replaceOne(@Param('id') id: string, @Body() req: {name: string}) {
    await this.shopService.updateProduct(id, req.name);
  }
  @Get('/test/:age')
  async test(@Param('age', new CheckAgePipe({ minAge: 21 } ) ) age: number) {
    return age
  }
  @Get('/test2')
  async test2() {
    throw new ImATeapotException('Im a teapot');
  }
  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      {name: 'photo', maxCount: 10},
    ], {storage: multerStorage(path.join(storageDir(), 'product-photos'))})
  )
  addProduct(
    @Body() req: AddProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ShopItemInterface> {
    return this.shopService.addProduct(req, files);
  }
  @Get('/photo/:id')
  async getPhoto(@Param('id') id: string, @Res() res:any) {
    return await this.shopService.getPhoto(id);
  }
}
