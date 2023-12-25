const express = require("express");
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// post Doctor info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

// post update Doctor Profile
router.post('/updateProfile', authMiddleware, updateProfileController)

//POST  GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

//GET Doctor Appointments
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;