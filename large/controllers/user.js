const bcrypt = require('bcryptjs');
const {
    layout
} = require("../utils")

const {
    User
} = require("../models")

const newUser = (req, res) => {
    res.render('forms/create-login', {
        ...layout,
        locals: {
            title: "Create Account"
        }
    })
}

const processNewUser = async (req, res) => {

    const {
        username,
        password
    } = req.body

    if (username === "" || password === "") {
        res.redirect(`${req.baseUrl}/create`)
    } else {
        const hash = bcrypt.hashSync(password, 10)

        try {
            const newUser = await User.create({
                username,
                hash,
            })

            res.redirect("/")
        } catch (e) {
            console.log(`ERROR : ${e}`);

            res.redirect(`/`)
        }
    }
}


const processLogin = async (req, res) => {
    const {
        username,
        password
    } = req.body

    const user = await User.findOne({
        where: {
            username,
        }
    })

    if (user) {
        console.log(`PROCESSLOGIN: Valid User....processing password`);

        const isValid = bcrypt.compareSync(password, user.hash)

        if (isValid) {
            console.log(`PASSWORD IS GOOD`);

            req.session.user = {
                username: user.username,
                id: user.id,
            }

            req.session.save(() => {
                res.redirect(`/members-only`)
            })
        }
    } else {
        console.log(`NOT VALID USER`);
        res.redirect(`/`)
    }
}


const logout = (req, res) => {
    console.log(`LOGOUT`);

    req.session.destroy(() => {
        res.redirect("/")
    })
}



module.exports = {
    newUser,
    processNewUser,
    processLogin,
    logout,
}