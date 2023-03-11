import { MarketplaceNftsType } from '@app/shared-library/workers/workers.marketplace';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  private static readonly DefaultPaginationSize = 1;

  constructor(private readonly appService: AppService) { }

  @Get('cronosUsdPrice')
  getCronosUsdPrice() {
    return this.appService.getCronosUsdPrice()
  }

  @Get('projects')
  projects() {
    return this.appService.getProjects()
  }

  @Get('collection/:address')
  getCollection(@Param('address') address: string) {
    return this.appService.getCollection(address);
  }

  @Get('collection/:address/listed')
  getCollectionListedItems(
    @Param('address') address: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = AppController.DefaultPaginationSize) {
    return this.appService.getCollectionItems(MarketplaceNftsType.LISTED, address, page, size);
  }

  @Get('collection/:address/sold')
  getCollectionSoldItems(
    @Param('address') address: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = AppController.DefaultPaginationSize) {
    return this.appService.getCollectionItems(MarketplaceNftsType.SOLD, address, page, size);
  }

  @Get('collection/:address/all')
  getCollectionAllItems(
    @Param('address') address: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = AppController.DefaultPaginationSize) {
    return this.appService.getCollectionItems(MarketplaceNftsType.ALL, address, page, size);
  }

  @Get('collection/:address/owner/:owner')
  getCollectionMyItems(
    @Param('address') address: string,
    @Param('owner') owner: string) {
    return this.appService.getCollectionItemsByOwner(address, owner);
  }

  @Get('mint/:collectionAddress')
  getMint(@Param('collectionAddress') collectionAddress: string) {
    return this.appService.getMintByCollection(collectionAddress);
  }

}
