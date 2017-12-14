const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();
const users = require('./routes/users')
const config = require('./config/database')
const port = process.env.PORT || 8080;

// connect to database
mongoose.connect(config.database, {useMongoClient : true});
// on connection
mongoose.connection.on('connected', ()=>{
    console.log("Connected to database "+ config.database)
})
// on db error
mongoose.connection.on('error', (err) => {
    console.log('database error: '+err)
})
// cors middleware
app.use(cors());
// bodyParser middleware
app.use(bodyParser.json())
// set static folder
app.use(express.static(path.join(__dirname, 'public')))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.get('/', (req, res)=>{
    res.send('hiii')
})
app.use('/users',users);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(port, () => {
    console.log('app server started')
})