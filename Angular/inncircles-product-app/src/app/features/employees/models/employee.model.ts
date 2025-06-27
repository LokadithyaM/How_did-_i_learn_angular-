export interface IEmployee {
  fullName: string;
  organization: 'OrgA' | 'OrgB' | 'OrgC';
  languages: string[];
  mobile: string;
  services: string[];
  email?: string;
  profilePhoto?: string;
  vehicleType: 'Two Wheeler' | 'Four Wheeler' | 'None';
  kycDocs: string[];
  additionalDocs?: string[];
  createdAt?: Date;
  _id?: string; // MongoDB ID
}
