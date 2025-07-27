import mongoose, { Schema, Document, model } from 'mongoose';

export interface IEmployee extends Document {
  id: number;
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
  gender?: string;
  createdAt?: Date;
}

const employeeSchema: Schema = new Schema<IEmployee>({
  id:{
    type: Number,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    enum: ['Organization A', 'Organization B', 'Organization C'],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'],
  },
  services: {
    type: [String],
    required: true,
  },
  email: {
    type: String,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  vehicleType: {
    type: String,
    enum: ['Car', 'Bike', 'Truck', 'None'],
    required: true,
  },
  kycDocs: {
    type: [String],
    required: true,
  },
  additionalDocs: {
    type: [String],
    default: [],
  },
  gender: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IEmployee>('Employee', employeeSchema);
