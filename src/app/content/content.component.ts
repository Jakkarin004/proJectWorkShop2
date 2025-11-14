import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RunTimePipe } from '../pipe/run-time.pipe';
import { AgeDatePipe } from '../pipe/age-date.pipe';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'edit' = 'success'; // เก็บประเภท toast

  showSuccess(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }
  showError(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }
  showEdit(message: string) {
    this.toastMessage = message;
    this.toastType = 'edit';
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }

  firstName: string = '';
  lastName: string = '';
  birth: string = '';
  age: number = 0;
  sex: string = '';
  userName: string = 'jakkarin';
  date1: any;
  ngOnInit(): void {
  }

  datalist = [
    { id: 1, userPass: 1, firstName: 'jakkarin', lastName: 'mueagesong', birth: '02/02/2547', age: 21, sex: 'ชาย', saveTime: '11/11/2568', saveUserBy: 'jakkarin' },
    { id: 2, userPass: 2, firstName: 'test1', lastName: 'test1', birth: '02/02/2546', age: 22, sex: 'หญิง', saveTime: '11/11/2568', saveUserBy: 'jakkarin' },
    { id: 3, userPass: 3, firstName: 'test2', lastName: 'test2', birth: '02/02/2545', age: 23, sex: 'ชาย', saveTime: '11/11/2568', saveUserBy: 'jakkarin' },
    { id: 4, userPass: 4, firstName: 'test3', lastName: 'test3', birth: '02/02/2544', age: 24, sex: 'หญิง', saveTime: '12/11/2568', saveUserBy: 'jakkarin' },
    { id: 5, userPass: 5, firstName: 'test4', lastName: 'test4', birth: '02/02/2543', age: 25, sex: 'ชาย', saveTime: '12/11/2568', saveUserBy: 'jakkarin' },
  ];

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.birth = '';
    this.age = 0;
    this.sex = '';
    this.userName = 'jakkarin';
    this.date1 = '';
  }

  editingUserId: number | null = null;
  submitted: boolean = false;
  saveUser(form: NgForm) {

    this.submitted = true;
    if (form.invalid) {
      return;
    }
    const runTimePipe = new RunTimePipe();
    const ageDatePipe = new AgeDatePipe();
    const formattedBirth = this.date1 ? runTimePipe.transform(this.date1) : '';
    const formattedAge = this.date1 ? Number(ageDatePipe.transform(this.date1)) : 0;
    let textToast = '';

    if (this.editingUserId !== null) {
      this.datalist = this.datalist.map(data => {
        if (data.id === this.editingUserId) {
          return {
            ...data,
            firstName: this.firstName,
            lastName: this.lastName,
            birth: formattedBirth,
            age: formattedAge,
            sex: this.sex
          };
        }
        return data;
      });
      textToast = 'แก้ไขผู้ใช้งานสำเร็จ';
      this.showEdit(textToast);
    } else {
      const newUser: any = {
        id: this.datalist.length + 1,
        userPass:this.datalist.length + 1,
        firstName: this.firstName,
        lastName: this.lastName,
        birth: formattedBirth,
        age: formattedAge,
        sex: this.sex,
        saveTime: new Date().toLocaleDateString('th-TH'),
        saveUserBy: this.userName
      };
      this.datalist = [...this.datalist, newUser];
      textToast = 'เพิ่มผู้ใช้งานสำเร็จ';
      this.showSuccess(textToast);
    }
    this.resetForm();
    this.editingUserId = null;
    this.jakkarin.hide();
    this.submitted = false;
  }

  @ViewChild('jakkarin') jakkarin!: ModalDirective;
  openModal() {
    this.resetForm();
    this.submitted = false;
    this.editingUserId = null;
    this.jakkarin.show();
  }
  closeModal() {
    this.jakkarin.hide();
    this.resetForm();
    this.submitted = false;
  }


  editUser(id: number) {
    const user = this.datalist.find(u => u.id === id);
    if (!user) return;

    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.sex = user.sex;

    const parts = user.birth.split('/');
    this.date1 = new Date(+parts[2] - 543, +parts[1] - 1, +parts[0]);
    this.jakkarin.show();
    this.editingUserId = id;
  }

  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  userIdToDelete: number | null = null;
  openDeleteModal(id: number) {
    this.userIdToDelete = id;
    this.deleteModal.show();
  }

  closeDeleteModal() {
    this.userIdToDelete = null;
    this.deleteModal.hide();
  }

  confirmDelete() {
    if (this.userIdToDelete !== null) {
      this.datalist = this.datalist.filter(u => u.id !== this.userIdToDelete);
    }
    this.closeDeleteModal();
    this.showError('ลบผู้ใช้งานสำเร็จ');
  }
}
