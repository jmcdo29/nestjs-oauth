import { Get,  Query, Controller } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller()
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get()
  getLoginUrl(): void {
    return;
  }

  @Get('callback')
  getUser(@Query('code') code: string) {
    return this.oauthService.getUser(code);
  }
}
