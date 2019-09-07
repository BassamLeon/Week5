const express = require('express')
const {Router} = require('express')
const router = new Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const corsMiddleware = cors()
app.use(corsMiddleware)
const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)

// router.post('/messages',
// (req,res,next)=>{
//     Message.create(req.body)
//     .then(message=>res.json(message))
//     .catch(err => next(err))
// })
router.post('/messages', (req, res) => {
    console.log(req.body)
    res.json({
        message: "We received your request body!",
        
    })
    .then(task => {
        if (task) {
            return res.json(task)
        }
        return res.status(404).end()
    })
    .catch(next)
})

app.use(router)
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`port ${port} working`))
