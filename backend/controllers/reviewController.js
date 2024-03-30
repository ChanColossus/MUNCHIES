const Review = require('../models/review'); // Assuming your model file is in the same directory
const Bevvies = require('../models/bevvies'); 
// Create a new review
exports.createReview = async (req, res) => {
    try {
      const { user, comment, rating, Bevvies } = req.body;
      
      // Check if required fields are provided
      if ( !comment || !rating) {
        return res.status(400).json({ success: false, error: "User, comment, and rating are required" });
      }
  
      // Create the review
      const review = await Review.create({
        user,
        comment,
        rating,
        Bevvies,
      });
  
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// Assuming you have already set up your Express app and connected it to your database

// Assuming you have a Review model defined

// Route to fetch reviews by user ID
exports.ReviewByUser = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Query the database to fetch reviews by user ID
      const reviews = await Review.find({ user: userId }).populate('Bevvies');
  
      res.json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };



// // Update a review by ID
// exports.updateReview = async (req, res) => {
//   try {
//     const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!review) {
//       return res.status(404).json({ success: false, error: 'Review not found' });
//     }
//     res.status(200).json({ success: true, data: review });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Delete a review by ID
// exports.deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findByIdAndDelete(req.params.id);
//     if (!review) {
//       return res.status(404).json({ success: false, error: 'Review not found' });
//     }
//     res.status(200).json({ success: true, data: {} });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
