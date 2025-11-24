import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  toggleAdvanced = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'edit' = 'success';

  @Output() onSearch = new EventEmitter<any>();

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

   private showToastMessage(message: string, type: 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }

  showSuccess(message: string) { this.showToastMessage(message, 'success'); }


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  

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

    this.http.get<any[]>('http://localhost:8778/Tahn-controller/get-data-find-user', { params })
      .subscribe(res => {
        this.onSearch.emit(res); // ส่งกลับไปที่ content component
      });
    
     this.showSuccess('ค้นหาเสร็จสิ้น');
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
    this.http.get<any[]>('http://localhost:8778/Tahn-controller/get-data')
      .subscribe(res => this.onSearch.emit(res));

    this.showSuccess('เคลียร์ข้อมูลเสร็จสิ้น');
  }

  toggleMore() {
    this.toggleAdvanced = !this.toggleAdvanced;
  }



}
