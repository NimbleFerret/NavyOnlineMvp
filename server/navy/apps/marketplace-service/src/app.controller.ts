import { MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Utils } from '@app/shared-library/utils';
import { Body, Controller, Get, HttpCode, Param, Post, Query, Req } from '@nestjs/common';
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
  @HttpCode(200)
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
  topSales(@Req() request: Request, @Param('days') days?: string) {
    return this.collectionService.topSales(Utils.GetBearerTokenFromRequest(request), days);
  }

  // --------------------------------
  // Collection api
  // --------------------------------

  @Get('collection/:address')
  getCollection(@Param('address') address: string) {
    return this.collectionService.getCollection(address);
  }

  // @Get('collection/:address/listed')
  // getCollectionListedItems(
  //   @Req() request: Request,
  //   @Param('address') address: string,
  //   @Query('page') page?: number) {
  //   return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), MarketplaceState.LISTED, address, page);
  // }

  // @Get('collection/:address/sold')
  // getCollectionSoldItems(
  //   @Req() request: Request,
  //   @Param('address') address: string,
  //   @Query('page') page?: number) {
  //   return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), MarketplaceState.SOLD, address, page);
  // }

  @Get('collection/:address/all')
  getCollectionAllItems(
    @Req() request: Request,
    @Param('address') address: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('rarity') rarity?: string) {
    return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), address, page, size, rarity);
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
