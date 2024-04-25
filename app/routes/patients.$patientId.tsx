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
    <div id="patient">
      <div>
        <h1>
          {patient.firstName || patient.lastName ? (
            <>
              {patient.firstName} {patient.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>
        <br></br>
        {patient.mrn ? (
          <p>
            <b>MRN:</b> {patient.mrn}
          </p>
        ) : null}
        {patient.notes ? (
          <p>
            <b>Notes:</b> {patient.notes}
          </p>
        ) : null}
        <br></br>
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
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
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
