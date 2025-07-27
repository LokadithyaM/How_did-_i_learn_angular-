import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../../../core/services/communication.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioButton} from '@angular/material/radio';
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
    MatButtonModule,
    MatRadioButton
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
      gender: [''],
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
  uploadProfile: { [docType: string]: File | null } = {};


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



async onSubmit() {
  if (this.employeeForm.valid) {
    try {
      // 1. Get current employees to assign new ID
      const employeeListRes = await fetch("http://localhost:3000/routes/employee");
      if (!employeeListRes.ok) throw new Error("Failed to fetch employee list");

      const existingEmployees = await employeeListRes.json();
      const newId = existingEmployees.length + 1;

      // 2. Prepare FormData for uploading files
      const formData = new FormData();
      console.log(this.uploadedFiles);

    let uploadedPhotoPath = '';
    if (this.uploadProfile['profilePhoto']) {
      const profileFormData = new FormData();
      profileFormData.append('profilePhoto', this.uploadProfile['profilePhoto']);

      const profilePhotoRes = await fetch("http://localhost:3000/routes/employee/upload/photo", {
        method: "POST",
        body: profileFormData
      });

      if (!profilePhotoRes.ok) throw new Error("Profile photo upload failed");

      const profilePhotoData = await profilePhotoRes.json();
      uploadedPhotoPath = profilePhotoData.path;
    }

      // Add KYC docs
      for (const docType of this.selectedKycDocs) {
        if (this.uploadedFiles[docType]) {
          formData.append('kycDocs', this.uploadedFiles[docType] as File);
        }
      }

      // Add any additional docs
      for (const key in this.uploadedFiles) {
        if (!this.selectedKycDocs.includes(key) && key !== 'profilePhoto') {
          formData.append('additionalDocs', this.uploadedFiles[key] as File);
        }
      }

      // 3. Upload files to the backend
      const fileUploadRes = await fetch("http://localhost:3000/routes/employee/upload/docs", {
        method: "POST",
        body: formData
      });

      const fileUploadData = await fileUploadRes.json();
      const uploadedKycPaths = fileUploadData.kycDocs || [];
      const uploadedAdditionalPaths = fileUploadData.additionalDocs || [];

      // Upload profile photo separately (if it exists)
      console.log('Selected Profile Photo:', this.uploadedFiles['profilePhoto']);


      // 4. Now send the final employee data with ID and uploaded file paths
      const employeeData = {
        id: newId,
        ...this.employeeForm.value,
        profilePhoto: uploadedPhotoPath,
        kycDocs: uploadedKycPaths,
        additionalDocs: uploadedAdditionalPaths
      };

      const createEmployeeRes = await fetch("http://localhost:3000/routes/employee/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeData)
      });

      

      

      if (!createEmployeeRes.ok) throw new Error("Failed to create employee");

      const createdEmployee = await createEmployeeRes.json();
      console.log('Employee added successfully:', createdEmployee);

      // Reset the form
      this.employeeForm.reset();
      this.uploadedFiles = {};
      this.selectedKycDocs = [];
      this.currentNavItem = null;
      this.selectedEmployee = null;

      this.communicationService.addEmployeeToSubject(createdEmployee);
      this.communicationService.selectNavItem('next');

    } catch (err) {
      console.error("Submission error:", err);
    }
  } else {
    console.warn("Form is invalid");
  }
}


  deleteplease() {
    console.log('Delete action triggered');
    // Implement delete logic here
    // For example, you might want to call a service method to delete the employee
    // this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe(response => {
    //   console.log('Employee deleted successfully', response);
    //   this.selectedEmployee = null; // Reset selected employee after deletion
    // });
  }

  getFullPhotoUrl(path: string): string {
    return path ? `http://localhost:3000/${path}` : 'assets/dream.svg';
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

  onProfilePhotoSelected(event: Event, docType: string): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  this.uploadProfile[docType] = input.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    this.filePreviewUrls[docType] = reader.result as string;
  };
  reader.readAsDataURL(input.files[0]);

  console.log(`Profile photo selected for ${docType}:`, this.uploadProfile[docType]);
}



onFileSelected(event: Event, docType: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.uploadedFiles[docType] = file;
    console.log(`File selected for ${docType}:`, this.uploadedFiles[docType]);

    // If image, create preview URL
    if (this.isImage(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewUrls[docType] = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Optional: clear preview if not an image
      delete this.filePreviewUrls[docType];
    }
  }
}


    acceptedFileTypes = 'image/*,application/pdf'; // restrict as needed

  // Store preview URLs for images to safely bind to <img> src
  filePreviewUrls: { [docType: string]: string } = {};

  // Helper method to check if a file is an image
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
