import * as Sentry from "@sentry/remix";
import {
  json,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
  useRouteError,
} from "@remix-run/react";
import appStylesHref from "./app.css?url";
import tailwindStylesHref from "./tailwind.css?url";

import { useEffect } from "react";
import { createEmptyPatient, getPatients } from "./service";
import PatientItem from "./patientItem";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesHref },
  { rel: "stylesheet", href: appStylesHref },
];

export const action = async () => {
  const patient = await createEmptyPatient();
  return redirect(`/patients/${patient.id}/edit`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const patients = await getPatients(q);
  return json({ patients, q });
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  Sentry.captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
};

export default function App() {
  const { patients, q } = useLoaderData<typeof loader>();
  console.log("Patients Loaded", patients);
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  // Set user context for Sentry on App load
  useEffect(() => {
    Sentry.setUser({
      doctor_id: "1234",
      doctor_email: "john.doe@advocadohealth.com",
    });
  }, [q]);

  return (
    <html lang="en">
      <head>
        <title>Avocado Doctors Portal</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <footer className="text-sm italic">
            <div>Avocado Doctors Portal</div>
            <div className="text-xs">© 2024 v1.0</div>
          </footer>
          <div className="h-16">
            <Form
              id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, { replace: !isFirstSearch });
              }}
              role="search"
              className="w-full"
            >
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search patients"
                defaultValue={q || ""}
                placeholder="Search patient"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
          </div>
          <Form method="post" className="w-full">
            <button
              type="submit"
              className="btn w-full"
              style={{ marginTop: "1rem" }}
            >
              New Patient
            </button>
          </Form>
          <nav>
            {patients.length ? (
              <ul>
                {patients.map((patient) => (
                  <PatientItem key={patient.id} patient={patient} />
                ))}
              </ul>
            ) : (
              <p>
                <i>No Patients Found</i>
              </p>
            )}
          </nav>
        </div>
        <div className="flex-1">
          <div className="h-16 bg-neutral-100 flex justify-between items-center px-8 border-b">
            <Link to="/" className="flex items-center">
              <img
                src="/avocado-logo-transparent.png"
                alt="Avatar of Dr"
                className="w-8 h-8 mr-2"
              />
              <span className="font-bold">Avocado Doctors Portal</span>
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <img
                  src="/dr-thumb.png"
                  alt="Avatar of Dr"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm">Dr. John Doe</span>
            </div>
          </div>
          <div
            className={
              navigation.state === "loading" && !searching ? "loading" : ""
            }
            id="outlet"
          >
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
