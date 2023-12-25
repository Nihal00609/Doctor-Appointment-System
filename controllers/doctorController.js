const appointmentModel = require("../models/appointmentModel");
const doctormodel = require("../models/doctorModels");
const userModel = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctormodel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "Doctor Info fetch success",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Fetching Doctor details",
            error
        })
    }
}

// Update Doctor Profile
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctormodel.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(201).send({
            success: true,
            message: "Doctor Profile Updated successfully",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Updating Doctor Profile",
            error
        })
    }
}

//get single doctor
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctormodel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: "Single Doctor Info Fetched",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting Single doctor info",
            error,
        });
    }
};

// Doctor's Appointments List Controller
const doctorAppointmentsController = async (req, res) => {
    try {
      const doctor = await doctormodel.findOne({ userId: req.body.userId });
      const appointments = await appointmentModel.find({
        doctorId: doctor._id,
      });
      res.status(200).send({
        success: true,
        message: "Doctor Appointments fetch Successfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Doc Appointments",
        error,
      });
    }
  };

  // update Status Controller
  const updateStatusController = async (req, res) => {
    try {
      const { appointmentsId, status } = req.body;
      const appointments = await appointmentModel.findByIdAndUpdate(
        appointmentsId,
        { status }
      );
      const user = await userModel.findOne({ _id: appointments.userId });
      const notification = user.notification;
      notification.push({
        type: "status-updated",
        message: `your appointment has been updated ${status}`,
        onCLickPath: "/doctor-appointments",
      });
      await user.save();
      res.status(200).send({
        success: true,
        message: "Appointment Status Updated",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Update Appoitment Status",
        error,
      });
    }
  };
  

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController }