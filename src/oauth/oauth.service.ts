import { Injectable, HttpService, Inject } from '@nestjs/common';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class OauthService {
  constructor(
    private readonly http: HttpService,
    @Inject('OAUTH_SERVICE_OPTIONS')
    private readonly options: {
      scope: string[];
      callback: string;
      clientId: string;
      prompt?: string;
      clientSecret: string;
    },
    @Inject('PROVIDED_SERVICE')
    private readonly providedService: { saveUser: (user: any) => any },
  ) {}

  getLoginUrl() {
    return `https://accounts.google.com/o/oauth2/v2/auth?scope=${
      Array.isArray(this.options.scope)
        ? this.options.scope.join(' ')
        : this.options.scope
    }&access_type=online&response_type=code&redirect_uri=${
      this.options.callback
    }&client_id=${this.options.clientId}&prompt=${this.options.prompt ||
      'select_account'}`;
  }

  getUser(code: string) {
    return this.http
      .post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.options.callback,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map(res => res.data),
        switchMap(accessData =>
          this.http.get('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
              Authorization: `Bearer ${accessData.access_token}`,
            },
          }),
        ),
        map(userData => userData.data),
        switchMap(data => of(this.providedService.saveUser(data))),
      );
  }
}
