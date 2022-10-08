import { Injectable } from '@nestjs/common';

@Injectable()
export class Web3ServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
