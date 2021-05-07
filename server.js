/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:		 Frankfurt University of Applied Sciences
* Study program:	 Engineering Business Information Systems
* Module:		     Advanced Programming 2021
* Professor:		 Prof. Dr. Jung, Prof. Dr. Bremm
* Date:			     03.05.2021
*
*/

/**
 * Defines the node.js server.
 * @author Anton Roesler, Leonard Husske
 *
 */

/**
 * Required External Modules
 */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require("cors");
require('dotenv/config')

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || '8000';


/**
 *  App Configuration
 */

app.use(express.static('public')) // set the static files location
app.use(bodyParser.json())
app.use(cors()) // Need to use cors to make API requests due to CORS-policy
/**
 * Routes Definitions
 */

app.get('/', (req, res) => {
  res.sendFile('./public/index.html');
});

// Import routes
const mongoRoute = require('./routes/mongo')
app.use('/mongo', mongoRoute)

/**
 * Database
 */
mongoose.connect(
    process.env.DB_CONNECTION, {useNewUrlParser: true}, err =>{
        if (err===null) {
            console.log('Connected to DB')
        }
        else{
            console.error('Failed to connect to DB. Check your credentials in .env')
        }
    }
)

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

