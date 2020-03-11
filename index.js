const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')

const invoiceRoutes = require('./routes/invoiceRoutes')
const payslipRoutes = require('./routes/payslipRoutes')

const app = express()

// HANDLEBARS

const Handlebars = require('handlebars')
let fstFooter = 0
let scndFooter = 0 
Handlebars.registerHelper('checkIndex', function(index) {
    if(index == 30) {
      fstFooter = index
      return new Handlebars.SafeString('<div class="separator"></div><div class="grey"></div>');
    }

    if(index == 80) {
      scndFooter = index
      return new Handlebars.SafeString('<div class="separator"></div><div class="grey"></div>');
    }
});

Handlebars.registerHelper('addFooter', function() {
  if(fstFooter == 30) {
    fstFooter = 0
    return new Handlebars.SafeString('<div class="footer-2">BANK REVOLUT<br />Account Holder WORK RULES LTD<br />Account Number: 34 53 21 96<br />Sort Code: 04-00-75<br /></div>');
  }
  return 
})

Handlebars.registerHelper('scndFooter', function() {
  if(scndFooter == 80) {
    scndFooter = 0
    return new Handlebars.SafeString('<div class="footer-3">BANK REVOLUT<br />Account Holder WORK RULES LTD<br />Account Number: 34 53 21 96<br />Sort Code: 04-00-75<br /></div>');
  }
  return 
})

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

  
// DB CONNECTION INFO

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

const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const PORT = process.env.PORT || 3001

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < 4; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    })
} else {
    app.listen(PORT) 
}
 