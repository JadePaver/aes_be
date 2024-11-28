import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import os from "os";
import multer from "multer";

import userRoutes from "./routes/userRoutes.js"
import roleRoutes from "./routes/roleRoutes.js"
import sexRoutes from "./routes/sexRoute.js"
import prof_imageRoutes from "./routes/prof_imageRoutes.js"
import classroomRoutes from "./routes/classroomRoutes.js"
import subjectRoutes from "./routes/subjectsRoutes.js"
import moduleRoutes from "./routes/moduleRoutes.js"
import assessmentRoutes from "./routes/assessmentsRoutes.js"


dotenv.config();

const app = express();

const networkInterfaces = os.networkInterfaces();
let localIP = null;

for (const interfaceKey in networkInterfaces) {
  for (const network of networkInterfaces[interfaceKey]) {
    if (network.family === "IPv4" && !network.internal) {
      localIP = network.address;
      break;
    }
  }
}

app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());

app.get("/getserver_ip", (req, res) => {
  res.send( {localIP} );
});

app.use("/users",userRoutes)
app.use("/roles",roleRoutes)
app.use("/sex",sexRoutes)
app.use("/prof_img",prof_imageRoutes)
app.use("/classrooms",classroomRoutes)
app.use("/subjects",subjectRoutes)
app.use("/modules",moduleRoutes)
app.use("/assessments",assessmentRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});