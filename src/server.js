import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import os from "os";

dotenv.config();

const app = express();

const networkInterfaces = os.networkInterfaces();
let localIp = null;

for (const interfaceKey in networkInterfaces) {
  for (const network of networkInterfaces[interfaceKey]) {
    if (network.family === "IPv4" && !network.internal) {
      localIp = network.address;
      break;
    }
  }
}

console.log("IPADDRESS:", localIp);

app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.send({ message: "HIeeasad" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
