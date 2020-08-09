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
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getEmployees();
    this.getUdemyCourse();
  }

  public getUdemyCourse(): void {
    console.log('Fetching all courses...');
      this.employeeService.getUdemyCourse().subscribe(
        (response: any) => {
          console.log(response);
          console.log(response.results);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

  public getEmployees(): void {
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

  public searchEmployees(key: string): void {
    console.log('Searching employees...');
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
          employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public addEmployee(employeeForm: NgForm): void {
    document.getElementById('addFormId').click();
    console.log('Adding employee...', employeeForm.value);
      this.employeeService.addEmployee(employeeForm.value).subscribe(
        (response: Employee) => {
          console.log(response);
          this.employee = response;
          this.getEmployees();
          employeeForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          employeeForm.reset();
        }
    );
  }

  public updateEmployee(employee: Employee): void {
    console.log(`Editing employee...${employee}`);
      this.employeeService.updateEmployee(employee).subscribe(
        (response: Employee) => {
          console.log(response);
          this.employee = response;
          this.getEmployees();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    console.log(`Deleting employee by id: ${employeeId}`);
      this.employeeService.deleteEmployee(employeeId).subscribe(
        (response: Employee) => {
          console.log(`Employee deleted`);
          this.employee = response;
          this.getEmployees();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
    );
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }

}
