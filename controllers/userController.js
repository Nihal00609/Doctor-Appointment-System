const userModel = require("../models/userModels");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const doctormodel = require("../models/doctorModels");
const appointmentModel = require("../models/appointmentModel");

// Register callback
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({
                message: "User Already Exists",
                success: false,
            });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Register Successfully", success: true })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Register controller ${error.message}`,
        });
    }
};

//Login Callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: "User not Found", success: false })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: "Invalid Credentials", success: false })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(201).send({ message: "Login Successfully", success: true, token })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Login controller ${error.message}` })
    }
};

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: "user not found",
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "auth error",
            success: false,
            error
        })
    }
}

// Apply Doctor controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctormodel({ ...req.body, status: "pending" })
        await newDoctor.save();

        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has Applied for a Doctor`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + ' ' + newDoctor.lastName,
                onClickPath: "/admin/doctors"
            }
        })

        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully",
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while Applying for Doctor"
        })
    }
}

// Notification controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        const seenNotification = user.seenNotification
        const notification = user.notification

        seenNotification.push(...notification)
        user.notification= []
        user.seenNotification= notification
        const updatedUser = await user.save()

        res.status(200).send({
            success: true,
            message: "All Notification Marked as Read",
            data: updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting notification",
            error
        })
    }
}

// Delete Notification controller
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        user.notification= []
        user.seenNotification= []
        const updatedUser = await user.save()
        updatedUser.password = undefined

        res.status(200).send({
            success: true,
            message: "All Notification Deleted",
            data: updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting notification",
            error
        })
    }
}

// Get All Doctors controller
const getAllDoctorsContorller = async (req, res) => {
    try {
        const doctors = await doctormodel.find({status:'approved'})

        res.status(200).send({
            success: true,
            message: "Doctors Fetched Succesfully",
            data: doctors
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Getting Doctors List",
            error
        })
    }
}

//BOOK APPOINTMENT CONTROLLER
const bookAppointmnetController = async (req, res) => {
    try {
      req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
      req.body.time = moment(req.body.time, "HH:mm").toISOString();
      req.body.status = "pending";
      const newAppointment = new appointmentModel(req.body);
      await newAppointment.save();
      const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
      user.notification.push({
        type: "New-appointment-request",
        message: `A new Appointment Request from ${req.body.userInfo.name}`,
        onCLickPath: "/user/appointments",
      });
      await user.save();
      res.status(200).send({
        success: true,
        message: "Appointment Book succesfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Booking Appointment",
        error,
      });
    }
  };
  
// check booking Availability Controller
const bookingAvailabilityController = async (req, res) => {
    try {
      const date = moment(req.body.date, "DD-MM-YY").toISOString();
      const fromTime = moment(req.body.time, "HH:mm")
        .subtract(1, "hours")
        .toISOString();
      const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
      const doctorId = req.body.doctorId;
      const appointments = await appointmentModel.find({
        doctorId,
        date,
        time: {
          $gte: fromTime,
          $lte: toTime,
        },
      });
      if (appointments.length > 0) {
        return res.status(200).send({
          message: "Appointments NOT Available at this time",
          success: true,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "Appointments available",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Booking",
        error,
      });
    }
  };

  // user Appointments list Controller
  const userAppointmentsController = async (req, res) => {
    try {
      const appointments = await appointmentModel.find({
        userId: req.body.userId,
      });
      res.status(200).send({
        success: true,
        message: "Users Appointments Fetch Successfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In User Appointments",
        error,
      });
    }
  };

module.exports = { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsContorller, bookAppointmnetController, bookingAvailabilityController, userAppointmentsController };
