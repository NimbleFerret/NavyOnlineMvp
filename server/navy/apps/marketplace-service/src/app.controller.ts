import { MarketplaceNftsType } from '@app/shared-library/workers/workers.marketplace';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsReadDto } from './dto/dto.notifications.read';

@Controller('marketplace')
export class AppController {

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
    @Query('page') page?: number) {
    return this.appService.getCollectionItems(MarketplaceNftsType.LISTED, address, page);
  }

  @Get('collection/:address/sold')
  getCollectionSoldItems(
    @Param('address') address: string,
    @Query('page') page?: number) {
    return this.appService.getCollectionItems(MarketplaceNftsType.SOLD, address, page);
  }

  @Get('collection/:address/all')
  getCollectionAllItems(
    @Param('address') address: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('rarity') rarity?: string) {
    return this.appService.getCollectionItems(MarketplaceNftsType.ALL, address, page, size, rarity);
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

  @Get('notifications/:walletAddress')
  getNotifications(@Param('walletAddress') walletAddress: string) {
    return this.appService.getNotifications(walletAddress);
  }

  @Post('notifications/read')
  readNotifications(@Body() dto: NotificationsReadDto) {
    return this.appService.readNotifications(dto.walletAddress);
  }

}
