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
const Diagram = require('../model/Diagram')

/**
 * Saves the whole model. model must be passed in the request's body.
 */
router.post('/', async (req, res) => {
    const nodeDataArray = [];
    const linkDataArray = [];
    req.body.nodeDataArray.forEach(node => {
        const appNode = new AppNode({
            _id: node.key,
            name: node.nameProperty,
            category: node.category,
            desc: node.desc,
            tags: node.tags,
            version: node.version,
            department: node.department,
            allowedUsers: node.allowedUsers,
            license: node.license,
        });
        nodeDataArray.push(appNode)
    });
    req.body.linkDataArray.forEach(link => {
        linkDataArray.push(new Link({
            from: link.from,
            to: link.to,
            category: link.category
        }))
    });
    const diagram = new Diagram({
        name: req.body.name,
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray
    });
    try {
        const savedDiagram = await diagram.save()
        res.json(savedDiagram);

    }catch (err){
        res.json(err)
    }
})

/**
 * Get a diagram form the database. Must be specified by name.
 *
 * mongo/ABC
 *
 * to get diagram called ABC
 */
router.get('/:name', async (req, res) => {
    const name = req.params.name
    try {
        const diagram = await Diagram.findOne({name:name});
        res.json(diagram);

    }catch (err){
        res.json(err)
    }
})

router.get('/diagram/names', async (req, res) => {
    try {
        const names = [];
        const diagrams = await Diagram.find();
        diagrams.forEach(diagram => {
            names.push(diagram.name)
        })
        res.json(names);
    }catch (err){
        res.json(err)
    }
})



module.exports = router;