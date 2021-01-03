const express = require("express")
const router = express.Router()

const {
    memberController
} = require("../controllers")

router.get("/", memberController.memberPage)
router.get("/add-note", memberController.noteForm)
    .post("/add-note", memberController.processForm)

router.get("/note/:id",memberController.showNote)
router.get("/search", memberController.searchNotes)

module.exports = router