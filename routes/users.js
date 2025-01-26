const express = require('express')
const router = express.Router()  //the router have all the .get, .send, etc just like the appp


//all the router start from the /users so no need to add /users
router.get('/', (reg, res) =>{  //list all of our current user
    res.send('User List')
})
router.get('/new', (reg, res)=>{   //THIS IS A STATIC ROUTE, ALWAYS PUT ABOVE THE DYNAMIC ROUTE
    res.send('User New Form')
})

router.post('/', (req, res)=>{
    res.send('Create New User')
})

//THIS IS A DYNAMIC ROUTE
router.route("/:userId")
.get((req, res)=>{ 
    res.send(`Get User with ID ${req.params.userId}`)
})
.put((req, res)=>{  
    res.send(`Updatet User with ID ${req.params.userId}`)
})
.delete((req, res)=>{  
    res.send(`Delete User with ID ${req.params.userId}`)
})


router.get('/:userId', (req, res)=>{   //:id means userId is a dynamic var
    res.send(`Get User with ID ${req.params.userId}`)
})

router.put('/:userId', (req, res)=>{   //:id means userId is a dynamic var
    res.send(`Updatet User with ID ${req.params.userId}`)
})
router.delete('/:userId', (req, res)=>{   //:id means userId is a dynamic var
    res.send(`Delete User with ID ${req.params.userId}`)
})


module.exports = router