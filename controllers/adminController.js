const doctormodel = require("../models/doctorModels");
const userModel = require("../models/userModels");

// Users controller
const getAllUsersController = async (req,res) => {
    try {
        const users = await userModel.find({})

        res.status(200).send({
            success: true,
            message: "Users data list",
            data: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Fetching Users",
            error
        })
    }
};

// Doctors controller
const getAllDoctorsController = async (req,res) => {
    try {
        const doctors = await doctormodel.find({})

        res.status(200).send({
            success: true,
            message: "Doctors data list",
            data: doctors
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Fetching Doctors",
            error
        })
    }
};

// change Doctor Account Status Controller

const changeAccountStatusController = async (req,res) => {
    try {
        const {doctorId, status} = req.body
        const doctor = await doctormodel.findByIdAndUpdate(doctorId,{status})
        const user = await userModel.findOne({_id: doctor.userId})

        const notification = user.notification
        notification.push({
            type: 'doctor-account-request-updated',
            message: `your doctor account request has ${status}`,
            onclickPath: '/notification'
        })
        user.isDoctor = status === "approved" ? true : false
        await user.save()

        res.status(200).send({
            success: true,
            message: "Account status updated",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while changing status",
            error
        })
    }
}

module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController };
