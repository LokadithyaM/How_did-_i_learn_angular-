import { Component } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private communicationService: CommunicationService){}

  onNavItemClick(item: string) {
    this.communicationService.selectNavItem(item);
  }
}
