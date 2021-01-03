require('dotenv').config(); // don't forget to require dotenv

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const {
    homeRouter,
    userRouter,

} = require("./routers")
const {
    requireLogin
} = require('./auth');
const {
    layout
} = require('./utils');

const app = express();
const server = http.createServer(app);

const PORT = 3000;
const HOST = 'localhost';

const logger = morgan('tiny');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(session({
    store: new FileStore(), // no options for now
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(logger);

app.get("/", homeRouter)
app.use('/users', userRouter);
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('LOGOUT!');
        // after deleting the session...
        res.redirect('/users/login');
    });
});


app.get('/members-only', requireLogin, (req, res) => {
    res.render("restricted", {
        ...layout,
        locals: {
            title: `JUNK`
        }
    })
})

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});