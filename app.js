const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { dirname } = require("path");
const { url } = require("inspector");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;
  console.log(fname, lname, email, res.statusCode);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const stringify = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0//lists/ce1ecb598d";

  const options = {
    method: "POST",
    auth: "ashim:283b1f640c241d682b6f828f6eceeebd-us21",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/error.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(stringify);
  request.end();

  app.post("/back", function (req, response) {
    response.redirect("/");
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running", process.env.PORT);
});
