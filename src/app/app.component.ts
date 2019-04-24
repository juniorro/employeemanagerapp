import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { NotifierService } from "angular-notifier";
import { EmployeeService } from "./employee.service";
import { Employee } from "./employee";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationType } from "./notificationType.enum";
import * as fileSaver from 'file-saver';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  public employees: Employee[];
  public employee: Employee;
  private subscription: Subscription[] = [];
  private notifier: NotifierService;
  public fileUrl: SafeResourceUrl;
  public blob: Blob;
  public res;

  constructor(notifier: NotifierService, private sanitizer: DomSanitizer,  private employeeService: EmployeeService) {
    this.notifier = notifier;
  }

  ngOnInit() {
    //this.getEmployeeList();
  }

  public downloadFile(): void {
    console.log('Downloading file...');
    this.subscription.push(
      this.employeeService
        .downloadFile('juniorro', '_agreement.doc')
        .subscribe(
          (response: HttpResponse<any>) => {
            console.log(response);
            const filename = response.headers.get('filename');
            const contentType = response.headers.get('Content-Type');
            const blob = new Blob([response.body], {type: contentType + ';' + ' charset=utf-8'});
            fileSaver.saveAs(blob, filename);
          },
          (error: HttpErrorResponse) => {
            console.error(error);
            this.showNotification(
              NotificationType.ERROR,
              `Unable to download file`
            );
          }
        )
    );
  }

  public getEmployeeList(): void {
    console.log("Fetching all employees...");
    this.subscription.push(
      this.employeeService.getEmployees().subscribe(
        (response: Employee[]) => {
          console.log(response);
          this.employees = response;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.showNotification(
            NotificationType.ERROR,
            `Unable to fetch employees. Please try again`
          );
        }
      )
    );
  }

  public searchEmployees(employeeName: string): void {
    console.log("Searching employees...");
    this.subscription.push(
      this.employeeService.searchEmployees(employeeName).subscribe(
        (response: Employee[]) => {
          console.log(response);
          console.log("Employees Found...", this.employees);
          this.employees = response;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.showNotification(
            NotificationType.ERROR,
            `Unable to search employees. Please try again`
          );
        }
      )
    );
  }

  public addEmployee(employeeForm: NgForm): void {
    document.getElementById("addFormId").click();
    console.log("Adding employee...", employeeForm.value);
    //this.employees.unshift(employeeForm.value);
    this.subscription.push(
      this.employeeService.addEmployee(employeeForm.value).subscribe(
        (response: Employee) => {
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
          this.showNotification(
            NotificationType.SUCCESS,
            `${this.employee.name} has been added successfully`
          );
          employeeForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.showNotification(
            NotificationType.ERROR,
            `${employeeForm.value.name} has been not added. Please try again`
          );
          employeeForm.reset();
        }
      )
    );
  }

  public editEmployee(employee: Employee): void {
    console.log(`Editing employee...${employee}`);
    this.subscription.push(
      this.employeeService.updateEmployee(employee).subscribe(
        (response: Employee) => {
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
          this.showNotification(
            NotificationType.SUCCESS,
            `${this.employee.name} has been updated successfully`
          );
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.showNotification(
            NotificationType.WARNING,
            `${employee.name} has been not updated. Please try again`
          );
        }
      )
    );
  }

  public deleteEmployee(employeeId: number): void {
    console.log(`Deleting employee by id: ${employeeId}`);
    // const index: number = this.employees.findIndex(employee => employee.id === employeeId);
    // this.employees.splice(index, 1);
    this.subscription.push(
      this.employeeService.deleteEmployee(employeeId).subscribe(
        (response: Employee) => {
          console.log(`Employee deleted`);
          this.employee = response;
          this.getEmployeeList();
          this.showNotification(
            NotificationType.SUCCESS,
            `Employee has been deleted successfully`
          );
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.showNotification(
            NotificationType.ERROR,
            `Employee was not deleted. Please try again`
          );
        }
      )
    );
  }

  public showNotification(type: NotificationType, message: string): void {
    this.notifier.notify(type, message);
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
