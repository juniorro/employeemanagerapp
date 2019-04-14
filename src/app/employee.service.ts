import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private SERVER_URL = 'http://localhost:9000';

  constructor(private http: HttpClient) {}

  public getEmployees(): Observable<Employee[]> {
    console.log(`${this.SERVER_URL}/employee/all}`);
    return this.http.get<Employee[]>(`${this.SERVER_URL}/employee/all`);
  }

}
