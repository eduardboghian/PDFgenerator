const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const { generatePayslipPDF } = require('./util')

const invoiceRoutes = require('./routes/invoiceRoutes')
const payslipRoutes = require('./routes/payslipRoutes')

const app = express()

// MIDDLEWARE

app.use(express.static(path.resolve('./public')))
app.use('/public', express.static(path.resolve('./public')))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
dotenv.config()
app.use('/api', invoiceRoutes)
app.use('/api', payslipRoutes)

  
// DB CONNECTION 

mongoose.connect(
    process.env.DB_CONNECT,  
    { useNewUrlParser: true, useUnifiedTopology: true  },
    console.log('connected to db...')
)



// BUILD THE CLIENT SIDE 

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

// PORT

const PORT = process.env.PORT || 3001
app.listen(PORT)  