import { Component, Input, OnInit } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle, ChartComponent
} from "ng-apexcharts";
import { MatCard } from "@angular/material/card";
import { ChartData } from "../../models/chart-data.model";
import { NgIf } from "@angular/common";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    ChartComponent,
    MatCard,
    NgIf
  ],
  templateUrl: './chart.component.html',
})
export class Chart implements OnInit {
  public chartOptions: Partial<ChartOptions> = {};
  private _chartData: ChartData[] = [];

  @Input()
  set chartData(value: ChartData[]) {
    this._chartData = value;
    this.updateChartSeries();
  }

  get chartData(): any {
    return this._chartData;
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      series: [{
        name: "candle",
        data: []
      }],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    };
  }

  private updateChartSeries(): void {
    if (this._chartData) {
      this.chartOptions.series = [{
        name: "candle",
        data: this._chartData,
      }];
    }
  }

  ngOnInit(): void {
    this.initializeChartOptions();
  }
}
