import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../auth-service/auth.service";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getTokenFromStorage('accessToken');

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401 && accessToken) {
          return this.handleTokenExpired(request, next);
        } else if (error.status === 401 && !accessToken) {
          return this.handleToken(request, next);
        }

        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshAccessToken().pipe(
      switchMap(() => {
        const newAccessToken = this.authService.getTokenFromStorage('accessToken');
        return next.handle(this.addToken(request, newAccessToken!));
      }),
      catchError((error) => {
        console.error('Error handling expired access token:', error);
        return this.handleToken(request, next);
      })
    );
  }

  private handleToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getAccessToken({password:environment.password, username:environment.username}).pipe(
      switchMap(() => {
        const newAccessToken = this.authService.getTokenFromStorage('accessToken');
        return next.handle(this.addToken(request, newAccessToken!));
      }),
      catchError((error) => {
        console.error('Error handling expired access token:', error);
        return throwError(error);
      })
    );
  }
}
