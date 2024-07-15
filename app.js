const express= require('express')
const path = require('path')
const app = express()
const userModel = require('./models/user')

app.set('view engine','ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.get('/' , (req,res)=>{
    res.render('index')
})

//To view all users on read.ejs page :
app.get('/read' , async (req,res)=>{

    allUsers = await userModel.find()
    res.render('read', {allUsers : allUsers})
})

//To create a document in MongoDB user database :
app.post('/create' ,async (req , res)=>{

    let newUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        image: req.body.imageUrl
    })
    console.log('Created User : ', newUser)

    res.redirect('/read')               // redirects to read.ejs page to view created user
})

// To delete the user from database
app.get('/delete/:userId' ,async (req, res)=>{

    let deletedUser = await userModel.findOneAndDelete({_id: req.params.userId })
    console.log('Deleted User : ', deletedUser)

    res.redirect('/read')
})

// To edited the details of requested user, it renders a new page for editing the details of requested users
app.get('/edit/:userId' , async (req, res)=>{

    let toBeEdit = await userModel.findOne({ _id: req.params.userId })   
    res.render('edit' , {toBeEdit: toBeEdit })
})

// Getting the edited details of user in POST request and updating it in database.
app.post('/update/:userId', async (req, res)=>{

    console.log('------',req.params.userId )

    let editedUser = await userModel.findOneAndUpdate(
        { _id : req.params.userId } , 
        { name: req.body.name , email: req.body.email , image: req.body.imageUrl } , 
        { new:true }
    )
    console.log('Edited User : ', editedUser)
    res.redirect('/read') 

})

app.listen(3000, ()=>{
    console.log('server running on port 3000...')
})