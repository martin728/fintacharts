import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Environment } from "../../../models/environment-model";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  environment:Environment = environment
  url = `/identity/realms/fintatech/protocol/openid-connect/token`;

  constructor(private http:HttpClient) {}

  getAccessToken(credentials: { username: string; password: string }): Observable<any> {
    const body = new URLSearchParams({
      username: credentials.username,
      password: credentials.password,
      grant_type: environment.grant_type,
      client_id: environment.client_id
    }).toString();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(this.url, body.toString(), { headers }).pipe(
      tap((response) => {
        this.setTokenToStorage('accessToken', response.access_token);
        this.setTokenToStorage('refreshToken', response.refresh_token);
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);
        return throwError(error);
      })
    );
  }

  getTokenFromStorage(name:string) {
    return localStorage.getItem(name);
  }

  setTokenToStorage(name:string,token:string) {
    return localStorage.setItem(name,token);
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getTokenFromStorage('refreshToken');

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: 'app-cli',
      refresh_token: refreshToken || '',
    }).toString();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(this.url, body, { headers }).pipe(
      tap((response) => {
        this.setTokenToStorage('accessToken', response.access_token);
        this.setTokenToStorage('refreshToken', response.refresh_token);
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);
        return throwError(error);
      })
    );
  }

}
