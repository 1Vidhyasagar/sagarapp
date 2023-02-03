var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static("folder_structure"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

mongoose.connect("mongodb://0.0.0.0:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

app.post("/sign_up", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var phno = req.body.phno;
  var age = req.body.age;
  var password = req.body.password;
  var data = {
    name: name,
    email: email,
    phno: phno,
    age: age,
    password: password,
  };
  db.collection("users").insertOne(data, (err, collection) => {
    if (err) throw err;
    console.log("Record Inserted Successfully");
  });
  return res.redirect("login.html");
});

app.post("/login", async (request, response) => {
  console.log(request.body);
  const { username, password } = request.body;
  if (!username || !password) {
    response.send("Invalid information!❌❌❌! Please create account first");
  }
  try {
    // const username = request.body.username;
    // const password = request.body.password;

    const usermail = await db
      .collection("users")
      .findOne({ email: username, password: password }, (err, res) => {
        if (res == null) {
          return response.redirect("login.html");
        } else if (err) throw err;

        if (res.password === password) {
        response.render("user", { user: res });
        } else {
          if (response.send("Invalid Password!❌❌❌"));
        }
      });
  } catch (error) {
    response.send("Invalid information❌");
  }
});


app.get("/login/:id", (req, res) => {
  const id = req.params.id;

  // Query to retrieve user details
  db.collection("users").findOne({ _id: mongodb.ObjectID(id) }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      // Render the user details on the page
      res.render("user", { user: user });
    }
  });
});

app.post("/login/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const phno = req.body.phno;
  const age = req.body.age;

  // Update query to update the user details
  db.collection("users").updateOne(
    { _id: mongodb.ObjectID(id) },
    { $set: { name: name, email: email, phno: phno, age: age } },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // Redirect to the updated user details page
        res.redirect(`/user/${id}`);
      }
    }
  );
});


app
  .get("/", (req, res) => {
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    return res.redirect("index.html");
  })
  .listen(3000);

console.log("Listening on Port 3000");
