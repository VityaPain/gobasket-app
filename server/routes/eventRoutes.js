const express = require('express')
const eventContollers = require('../controllers/eventControllers')
const router = express.Router()

// @route GET && POST - /posts/
router
    .route("/")
    .get(eventContollers.getAllEvents)
    .post(eventContollers.createNewEvent)
    .put(eventContollers.editEventByUser)

router.route("/:id").get(eventContollers.getEventById)

module.exports = router