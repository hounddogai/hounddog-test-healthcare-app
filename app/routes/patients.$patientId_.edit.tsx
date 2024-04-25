import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {Form, useLoaderData, useNavigate} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPatient, updatePatient } from "~/data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatePatient(params.patientId, updates);
  return redirect(`/patients/${params.patientId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const patient = await getPatient(params.patientId);
  if (!patient) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ patient });
};

export default function EditPatient() {
  const { patient } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={patient.id} id="patient-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={patient.firstName}
          aria-label="First name"
          name="firstName"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={patient.lastName}
          name="lastName"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Medical Record Number</span>
        <input
          defaultValue={patient.mrn}
          name="mrn"
          placeholder="1111111111"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={patient.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
