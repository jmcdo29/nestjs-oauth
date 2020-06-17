import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { OauthModule } from '../lib';
import { waitFor } from './utils';
import { AppModule } from './app.module';

class SaveUserClass {
  async saveUser(user: any) {
    await waitFor(3000);
    return user;
  }
}

const bootstrap = async () => {
  const saveUSerClass = new SaveUserClass();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3333);
};

bootstrap();
