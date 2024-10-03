import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { Instrument } from "../../models/instrument-model";
import { MatLabel } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { LastData } from "../../models/wecsocket-response.model";

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [
    MatCard,
    MatLabel,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    AsyncPipe
  ],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss'
})
export class MarketDataComponent implements OnInit, OnDestroy {
  @Input() instrument: Instrument | null = null;
  @Input() websocketData: LastData | null = null;
  @Input() resetPrice: boolean = true;

  currentTime: string = '';
  intervalId!: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }
}
