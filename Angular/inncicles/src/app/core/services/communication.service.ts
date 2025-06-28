import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private navSelectionSubject = new BehaviorSubject<string | null>(null);
  navSelection$ = this.navSelectionSubject.asObservable();

  selectNavItem(item: string) {
    this.navSelectionSubject.next(item);
  }
}
