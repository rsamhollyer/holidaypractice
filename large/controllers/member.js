const {
    navLayout
} = require("../utils")
const {
    Note
} = require("../models")

const Sequelize = require("sequelize")
const Op = Sequelize.Op


const memberPage = async (req, res) => {
    const {
        username,
        id
    } = req.session.user

    if (id) {

        let notes = []
        try {
            notes = await Note.findAll({
                where: {
                    userId: id,
                }
            })
            console.log(`THIS IS NOTES`, notes);
        } catch (e) {
            console.log(`THIS IS ERROR`, e);
        }
        res.render("member-page", {
            ...navLayout,
            locals: {
                title: "Note List",
                username,
                notes,
            }
        })
    }
}


const noteForm = (req, res) => {
    res.render("forms/note-form", {
        ...navLayout,
        locals: {
            title: "New Note"
        }
    })
}

const processForm = async (req, res) => {

    const {
        title,
        content
    } = req.body

    const {
        id
    } = req.session.user

    try {
        if (title && content && id) {
            const newNote = await Note.create({
                title,
                content,
                userId: id
            })
            console.log(`NEW NOTE ITEM`, newNote);
            res.redirect(`${req.baseUrl}/`)
        } else {
            res.redirect(req.url)
        }
    } catch (e) {
        console.log(`ERROR ${e}`);
        res.redirect(`${req.baseUrl}/`)
    }
}

const showNote = async (req, res) => {

    const {
        id
    } = req.params
    try {
        if (id) {

            const note = await Note.findOne({
                where: {
                    id
                }
            })
            res.render('see-note', {
                ...navLayout,
                locals: {
                    title: note.title,
                    yournote: note.content

                }
            })

        } else {
            res.redirect("/members-only")
        }
    } catch (e) {
        console.log(`ERROR`, e);
        res.redirect("/members-only")
    }
}


const searchNotes = async (req, res) => {
    const {
        term
    } = req.query

    try {
        if (term) {

            const notes = await Note.findAll({
                where: {
                    content: {
                        [Op.like]: "%" + term + "%"
                    }
                }
            })
            console.log(`THIS IS NOTES`, notes);

            res.render("search", {
                ...navLayout,
                locals: {
                    title: 'Search Results',
                    notes,
                }
            })

        } else {
            res.redirect(`${req.baseUrl}`)
        }
    } catch (e) {
        console.log(`SEARCH ERROR`, e);
        res.redirect(`${req.baseUrl}`)
    }

}

module.exports = {
    noteForm,
    memberPage,
    processForm,
    showNote,
    searchNotes
}