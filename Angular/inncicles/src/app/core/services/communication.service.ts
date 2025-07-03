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
        this.employeesSubject.next(data);
        console.log('Fetched items:', data);
      },
      error: (err) => {
        console.error('Error fetching items:', err);
      },
    });
  }

  addEmployeeToSubject(newEmployee: Employee): void {
    const current = this.employeesSubject.getValue();
    this.employeesSubject.next([...current, newEmployee]);
  }


  selectNavItem(item: string | null): void {
    this.navSelectionSubject.next(item);
  }

  selectEmployee(employee: Employee): void {
    // This method can be used to select an employee and notify subscribers
    this.selectedEmployeeSubject.next(employee);
  }
}
