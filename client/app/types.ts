export type Visit = {
  date?: string;
  vitalSigns?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
};

export type PatientMutation = {
  id?: string;
  firstName?: string;
  lastName?: string;
  mrn?: string;
  dob?: string;
  address?: string;
  phoneNumber?: string;
  bloodType?: string;
  notes?: string;
  visits?: Visit[];
};

export type PatientRecord = PatientMutation & {
  id: string;
  createdAt: string;
};
