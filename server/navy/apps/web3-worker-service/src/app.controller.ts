import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { GenerateNftImageDto } from "./dto/dto";

@Controller()
export class AppController {

    constructor(private readonly appSerivce: AppService) {
    }

    @Post('generateNftImage')
    generateNftImage(@Body() request: GenerateNftImageDto) {
        this.appSerivce.generateNftImage(request);
    }

}