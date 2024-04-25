////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type PatientMutation = {
  id?: string;
  firstName?: string;
  lastName?: string;
  mrn?: string;
  notes?: string;
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

export async function deletePatient(id: string) {
  fakePatients.destroy(id);
}

[
  {
    firstName: "Jane",
    lastName: "Smith",
    mrn: "019-111-999",
  },
  {
    firstName: "Robert",
    lastName: "Johnson",
    mrn: "018-222-555",
  },
  {
    firstName: "Sarah",
    lastName: "Williams",
    mrn: "029-125-874",
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    mrn: "049-185-898",
  },
].forEach((patient) => {
  fakePatients.create({
    ...patient,
    id: `${patient.firstName.toLowerCase()}-${patient.lastName.toLocaleLowerCase()}`,
  });
});
