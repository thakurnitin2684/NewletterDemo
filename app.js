//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
require("dotenv").config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  console.log("here 1");
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
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
  console.log("here 2");
  const jsonData = JSON.stringify(data);

  console.log("here 3");
  var url = "https://us14.api.mailchimp.com/3.0/lists/f6d85d2ccb";
  const options = {
    method: "POST",
    auth: "nitin2684:" + process.env.API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      console.log(response.statusCode);
      console.log("here 4");
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  console.log("here 5");
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
