import { NavLink } from "@remix-run/react";
import { PatientRecord } from "~/types";

const PatientItem = ({ patient }: { patient: PatientRecord }) => {
  const isFavoritePatient = (mrn?: string) => {
    if (typeof window === "undefined") {
      return;
    }
    if (!mrn) {
      return false;
    }
    const favoriteMrns = window.localStorage.getItem("favoritePatientMrns");
    if (!favoriteMrns) {
      return false;
    }
    const favoriteMrnsArray: string[] = JSON.parse(favoriteMrns);

    return favoriteMrnsArray.includes(mrn);
  };

  return (
    <li key={patient.id}>
      <NavLink
        className={({ isActive, isPending }) =>
          isActive
            ? "active flex justify-between"
            : isPending
            ? "pending flex justify-between"
            : ""
        }
        to={`patients/${patient.id}`}
      >
        <div>
          {patient.firstName || patient.lastName ? (
            <>
              {patient.firstName} {patient.lastName}
            </>
          ) : (
            <i>New Patient</i>
          )}
        </div>
        {isFavoritePatient(patient.mrn) ? (
          <img src="/star.svg" alt="see visit" className="w-5 h-5" />
        ) : null}
      </NavLink>
    </li>
  );
};

export default PatientItem;
