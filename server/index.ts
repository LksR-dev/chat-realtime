import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { firestore, rtdb } from "./db";
import { v4 as uuidv4 } from "uuid";

// INIT APP AND CFG
const app = express();
app.use(json());
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
