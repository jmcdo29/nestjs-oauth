import { Controller } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller()
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}
} 
