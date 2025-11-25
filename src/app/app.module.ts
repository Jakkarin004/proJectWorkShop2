import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { RunTimePipe } from './pipe/run-time.pipe';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule,BsLocaleService } from 'ngx-bootstrap/datepicker';

import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgeDatePipe } from './pipe/age-date.pipe';
import { HttpClientModule } from '@angular/common/http';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { SearchComponent } from './search/search.component';
import { ChartComponent } from './chart/chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
defineLocale('th', thBeLocale); // <-- กำหนด locale ไทย

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContentComponent,
    RunTimePipe,
    AgeDatePipe,
    SearchComponent,
    ChartComponent,
    BarChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    NzTableModule,
    NzTagModule,
    ModalModule,
    HttpClientModule//เอาไว้เรียก API
  ],
  providers: [
    ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private localeService: BsLocaleService) {
    this.localeService.use('th'); 
  }
}
