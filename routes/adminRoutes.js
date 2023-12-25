const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require("../controllers/adminController");

const router = express.Router();

//GET METHOD || Users
router.get('/getAllUsers', authMiddleware, getAllUsersController)

//GET METHOD || Doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)

// POST METHOD || Doctor status
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)

module.exports = router;
