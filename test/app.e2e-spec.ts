import { config } from 'dotenv';
config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { OauthModule } from '../lib';
import { waitFor, httpPromise } from './utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        OauthModule.forRoot({
          controllerRoot: 'auth',
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
              },
              provide: async (user: any) => {
                await waitFor(3000);
                return user;
              },
            },
          ],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('oauth calls', () => {
    let baseUrl: string;

    beforeAll(async () => {
      baseUrl = await app.getUrl();
    });

    it('should call for the login URL', async () => {
      const data = await httpPromise(baseUrl + '/api/auth/google');
      console.log(data);
      expect(true);
    });
  });
});
