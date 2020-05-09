import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('notHello')
  helloFromOne() {
    return { hello: 'from AppController' };
  }
}
