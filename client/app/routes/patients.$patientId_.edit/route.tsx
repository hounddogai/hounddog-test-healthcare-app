import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import MaskedInput from "react-input-mask";
import invariant from "tiny-invariant";
import { getPatient, updatePatient } from "~/service";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatePatient(params.patientId, updates);
  return redirect(`/patients/${params.patientId}/`);
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
    <Form key={patient.id} method="post">
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn w-40"
          style={{ color: "black" }}
        >
          Go Back
        </button>
        <button type="submit" className="mt-8 btn w-40">
          Save Changes
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-10">
        <label className="flex">
          <span className="w-48">First Name</span>
          <input
            defaultValue={patient.firstName}
            aria-label="First name"
            name="firstName"
            type="text"
            placeholder="First"
            className="w-80"
          />
        </label>

        <label className="flex">
          <span className="w-48">Last Name</span>
          <input
            aria-label="Last name"
            defaultValue={patient.lastName}
            name="lastName"
            placeholder="Last"
            type="text"
            className="w-80"
          />
        </label>

        <div className="flex">
          <span className="w-48">Date of Birth</span>
          <div>
            <MaskedInput
              mask="99/99/9999"
              placeholder="MM/DD/YYYY"
              defaultValue={patient.dob}
              name="dob"
              className="w-80"
            />
          </div>
        </div>
        <label className="flex">
          <span className="w-48">Medical Record Number</span>
          <input
            defaultValue={patient.mrn}
            name="mrn"
            placeholder="111-111-111"
            type="text"
            className="w-80"
          />
        </label>
        <label className="flex">
          <span className="w-48">Address</span>
          <input
            defaultValue={patient.address}
            name="address"
            placeholder="123 Fake St, Chicago, IL"
            type="text"
            className="w-80"
          />
        </label>
        <label className="flex">
          <span className="w-48">Phone Number</span>
          <input
            defaultValue={patient.phoneNumber}
            name="phoneNumber"
            placeholder="111-111-1111"
            type="tel"
            className="w-80"
          />
        </label>
        <label className="flex">
          <span className="w-48">Blood Type</span>
          <input
            defaultValue={patient.bloodType}
            name="bloodType"
            placeholder="0 negative"
            type="text"
            className="w-80"
          />
        </label>
        <label className="flex">
          <span className="w-48">Notes</span>
          <textarea
            defaultValue={patient.notes}
            name="notes"
            rows={6}
            className="w-80"
          />
        </label>
      </div>
    </Form>
  );
}
