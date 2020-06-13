import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { OauthModule } from '../lib';
import { waitFor } from './utils';

class SaveUserClass {
  async saveUser(user: any) {
    await waitFor(3000);
    return user;
  }
}

const bootstrap = async () => {
  const saveUSerClass = new SaveUserClass();
  const app = await NestFactory.create(
    OauthModule.forRoot({
      controllerRoot: 'auth',
      authorities: [
        {
          name: 'google',
          controller: {
            root: 'google',
            callback: '/google/callback',
          },
          service: {
            scope: ['profile', 'email'],
            clientId: process.env.GOOGLE_CLIENT,
            callback: process.env.GOOGLE_CALLBACK,
            clientSecret: process.env.GOOGLE_SECRET,
            prompt: 'select_account',
          },
          provide: saveUSerClass.saveUser,
        },
        {
          name: 'github',
          controller: {
            callback: '/github/callback',
            root: 'github'
          },
          service: {
            scope: ['user', 'repo'],
            clientId: process.env.GITHUB_CLIENT,
            callback: process.env.GITHUB_CALLBACK,
            clientSecret: process.env.GITHUB_SECRET,
            prompt: 'select_account'
          },
          provide: saveUSerClass.saveUser,
        }
      ],
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(3333);
};

bootstrap();
