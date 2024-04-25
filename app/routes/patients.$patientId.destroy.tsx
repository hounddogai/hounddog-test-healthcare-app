import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deletePatient } from "~/data";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.patientId, "Missing patientId param");
  await deletePatient(params.patientId);
  return redirect("/");
};
