import { MarketplaceNftsType } from '@app/shared-library/workers/workers.marketplace';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BidApiService } from './api/api.bid';
import { CollectionApiService } from './api/api.collection';
import { DashboardApiService } from './api/api.dashboard';
import { FavouriteApiService } from './api/api.favourite';
import { GeneralApiService } from './api/api.general';
import { NotificationApiService } from './api/api.notification';
import { AppService } from './app.service';
import { BidPlaceDto, BidDeleteDto } from './dto/dto.bids';
import { FeedbackDto } from './dto/dto.feedback';

@Controller('marketplace')
export class AppController {

  constructor(
    private readonly bidService: BidApiService,
    private readonly collectionService: CollectionApiService,
    private readonly dashboardService: DashboardApiService,
    private readonly favouriteService: FavouriteApiService,
    private readonly generalService: GeneralApiService,
    private readonly notificationService: NotificationApiService
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
    @Param('address') address: string,
    @Query('page') page?: number) {
    return this.collectionService.getCollectionItems(MarketplaceNftsType.LISTED, address, page);
  }

  @Get('collection/:address/sold')
  getCollectionSoldItems(
    @Param('address') address: string,
    @Query('page') page?: number) {
    return this.collectionService.getCollectionItems(MarketplaceNftsType.SOLD, address, page);
  }

  @Get('collection/:address/all')
  getCollectionAllItems(
    @Param('address') address: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('rarity') rarity?: string) {
    return this.collectionService.getCollectionItems(MarketplaceNftsType.ALL, address, page, size, rarity);
  }

  @Get('collection/:address/owner/:owner')
  getCollectionByOwner(
    @Param('address') address: string,
    @Param('owner') owner: string) {
    return this.collectionService.getCollectionItemsByOwner(address, owner);
  }

  @Get('collection/:address/item/:tokenId')
  getCollectionItem(
    @Param('address') address: string,
    @Param('tokenId') tokenId: string
  ) {
    return this.collectionService.getCollectionItem(address, tokenId);
  }

  @Get('mint/:collectionAddress')
  getMint(@Param('collectionAddress') collectionAddress: string) {
    return this.collectionService.getMintByCollection(collectionAddress);
  }

}
