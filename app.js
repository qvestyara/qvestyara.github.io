const { google } = require("googleapis");
const express = require("express");
const OAuth2Data = require("./google_key.json");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

const googleConfig = {
  clientId:
    "724621884932-hmo39oeradt2v751tnf16secsvdsa5i2.apps.googleusercontent.com", // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: "sjdoq4nmoBjcw_cLqEimUfQf", // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: "https://newreviewer.herokuapp.com" // this must match your google api settings
};

const defaultScope = [
  "https://www.googleapis.com/auth/plus.me",
  "https://www.googleapis.com/auth/userinfo.email"
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: "v1", auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  const auth = createConnection();
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({ userId: "me" });
  const userGoogleId = me.data.id;
  const userGoogleEmail =
    me.data.emails && me.data.emails.length && me.data.emails[0].value;
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens
  };
}
const reviewers = [
  "Evita Kusinia",
  "Bogdan Kupranets",
  "Lurii Besidka",
  "Oksana Piaskovska",
  "Olena Shatna",
  "Yurii Petrichenko",
  "Natalia Virt",
  "Roman Pidkostelnyi",
  "Oleksiy Domianych",
  "Yurii Faevskyi",
  "Yana Schebyvok"
];
let index = 0;

app.get("/", (request, response) => {
  response.render("index", {
    name: reviewers[index]
  });
});
app.get("/newReviewer", (request, response) => {
  reviewers.length - 1 === index ? (index = 0) : index++;
  response.redirect("/");
});
app.listen(process.env.PORT || port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});
