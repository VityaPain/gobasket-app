const User = require('../models/User')

exports.getAllUsers = async (req, res, next) => {
    try {
        // res.setHeader('Acces-Control-Allow-Methods', 'GET')
        const [users, _] = await User.findAll()

        res.status(200).json({users})
    } catch (err) { 
        console.log(err) 
        next(err)
    }   
}

exports.createNewUser = async (req, res, next) => {
    try {
        let { name, password, descr } = req.body
        let user = new User(name, password, descr)
    
        user = await user.save()

        console.log(user)

        res.status(201).json({message:"User created"})
    } catch (err) {
        console.log(err) 
        next(err)
    }
   
}

exports.getUserById = async (req, res, next) => {
    try {
        let userId = req.params.id
        let [user, _] = await User.findById(userId)

        res.status(200).json({user})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.authUser = async (req, res, next) => {
    try {
        let userLogin = req.params.login
        let userPassword = req.params.password

        const [user, _] = await User.authUser(userLogin, userPassword)

        res.status(200).json({user})
    } catch (err) {
        console.log(err) 
        next(err)
    }
}

exports.editProfile = async(req, res, next) => {
    try {
        let { userId, name, descr } = req.body
        
        let user = new User(name, '', descr)
    
        user = await user.editProfile(userId)

        // const update = await User.editProfile(userId, name, descr)

        res.status(202).json({user})

    } catch (err) {
        console.log(err) 
        next(err)
    }
}