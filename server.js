const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); //this line will allow our program to read the file and save to variables as environment variables
const app = require("./app");

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
