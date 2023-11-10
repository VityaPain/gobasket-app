const Sub = require('../models/SubOnEvent')

// юзеры подписанные на событие
exports.findUserSubsOnEvent = async (req, res, next) => {
    try {
        let eventId = req.params.id
        let [subs, _] = await Sub.findUserSubsOnEvent(eventId)

        res.status(200).json({subs})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

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

// события, на которые подписан юзер
exports.findEventsBySubUser = async (req, res, next) => {
    try {
        let userId = req.params.id
        let [events, _] = await Sub.findEventsBySubUser(userId)

        console.log(typeof events)

        res.status(200).json({events})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.cancelSubOrDeleteEvent = async (req, res, next) => {
    const loginedUserId = 'userid3'
    let { eventId, userId } = req.body
    let del = new Sub(eventId, userId)
    del = await del.cancelSubOrDeleteEvent(userId, eventId)

    res.status(202).json({message:"Event/sub deleted"})
}

exports.getOnlyIdSubs = async (req, res, next) => {
    let userId = req.params.id
    let [eventsId, _] = await Sub.getOnlyIdSubs(userId)

    res.status(200).json({eventsId})
}
