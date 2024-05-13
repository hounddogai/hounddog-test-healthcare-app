const sortBy = require("sort-by");

const fakePatients = {
  records: {},

  async getAll() {
    return Object.keys(fakePatients.records)
      .map((key) => fakePatients.records[key])
      .sort(sortBy("-createdAt", "lastName"));
  },

  async get(id) {
    return fakePatients.records[id] || null;
  },

  async create(values) {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newPatient = { id, createdAt, ...values };
    fakePatients.records[id] = newPatient;
    return newPatient;
  },

  async set(id, values) {
    const patient = await fakePatients.get(id);
    const updatedPatient = { ...patient, ...values };
    fakePatients.records[id] = updatedPatient;
    return updatedPatient;
  },

  destroy(id) {
    delete fakePatients.records[id];
    return null;
  },
};

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
    visits: [],
  },
  {
    firstName: "Robert",
    lastName: "Johnson",
    mrn: "018-222-555",
    dob: "02/19/1984",
    address: "456 Elm St, Springfield, IL 62701",
    phoneNumber: "123-553-8413",
    bloodType: "AB-",
    visits: [
      {
        date: "05/08/2024",
        vitalSigns: "BP 110/70, HR 80",
        patientSymptoms: "Stomach ache",
        medicalDiagnosis: "Indigestion",
        medicalTreatment: "Pepto-Bismol 2tbsp",
      },
    ],
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
    visits: [
      {
        date: "05/11/2024",
        vitalSigns: "BP 130/90, HR 60",
        patientSymptoms: "Fever",
        medicalDiagnosis: "Flu",
        medicalTreatment: "Tamiflu 40mg",
      },
    ],
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    mrn: "049-185-898",
    dob: "03/05/1973",
    address: "1011 Pine St, Springfield, IL 62701",
    phoneNumber: "457-333-4907",
    bloodType: "B-",
    visits: [
      {
        date: "04/21/2024",
        vitalSigns: "BP 120/80, HR 70",
        patientSymptoms: "Headache",
        medicalDiagnosis: "Migraine",
        medicalTreatment: "Tylenol 100mg",
      },
      {
        date: "05/04/2024",
        vitalSigns: "BP 130/90, HR 80",
        patientSymptoms: "Sore throat",
        medicalDiagnosis: "Strep throat",
        medicalTreatment: "Amoxicillin 500mg",
      },
    ],
  },
].forEach((patient) => {
  fakePatients.create({
    ...patient,
    id: `${patient.firstName.toLowerCase()}-${patient.lastName.toLocaleLowerCase()}`,
  });
});

module.exports = fakePatients;
