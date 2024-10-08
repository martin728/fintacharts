import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Environment } from "../../models/environment-model";
import { environment } from "../../environments/environment.development";
import { DateRangeResponse, InstrumentsResponse } from "../../models/instrument-model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class Service {
  environment:Environment = environment
  private dateRangeSubject = new BehaviorSubject<DateRangeResponse | null>(null);

  constructor(private http: HttpClient) { }

  getInstruments(){
    return this.http.get<InstrumentsResponse>(`/api/instruments/v1/instruments?provider=${this.environment.provider}&kind=${this.environment.kind}`)
  }

  getDateRange(instrumentId:string){
    return this.http.get<DateRangeResponse>(`/api/bars/v1/bars/date-range?instrumentId=${instrumentId}&provider=${this.environment.provider}&interval=${this.environment.interval}&periodicity=${this.environment.periodicity}&startDate=${this.environment.startDate}`)
  }

  setDateRange(data: DateRangeResponse): void {
    this.dateRangeSubject.next(data);
  }

  getDateRangeData(): Observable<DateRangeResponse | null> {
    return this.dateRangeSubject.asObservable();
  }
}
