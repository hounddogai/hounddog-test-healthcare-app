const express = require("express");
const { matchSorter } = require("match-sorter");
const sortBy = require("sort-by");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

const fakePatients = require("./data");
const writeAndDownloadData = require("./writeAndDownloadData");

const app = express();
const port = 5174;

//
// MIDDLEWARES
//

// Enable CORS for all origins (loose policy)
app.use(cors());
app.use(cookieParser());
// Configure body-parser to handle JSON or URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "sessionSecret",
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Create session for new users
    cookie: { secure: false, maxAge: 60000 }, // Change secure to true for HTTPS
  })
);

//
// ROUTES
//

app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "valid_user" && password === "valid_password") {
    const user = { id: 1, username };
    const token = generateJWT(user);

    res.cookie("jwt", token, {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 3600000, // Set expiration time in milliseconds (1 hour here)
    });

    const userIp =
      req.ip || req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
    console.log(`User ${username} logged in from IP: ${userIp}`);

    // Store User Ip in Express Session
    req.session.user_ip = userIp;

    res.json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/patients/:id", async (req, res) => {
  const patientId = req.params.id;
  const patientInfo = await fakePatients.get(patientId);

  const patientJsonData = JSON.stringify(patientInfo);
  res.cookie("patient-info", patientJsonData, {
    maxAge: 1000 * 60 * 60,
    httpOnly: false,
  });

  res.json(patientInfo);
});

app.get("/patients", async (req, res) => {
  const query = req.query.q;
  let patients = await fakePatients.getAll();
  if (query) {
    patients = matchSorter(patients, query, {
      keys: ["firstName", "lastName"],
    });
  }
  const result = patients.sort(sortBy("lastName", "createdAt"));
  res.json(result);
});

app.post("/patients", async (req, res) => {
  const result = await fakePatients.create({});
  res.json(result);
});

app.patch("/patients/:id", async (req, res) => {
  const patientId = req.params.id;
  const patient = await fakePatients.get(patientId);
  if (!patient) {
    res.json({ error: `No patient found for ${patientId}` });
  }

  const updateData = req.body;
  try {
    await fakePatients.set(patientId, { ...patient, ...updateData });
  } catch (error) {
    console.error("Error updating patient data for patient: ", patient);
  }
  res.json(patient);
});

app.patch("/patients/:id/visits", async (req, res) => {
  const patientId = req.params.id;
  const patient = await fakePatients.get(patientId);
  if (!patient) {
    res.json({ error: `No patient found for ${patientId}` });
  }

  const updateData = req.body;
  await fakePatients.set(patientId, {
    ...patient,
    visits: [...(patient.visits || []), updateData],
  });
  res.json(patient);
});

app.delete("/patients/:id", async (req, res) => {
  const patientId = req.params.id;
  await fakePatients.destroy(patientId);
  res.json({ ok: true });
});

app.get("/download-visits/:id", async (req, res) => {
  const patientId = req.params.id;
  const patient = await fakePatients.get(patientId);
  if (!patient) {
    res.json({ error: `No patient found for ${patientId}` });
  }

  writeAndDownloadData(
    `${patient.firstName}-${patient.lastName}-${patient.mrn}-visits.txt`,
    patient.visits,
    res
  );
});

app.get("/download-patient-information/:id", async (req, res) => {
  const patientId = req.params.id;
  const patient = await fakePatients.get(patientId);
  if (!patient) {
    res.json({ error: `No patient found for ${patientId}` });
  }

  writeAndDownloadData(
    `${patient.firstName}-${patient.lastName}-${patient.mrn}-information.txt`,
    patient,
    res
  );
});

//
// APP LISTEN
//
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
