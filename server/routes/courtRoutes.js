const express = require('express')
const courtContollers = require('../controllers/courtConrollers')
const router = express.Router()

// @route GET && POST - /posts/
router
    .route("/")
    .get(courtContollers.getAllCourts)
    .post(courtContollers.createNewCourt)

router.route("/all").get(courtContollers.findAllAdress)
router.route("/markers").get(courtContollers.getMarkers)
router.route("/:id").get(courtContollers.getCourtById)
router.route("/descr/:id").get(courtContollers.getDescrAndImages)

module.exports = router