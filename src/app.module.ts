import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './oauth/oauth.module';

const waitFor = (time: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

@Module({
  imports: [
    OauthModule({ name: 'google' }).forRoot({
      controller: {
        root: 'google',
        callback: '/google/callback',
        name: 'auth',
      },
      service: {
        scope: ['profile', 'email'],
        clientId:
          process.env.GOOGLE_CLIENT,
        callback: process.env.GOOGLE_CALLBACK,
        clientSecret: process.env.GOOGLE_SECRET,
        prompt: 'select_account',
      },
      provide: {
        saveUser: async data => {
          await waitFor(3000);
          return data;
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
