const express = require('express');
const router = express.Router();
const customLogger = require('../utils/CustomLogger');
const CustomError = require('../utils/CustomError'); // Assuming you have this for custom status codes

// =========================================================================
// This dummy file demonstrates the three primary ways to use the logger.
// =========================================================================

/**
 * SCENARIO 1: Successful operation with an informational log.
 * The developer wants to record that a specific, positive event happened.
 */
router.get('/success', (req, res) => {
  // --- INFO LOG ---
  // We call myinfo() with a simple message. The logger automatically
  // gets the userId from your utility function.
  customLogger.myinfo('Successfully retrieved payment history.');

  res.status(200).json({
    success: true,
    message: 'Payment history fetched successfully.',
  });
});


/**
 * SCENARIO 2: A "Forced Error" due to business logic or validation.
 * The developer handles the condition and wants to log it as an error.
 */
router.post('/fail', (req, res) => {
  const { username } = req.body;

  // --- FORCED ERROR LOG ---
  // The username is invalid. We handle the response but log the failure
  // by calling myerror() with a simple string.
  if (!username || username.length < 3) {
    customLogger.myerror('User creation failed: Username is too short.');
    return res.status(400).json({
      success: false,
      message: 'Username must be at least 3 characters long.',
    });
  }

  res.status(201).json({ success: true, message: `User ${username} created.` });
});


/**
 * SCENARIO 3: An unexpected API error.
 * Something breaks, and the developer throws a real Error object.
 */
router.get('/crash', (req, res) => {
  // --- UNHANDLED API ERROR ---
  // We throw a real Error. This will be automatically caught by your
  // global `errorHandler.js` middleware, which will then call
  // `customLogger.myerror(err, req)` with all the request details.
  throw new CustomError('Could not connect to the payment gateway.', 503);
});


module.exports = router;