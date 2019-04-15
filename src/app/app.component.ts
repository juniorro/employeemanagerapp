import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs'
import { NotifierService } from 'angular-notifier';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private employees: Employee[];
  private employee: Employee = new Employee();
  private subscription: Subscription[] = [];
  private notifier: NotifierService;
  private employeeService: EmployeeService

  constructor(notifier: NotifierService, employeeService: EmployeeService) {
    this.notifier = notifier;
    this.employeeService = employeeService;
  }

  ngOnInit(){
    this.getEmployeeList();
  }

  public getEmployeeList(): void {
    this.subscription.push(
      this.employeeService.getEmployees()
      .subscribe(
        (response: Employee[]) =>{
          console.log(response);
          this.employees = response;
        },
        (error: any) => {
          console.log(error);
        }
      )
    );
  }

  public addEmployee(employeeForm: NgForm): void {
    document.getElementById('addFormId').click();
    this.subscription.push(
      this.employeeService.addEmployee(employeeForm.value)
      .subscribe(
        (response: Employee) =>{
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
          this.showNotification('success', `${this.employee.name} has been added successfully`);
          employeeForm.reset();
        },
        (error: any) => {
          console.log(error);
          this.showNotification('error', `${employeeForm.value.name} has been not added. Please try again`);
          employeeForm.reset();
        }
      )
    );
  }

  public editEmployee(employee: Employee): void {
    document.getElementById(employee.userCode).click();
    this.subscription.push(
      this.employeeService.updateEmployee(employee)
      .subscribe(
        (response: Employee) =>{
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
          this.showNotification('success', `${this.employee.name} has been updated successfully`);
        },
        (error: any) => {
          console.log(error);
          this.showNotification('error', `${employee.name} has been not updated. Please try again`);
        }
      )
    );
  }

  public deleteEmployee(employeeId: number): void {
    this.subscription.push(
      this.employeeService.deleteEmployee(employeeId)
      .subscribe(
        (response: Employee) =>{
          console.log(response);
          this.employee = response;
          this.getEmployeeList();
          this.showNotification('success', `Employee has been deleted successfully`);
        },
        (error: any) => {
          console.log(error);
          this.showNotification('error', `Employee was not deleted. Please try again`);
        }
      )
    );
  }
  


	/**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	 */
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
  }
  
  ngOnDestroy(){
    this.subscription.forEach(sub => sub.unsubscribe());
  }

}
