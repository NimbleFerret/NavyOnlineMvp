import { SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthUpdateDto } from 'apps/gateway-service/src/dto/app.dto';
import { AuthApiService } from './api/api.auth';
import { BidApiService } from './api/api.bid';
import { FavouriteApiService } from './api/api.favourite';
import { NotificationApiService } from './api/api.notification';
import { BidPlaceDto, BidDeleteDto } from './dto/dto.bids';
import { FavouriteDto } from './dto/dto.favourite';
import { NotificationsReadDto } from './dto/dto.notifications.read';

@Controller('marketplace/auth')
export class AppControllerAuth {

  constructor(
    private readonly authService: AuthApiService,
    private readonly favouriteService: FavouriteApiService,
    private readonly bidService: BidApiService,
    private readonly notificationService: NotificationApiService
  ) { }

  // --------------------------------
  // Auth
  // --------------------------------

  @Post('auth/signUp')
  async authSignUp(@Body() request: SignUpRequest) {
    return this.authService.authSignUp(request);
  }

  @Post('auth/signIn')
  async authSignIn(@Body() request: SignUpRequest) {
    return this.authService.authSignIn(request);
  }

  @Post('auth/update')
  async authUpdate(@Body() request: AuthUpdateDto) {
    return this.authService.authUpdate(request);
  }

  // --------------------------------
  // Collection
  // --------------------------------

  @Post('favourite/add')
  favouriteAdd(@Body() dto: FavouriteDto) {
    return this.favouriteService.favouriteAdd(dto);
  }

  @Post('favourite/remove')
  favouriteRemove(@Body() dto: FavouriteDto) {
    return this.favouriteService.favouriteRemove(dto);
  }

  // --------------------------------
  // Bids api
  // --------------------------------

  @Get('bid/:contractAddress/:tokenId')
  bid(@Param('contractAddress') contractAddress: string, @Param('tokenId') tokenId: string) {
    return this.bidService.bids(contractAddress, tokenId);
  }

  @Post('bid/place')
  bidPlace(@Body() dto: BidPlaceDto) {
    return this.bidService.bidPlace(dto);
  }

  @Delete('bid/delete')
  bidDelete(@Body() dto: BidDeleteDto) {
    return this.bidService.bidDelete(dto);
  }

  // --------------------------------
  // Notifications
  // --------------------------------

  @Get('notifications/:walletAddress')
  getNotifications(@Param('walletAddress') walletAddress: string) {
    return this.notificationService.getNotifications(walletAddress);
  }

  @Post('notifications/read')
  readNotifications(@Body() dto: NotificationsReadDto) {
    return this.notificationService.readNotifications(dto.walletAddress);
  }
}
