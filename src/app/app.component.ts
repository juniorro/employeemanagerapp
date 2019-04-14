import { Component, OnInit, OnDestroy } from '@angular/core';
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
