import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'] // ✅ correct spelling
})
export class MainContentComponent implements OnInit, OnDestroy {
  currentNavItem: string | null = null;
  private subscription!: Subscription;

  employeeForm: FormGroup;

  // Options for selects
  availableLanguages = ['English', 'Hindi', 'Telugu'];
  availableServices = ['Courier', 'Tech Support', 'Delivery'];
  availableKycDocs = ['Aadhar', 'PAN', 'Driving License'];
  availableAdditionalDocs = ['Degree Certificate', 'Work Permit'];

  constructor(
    private communicationService: CommunicationService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.employeeForm = this.fb.group({
      fullName: [''],
      mobile: [''],
      email: [''],
      organization: [''],
      vehicleType: [''],
      languages: [[]],
      services: [[]],
      kycDocs: [[]],
      additionalDocs: [[]],
      profilePhoto: ['']
    });
  }

  ngOnInit() {
    this.subscription = this.communicationService.navSelection$.subscribe(item => {
      this.currentNavItem = item;
      console.log('Current Nav Item:', item);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Form Submitted:', this.employeeForm.value);
    } else {
      console.warn('Form is invalid');
    }
  }
}
