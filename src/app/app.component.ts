import { Component } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { MatFormField } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";
import { RouterOutlet } from '@angular/router';
import { Service } from "./services/service";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { AsyncPipe, NgIf } from "@angular/common";
import { map } from "rxjs";
import { MarketDataComponent } from "./market-data/market-data.component";
import { Instrument } from "../models/instrument-model";
import { Websocket } from "./services/websocket/websocket.service";
import { Chart } from "./chart/chart.component";
import { ChartData } from "../models/chart-data.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatFormField, MatSelect, MatOption, ToolbarComponent, AsyncPipe, MarketDataComponent, Chart, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[]
})
export class AppComponent{
  title = 'Fintacharts';
  showChart = false;
  selectedInstrument : Instrument | null = null
  instruments$ = this.service.getInstruments().pipe(map(({data}) => data))
  websocketData$  = this.websocketService.receivedMessage.asObservable().pipe(map(el=>el?.last));
  dateRangeData$  = this.service.getDateRangeData().pipe(
    map(res => res?.data.map(d => ({
      x: d.t,
      y: [d.c, d.h, d.l, d.o]
    } as unknown as ChartData)))
  );
  constructor(private service:Service, private websocketService:Websocket) {}
}

