const Sub = require('../models/SubOnCourt')

// новая подписка
exports.createNewSub = async (req, res, next) => {
    try {
        let { eventId, userId } = req.body
        let sub = new Sub(eventId, userId)
        
        sub = await sub.save()

        res.status(201).json({message:"Sub created"})
    } catch (err) {
        console.log(err) 
        next(err)
    }  
}

// площадки, на которые подписан юзер
exports.findCourtsBySubUser = async (req, res, next) => {
    try {
        let userId = req.params.id
        let [events, _] = await Sub.findCourtsBySubUser(userId)

        res.status(200).json({events})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.cancelSubOnCourt = async (req, res, next) => {
    try {
        let { courtId, userId } = req.body

        let del = Sub.cancelSubOnCourt(courtId, userId)

        res.status(200).json({del})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

