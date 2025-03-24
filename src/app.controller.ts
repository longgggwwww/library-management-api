import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicEndpoint } from './auth/decorators/public-endpoint.decorator';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @PublicEndpoint()
  @Get()
  sayHi() {
    return this.app.sayHi();
  }
}
