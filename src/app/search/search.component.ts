import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TahnService } from '../services/tahn.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  toggleHide = false;
  showToast = false;
  toastMessage = '';
  toastType = 'success';

  @Output() onSearch = new EventEmitter<any>();

  toggleMore() {
    this.toggleHide = !this.toggleHide;
  }

  searchModel = {
    userPass: '',
    nameFull: '',
    firstname: '',
    lastname: '',
    age: '',
    birthday: '',
    gender: '',
    createDate: '',
    createBy: ''
  };

  constructor(private http: HttpClient, private tahnService: TahnService) { }

  ngOnInit(): void { }

  private showToastMessage(message: string, type: 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }

  showSuccess(message: string) { this.showToastMessage(message, 'success'); }

  search() {
    const formattedBirthday = this.searchModel.birthday
      ? formatDate(this.searchModel.birthday, 'yyyy-MM-dd', 'en')
      : '';

    const formattedCreateDate = this.searchModel.createDate
      ? formatDate(this.searchModel.createDate, 'yyyy-MM-dd', 'en')
      : '';

    const params = {
      ...this.searchModel,
      birthday: formattedBirthday,
      createDate: formattedCreateDate
    };

    this.tahnService.getDataUser(params).subscribe({
      next: (res) => {
        this.onSearch.emit(res); // ส่งกลับไปที่ content component
        this.showSuccess('ค้นหาเสร็จสิ้น');
      },
      error: (error) => {
        console.error('มีปัญหาในการค้นหาข้อมูลผู้ใช้งาน', error);
      }
    })
  }

  clear() {
    this.searchModel = {
      userPass: '',
      nameFull: '',
      firstname: '',
      lastname: '',
      age: '',
      birthday: '',
      gender: '',
      createDate: '',
      createBy: ''
    };

    // โหลดข้อมูลทั้งหมดจาก backend
    this.tahnService.getData().subscribe({
      next: (res) =>{
        this.onSearch.emit(res)
      }
    })

    this.showSuccess('เคลียร์ข้อมูลเสร็จสิ้น');
  }
}
