import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Employee {
  _id?: string;
  fullName: string;
  mobile: string;
  email: string;
  organization: string;
  vehicleType: string;
  languages: string[];
  services: string[];
  kycDocs: string[];
  additionalDocs: string[];
  profilePhoto: string;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://localhost:3000/routes/employee';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all employees and log the result
   */
  getEmployees(): Observable<Employee[]> {
    console.log('[ItemService] Sending GET request to:', this.apiUrl);
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap((data) => {
        console.log('[ItemService] Received response:', data);
      })
    );
  }
}
