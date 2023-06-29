const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const User = require('./UserModel')
const Exercise = require('./ExerciseModel')
const mongoose = require('mongoose')
require('dotenv').config()


app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

/* DB */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  /* get user by id */
  const { _id } = req.params
  const user = await User.findById({ _id })
  console.log(`User: ${user}`)
  const username = user.username

  /* get data from body */
  const { description, duration } = req.body
  let date
  if(req.body.date === '' || !req.body.date) {
    date = new Date()
  } else {
    date = req.body.date
  }

  /* post exericse */
  try {
    const exercises = await Exercise.create({
      username,
      description,
      duration,
      date,
      userId: _id
    })
    res.json({
      _id,
      username: exercises.username,
      description: exercises.description,
      duration: exercises.duration,
      date: new Date(exercises.date).toDateString(),
    })
  } catch (err) {
    console.log(err)
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query
  const { _id } = req.params

  let dateObj = {}
  if(from) {
    dateObj['$gte'] = new Date(from)
  }
  if(to) {
    dateObj['$lte'] = new Date(to)
  }

  const filter = {
    userId: _id
  }

  if(from || to) {
    filter.date = dateObj
  }
  
  try {
    /* get exercises */
    const exercises = await Exercise.find(filter).limit(limit ? parseInt(limit) : 500)
    const log = []
    exercises.map(val => {
      log.push({
        description: val.description,
        duration: val.duration,
        date: new Date(val.date).toDateString()
      })  
    })
    console.log(log)
    const count = exercises.length
    res.json({
      username: exercises[0].username,
      count,
      _id,
      log
    })
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/users', async (req, res) => {
  const { username } = req.body
  try {
    const user = await User.create({
      username
    })
    res.json(user)
  } catch (err) {
    console.log(err)
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (err) {
    console.log(err) 
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
