const express = require("express")
const router = express.Router()

const {
    userController
} = require("../controllers")

router.get("/create", userController.newUser)
    .post("/create", userController.processNewUser);

router.post("/login",userController.processLogin)


router.post("/logout",userController.logout)
module.exports = router