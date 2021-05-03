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
 * Defines all routes /mongo that are used to post and get data from the mongoDB.
 * @author Anton Roesler
 *
 */

const express = require('express');
const router = express.Router();
const AppNode = require('../model/AppNode')

/**
 * Route to GET pack all AppNodes in the DB.
 * Returns a list of JSON objects: [{},{}...]
 */
router.get('/', async (req, res) => {
    try {
        const appNodes = await AppNode.find();
        res.json(appNodes);
    }catch (err){
        res.json(err);
    }
});

/**
 * Route to POST a new AppNode to the DB.
 * Requires a AppNode as JSON object where at least the name is specified.
 *
 * Returns the JSON object as it is stored in the mongoDb including the _id attribute.
 */
router.post('/', async (req, res) => {
    const appNode = new AppNode({
        name: req.body.name,
        category: req.body.category,
        metadata: {
            version: req.body.metadata.version,
            license: req.body.metadata.license
        }
    });
    try {
        const savedAppNode = await appNode.save()
        res.json(savedAppNode);

    }catch (err){
        res.json(err)
    }
})

/**
 * Route to GET a specific AppNode from the DB with a specified name. Returns all AppNodes with that name.
 * Use
 * /mongo/webstorm
 * to get (all) the AppNodes where name: webstorm
 *
 * Returns AppNodes as (a List of) JSON objects in the body of the response.
 */
router.get('/:appName', async (req, res) => {
    const appNode = await AppNode.find({name:req.params.appName})
    res.json(appNode)
})

module.exports = router;