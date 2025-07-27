import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemService, Employee } from './item.service';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  // BehaviorSubject to hold the employee list
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$: Observable<Employee[]> = this.employeesSubject.asObservable();
  private fullEmployeeList: Employee[] = [];
  // private formNext: String = '';

  searchQuery: string = '';

  // Subject for navigation selection
  private navSelectionSubject = new BehaviorSubject<string | null>(null);
  navSelection$ = this.navSelectionSubject.asObservable();

  // subject to hold the current selected employee
  private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();

  constructor(private itemService: ItemService) {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.itemService.getEmployees().subscribe({
      next: (data) => {
        this.fullEmployeeList = data;
        this.employeesSubject.next(data);
        console.log('Fetched items:', data);
      },
      error: (err) => {
        console.error('Error fetching items:', err);
      },
    });
  }

  removeEmployeeFromSubject(employeeId: number): void {
    this.fullEmployeeList = this.fullEmployeeList.filter(
      (employee) => employee.id !== employeeId
    );
    const current = this.employeesSubject.getValue();
    this.employeesSubject.next(current.filter((emp) => emp.id !== employeeId));
  }

  addEmployeeToSubject(newEmployee: Employee): void {
     this.fullEmployeeList.push(newEmployee);
    const current = this.employeesSubject.getValue();
    this.employeesSubject.next([...current, newEmployee]);
  }

  searchEmployees(query: string): void {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      this.employeesSubject.next([...this.fullEmployeeList]);
      return;
    }

    const filtered = this.fullEmployeeList.filter((employee) =>
      employee.fullName.toLowerCase().includes(lowerQuery) ||
      employee.email.toLowerCase().includes(lowerQuery) ||
      employee.mobile.toLowerCase().includes(lowerQuery)
    );

    this.employeesSubject.next(filtered);
  }


  selectNavItem(item: string | null): void {
    this.navSelectionSubject.next(item);
  }

  selectEmployee(employee: Employee): void {
    // This method can be used to select an employee and notify subscribers
    this.selectedEmployeeSubject.next(employee);
  }
}
