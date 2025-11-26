import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PATHS } from '../api/api-paths';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TahnService {

    constructor(private http: HttpClient) { }

    // ดึงข้อมูลทั้งหมด
    getData(): Observable<any[]> {
        return this.http.get<any[]>(API_PATHS.getData);
    }

    // ดึงข้อมูลที่ค้นหา
    getDataUser(paramsObj: any): Observable<any[]> {
        return this.http.get<any[]>(API_PATHS.findData,{params: paramsObj});
    }

    // เพิ่มข้อมูล
    saveData(payload: any): Observable<any> {
        return this.http.post<any>(API_PATHS.saveData, payload);
    }

    // อัปเดตข้อมูล
    updateUser(id: string | number, payload: any): Observable<any> {
        return this.http.put<any>(API_PATHS.updateUser(id), payload);
    }

    // ลบข้อมูล
    deleteData(id: any): Observable<any> {
        return this.http.delete<any>(API_PATHS.deleteData(id));
    }
}
