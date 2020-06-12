import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  public SERVER_URL = 'http://localhost:9000';

  constructor(private http: HttpClient) {}

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.SERVER_URL}/employee/all`);
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.SERVER_URL}/employee/add`, employee);
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.SERVER_URL}/employee/update`, employee);
  }

  public deleteEmployee(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.SERVER_URL}/employee/delete/${employeeId}`);
  }

}
