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
    formatNodeDataArray(req, nodeDataArray);
    formatLinkDataArray(req, linkDataArray);
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

/**
 * Deletes a diagram form the database. Must be specified by name.
 *
 * mongo/ABC
 *
 * to delete the diagram called ABC
 */
router.delete('/:name', async (req, res) => {
    const name = req.params.name
    try {
        const diagram = await Diagram.deleteMany({name:name});
        res.json(diagram);

    }catch (err){
        res.json(err)
    }
})

/**
 * Get names of all diagrams stored in the database.
 */
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

/**
 * Get names of all departments of all nodes stored in the database
 *
 * /mongo/XYZDiagram/departments
 *
 * to get all departments that are part of any AppNode in the diagram called 'XYZDiagram'.
 */
router.get('/:diagramName/departments', async (req, res) => {
    const name = req.params.diagramName
    try {
        const departments = new Set();
        const diagram = await Diagram.findOne({name:name});
        diagram.nodeDataArray.forEach(node => {
            if (node.department){
                node.department.forEach(dep => departments.add(dep))
            }
        })
        res.json(Array.from(departments));
    }catch (err){
        res.json(err)
    }
})

/*
 * UTIL FUNCTIONS
 */
function formatNodeDataArray(req, nodeDataArray) {
    req.body.nodeDataArray.forEach(node => {
        const appNode = new AppNode({
            _id: node.key,
            name: node.nameProperty,
            category: node.category,
            desc: node.desc,
            tags: node.tags,
            version: node.version,
            department: node.departments,
            license: node.license,
            startDate: node.startDate,
            shutdownDate: node.shutdownDate,
            profOwner: node.profOwner,
            techOwner: node.techOwner,
            loc: node.loc,
        });
        nodeDataArray.push(appNode)
    });
}

function formatLinkDataArray(req, linkDataArray) {
    req.body.linkDataArray.forEach(link => {
        linkDataArray.push(new Link({
            from: link.from,
            to: link.to,
            category: link.category
        }))
    });
}



/**
 * Export Routes.
 */
module.exports = router;