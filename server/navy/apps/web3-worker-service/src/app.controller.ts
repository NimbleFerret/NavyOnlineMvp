import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { GenerateNftImageDto, MintCaptainDto } from "./dto/dto";

@Controller()
export class AppController {

    constructor(private readonly appSerivce: AppService) {
    }

    @Post('generateNftImage')
    generateNftImage(@Body() request: GenerateNftImageDto) {
        this.appSerivce.generateNftImage(request);
    }

    @Post('mintCaptain')
    mintCaptain(@Body() request: MintCaptainDto) {
        this.appSerivce.mintCaptain(request);
    }

}