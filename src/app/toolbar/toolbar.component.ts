import { NgForOf } from "@angular/common";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { take } from "rxjs";
import { Instrument } from "../../models/instrument-model";
import { Websocket } from "../services/websocket/websocket.service";
import { Service } from "../services/service";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    NgForOf,
    MatInputModule,
    MatButton,
    FormsModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  selectedInstrument!: Instrument;
  logData = false;
  private _instruments!: Instrument[];

  @Output() logDataChange = new EventEmitter<boolean>();
  @Output() selectionChange = new EventEmitter<Instrument>();
  @Input() set instruments(instruments: Instrument[]) {
    this._instruments = instruments;
    this.updateSelectedInstrument();
  }

  get instruments(): Instrument[] {
    return this._instruments;
  }

  private updateSelectedInstrument(): void {
    if (this._instruments?.length) {
      this.selectedInstrument = this._instruments[0];
      this.selectionChange.emit(this.selectedInstrument);
    }
  }

  onSubscribe(){
    this.logData = !this.logData;
    this.emitLogData();
    this.toggleWebsocket()
    this.websocketService.sendMessage(this.websocketService.getMessage(this.selectedInstrument.id, true));
    this.service
      .getDateRange(this.selectedInstrument.id)
      .pipe(take(1))
      .subscribe(data => {
        this.service.setDateRange(data);
      });
  }

  onSymbolChange(newSymbol: Instrument): void {
    this.selectedInstrument = newSymbol;
    this.selectionChange.emit(this.selectedInstrument);
    this.logData = false;
    this.toggleWebsocket()
    this.emitLogData();
  }

  emitLogData(){
    this.logDataChange.emit(this.logData);
  }

  toggleWebsocket(){
    if(!this.logData){
      this.websocketService.socket$.complete()
    } else {
      this.websocketService.subscribeToMessages();
    }
  }

  constructor(private websocketService:Websocket,private service:Service){
  }
}
