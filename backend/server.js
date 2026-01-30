const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const { errorHandler } = require('./middleware/errorMiddle')
const connectDB = require('./config/db')

dotenv.config()
connectDB();

const port = process.env.PORT || 8000
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use('/api/goals', require('../routes/goalRoutes'))


app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
