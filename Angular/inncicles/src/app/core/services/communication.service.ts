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

updateEmployeeInSubject(updatedEmployee: Employee): void {
  this.fullEmployeeList = this.fullEmployeeList.map(emp =>
    emp.id === updatedEmployee.id ? updatedEmployee : emp
  );

  const updatedList = this.employeesSubject.getValue().map(emp =>
    emp.id === updatedEmployee.id ? updatedEmployee : emp
  );

  this.employeesSubject.next(updatedList);
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
  const existsInFull = this.fullEmployeeList.some(emp => emp.id === newEmployee.id);
  if (!existsInFull) {
    this.fullEmployeeList.push(newEmployee);
  }

  const current = this.employeesSubject.getValue();
  const existsInCurrent = current.some(emp => emp.id === newEmployee.id);

  if (!existsInCurrent) {
    this.employeesSubject.next([...current, newEmployee]);
  }
}


sortEmployees(criterion: string): void {
  const sorted = [...this.employeesSubject.getValue()]; // Work on current filtered list

  switch (criterion) {
    case 'id':
      sorted.sort((a, b) => a.id - b.id);
      break;
    case 'name':
      sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
      break;
    default:
      console.warn('Unknown sort criterion:', criterion);
      return;
  }

  this.employeesSubject.next(sorted);
}

filterEmployees(field: string, value: string): void {
  const trimmedValue = value.toLowerCase().trim();
  if (!field || !trimmedValue) {
    this.employeesSubject.next([...this.fullEmployeeList]);
    return;
  }

  const filtered = this.fullEmployeeList.filter((employee) => {
    const fieldValue = (employee as any)[field];
    return fieldValue && fieldValue.toString().toLowerCase().includes(trimmedValue);
  });

  this.employeesSubject.next(filtered);
}

resetFilters(): void {
  this.employeesSubject.next([...this.fullEmployeeList]);
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
