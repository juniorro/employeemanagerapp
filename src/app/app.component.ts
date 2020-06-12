import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public employee: Employee;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getEmployeeList();
  }

  public getEmployeeList(): void {
    console.log('Fetching all employees...');
      this.employeeService.getEmployees().subscribe(
        (response: Employee[]) => {
          console.log(response);
          this.employees = response;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

  public searchEmployees(employeeName: string): void {
    console.log('Searching employees...');
      this.employeeService.searchEmployees(employeeName).subscribe(
        (response: Employee[]) => {
          console.log(response);
          console.log('Employees Found...', this.employees);
          this.employees = response;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

  public addEmployee(employeeForm: NgForm): void {
    document.getElementById('addFormId').click();
    console.log('Adding employee...', employeeForm.value);
      this.employeeService.addEmployee(employeeForm.value).subscribe(
        (response: Employee) => {
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
          employeeForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          employeeForm.reset();
        }
    );
  }

  public editEmployee(employee: Employee): void {
    console.log(`Editing employee...${employee}`);
      this.employeeService.updateEmployee(employee).subscribe(
        (response: Employee) => {
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

  public deleteEmployee(employeeId: number): void {
    console.log(`Deleting employee by id: ${employeeId}`);
      this.employeeService.deleteEmployee(employeeId).subscribe(
        (response: Employee) => {
          console.log(`Employee deleted`);
          this.employee = response;
          this.getEmployeeList();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

}
