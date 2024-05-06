import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

export type Visit = {
  date?: string;
  vitalSigns?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
};

type PatientMutation = {
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

const fakePatients = {
  records: {} as Record<string, PatientRecord>,

  async getAll(): Promise<PatientRecord[]> {
    return Object.keys(fakePatients.records)
      .map((key) => fakePatients.records[key])
      .sort(sortBy("-createdAt", "lastName"));
  },

  async get(id: string): Promise<PatientRecord | null> {
    return fakePatients.records[id] || null;
  },

  async create(values: PatientMutation): Promise<PatientRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newPatient = { id, createdAt, ...values };
    fakePatients.records[id] = newPatient;
    return newPatient;
  },

  async set(id: string, values: PatientMutation): Promise<PatientRecord> {
    const patient = await fakePatients.get(id);
    invariant(patient, `No patient found for ${id}`);
    const updatedPatient = { ...patient, ...values };
    fakePatients.records[id] = updatedPatient;
    return updatedPatient;
  },

  destroy(id: string): null {
    delete fakePatients.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getPatients(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let patients = await fakePatients.getAll();
  if (query) {
    patients = matchSorter(patients, query, {
      keys: ["firstName", "lastName"],
    });
  }
  return patients.sort(sortBy("lastName", "createdAt"));
}

export async function createEmptyPatient() {
  return await fakePatients.create({});
}

export async function getPatient(id: string) {
  return fakePatients.get(id);
}

export async function updatePatient(id: string, updates: PatientMutation) {
  const patient = await fakePatients.get(id);
  if (!patient) {
    throw new Error(`No patient found for ${id}`);
  }
  await fakePatients.set(id, { ...patient, ...updates });

  console.log(`Patient ${patient.id} updated`, patient);
  return patient;
}

export async function updateVisits(id: string, visit: Visit) {
  const patient = await fakePatients.get(id);
  if (!patient) {
    throw new Error(`No patient found for ${id}`);
  }

  await fakePatients.set(id, {
    ...patient,
    visits: [...(patient.visits || []), visit],
  });

  console.log(`Patient ${patient.id} updated`, patient);
  return patient;
}

export async function deletePatient(id: string) {
  fakePatients.destroy(id);
}

[
  {
    firstName: "Jane",
    lastName: "Smith",
    mrn: "019-111-999",
    dob: "12/09/1955",
    address: "123 Main St, Springfield, IL 62701",
    phoneNumber: "434-512-6512",
    bloodType: "O+",
    notes: "Allergic to penicillin",
    visits: [
      {
        date: "04/21/2024",
        vitalSigns: "BP 120/80, HR 70",
        symptoms: "Headache",
        diagnosis: "Migraine",
        treatment: "Tylenol 100mg",
      },
      {
        date: "05/04/2024",
        vitalSigns: "BP 130/90, HR 80",
        symptoms: "Sore throat",
        diagnosis: "Strep throat",
        treatment: "Amoxicillin 500mg",
      },
    ],
  },
  {
    firstName: "Robert",
    lastName: "Johnson",
    mrn: "018-222-555",
    dob: "02/19/1984",
    address: "456 Elm St, Springfield, IL 62701",
    phoneNumber: "123-553-8413",
    bloodType: "AB-",
  },
  {
    firstName: "Sarah",
    lastName: "Williams",
    mrn: "029-125-874",
    dob: "10/23/2009",
    address: "789 Oak St, Springfield, IL 62701",
    phoneNumber: "463-555-7833",
    bloodType: "A+",
    notes: "Allergic to peanuts",
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    mrn: "049-185-898",
    dob: "03/05/1973",
    address: "1011 Pine St, Springfield, IL 62701",
    phoneNumber: "457-333-4907",
    bloodType: "B-",
  },
].forEach((patient) => {
  fakePatients.create({
    ...patient,
    id: `${patient.firstName.toLowerCase()}-${patient.lastName.toLocaleLowerCase()}`,
  });
});
