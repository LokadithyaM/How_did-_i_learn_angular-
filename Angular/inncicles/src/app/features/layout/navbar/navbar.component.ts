import { Component } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentNavItem: string | null = null;
  searchQuery: string = '';

  constructor(private communicationService: CommunicationService) {}

  onSearch() {
    console.log('Search query:', this.searchQuery); // ✅ Log search query
    this.communicationService.searchEmployees(this.searchQuery); // ✅ Notify service of search query
  }

  onNavItemClick(item: string) {
    this.currentNavItem = item; // ✅ Update local state
    this.communicationService.selectNavItem(item); // Notify others
  }

  onBack() {
    this.currentNavItem = null; // ✅ Reset locally
    this.communicationService.selectNavItem(''); // ✅ Reset globally
  }
}
