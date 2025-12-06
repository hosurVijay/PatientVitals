import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is live and Hot at port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Server failed to listen", error);
  });
