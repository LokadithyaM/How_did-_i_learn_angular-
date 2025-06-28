import { Component } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  
  currentNavItem: string | null= null;
  private subscription!: Subscription;

  constructor(private communicationService: CommunicationService){}

  ngOnInit() {
    this.subscription = this.communicationService.navSelection$.subscribe(item=>{
      this.currentNavItem = item;
      console.log('Current Nav Item:',item);
    })
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
