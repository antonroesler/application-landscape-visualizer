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
 * Defines all routes /mongo that are used to post get and delete data from the mongoDB.
 * @author Anton Roesler
 *
 */

const express = require('express');
const router = express.Router();
const AppNode = require('../model/AppNode')
const Link = require('../model/Link')

/**
 * Route to GET pack all AppNodes in the DB.
 * Sends a list of JSON objects: [{},{}...] in the body of the http response.
 */
router.get('/node', async (req, res) => {
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
 * Sends the JSON object as it is stored in the mongoDb including the _id attribute in the body of the http response.
 */
router.post('/node', async (req, res) => {
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
 * /mongo/node/webstorm
 * to get (all) the AppNodes where name: webstorm
 *
 * Sends AppNodes as (a List of) JSON objects in the body of the response.
 */
router.get('/node/:appName', async (req, res) => {
    const appNode = await AppNode.find({name:req.params.appName})
    res.json(appNode)
})

/**
 * Route to GET a specific AppNode from the DB by its _id attribute.
 * Use
 * /mongo/node/441b
 * to get the AppNode with _id: 441b
 *
 * Sends AppNode as a JSON object in the body of the response.
 */
router.get('/node/id/:appId', async (req, res) => {
    const appNode = await AppNode.findById(req.params.appId)
    res.json(appNode)
})

/**
 * Route to DELETE a specific AppNode from the DB with a specified name. Deletes all AppNodes with that name.
 * Use
 * /mongo/node/name/webstorm
 * to delete (all) the AppNodes where name: webstorm
 *
 * Sends JSON object returned by mongoDB including number of deleted AppNodes as 'deletedCount'.
 */
router.delete('/node/name/:appName', async (req, res) => {
    const appNode = await AppNode.deleteMany(({name:req.params.appName}))
    res.json(appNode)
})

/**
 * Route to DELETE a specific AppNode from the DB ny its _id attribute.
 * /mongo/node/id/6091a
 * to delete the AppNodes where _id: 6091a
 *
 * Sends the deleted AppNode as JSON object in response body.
 */
router.delete('/node/id/:appId', async (req, res) => {
    const appNode = await AppNode.findByIdAndDelete(req.params.appId)
    res.json(appNode)
})

/**
 * Test to POST a Link
 */
router.post('/link', async (req, res) => {
    const link = new Link({
        name: "hi",
        len: 38,
        attr: {
            some: "thing",
            and: "other"
        }
    })
    const savedlink = await link.save()
    res.json(savedlink);
})

module.exports = router;