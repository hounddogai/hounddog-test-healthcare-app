import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPatient } from "~/data";
import { json } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const patient = await getPatient(params.patientId);
  if (!patient) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ patient });
};

export default function Patient() {
  const { patient } = useLoaderData<typeof loader>();

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
