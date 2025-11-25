import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { ChartUpdateService } from '../chart-update.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  ageGroups: any = {};
  chartInstance!: echarts.ECharts;

  constructor(private http: HttpClient, private chartUpdate: ChartUpdateService) {}

  ngOnInit(): void {
    this.fetchData();

    this.chartUpdate.chartUpdate$.subscribe(() => {
      this.fetchData();
    });
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:8778/Tahn-controller/get-data')
      .subscribe(users => {

        // จัดกลุ่มอายุแบบอ่านง่าย
        const groups: any = {
          '0-9': 0,
          '10-19': 0,
          '20-29': 0,
          '30-39': 0,
          '40-49': 0,
          '50-59': 0,
          '60+': 0
        };

        users.forEach(u => {
          const age = u.age;

          if (age < 10) groups['0-9']++;
          else if (age < 20) groups['10-19']++;
          else if (age < 30) groups['20-29']++;
          else if (age < 40) groups['30-39']++;
          else if (age < 50) groups['40-49']++;
          else if (age < 60) groups['50-59']++;
          else groups['60+']++;
        });

        this.ageGroups = groups;
        this.initChart();

      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  initChart() {
    const chartDom = document.getElementById('barChart')!;
    this.chartInstance = echarts.init(chartDom);
    this.updateChart();
    window.addEventListener('resize', () => this.chartInstance.resize());
  }

  updateChart() {
    const option = {
      tooltip: { trigger: 'axis' },

      xAxis: {
        type: 'value',
        name: 'จำนวนคน'
      },
      yAxis: {
        type: 'category',
        data: Object.keys(this.ageGroups),
        name: 'ช่วงอายุ'
      },

      series: [
        {
          name: 'จำนวนผู้ใช้งาน',
          type: 'bar',
          data: Object.values(this.ageGroups),

          // label อยู่ท้ายแท่ง อ่านง่ายมาก
          label: {
            show: true,
            position: 'right'
          }
        }
      ]
    };

    this.chartInstance.setOption(option);
  }
}
