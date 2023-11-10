const express = require('express')
const subContollers = require('../controllers/subCourtByUserControllers')
const router = express.Router()

router
    .route("/")
    .post(subContollers.createNewSub)
    .delete(subContollers.cancelSubOnCourt) // отменить подписку на площадку

// события юзезра
router.route('/user/:id').get(subContollers.findCourtsBySubUser)

module.exports = router