const Court = require('../models/Court')

exports.getAllCourts = async (req, res, next) => {
    try {
        const [courts, _] = await Court.findAll()

        res.status(200).json({courts})
    } catch (err) { 
        console.log(err) 
        next(err)
    }
}

exports.createNewCourt = async (req, res, next) => {
    try {
        let { adress, description, region } = req.body
        let court = new Court(adress, description, region)
    
        court = await court.save()

        console.log(court)

        res.status(201).json({message:"Court created"})
    } catch (err) {
        console.log(err) 
        next(err)
    }
   
}

exports.getCourtById = async (req, res, next) => {
    try {
        let courtId = req.params.id
        let [court, _] = await Court.findById(courtId)

        res.status(200).json({court})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.findAllAdress = async (req, res, next) => {
    try {
        const [courts, _] = await Court.findAllAdress()

        res.status(200).json({courts})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.getDescrAndImages = async (req, res, next) => {
    try {
        let courtId = req.params.id
        let [court, _] = await Court.findDescrAndImages(courtId)

        res.status(200).json({court})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.getMarkers = async (req, res, next) => {
    try {
        const [courts, _] = await Court.getMarkers()

        res.status(200).json({courts})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}