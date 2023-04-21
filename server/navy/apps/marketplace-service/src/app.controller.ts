import { Utils } from '@app/shared-library/utils';
import { MarketplaceNftsType } from '@app/shared-library/workers/workers.marketplace';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { CollectionApiService } from './api/api.collection';
import { DashboardApiService } from './api/api.dashboard';
import { GeneralApiService } from './api/api.general';
import { FeedbackDto } from './dto/dto.feedback';

@Controller('marketplace')
export class AppController {

  constructor(
    private readonly collectionService: CollectionApiService,
    private readonly dashboardService: DashboardApiService,
    private readonly generalService: GeneralApiService,
  ) { }

  // --------------------------------
  // General api page
  // -------------------------------- 

  @Get('cronosUsdPrice')
  getCronosUsdPrice() {
    return this.generalService.getCronosUsdPrice()
  }

  @Get('faq')
  faq() {
    return this.generalService.faq();
  }

  @Post('feedback')
  feedback(@Body() dto: FeedbackDto) {
    return this.generalService.feedback(dto);
  }

  @Get('projects')
  projects() {
    return this.generalService.getProjects();
  }

  // --------------------------------
  // Dashboard page
  // --------------------------------

  @Get('dashboard/:days')
  dashboard(@Param('days') days?: string) {
    return this.dashboardService.dashboard(days);
  }

  @Get('topSales/:days')
  topSales(@Param('days') days?: string) {
    return this.dashboardService.topSales(days);
  }

  // --------------------------------
  // Collection api
  // --------------------------------

  @Get('collection/:address')
  getCollection(@Param('address') address: string) {
    return this.collectionService.getCollection(address);
  }

  @Get('collection/:address/listed')
  getCollectionListedItems(
    @Req() request: Request,
    @Param('address') address: string,
    @Query('page') page?: number) {
    return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), MarketplaceNftsType.LISTED, address, page);
  }

  @Get('collection/:address/sold')
  getCollectionSoldItems(
    @Req() request: Request,
    @Param('address') address: string,
    @Query('page') page?: number) {
    return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), MarketplaceNftsType.SOLD, address, page);
  }

  @Get('collection/:address/all')
  getCollectionAllItems(
    @Req() request: Request,
    @Param('address') address: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('rarity') rarity?: string) {
    return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), MarketplaceNftsType.ALL, address, page, size, rarity);
  }

  @Get('collection/:address/owner/:owner')
  getCollectionByOwner(
    @Req() request: Request,
    @Param('address') address: string,
    @Param('owner') owner: string) {
    return this.collectionService.getCollectionItemsByOwner(Utils.GetBearerTokenFromRequest(request), address, owner);
  }

  @Get('collection/:address/item/:tokenId')
  getCollectionItem(
    @Req() request: Request,
    @Param('address') address: string,
    @Param('tokenId') tokenId: string) {
    return this.collectionService.getCollectionItem(Utils.GetBearerTokenFromRequest(request), address, tokenId);
  }

  @Get('mint/:collectionAddress')
  getMint(@Param('collectionAddress') collectionAddress: string) {
    return this.collectionService.getMintByCollection(collectionAddress);
  }

}
