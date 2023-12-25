const express = require("express")
const { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsContorller, bookAppointmnetController, bookingAvailabilityController, userAppointmentsController } = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")

// router object
const router = express.Router()

// routes
// Login || POST
router.post('/login', loginController)

// Register || POST
router.post('/register', registerController)

// Auth || POST
router.post('/getUserData', authMiddleware, authController)

// Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController)

// Notification Doctor || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController)

// Notification Doctor || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController)

// Get All Doctors list ||GET
router.get('/getAllDoctors', authMiddleware, getAllDoctorsContorller)

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmnetController);

//Booking Availability
router.post("/booking-availability", authMiddleware, bookingAvailabilityController);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports= router;