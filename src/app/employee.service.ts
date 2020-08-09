import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class EmployeeService {
  public apiServerUrl = environment.serverBaseUrl;

  constructor(private http: HttpClient) {}

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`);
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee);
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee);
  }

  public deleteEmployee(employeeId: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiServerUrl}/employee/delete/${employeeId}`);
  }

  public getUdemyCourse(): Observable<any> {
    const headers = new HttpHeaders({'Authorization': `bearer gYBvNgnY4GIyZC1FjfLr8ENMGNbVkCd9`});
    return this.http.get<any>(`https://www.udemy.com/instructor-api/v1/taught-courses/courses/`, {headers: headers});
  }

}
