import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BidPlaceDto, BidDeleteDto } from './dto/dto.bids';
import { FavouriteDto } from './dto/dto.favourite';
import { NotificationsReadDto } from './dto/dto.notifications.read';

@Controller('marketplace/auth')
export class AppControllerAuth {

  constructor(private readonly appService: AppService) { }

  // --------------------------------
  // Collection
  // --------------------------------

  @Post('favourite/add')
  favouriteAdd(@Body() dto: FavouriteDto) {
    return this.appService.favouriteAdd(dto);
  }

  @Post('favourite/remove')
  favouriteRemove(@Body() dto: FavouriteDto) {
    return this.appService.favouriteRemove(dto);
  }

  // --------------------------------
  // Bids
  // --------------------------------

  @Post('bid')
  bidPlace(@Body() dto: BidPlaceDto) {
    return this.appService.bidPlace(dto);
  }

  @Delete('bid')
  bidDelete(@Body() dto: BidDeleteDto) {
    return this.appService.bidDelete(dto);
  }

  // --------------------------------
  // Notifications
  // --------------------------------

  @Get('notifications/:walletAddress')
  getNotifications(@Param('walletAddress') walletAddress: string) {
    return this.appService.getNotifications(walletAddress);
  }

  @Post('notifications/read')
  readNotifications(@Body() dto: NotificationsReadDto) {
    return this.appService.readNotifications(dto.walletAddress);
  }
}
