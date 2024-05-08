import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { json } from "@remix-run/node";
import { getPatient } from "~/service";
import { useEffect } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const patient = await getPatient(params.patientId);
  if (!patient) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ patient });
};

function toggleStringInArray(array: string[], stringToToggle: string) {
  const index = array.indexOf(stringToToggle);

  if (index !== -1) {
    // Remove if present
    return array.filter((item, idx) => idx !== index);
  } else {
    // Add if not present
    return [...array, stringToToggle];
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

export default function Patient() {
  const { patient } = useLoaderData<typeof loader>();
  console.log("Patient Loaded:", patient);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:5174/set-cookie");
      console.log("response", response);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Sending to Google Analytics
    if (window?.dataLayer) {
      window.dataLayer.push({
        event: "Visiting Patient Page",
        patientFirstName: patient.firstName,
        patientLastName: patient.lastName,
        patientMrn: patient.mrn,
        patientDob: patient.dob,
        patientAddress: patient.address,
        patientPhoneNumber: patient.phoneNumber,
        patientBloodType: patient.bloodType,
      });
    }
  }, [
    patient.address,
    patient.bloodType,
    patient.dob,
    patient.firstName,
    patient.lastName,
    patient.mrn,
    patient.phoneNumber,
  ]);

  const handleFavoritePatient = () => {
    if (!patient.mrn) {
      return false;
    }
    const favoriteMrns = window.localStorage.getItem("favoritePatientMrns");
    let favoriteMrnsArray: string[] = [];
    if (favoriteMrns) {
      favoriteMrnsArray = JSON.parse(favoriteMrns);
    }

    console.log("Previous Favorite Patient MRNs", favoriteMrnsArray);

    const favoriteMrnsArrayToStore = toggleStringInArray(
      favoriteMrnsArray,
      patient.mrn
    );

    console.log("New Favorite Patient MRNs", favoriteMrnsArrayToStore);

    window.localStorage.setItem(
      "favoritePatientMrns",
      JSON.stringify(favoriteMrnsArrayToStore)
    );
    navigate(`/patients/${patient.id}`);
  };

  return (
    <>
      <div className="flex gap-4">
        <Form action="visits">
          <button type="submit" className="btn w-40">
            See Visits
          </button>
        </Form>
        <Form action="edit">
          <button type="submit" className="btn w-40">
            Edit Patient
          </button>
        </Form>

        <button
          type="submit"
          className="btn w-40"
          onClick={handleFavoritePatient}
        >
          Favorite Patient
        </button>

        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm(
              "Please confirm you want to delete this record."
            );
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit" className="btn w-40">
            Delete Patient
          </button>
        </Form>
      </div>
      <div id="patient" className="w-96 flex flex-col gap-6 mt-10">
        <p className="font-bold text-3xl">
          {patient.firstName || patient.lastName ? (
            <>
              {patient.firstName} {patient.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}
        </p>

        {patient.mrn ? (
          <p>
            <b className="text-lg">MRN</b> <br />
            {patient.mrn}
          </p>
        ) : null}

        {patient.dob ? (
          <p>
            <b className="text-lg">Date of Birth</b> <br />
            {patient.dob}
          </p>
        ) : null}

        {patient.address ? (
          <p>
            <b className="text-lg">Address</b> <br />
            {patient.address}
          </p>
        ) : null}

        {patient.phoneNumber ? (
          <p>
            <b className="text-lg">Phone Number</b> <br />
            {patient.phoneNumber}
          </p>
        ) : null}

        {patient.bloodType ? (
          <p>
            <b className="text-lg">Blood Type</b>
            <br /> {patient.bloodType}
          </p>
        ) : null}

        {patient.notes ? (
          <p>
            <b className="text-lg">Notes</b> <br />
            {patient.notes}
          </p>
        ) : null}
      </div>
    </>
  );
}
