const http = require("http")
const express = require("express")
const morgan = require("morgan")
const es6Renderer = require("express-es6-template-engine")

const app = express()
const server = http.createServer(app);

const PORT = 3000
const HOST = "localhost"


const logger = morgan('tiny');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(logger);



app.get("/", (req, res) => {
    let coin = (Math.floor(Math.random() * 2) > 0 ? `Head` : `Tails`)
    console.log(coin);
    res.redirect(`${req.baseUrl}/${coin.toLowerCase()}`)
})

app.get("/head", (req,res)=>{
res.render("head",{
    locals:{
        coin:`Heads`
    }
})
})

app.get("/tails", (req,res)=>{
    res.render("tails",{
        locals:{
            coin:`Tails`
        }
    })
    })

server.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
})