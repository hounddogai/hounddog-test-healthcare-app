import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deletePatient } from "~/service";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  await deletePatient(params.patientId);
  console.log("Patient deleted", params.patientId);
  return redirect("/");
};
