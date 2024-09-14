// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/listing.js");
// const wrapAsync = require("../Utils/wrapAsync.js");
// const expressError = require("../Utils/expressError.js");
// const { listingschema } = require("../schema.js");

// const validatelisting = (req, res, next) => {
//   if (!req.body.listing) {
//     throw new expressError(400, "Listing data is missing.");
//   }
//   let { error } = listingschema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new expressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// //Index route
// router.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("index.ejs", { allListings });
//   })
// );

// //New route
// router.get("/new", (req, res) => {
//   res.render("new.ejs");
// });

// //Show route
// router.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     if (!listing) {
//       req.flash("error", "This Listing is not exist!");
//       res.redirect("/listings");
//     }
//     res.render("show.ejs", { listing });
//   })
// );

// //Create route
// // app.post("/listings", validatelisting,wrapAsync( async (req,res)=>{
// //     let {title , description , url , price , country, location} = req.body;
// //     let listing = new Listing({title , description , url , price , country, location});
// //     await listing.save();
// //     res.redirect("/listings")
// // }));
// router.post(
//   "",
//   validatelisting,
//   wrapAsync(async (req, res) => {
//     let listing = req.body.listing;
//     console.log(listing);
//     let saveListing = await Listing.create(listing); //or we can do== new Listing(listing).save();
//     console.log(saveListing);
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
//   })
// );

// // Edit route
// router.get(
//   "/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if (!listing) {
//       req.flash("error", "This Listing is not exist!");
//       res.redirect("/listings");
//     }
//     res.render("edit.ejs", { listing });
//   })
// );

// // Update route
// router.put(
//   "/:id",
//   validatelisting,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     // let { title, description, url, price, country, location } = req.body;
//     // let listing = await Listing.findByIdAndUpdate(id, {
//     //   title,
//     //   description,
//     //   url,
//     //   price,
//     //   country,
//     //   location,
//     // });
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
//   })
// );

// // Delete route
// router.delete(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedValue = await Listing.findByIdAndDelete(id);
//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings");
//     console.log(deletedValue);
//   })
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const expressError = require("../Utils/expressError.js");
const { listingschema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validatelisting = (req, res, next) => {
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  })
);

//New route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

// //Show route
// router.get(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     if (!listing) {
//       req.flash("error", "This Listing is not exist!");
//       res.redirect("/listings");
//     }
//     res.render("show.ejs", { listing });
//   })
// );
//Show route
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "This Listing is not exist!");
      res.redirect("/listings");
    } else {
      
      res.render("show.ejs", { listing });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Create route
// app.post("/listings", validatelisting,wrapAsync( async (req,res)=>{
//     let {title , description , url , price , country, location} = req.body;
//     let listing = new Listing({title , description , url , price , country, location});
//     await listing.save();
//     res.redirect("/listings")
// }));
router.post(
  "/",
  isLoggedIn,
  validatelisting,
  wrapAsync(async (req, res) => {
    // let listing = req.body.listing;
    // console.log(listing);
    // Listing.owner = req.user._id;
    // let saveListing = await Listing.create(listing); //or we can do== new Listing(listing).save();
    // console.log(saveListing);
    // req.flash("success", "New Listing Created!");
    // res.redirect("/listings");
    let listing = req.body.listing;
    listing.owner = req.user._id; // Assign owner to the listing object
    let saveListing = await Listing.create(listing); // Save the listing
    console.log(saveListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// Edit route
// router.get(
//   "/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if (!listing) {
//       req.flash("error", "This Listing is not exist!");
//       res.redirect("/listings");
//     }
//     res.render("edit.ejs", { listing });
//   })
// );
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    try {
      let listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "This Listing is not exist!");
        res.redirect("/listings");
      } else {
        // You might want to add a check here to ensure the user is authorized to edit the listing
        res.render("edit.ejs", { listing });
      }
    } catch (err) {
      req.flash("error", "An error occurred while retrieving the listing.");
      res.redirect("/listings");
    }
  })
);

// Update route
router.put(
  "/:id",
  isLoggedIn,
  validatelisting,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let { title, description, url, price, country, location } = req.body;
    // let listing = await Listing.findByIdAndUpdate(id, {
    //   title,
    //   description,
    //   url,
    //   price,
    //   country,
    //   location,
    // });
    const listing = await Listing.findById(id);


    if (!res.locals.currUser._id.equals(listing.owner._id)) {
      req.flash("error", "You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedValue = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
    console.log(deletedValue);
  })
);

module.exports = router;
