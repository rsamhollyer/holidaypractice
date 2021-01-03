const bcrypt = require('bcryptjs');

const {
    layout
} = require('../utils')

const {
    User
} = require('../models');

const newUser = (req, res) => {
    res.render('login-form', {
        locals: {
            title: 'Sign up'
        },
        ...layout
    });
};

const processNewUser = async (req, res) => {
    const {
        username,
        password
    } = req.body
    console.log(`PROCESSNEWUSER, ${username} - ${password}`);
    if (username === "" || password === "") {
        console.log(`PROCESSNEWUSER NAME OR PW BLANK`, req.baseUrl);
        res.redirect(`${req.baseUrl}/new`)
    } else {
        // const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync());
        try {
            const newUser = await User.create({
                username,
                hash,
            })
            res.redirect(`${req.baseUrl}/login`)
        } catch (e) {
            console.log(`PNU : You have an error: ${e.name}`);
            if (e.name === SequelizeUniqueConstraintError) {

            }
            res.redirect(`${req.baseUrl}/new`)
        }
    }
}

const login = (req, res) => {
    res.render("login-form", {
        ...layout,
        locals: {
            title: `Login`,
        }
    })
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
        res.redirect(`${req.baseUrl}/login`)
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
    login,
    processLogin,
    logout
};