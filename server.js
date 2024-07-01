const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");


dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology:true
  })
  .then((con) => {
    console.log(con.connections);
    console.log("DB connection successfully!");
  });




const port = process.env.PORT || 27001;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
