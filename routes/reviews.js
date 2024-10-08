const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utils/wrapAsync.js");
const expressError = require("../Utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


const validateReview = (req, res, next) => {
  let {error }= reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(404,errMsg);
  }else{
    next();
  }
  };
  

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//       console.log(error);
//       let errMsg = error.details.map((el) => el.message).join(",");
//       throw new expressError(400, errMsg);
//     } else {
//       next();
//     }
//   };
  
  

  // post route
  
  router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      console.log(newReview);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success","New Review Created!")
  
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  
  // Delete review route
  router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id ,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!")
   res.redirect(`/listings/${id}`)
  }))
  

  module.exports = router;