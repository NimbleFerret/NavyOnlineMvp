import { Controller, Get, Param } from '@nestjs/common';
import { Web3ServiceService } from './app.service';
import { MoralisService } from './moralis/moralis.service';

@Controller()
export class Web3ServiceController {
  constructor(
    private readonly web3ServiceService: Web3ServiceService,
    private readonly moralisService: MoralisService) { }

  @Get('nfts/:address')
  async getNFTsByAddress(@Param('address') address: string) {
    return this.moralisService.loadUserNFTs(address.toLowerCase());
  }
}
