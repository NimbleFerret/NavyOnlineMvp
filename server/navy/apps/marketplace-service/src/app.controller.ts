import { Utils } from '@app/shared-library/utils';
import { Body, Controller, Get, HttpCode, Param, Post, Query, Req } from '@nestjs/common';
import { CollectionApiService } from './api/api.collection';
import { DashboardApiService } from './api/api.dashboard';
import { GeneralApiService } from './api/api.general';
import { FeedbackDto } from './dto/dto.feedback';

@Controller('api/marketplace')
export class AppController {

  constructor(
    private readonly collectionService: CollectionApiService,
    private readonly dashboardService: DashboardApiService,
    private readonly generalService: GeneralApiService,
  ) { }

  // --------------------------------
  // General api page
  // -------------------------------- 

  @Get('tokensUsdPrice')
  getTokensUsdPrice() {
    return this.generalService.getTokensUsdPrice()
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

  @Get('collection/:chainName/:collectionAddress')
  getCollection(@Param('chainName') chainName: string, @Param('collectionAddress') collectionAddress: string) {
    return this.collectionService.getCollection(chainName, collectionAddress.toLowerCase());
  }

  @Get('collection/:chainName/:collectionAddress/items')
  getCollectionItems(
    @Req() request: Request,
    @Param('chainName') chainName: string,
    @Param('collectionAddress') collectionAddress: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('priceOrder') priceOrder?: string,
    @Query('rarity') rarity?: string[],
    @Query('marketplaceState') marketplaceState?: string) {
    return this.collectionService.getCollectionItems(Utils.GetBearerTokenFromRequest(request), chainName, collectionAddress.toLowerCase(), page, size, priceOrder, rarity, marketplaceState);
  }

  @Get('collection/:chainName/:collectionAddress/item/:tokenId')
  getCollectionItem(
    @Req() request: Request,
    @Param('chainName') chainName: string,
    @Param('collectionAddress') collectionAddress: string,
    @Param('tokenId') tokenId: string) {
    return this.collectionService.getCollectionItem(Utils.GetBearerTokenFromRequest(request), collectionAddress.toLowerCase(), tokenId);
  }

  @Get('mint/:chainName/:collectionAddress')
  getMint(@Param('chainName') chainName: string, @Param('collectionAddress') collectionAddress: string) {
    return this.collectionService.getMintByCollection(chainName, collectionAddress.toLowerCase());
  }

}
