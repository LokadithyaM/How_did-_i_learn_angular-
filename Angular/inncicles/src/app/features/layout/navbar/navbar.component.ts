import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../core/services/communication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentNavItem: string | null = null;
  searchQuery: string = '';

  // 🔽 Sort
  selectedSortOption: string = '';

  // 🔍 Filter
  showFilterPopup: boolean = false;
  selectedFilterField: string = '';
  filterValue: string = '';

  constructor(private communicationService: CommunicationService) {}

  onSearch() {
    console.log('Search query:', this.searchQuery);
    this.communicationService.searchEmployees(this.searchQuery);
  }

  resetAll(): void {
  this.searchQuery = '';
  this.selectedFilterField = '';
  this.filterValue = '';
  this.selectedSortOption = '';
  this.communicationService.resetFilters();
}


  onSortChange() {
    console.log('Sort by:', this.selectedSortOption);
    this.communicationService.sortEmployees(this.selectedSortOption);
  }

  toggleFilterPopup() {
    this.showFilterPopup = !this.showFilterPopup;
  }

  applyFilter() {
    if (this.selectedFilterField && this.filterValue) {
      console.log(`Filter: ${this.selectedFilterField} = ${this.filterValue}`);
      this.communicationService.filterEmployees(this.selectedFilterField, this.filterValue);
      this.showFilterPopup = false;
    }
  }

  onNavItemClick(item: string) {
    this.currentNavItem = item;
    this.communicationService.selectNavItem(item);
  }

  onBack() {
    this.currentNavItem = null;
    this.communicationService.selectNavItem('');
  }
}
