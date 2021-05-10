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
 * Defines a schema for how AppNode objects are stored in the mongoDB.
 * @author Anton Roesler
 *
 */

const mongoose = require('mongoose')

const AppNodeSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  metadata: {
    tags: {
      type: String,
      required: false
    },
    version: {
      type: String,
      required: true
    },
    department: {
      type: list(),
      required: true
    },
    allowedUsers: {
      type: String,
      required: true
    },
    license: {
      type: String,
      required: false
    },
    language: {
      type: String,
      required: false
    }
  }
});


module.exports = mongoose.model('AppNode', AppNodeSchema)
