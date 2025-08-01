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
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../../core/services/item.service';
import { SafeUrlPipe } from '../../../core/services/pipi.pipe';


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
    MatRadioButton,
    MatRadioModule,
    SafeUrlPipe
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'] // ✅ correct spelling
})
export class MainContentComponent implements OnInit, OnDestroy {
  currentNavItem: string | null = '';
  selectedEmployee: Employee | null = null;
  private subscription!: Subscription;
  formSnapshot: Employee | null = null;


  employeeForm: FormGroup;

    showDeleteModal = false;
  // Options for selects
  availableLanguages = ['English', 'Hindi', 'Telugu'];
  availableServices = ['Courier', 'Tech Support', 'Delivery'];
  availableKycDocs = ['Aadhar', 'PAN', 'Driving License'];
  availableAdditionalDocs = ['Degree Certificate', 'Work Permit'];
  availableVehicleTypes = ['Bike', 'Car', 'Truck'];
  availableOrganizations = ['Organization A', 'Organization B', 'Organization C'];
   selectedAdditionalDocs: string[] = [];

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
          if (item === 'EditEmployee' && this.selectedEmployee) {
      this.loadEmployeeForEdit(this.selectedEmployee);
    }
    })
  );

  this.subscriptions.add(
    this.communicationService.selectedEmployee$.subscribe(employee => {
      this.selectedEmployee = employee;
      console.log('selectedEmployee:', employee);
      if (this.currentNavItem === 'EditEmployee' && employee) {
        this.loadEmployeeForEdit(employee);
      }
    })
  );
}

async submitEdit() {
  if (!this.employeeForm.valid || !this.selectedEmployee) {
    console.warn('Form is invalid or no employee selected');
    return;
  }

  try {
    // 1. Upload profile photo if changed
    let uploadedPhotoPath = this.selectedEmployee.profilePhoto;
    if (this.uploadProfile['profilePhoto']) {
      const profileFormData = new FormData();
      profileFormData.append('profilePhoto', this.uploadProfile['profilePhoto']);

      const profilePhotoRes = await fetch("http://localhost:3000/routes/employee/upload/photo", {
        method: "POST",
        body: profileFormData
      });

      if (!profilePhotoRes.ok) throw new Error("Profile photo upload failed");

      const profilePhotoData = await profilePhotoRes.json();
      uploadedPhotoPath = profilePhotoData.path; // Make sure backend returns 'path'
    }

    // 2. Upload KYC & Additional docs files
    const docsFormData = new FormData();
// KYC
// KYC: Upload new files
for (const docType of this.selectedKycDocs) {
  if (this.kycDocFiles[docType]) {
    docsFormData.append('kycDocs', this.kycDocFiles[docType] as File);
  }
}

// KYC: Append previously uploaded file paths
if (this.formSnapshot && this.formSnapshot.kycDocs?.length) {
  for (const existingPath of this.formSnapshot.kycDocs) {
    docsFormData.append('existingKycDocs', existingPath);
  }
}

// Additional: Upload new files
for (const docType of this.selectedAdditionalDocs) {
  if (this.additionalDocFiles[docType]) {
    docsFormData.append('additionalDocs', this.additionalDocFiles[docType] as File);
  }
}

// Additional: Append previously uploaded file paths
if (this.formSnapshot && this.formSnapshot.additionalDocs?.length) {
  for (const existingPath of this.formSnapshot.additionalDocs) {
    docsFormData.append('existingAdditionalDocs', existingPath);
  }
}

    let uploadedKycPaths = this.selectedEmployee.kycDocs || [];
    let uploadedAdditionalPaths = this.selectedEmployee.additionalDocs || [];

    if (docsFormData.has('kycDocs') || docsFormData.has('additionalDocs')) {
      const docsUploadRes = await fetch("http://localhost:3000/routes/employee/upload/docs", {
        method: "POST",
        body: docsFormData
      });

      if (!docsUploadRes.ok) throw new Error("Documents upload failed");

      const docsUploadData = await docsUploadRes.json();
      uploadedKycPaths = docsUploadData.kycDocs || uploadedKycPaths;
      uploadedAdditionalPaths = docsUploadData.additionalDocs || uploadedAdditionalPaths;
    }

    // 3. Prepare updated employee object
    const updatedEmployee: Employee = {
      id: this.selectedEmployee.id,
      ...this.employeeForm.value,
      profilePhoto: uploadedPhotoPath,
      kycDocs: uploadedKycPaths,
      additionalDocs: uploadedAdditionalPaths
    };

    // 4. PUT request to update employee data
    const updateRes = await fetch(`http://localhost:3000/routes/employee/${updatedEmployee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedEmployee)
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Update failed: ${errText}`);
    }

    const updatedFromServer = await updateRes.json();
    console.log('Employee updated successfully:', updatedFromServer);

    // 5. Update local state and reset UI
    this.selectedEmployee = updatedEmployee;
    this.communicationService.updateEmployeeInSubject(updatedEmployee);
    this.currentNavItem = null;
    this.communicationService.selectNavItem('');
    this.selectedEmployee = null;
    this.employeeForm.reset();
    this.uploadedFiles = {};
    this.uploadProfile = {};


  } catch (error) {
    console.error('Error updating employee:', error);
  }
}


cancelEdit() {
  this.currentNavItem = null;
  this.communicationService.selectNavItem('');
  this.employeeForm.reset();
  this.selectedKycDocs = [];
  this.selectedAdditionalDocs = [];
  this.selectedEmployee = null;
}



noEdit(){
  this.currentNavItem = 'EditEmployee';
  this.communicationService.selectNavItem('EditEmployee');
}

  next(){
  if (this.formSnapshot) {
    this.formSnapshot.additionalDocs = Object.keys(this.additionalDocFiles);
  }
  this.currentNavItem = 'review';
  this.communicationService.selectNavItem('review');
}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

onSubmit() {
  if (this.employeeForm.valid) {
    this.formSnapshot = { ...this.employeeForm.value }; // deep copy
    this.currentNavItem = 'next';
    this.communicationService.selectNavItem('next');
  }
}

  // Removed duplicate onAdditionalDocFileSelected to resolve duplicate implementation error.



async finalSubmit() {
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

// KYC
for (const docType of this.selectedKycDocs) {
  if (this.kycDocFiles[docType]) {
    formData.append('kycDocs', this.kycDocFiles[docType] as File);
  }
}

// Additional
for (const docType of this.selectedAdditionalDocs) {
  if (this.additionalDocFiles[docType]) {
    formData.append('additionalDocs', this.additionalDocFiles[docType] as File);
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
      this.communicationService.selectNavItem('');
      this.onBack();

    } catch (err) {
      console.error("Submission error:", err);
    }
  } else {
    console.warn("Form is invalid");
  }
}


  onDeleteClick() {
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    this.deleteplease();  // Call your existing delete function
  }

    // User cancels deletion
  cancelDelete() {
    this.showDeleteModal = false;
  }

async deleteplease() {
  const identifier = this.selectedEmployee?.id;
  const name = this.selectedEmployee?.fullName;

  if (!identifier && !name) {
    console.error('No identifier or name provided for deletion');
    return;
  }

  try {
    // If ID is present, delete by ID
    const url = identifier
      ? `http://localhost:3000/routes/employee/${identifier}`
      : `http://localhost:3000/routes/employee/${encodeURIComponent(name!)}`;

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Delete success', data);
      this.selectedEmployee = null;
      this.currentNavItem = null;
      this.communicationService.selectNavItem('');
if (identifier !== undefined) {
  this.communicationService.removeEmployeeFromSubject(identifier);
}

    } else {
      console.error('Delete failed with status', response.status);
    }
  } catch (error) {
    console.error('Delete error:', error);
  }
}



getFullPhotoUrl(path: string): string {
  if (!path) return 'assets/dream.svg';
  return `http://localhost:3000/${encodeURI(path.trim())}`;
}



  onBack(){
    if(this.currentNavItem === 'review') {
      this.currentNavItem = 'next';
      this.communicationService.selectNavItem('next');
      return;
    }
    if(this.currentNavItem === 'next') {
      this.currentNavItem = 'AddEmployee';
      this.communicationService.selectNavItem('AddEmployee');
      return;
    }
    this.currentNavItem = null; // Reset the current nav item
    this.communicationService.selectNavItem(''); // Notify the service to reset the selection
  }

  selectedKycDocs: string[] = [];
  kycDocFiles: { [docType: string]: File | null } = {};
  additionalDocFiles: { [docType: string]: File | null } = {};


onKycDocsChange(selectedDocs: string[]) {
  this.selectedKycDocs = selectedDocs;

  Object.keys(this.kycDocFiles).forEach(doc => {
    if (!selectedDocs.includes(doc)) {
      delete this.kycDocFiles[doc];
    }
  });
}


onAdditionalDocsChange(selectedDocs: string[]) {
  this.selectedAdditionalDocs = selectedDocs;

  Object.keys(this.additionalDocFiles).forEach(doc => {
    if (!selectedDocs.includes(doc)) {
      delete this.additionalDocFiles[doc];
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



onKycDocFileSelected(event: Event, docType: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.kycDocFiles[docType] = file;
    console.log(`KYC File selected for ${docType}:`, file);

    if (this.isImage(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewUrls[docType] = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      delete this.filePreviewUrls[docType];
    }
  }
}

onAdditionalDocFileSelected(event: Event, docType: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.additionalDocFiles[docType] = file;
    console.log(`Additional File selected for ${docType}:`, file);

    if (this.isImage(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewUrls[docType] = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      delete this.filePreviewUrls[docType];
    }
  }
}


loadEmployeeForEdit(employee: Employee) {
  if (!employee) return;

  this.employeeForm.patchValue({
    fullName: employee.fullName,
    mobile: employee.mobile,
    email: employee.email,
    gender: employee.gender,
    organization: employee.organization,
    vehicleType: employee.vehicleType,
    languages: employee.languages,
    services: employee.services,
    kycDocs: employee.kycDocs,
    additionalDocs: employee.additionalDocs,
    profilePhoto: employee.profilePhoto
  });

  // Also set selected docs arrays for your multiselects
  this.selectedKycDocs = employee.kycDocs || [];
  this.selectedAdditionalDocs = employee.additionalDocs || [];
}



    acceptedFileTypes = 'image/*,application/pdf'; // restrict as needed

  // Store preview URLs for images to safely bind to <img> src
  filePreviewUrls: { [docType: string]: string } = {};

  // Helper method to check if a file is an image
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
