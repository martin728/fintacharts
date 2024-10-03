import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject } from "rxjs/internal/observable/dom/WebSocketSubject";
import { BehaviorSubject, Subscription } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { WebsocketResponse } from "../../../models/wecsocket-response.model";
import { AuthService } from "../auth-service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class Websocket implements OnDestroy {
  constructor(private authService:AuthService) {
  }
  socket$!: WebSocketSubject<any>;
  subscription!: Subscription;
  receivedMessage = new BehaviorSubject<WebsocketResponse | null>(null);

  subscribeToMessages(): void {
    this.socket$ = webSocket(`wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${this.authService.getTokenFromStorage('accessToken')}`);
    this.subscription = this.socket$.subscribe(
      (message:WebsocketResponse) => {
        if (message.type === 'l1-update'){
        this.receivedMessage.next(message);
        }
      },
      err => console.error(err),
      () => console.warn('Completed!')
    );
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socket$.complete();
  }

  getMessage(instrumentId:string, subscribe:boolean){
    return {
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": instrumentId,
      "provider": "simulation",
      "subscribe": subscribe,
      "kinds": [
        "last"
      ]
    }
  }
}
