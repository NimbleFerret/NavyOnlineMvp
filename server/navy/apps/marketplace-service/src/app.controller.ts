import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('projects')
  projects() {
    return this.appService.getProjects()
  }

  @Get('mint/details/:projectId')
  mintDetails(@Param('projectId') projectId: string) {
    console.log(projectId);
    return this.appService.getProjectMintDetails(projectId)
  }
}
