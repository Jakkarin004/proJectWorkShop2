import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { ChartUpdateService } from '../chart-update.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  genderData: { male: number, female: number, unspecified: number } = { male: 0, female: 0, unspecified: 0 };
  chartInstance!: echarts.ECharts;

  constructor(private http: HttpClient, private chartUpdate: ChartUpdateService) { }

  ngOnInit(): void {
    this.fetchData();

    this.chartUpdate.chartUpdate$.subscribe(() => {
      this.fetchData();     // รีโหลดข้อมูลใหม่
    });
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:8778/Tahn-controller/get-data')
      .subscribe(users => {
        // นับจำนวนผู้ใช้งานตามเพศ
        this.genderData.male = users.filter(u => u.gender === 'ชาย').length;
        this.genderData.female = users.filter(u => u.gender === 'หญิง').length;
        this.genderData.unspecified = users.filter(u => u.gender === 'ไม่ระบุ').length;

        // หลังได้ข้อมูลแล้ว สร้าง chart
        this.initChart();
      }, error => {
        console.error('Error fetching user data:', error);
      });
  }


  initChart() {
    const chartDom = document.getElementById('genderChart')!;
    this.chartInstance = echarts.init(chartDom);

    this.updateChart();
    window.addEventListener('resize', () => this.chartInstance.resize());
  }

  updateChart() {
    const option = {
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center' },
      series: [
        {
          name: 'จำนวนผู้ใช้งาน',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: { show: true, position: 'outside', formatter: '{b}: {c} ({d}%)' },
          labelLine: { show: true },
          data: [
            { value: this.genderData.male, name: 'ชาย' },
            { value: this.genderData.female, name: 'หญิง' },
            { value: this.genderData.unspecified, name: 'ไม่ระบุ' }
          ]
        }
      ]
    };
    this.chartInstance.setOption(option);
  }

  // updateChart() {
  //   const option = {
  //     tooltip: {
  //       trigger: 'axis'
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: ['ชาย', 'หญิง', 'ไม่ระบุ']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [
  //       {
  //         name: 'จำนวนผู้ใช้งาน',
  //         type: 'bar',
  //         data: [
  //           this.genderData.male,
  //           this.genderData.female,
  //           this.genderData.unspecified
  //         ],
  //         label: {
  //           show: true,
  //           position: 'top'
  //         }
  //       }
  //     ]
  //   };

  //   this.chartInstance.setOption(option);
  // }

}
