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
import { Employee } from '../../../core/services/item.service';

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
  selectedEmployee: Employee | null = null;
  private subscription!: Subscription;

  employeeForm: FormGroup;

  // Options for selects
  availableLanguages = ['English', 'Hindi', 'Telugu'];
  availableServices = ['Courier', 'Tech Support', 'Delivery'];
  availableKycDocs = ['Aadhar', 'PAN', 'Driving License'];
  availableAdditionalDocs = ['Degree Certificate', 'Work Permit'];
  availableVehicleTypes = ['Bike', 'Car', 'Truck'];
  availableOrganizations = ['Organization A', 'Organization B', 'Organization C'];

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

  uploadedFiles: { [docType: string]: File | null } = {};


private subscriptions = new Subscription();

ngOnInit() {
  this.subscriptions.add(
    this.communicationService.navSelection$.subscribe(item => {
      this.currentNavItem = item;
      console.log('Current Nav Item:', item);
    })
  );

  this.subscriptions.add(
    this.communicationService.selectedEmployee$.subscribe(employee => {
      this.selectedEmployee = employee;
      console.log('selectedEmployee:', employee);
    })
  );
}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log('Form Submitted:', this.employeeForm.value);
    } else {
      console.warn('Form is invalid');
    }
  }

  onBack(){
    this.currentNavItem = null; // Reset the current nav item
    this.communicationService.selectNavItem(''); // Notify the service to reset the selection
  }

  selectedKycDocs: string[] = [];

  onKycDocsChange(selectedDocs: string[]) {
    this.selectedKycDocs = selectedDocs;
    
    // Clean up files for deselected docs
    Object.keys(this.uploadedFiles).forEach(doc => {
      if (!selectedDocs.includes(doc)) {
        delete this.uploadedFiles[doc];
      }
    });
  }


  onFileSelected(event: Event, docType: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFiles[docType] = input.files[0];
    }
  }


}
