import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from "./app/app.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from "./app/services/auth-service/auth.service";
import { TokenInterceptorService } from "./app/services/token-interceptor/token-interceptor.service";
import { Websocket } from "./app/services/websocket/websocket.service";

bootstrapApplication(AppComponent,{
  providers: [
    AuthService,
    Websocket,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync('noop'),
  ]}).catch(err => console.error(err));

