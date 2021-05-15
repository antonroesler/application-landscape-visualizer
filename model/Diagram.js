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
 * @author Anton Roesler
 */

const mongoose = require('mongoose')
const AppNode = require('./AppNode').schema
const Link = require('./Link').schema

var Schema = mongoose.Schema;

const Diagram = new Schema({
    nodeDataArray: [AppNode],
    linkDataArray: [Link]
});


module.exports = mongoose.model('Diagram', Diagram)
