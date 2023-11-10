const express = require('express')
const subContollers = require('../controllers/subEventByUserControllers')
const router = express.Router()

// @route GET && POST - /posts/
router
    .route("/")
    // .get(eventContollers.getAllEvents)
    .post(subContollers.createNewSub)
    .delete(subContollers.cancelSubOrDeleteEvent)

// юзеры подписанные на событие
router.route("/event/:id").get(subContollers.findUserSubsOnEvent)

// события юзезра
router.route('/user/:id').get(subContollers.findEventsBySubUser)

// события юзезра (только ID)
router.route('/user/id/:id').get(subContollers.getOnlyIdSubs)

module.exports = router