import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartUpdateService {
  private  chartUpdateSource = new Subject<void>();
  chartUpdate$ = this.chartUpdateSource.asObservable();

  constructor() {} 
  notifyUpdate(){
    this.chartUpdateSource.next();
  }
}
