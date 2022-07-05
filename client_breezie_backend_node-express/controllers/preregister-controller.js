const Preregister = require('../model/preregister-model')
const Devicelocation = require('../model/devicelocation-model');
const jwt = require('jsonwebtoken')
const fs = require('fs');

function getUserToken(req) {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    let verifiedUser = jwt.verify(token, process.env.jwtSecret);
    let userId = verifiedUser.userId
    return userId
}

const getPreregisterVisitor = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const visitors = await Preregister.find({
            userId
        });
        res.status(200).json({
            error: false,
            message: "all visitors list",
            visitors
        })
    } catch (err) {
        next(err)
    }
}

const getPreregisterVisitorById = async(req, res, next) => {
    try {
        const visitors = await Preregister.find({
            userId: req.params.id
        });
        res.status(200).json({
            error: false,
            message: "all visitors list",
            visitors
        })
    } catch (err) {
        next(err)
    }
}

const addNewVisitor = async(req, res, next) => {
    try {
        const {
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            location,
            HostName,
            phoneNumber
        } = req.body

        const userId = await getUserToken(req);

        let company = await Devicelocation.findOne({
            _id: location
        });
        let Location = company.locations.officeName

        const addvisitors = await Preregister.insertMany([{
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            locationId: location,
            location: Location,
            HostName,
            phoneNumber,
            userId: userId
        }])
        res.status(200).json({
            error: false,
            message: "New visitors added",
            addvisitors
        })
    } catch (err) {
        next(err)
    }
}

const editPreregisterData = async(req, res, next) => {
    try {
        const {
            fullName,
            companyName,
            dateOfVisit,
            dateOut,
            location,
            HostName,
            phoneNumber
        } = req.body
        const userId = await getUserToken(req);
        let company = await Devicelocation.findOne({
            _id: location
        });
        let Location = company.locations.officeName

        let responseData = await Preregister.updateOne({
            _id: req.params.id
        }, {
            $set: {
                fullName,
                companyName,
                dateOfVisit,
                dateOut,
                locationId: location,
                location: Location,
                HostName,
                phoneNumber,
                // userId:userId
            }
        })
        const response = await Preregister.findOne({
            _id: req.params.id
        })
        res.status(200).json({
            error: false,
            message: "Visitor Updated Successfully",
            responseData
        })
    } catch (err) {
        next(err)
    }
}

const remainingPreregisterLogout = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        const data = await Preregister.find({
            userId,
            logoutTime: {
                $exists: false
            }
        });
        res.status(200).json({
            error: false,
            data
        })
    } catch (err) {
        next(err)
    }
}


const deletePreregister = async(req, res, next) => {
    try {
        const userId = await getUserToken(req);
        await Preregister.deleteOne({
            _id: req.params.id,
            userId
        });
        res.status(200).json({
            error: false,
            message: "Deleted"
        });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    addNewVisitor,
    getPreregisterVisitor,
    getPreregisterVisitorById,
    remainingPreregisterLogout,
    editPreregisterData,
    deletePreregister
}