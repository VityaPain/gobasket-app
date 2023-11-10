const express = require('express')
const userContollers = require('../controllers/userControllers')
const router = express.Router()

// @route GET && POST - /posts/
router
    .route("/")
    // .get(userContollers.authUser)
    .post(userContollers.createNewUser)
    .put(userContollers.editProfile)

router.route("/:id").get(userContollers.getUserById)
router.route("/login/:login/:password").get(userContollers.authUser)

module.exports = router