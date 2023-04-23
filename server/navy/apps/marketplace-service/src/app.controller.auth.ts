import { SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Utils } from '@app/shared-library/utils';
import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { AuthUpdateDto } from 'apps/gateway-service/src/dto/app.dto';
import { AuthApiService } from './api/api.auth';
import { BidApiService } from './api/api.bid';
import { FavouriteApiService } from './api/api.favourite';
import { NotificationApiService } from './api/api.notification';
import { BidPlaceDto, BidDeleteDto } from './dto/dto.bids';
import { FavouriteDto } from './dto/dto.favourite';

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

  @Post('signUp')
  async authSignUp(@Body() request: SignUpRequest) {
    return this.authService.authSignUp(request);
  }

  @Post('signIn')
  async authSignIn(@Body() request: SignUpRequest) {
    return this.authService.authSignIn(request);
  }

  @Post('update')
  async authUpdate(@Body() request: AuthUpdateDto) {
    return this.authService.authUpdate(request);
  }

  // --------------------------------
  // Collection
  // --------------------------------

  @Get('favourites')
  favourites(@Req() request: Request) {
    return this.favouriteService.favoutires(Utils.GetBearerTokenFromRequest(request));
  }

  @Post('favourites/add')
  favouritesAdd(@Req() request: Request, @Body() dto: FavouriteDto) {
    return this.favouriteService.favouritesAdd(Utils.GetBearerTokenFromRequest(request), dto);
  }

  @Post('favourites/remove')
  favouritesRemove(@Req() request: Request, @Body() dto: FavouriteDto) {
    return this.favouriteService.favouritesRemove(Utils.GetBearerTokenFromRequest(request), dto);
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

  @Get('notifications')
  getNotifications(@Req() request: Request) {
    return this.notificationService.getNotifications(Utils.GetBearerTokenFromRequest(request));
  }

  @Post('notifications/read')
  readNotifications(@Req() request: Request) {
    return this.notificationService.readNotifications(Utils.GetBearerTokenFromRequest(request));
  }
}
