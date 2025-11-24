import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  currentTime: string = '';
  updateTime() {
    const now = new Date();
    // แปลงเป็น format ไทย DD/MM/YY HH:mm:ss
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = (now.getFullYear() + 543).toString().slice(-2); // ปี พ.ศ.
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} น.`;
  }

  // saveUser(form: NgForm) {
  
  //     this.submitted = true;
  //     if (form.invalid) {
  //       return;
  //     }
  //     const runTimePipe = new RunTimePipe();
  //     const ageDatePipe = new AgeDatePipe();
  //     const formattedBirth = this.date1 ? runTimePipe.transform(this.date1) : '';
  //     const formattedAge = this.date1 ? Number(ageDatePipe.transform(this.date1)) : 0;
  
  //     if (this.editingUserId !== null) {
  //       const updateUser = {
  //         ...this.dataTest.find((u:any) => u.id === this.editingUserId),
  //         firstname: this.firstname,
  //         lastname: this.lastname,
  //         birthday: formattedBirth,  // DD/MM/YYYY
  //         age: formattedAge,
  //         gender: this.gender,
  //         createDate: new Date().toISOString(),
  //         createBy: this.createBy
  //       }
  
  //       this.http.put(`http://localhost:8778/Tahn-controller/users/${this.editingUserId}`, updateUser)
  //         .toPromise()
  //         .then((response: any) => {
  //           // อัปเดต array โดยตรง
  //           this.dataTest = this.dataTest.map((u: any) => 
  //             u.id === this.editingUserId ? response : u
  //           );
            
  //           this.showEdit('แก้ไขผู้ใช้งานสำเร็จ');
  //           this.resetForm();
  //           this.editingUserId = null;
  //           this.jakkarin.hide();
  
  //           // รีโหลดข้อมูลใหม่จาก backend
  //           this.callApi();
  //         })
  //         .catch((error) => {
  //           console.error('Update error:', error);
  //           this.showError('เกิดข้อผิดพลาดในการแก้ไขผู้ใช้งาน');
  //         })
  //     } else {
  //       const newUser: any = {
  //         userPass: this.dataTest.length + 1,
  //         firstname: this.firstname,
  //         lastname: this.lastname,
  //         birthday: formattedBirth,
  //         age: formattedAge,
  //         gender: this.gender,
  //         createDate: new Date().toISOString(), // "2025-11-22T03:00:00.000Z"
  //         createBy: "jakkarin"
  //       };
  //       // ส่งข้อมูลไป backend
  //       this.http.post('http://localhost:8778/Tahn-controller/save-data', newUser)
  //         .toPromise()
  //         .then((response: any) => {
  //           console.log('Insert response:', response);
  //           this.dataTest = [...this.dataTest, response];
  //           this.showSuccess('เพิ่มผู้ใช้งานสำเร็จ');
  //         })
  //         .catch((error) => {
  //           console.error('Insert error:', error);
  //           this.showError('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน');
  //         });
  //     }
  //     this.resetForm();
  //     this.editingUserId = null;
  //     this.jakkarin.hide();
  //     this.submitted = false;
  //   }
}
