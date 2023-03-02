import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SaleBetDto } from './dto/dto.sale.bet';
import { SaleCancelDto } from './dto/dto.sale.cancel';
import { SaleNewDto } from './dto/dto.sale.new';
import { SaleRedeemDto } from './dto/dto.sale.redeem';

// TODO implement caches
@Controller()
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

  @Get('collection/listed/:address')
  getCollectionListed(@Param('address') address: string) {
    return this.appService.getCollectionListed(address);
  }

  @Get('collection/sold/:address')
  getCollectionSold(@Param('address') address: string) {
    return this.appService.getCollectionSold(address);
  }

  @Get('mint/:mintId')
  getMint(@Param('mintId') mintId: string) {
    return this.appService.getMint(mintId);
  }

  @Post('sale/new')
  saleNew(@Body() request: SaleNewDto) {

  }

  @Post('sale/cancel')
  saleCancel(@Body() request: SaleCancelDto) {

  }

  @Post('sale/redeem')
  saleRedeem(@Body() request: SaleRedeemDto) {

  }

  @Post('sale/bet')
  saleBet(@Body() request: SaleBetDto) {

  }

}
