import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/services/item.service'; // Adjust path if needed

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'], // correct spelling: styleUrls
})
export class SidebarComponent implements OnInit, OnDestroy {
  items: Employee[] = [];
  currentNavItem: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    // Subscribe to employees list
    this.subscriptions.add(
      this.communicationService.employees$.subscribe((employees) => {
        this.items = employees;
        console.log('Employees:', this.items);
      })
    );

    // Subscribe to nav selection
    this.subscriptions.add(
      this.communicationService.navSelection$.subscribe((item) => {
        this.currentNavItem = item;
        console.log('Current Nav Item:', this.currentNavItem);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // method to select an employee from the sidebar
  selectEmployee(employee: Employee) {
    // alert('CLICKED: ' + employee.fullName);
    console.log('Selected Employee sidebar:', employee);
    this.communicationService.selectEmployee(employee);
  }

}
