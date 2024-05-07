const express = require("express");
const { matchSorter } = require("match-sorter");
const sortBy = require("sort-by");
const bodyParser = require("body-parser");

const fakePatients = require("./data");

const app = express();
const port = 5174;

//
// MIDDLEWARES
//
// Configure body-parser to handle JSON or URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// ROUTES
//
app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});

app.get("/patients/:id", async (req, res) => {
  const patientId = req.params.id;
  await new Promise((resolve) => setTimeout(resolve, 500));
  const result = await fakePatients.get(patientId);
  res.json(result);
});

app.get("/patients", async (req, res) => {
  const query = req.query.q;
  await new Promise((resolve) => setTimeout(resolve, 500));
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
  await new Promise((resolve) => setTimeout(resolve, 500));
  const result = await fakePatients.create({});
  res.json(result);
});

app.patch("/patients/:id", async (req, res) => {
  const patientId = req.params.id;
  await new Promise((resolve) => setTimeout(resolve, 500));
  const patient = await fakePatients.get(patientId);
  if (!patient) {
    res.json({ error: `No patient found for ${patientId}` });
  }

  const updateData = req.body;
  await fakePatients.set(patientId, { ...patient, ...updateData });
  res.json(patient);
});

app.patch("/patients/:id/visits", async (req, res) => {
  const patientId = req.params.id;
  await new Promise((resolve) => setTimeout(resolve, 500));
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
  await new Promise((resolve) => setTimeout(resolve, 500));
  await fakePatients.destroy(patientId);
  res.json({ ok: true });
});

//
// APP LISTEN
//
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
