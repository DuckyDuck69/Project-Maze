const express = require('express')
const app = express()

app.get('/', (req, res) =>{ //(request, respond, next) but next is ignored
    console.log('Here')
    res.render()
    //res.download('server.js')
    //res.status(500).json({message: "Error"})   //send json code directly
    //res.sendStatus(500)
    // res.send('Hi')  //send the repond to the user, great for testing but not real practice
}) 

app.listen(3000) //set up port number, which is port 3000 now