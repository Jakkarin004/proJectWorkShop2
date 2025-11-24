import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RunTimePipe } from '../pipe/run-time.pipe';
import { AgeDatePipe } from '../pipe/age-date.pipe';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChartUpdateService } from '../chart-update.service';

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
  createBy = 'jakkarin';
  date1: any;
  editingUserId: number | null = null;
  submitted = false;
  userPass: number | null = null;
  userIdToDelete: number | null = null;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'edit' = 'success';

  constructor(private http: HttpClient, private chartUpdate:ChartUpdateService) { }

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
    this.http.get<any[]>('http://localhost:8778/Tahn-controller/get-data')
      .toPromise()
      .then(res => this.dataTest = res)
      .catch(err => console.error('Load data error:', err));
  }

  updateTable(result: any[]) {
    this.dataTest = result;  // อัปเดตตารางให้เป็นผลลัพธ์การค้นหา
  }

  saveUser(form: NgForm) {

    this.submitted = true;
    if (form.invalid) {
      return;
    }
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
        birthday: formattedBirth,  // DD/MM/YYYY
        age: formattedAge,
        gender: this.gender,
        createDate: new Date().toISOString(),
        createBy: this.createBy
      }

      this.http.put(`http://localhost:8778/Tahn-controller/users/${this.editingUserId}`, updateUser)
        .toPromise()
        .then(() => {
          this.showEdit('แก้ไขผู้ใช้งานสำเร็จ');
          this.resetForm();
          this.editingUserId = null;
          this.jakkarin.hide();
          // รีโหลดข้อมูลใหม่จาก backend
          this.callApi();
          this.chartUpdate.notifyUpdate();//กราฟรีเฟรช
        })
        .catch((error) => {
          console.error('Update error:', error);
          this.showError('เกิดข้อผิดพลาดในการแก้ไขผู้ใช้งาน');
        })
    } else {
      const newUser: any = {
        userPass: this.dataTest.length + 1,
        firstname: this.firstname,
        lastname: this.lastname,
        birthday: formattedBirth,
        age: formattedAge,
        gender: this.gender,
        createDate: new Date().toISOString(), // "2025-11-22T03:00:00.000Z"
        createBy: "jakkarin"
      };
      // ส่งข้อมูลไป backend
      this.http.post('http://localhost:8778/Tahn-controller/save-data', newUser)
        .toPromise()
        .then((response: any) => {
          console.log('Insert response:', response);
          this.dataTest = [...this.dataTest, response];
          this.showSuccess('เพิ่มผู้ใช้งานสำเร็จ');
          // รีโหลดข้อมูลใหม่จาก backend
          this.callApi();
          this.chartUpdate.notifyUpdate();//กราฟรีเฟรช
        })
        .catch((error) => {
          console.error('Insert error:', error);
          this.showError('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน');
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
    this.editingUserId = id;
    this.jakkarin.show();
  }

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
      this.http.delete(`http://localhost:8778/Tahn-controller/delete/${this.userIdToDelete}`)
        .toPromise()
        .then(() => {
          this.showError('ลบผู้ใช้งานสำเร็จ');
          this.callApi();
          this.chartUpdate.notifyUpdate();//กราฟรีเฟรช
        })
        .catch(err => console.error('Delete error:', err));
    }
    this.closeDeleteModal();
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
