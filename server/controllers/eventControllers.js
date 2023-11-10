const Event = require('../models/Event')
const Sub = require('../models/SubOnEvent')

exports.getAllEvents = async (req, res, next) => {
    try {
        const [events, _] = await Event.findAll()

        res.status(200).json({events})
    } catch (err) { 
        console.log(err) 
        next(err)
    }   
}

exports.createNewEvent = async (req, res, next) => {
    let eventId
    try {
        let { eventId, time, playersNum, descr, courtId, creator } = req.body
        let event = new Event(eventId, time, playersNum, descr, courtId, creator)
        
        event = await event.save()

        res.status(201).json({message:"Event created"})
    } catch (err) {
        console.log(err) 
        next(err)
    }
   
}

exports.getEventById = async (req, res, next) => {
    try {
        let eventId = req.params.id
        let [event, _] = await Event.findById(eventId)

        res.status(200).json({event})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.editEventByUser = async (req, res, next) => {
    try {
        let { event_id, time, players_num, description, court_id } = req.body

        let update = new Event()

        const resq = await update.editEventByUser(event_id, time, players_num, description, court_id)

        res.status(200).json({message:"Event edited"})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}
