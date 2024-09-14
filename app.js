const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./Utils/expressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen("8080", () => {
  console.log("Server is working");
});

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/sarayu");
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("root");
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    username: "demouser",
    email: "demouser@gmail.com",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/testListing", async (req, res) => {
//   let sampleListig = new Listing({
//     title: "Villa in miami",
//     description:
//       "5 Bed room villa with all necessary things one maid forr cleaning fully air conditioned with swimming pool and garden ",
//     image:
//       "https://static1.mansionglobal.com/production/media/article-images/92f2616f2a10d79c2ed128c724dd3e0f/large_1.20190612_02_DSC_0413_ED_HR.jpg",
//     location: "Miami, Florida",
//     country: "USA",
//   });

//   await sampleListig.save();
//   console.log("sample saved");
//   res.send("successful testing");
// });

// app.all("*",(req,res,next)=>{
//   next(new expressError(404 ,"Page not found"))
// });

// app.use((err, req , res , next)=>{
// let {statusCode = 500 ,message = "something went wrong"} =  err;
// res.render("error.ejs",{message})
// // res.status(statusCode).send(message);
// });

// app.all("*", (req, res, next) => {
//   next(new expressError(404, "Not Found"));
// });
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Some error" } = err;
//   res.status(statusCode).render("error.ejs", { err });
// });
