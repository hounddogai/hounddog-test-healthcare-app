import { PatientMutation, PatientRecord, Visit } from "./types";

const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5174";

type AllowedFetchBodies = PatientMutation | Visit;
const baseFetch = async <T>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: AllowedFetchBodies
) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const jsonRes: T = await response.json();
  return jsonRes;
};

export const getPatients = async (searchParams: string | null) => {
  const res = await baseFetch<PatientRecord[]>(
    `/patients/?q=${searchParams || ""}`
  );
  return res;
};

export const getPatient = async (patientId: string) => {
  const res = await baseFetch<PatientRecord>(`/patients/${patientId}`);
  return res;
};

export const createEmptyPatient = async () => {
  const res = await baseFetch<PatientRecord>("/patients/", "POST", {});
  return res;
};

export const updatePatient = async (
  patientId: string,
  updates: PatientMutation
) => {
  const res = await baseFetch(`/patients/${patientId}`, "PATCH", updates);
  return res;
};

export const updateVisits = async (patientId: string, updates: Visit) => {
  const res = await baseFetch(
    `/patients/${patientId}/visits`,
    "PATCH",
    updates
  );
  return res;
};

export const deletePatient = async (patientId: string) => {
  const res = await baseFetch(`/patients/${patientId}`, "DELETE");
  return res;
};
