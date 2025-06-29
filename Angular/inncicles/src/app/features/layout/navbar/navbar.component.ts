import { Component } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentNavItem: string | null = null;

  constructor(private communicationService: CommunicationService) {}

  onNavItemClick(item: string) {
    this.currentNavItem = item; // ✅ Update local state
    this.communicationService.selectNavItem(item); // Notify others
  }

  onBack() {
    this.currentNavItem = null; // ✅ Reset locally
    this.communicationService.selectNavItem(''); // ✅ Reset globally
  }
}
