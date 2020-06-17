import { Module } from '@nestjs/common';
import { OauthModule } from '../lib';
import { waitFor } from './utils';

async function saveUser(user: any) {
  await waitFor(3000);
  return user;
}

@Module({
  imports: [
    OauthModule.forRoot({
      controllerRoot: 'oauth',
      authorities: [
        {
          name: 'google',
          controller: {
            root: {
              path: 'google',
            },
            callback: {
              path: '/google/callback',
            },
          },
          service: {
            scope: ['profile', 'email'],
            clientId: process.env.GOOGLE_CLIENT,
            callbackUrl: process.env.GOOGLE_CALLBACK,
            clientSecret: process.env.GOOGLE_SECRET,
            prompt: 'select_account',
            responseType: 'code',
          },
          provide: saveUser,
        },
        {
          name: 'github',
          controller: {
            callback: {
              path: '/github/callback',
            },
            root: {
              path: 'github',
            },
          },
          service: {
            scope: ['user', 'repo'],
            clientId: process.env.GITHUB_CLIENT,
            callbackUrl: process.env.GITHUB_CALLBACK,
            clientSecret: process.env.GITHUB_SECRET,
            prompt: 'select_account',
          },
          provide: saveUser,
        },
      ],
    }),
  ],
})
export class AppModule {}
