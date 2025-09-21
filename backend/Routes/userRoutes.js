
const express = require("express");
const router = express.Router(); 
const { registerUser,authUser,allUsers } = require("../controllers/userControllers")
const { protect } = require("../middleware/authMiddleware")

// Controllers are used for convinence not to mess up all the things in routes a seperate function is written
router.route("/").post(registerUser);
router.route("/").get(protect,allUsers)
router.post("/login",authUser)

module.exports = router; 
