import { FormEvent, useState } from "react";
import styles from "./app.module.scss";
import { BASE_ELR, SupportedDisease } from "./data/elrs";
import { faker } from "@faker-js/faker";
import {
  generateRandomLastName,
  generateRandomNumbers,
  generateTimestamp,
} from "./data/generator";

type Patient = {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  sex: string;
  ssn: string;
  email: string;
  street: string;
  state: string;
  city: string;
  zipcode: string;
  buildingNumber: string;
  dob: string;
  timestamp: string;
};

const initial: Patient & { disease: SupportedDisease } = {
  firstName: "",
  lastName: "",
  middleName: "",
  suffix: "",
  sex: "",
  ssn: "",
  email: "",
  street: "",
  state: "GA",
  city: "",
  zipcode: "30342",
  buildingNumber: "",
  dob: "",
  timestamp: "",
  disease: "hepbPrelim",
};

export const App = () => {
  const [value, setValue] = useState<Patient & { disease: SupportedDisease }>(
    initial
  );
  const [elr, setElr] = useState<string | undefined>();

  const coalesce = (v: string, fallback: string): string => {
    return v.trim().length > 0 ? v : fallback;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let base = BASE_ELR[value.disease];
    console.log("Recieved base elr:", base);

    let patientData: Patient = {
      firstName: coalesce(value.firstName, faker.person.firstName()),
      middleName: coalesce(value.middleName, faker.person.middleName()),
      lastName: coalesce(value.lastName, generateRandomLastName()),
      suffix: "",
      sex: coalesce(value.sex, "M"),
      ssn: generateRandomNumbers(9),
      email: faker.internet.email(),
      street: coalesce(value.street, faker.location.streetAddress()),
      state: coalesce(value.state, faker.location.state({ abbreviated: true })),
      city: coalesce(value.city, faker.location.city()),
      zipcode: coalesce(value.zipcode, generateRandomNumbers(5)),
      buildingNumber: `unit ${faker.location.buildingNumber()}`,
      dob: coalesce(
        value.dob,
        `19${faker.number.int(9)}${faker.number.int(9)}`
      ),
      timestamp: generateTimestamp(),
    };
    console.log("adding patient data to ELR");
    const updated = base
      .replace(/PATIENTFIRSTNAME/g, patientData.firstName)
      .replace(/PATIENTLASTNAME/g, patientData.lastName)
      .replace(/PATIENTMIDDLENAME/g, patientData.middleName)
      .replace(/PATIENTSSN/g, patientData.ssn)
      .replace(/PATIENTDOB/g, patientData.dob)
      .replace(/PATIENTGENDER/g, patientData.sex)
      .replace(/PATIENTCITY/g, patientData.city)
      .replace(/PATIENTEMAIL/g, patientData.email)
      .replace(/PATIENTSTREET/g, patientData.street)
      .replace(/PATIENTUNITADDRESS/g, patientData.buildingNumber)
      .replace(/PATIENTSTATEADDRESS/g, patientData.state)
      .replace(/PATIENTZIPCODE/g, patientData.zipcode)
      .replace(/UUIDTIMESTAMP/g, patientData.timestamp);
    console.log("setting elr", updated);
    setElr(updated);
  };

  return (
    <div className={styles.elrGenerator}>
      <h1>ELR generator</h1>
      <div className={styles.pageContent}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="first-name">First name</label>
            <input
              id="first-name"
              onChange={(e) =>
                setValue({ ...value, firstName: e.target.value })
              }
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="last-name">Last name</label>
            <input
              id="last-name"
              onChange={(e) => setValue({ ...value, lastName: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="middle-name">Middle name</label>
            <input
              id="middle-name"
              onChange={(e) =>
                setValue({ ...value, middleName: e.target.value })
              }
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="dob">Year of birth</label>
            <input
              id="dob"
              pattern="\d{4}"
              maxLength={4}
              max={2025}
              onChange={(e) => setValue({ ...value, dob: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="dob">Sex</label>
            <select
              onChange={(e) =>
                setValue({
                  ...value,
                  sex: e.target.value,
                })
              }
            >
              <option value={"M"}>Male</option>
              <option value={"F"}>Female</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="street">Street Address</label>
            <input
              id="street"
              onChange={(e) => setValue({ ...value, street: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="city">City</label>
            <input
              id="city"
              onChange={(e) => setValue({ ...value, city: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="state">State Abbreviation</label>
            <input
              id="state"
              defaultValue={value.state}
              maxLength={2}
              onChange={(e) => setValue({ ...value, state: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="zip">Zip</label>
            <input
              id="zip"
              defaultValue={value.zipcode}
              onChange={(e) => setValue({ ...value, zipcode: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="elr-type">Disease</label>
            <select
              onChange={(e) =>
                setValue({
                  ...value,
                  disease: e.target.value as SupportedDisease,
                })
              }
            >
              <option value={"hepbPrelim"}>HepB Preliminary</option>
              <option value={"hepbFinal"}>HepB Final</option>
            </select>
          </div>
          <button type="submit">Generate ELR</button>
        </form>
        <textarea className={styles.elrContent} value={elr} />
      </div>
    </div>
  );
};

export default App;
