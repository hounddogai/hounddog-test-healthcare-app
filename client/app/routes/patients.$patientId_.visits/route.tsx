/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import invariant from "tiny-invariant";

import "react-responsive-modal/styles.css";
import MaskedInput from "react-input-mask";
import { getPatient, updateVisits } from "~/service";
import { Visit } from "~/types";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const formData = await request.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visitData: any = Object.fromEntries(formData);
  const newVisitData: Visit = {
    date: visitData.date,
    vitalSigns: visitData.vitalSigns,
    symptoms: visitData.symptoms,
    diagnosis: visitData.diagnosis,
    treatment: visitData.treatment,
  };
  console.log("Creating New Visit with data:", newVisitData);
  await updateVisits(params.patientId, visitData);
  return redirect(`/patients/${params.patientId}/visits`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  const patient = await getPatient(params.patientId);
  if (!patient) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ patient });
};

export default function Visits() {
  const { patient } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn w-40"
          style={{ color: "black" }}
        >
          Go Back
        </button>
        <button type="submit" className="mt-8 btn w-40" onClick={onOpenModal}>
          Create New Visit
        </button>
      </div>
      <div className="flex mt-10">
        <div>
          <p className="font-bold text-3xl">
            {patient.firstName || patient.lastName ? (
              <>
                {patient.firstName} {patient.lastName}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            Visits
          </p>
          <div className="w-64 mt-6">
            <div>
              {patient.visits && patient.visits.length > 0 ? (
                patient.visits.map((visit, index) => {
                  return (
                    <div key={`${visit.date}-${index}`}>
                      {index > 0 && (
                        <div className="border-t border-gray-400 my-2"></div>
                      )}
                      <div
                        key={visit.date}
                        className="font-medium p-2 cursor-pointer rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                        onClick={() => setSelectedVisit(visit)}
                      >
                        <div>{visit.date}</div>
                        <img
                          src="/chevron-right.svg"
                          alt="see visit"
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>There are no visits for this patient.</p>
              )}
            </div>
          </div>
        </div>
        {selectedVisit && (
          <>
            <div className="border-l pl-10 ml-10">
              <div className="font-bold text-2xl mb-6">
                Visit date: {selectedVisit.date}
              </div>
              <div className="flex flex-col gap-6">
                {selectedVisit.vitalSigns ? (
                  <div>
                    <strong className="text-lg">Vital Signs</strong>
                    <br />
                    {selectedVisit.vitalSigns}
                  </div>
                ) : null}
                {selectedVisit.symptoms ? (
                  <div>
                    <strong className="text-lg">Symptoms</strong>
                    <br />
                    {selectedVisit.symptoms}
                  </div>
                ) : null}
                {selectedVisit.diagnosis ? (
                  <div>
                    <strong className="text-lg">Diagnosis</strong>
                    <br />
                    {selectedVisit.diagnosis}
                  </div>
                ) : null}
                {selectedVisit.treatment ? (
                  <div>
                    <strong className="text-lg">Treatment</strong>
                    <br />
                    {selectedVisit.treatment}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
        closeOnOverlayClick={false}
        classNames={{
          modal: "customModal",
        }}
      >
        <h2 className="mb-6 font-bold text-3xl">New Visit</h2>
        <Form key={patient.id} method="post" className="flex flex-col gap-8">
          <label className="flex items-center gap-4" htmlFor="date">
            <span className="w-20">Visit Date</span>
            <MaskedInput
              mask="99/99/9999"
              placeholder="MM/DD/YYYY"
              defaultValue=""
              name="date"
              id="date"
              className="w-96"
            />
          </label>
          <label className="flex items-center gap-4">
            <span className="w-20">Vital Signs</span>
            <input
              className="w-96"
              defaultValue=""
              name="vitalSigns"
              placeholder="BP 130/90, HR 80"
              type="text"
            />
          </label>
          <label className="flex items-center gap-4">
            <span className="w-20">Symptoms</span>
            <input
              className="w-96"
              defaultValue=""
              name="symptoms"
              placeholder="Sore throat"
              type="text"
            />
          </label>
          <label className="flex items-center gap-4">
            <span className="w-20">Diagnosis</span>
            <input
              className="w-96"
              defaultValue=""
              name="diagnosis"
              placeholder="Strep throat"
              type="text"
            />
          </label>
          <label className="flex items-center gap-4">
            <span className="w-20">Treatment</span>
            <input
              className="w-96"
              defaultValue=""
              name="treatment"
              placeholder="Amoxicillin 500mg"
              type="text"
            />
          </label>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={onCloseModal}
              type="button"
              className="btn w-40"
              style={{ color: "black" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mt-8 btn w-40"
              onClick={onCloseModal}
            >
              Create New Visit
            </button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
