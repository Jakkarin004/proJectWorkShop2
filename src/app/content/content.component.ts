import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RunTimePipe } from '../pipe/run-time.pipe';
import { AgeDatePipe } from '../pipe/age-date.pipe';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChartUpdateService } from '../chart-update.service';
import { TahnService } from '../services/tahn.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @ViewChild('jakkarin') jakkarin!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  dataTest: any[] = [];
  firstname = '';
  lastname = '';
  birthday = '';
  age = 0;
  gender = '';
  createDate = '';
  createBy = 'jakkarin';
  date1: any;
  editingUserId: number | null = null;
  submitted = false;
  userPass: number | null = null;
  userIdToDelete: number | null = null;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'edit' = 'success';

  constructor(private http: HttpClient, private chartUpdate: ChartUpdateService, private tahnService: TahnService) { }

  ngOnInit(): void {
    this.callApi();
  }

  private showToastMessage(message: string, type: 'success' | 'error' | 'edit') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }

  showSuccess(message: string) { this.showToastMessage(message, 'success'); }
  showError(message: string) { this.showToastMessage(message, 'error'); }
  showEdit(message: string) { this.showToastMessage(message, 'edit'); }

  //api
  callApi() {
    this.tahnService.getData().subscribe({
      next: res => this.dataTest = res,
      error: err => console.error('Load data error:', err)
    });
  }

  updateTable(res: any[]) {
    this.dataTest = res;  // อัปเดตตารางให้เป็นผลลัพธ์การค้นหา
  }

  saveUser(form: NgForm) {

    this.submitted = true;
    if (form.invalid) {
      return;
    }

    //ป้องกัน รหัสผู้ใช้งานซ้ำ
    const maxUserPass = Math.max(...this.dataTest.map(u => u.userPass), 0);
    const newUserPass = maxUserPass + 1;

    //แปลงค่า pipe ก่อนนำข้อมูลไปใช้งาน
    const runTimePipe = new RunTimePipe();
    const ageDatePipe = new AgeDatePipe();
    const formattedBirth = this.date1 ? runTimePipe.transform(this.date1) : '';
    const formattedAge = this.date1 ? Number(ageDatePipe.transform(this.date1)) : 0;

    if (this.editingUserId !== null) {
      const updateUser = {
        ...this.dataTest,
        userPass: this.userPass,
        firstname: this.firstname,
        lastname: this.lastname,
        birthday: formattedBirth,
        age: formattedAge,
        gender: this.gender,
        createDate: this.createDate,
        createBy: this.createBy
      }

      this.tahnService.updateUser(this.editingUserId, updateUser).subscribe({
        next: () => {
          this.showEdit('แก้ไขผู้ใช้งานสำเร็จ');
          this.resetForm();
          this.editingUserId = null;
          this.jakkarin.hide();
          // รีโหลดข้อมูลใหม่จาก backend
          this.callApi();
          this.chartUpdate.notifyUpdate(); // กราฟรีเฟรช
        },
        error: (error) => {
          console.error('Update error:', error);
          this.showError('เกิดข้อผิดพลาดในการแก้ไขผู้ใช้งาน');
        }
      });
    } else {
      const newUser: any = {
        userPass: newUserPass,
        firstname: this.firstname,
        lastname: this.lastname,
        birthday: formattedBirth,
        age: formattedAge,
        gender: this.gender,
        createBy: "jakkarin"
      };
      this.tahnService.saveData(newUser).subscribe({
        next: (response) => {
          console.log('Insert response:', response);
          this.dataTest = [...this.dataTest, response];
          this.showSuccess('เพิ่มผู้ใช้งานสำเร็จ');
          // รีโหลดข้อมูลใหม่จาก backend
          this.callApi();
          this.chartUpdate.notifyUpdate();//กราฟรีเฟรช
        },
        error: (error) => {
          console.error('Update error:', error);
          this.showError('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน');
        }
      });
    }
    this.resetForm();
    this.editingUserId = null;
    this.jakkarin.hide();
    this.submitted = false;
  }

  //modal
  openModal() {
    this.resetForm();
    this.jakkarin.show();
  }

  closeModal() {
    this.jakkarin.hide();
    this.resetForm();
  }

  editUser(id: number) {
    const user = this.dataTest.find(u => Number(u.id) === id);
    if (!user) return;
    this.userPass = user.userPass;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.gender = user.gender;
    this.date1 = user.birthday ? new Date(user.birthday) : null;
    this.createDate = user.createDate;
    this.editingUserId = id;
    this.jakkarin.show();
  }

  openDeleteModal(id: number) {
    this.userIdToDelete = id;
    const user = this.dataTest.find(u => Number(u.id) === id);
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.deleteModal.show();
  }

  closeDeleteModal() {
    this.userIdToDelete = null;
    this.deleteModal.hide();
  }

  confirmDelete() {
    if (this.userIdToDelete !== null) {
      this.tahnService.deleteData(this.userIdToDelete).subscribe({
        next: () => {
          this.showError('ลบผู้ใช้งานสำเร็จ');
          this.callApi();
          this.chartUpdate.notifyUpdate();// รีเฟรชกราฟ
          this.closeDeleteModal();// ปิด modal หลัง delete สำเร็จ
        },
        error: (error) => {
          console.error('Update error:', error);
          this.showError('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน');
        }
      });
      this.closeDeleteModal();
    }
  }

  private resetForm() {
    this.firstname = '';
    this.lastname = '';
    this.birthday = '';
    this.age = 0;
    this.gender = '';
    this.createBy = 'jakkarin';
    this.date1 = null;
    this.editingUserId = null;
    this.submitted = false;
  }
}
