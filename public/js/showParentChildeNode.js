/*
 * Copyright (c) 2021 Ecore. All rights reserved.
 *
 * University:        Frankfurt University of Applied Sciences
 * Study program:     Engineering Business Information Systems
 * Module:            Advanced Programming 2021
 * Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
 * Date:              21.04.2021
 *
 *
 */



/**
 * This file contains all templates that will be used for different styles of
 * AppNodes. In this file we create a variable that contains a preset of a node
 * style these variables can be used in the index.js file.
 * 'templmap' is a map that contains all of our templates that we create.
 * In Index.js we declare a TemplateMap to our diagram
 * "diagram.nodeTemplateMap = templmap;" with that our nodes are able to use
 * these templates.
 * (the attribute "category" inside of the AppNode object declares which template it uses)
 *
 * @author Feng Yi Lu
 *
 */


var allParentChildKeys = new Set();
/*function finds a parent of a node
 */
function findParentsOfANode(node) {
    for (parentLinks of modelLinkWithoutFilter) {
        if (parentLinks.to === node.key) {
            parentChildArrayGrew += 1;
            allParentChildKeys.add(parentLinks.from);
            parentChildLinkArray.push(parentLinks);
        }
    }
    return allParentChildKeys;
}

/*function returns the child or parent of a certain node
 */
function getParentsChildFromKey(nodeKeys) {
    parentChild = modelNodeWithoutFilter.filter(node => {
        for (keys of nodeKeys) {
            if (keys === node.key) {
                return true;
            }
        }
        return false

    })
    return parentChild;
}

/*function finds a child of a node
 */
function findChildsofANode(node) {
    for (childLinks of modelLinkWithoutFilter) {
        if (childLinks.from === node.key) {
            parentChildArrayGrew += 1;
            allParentChildKeys.add(childLinks.to);
            parentChildLinkArray.push(childLinks);
        }
    }
    return allParentChildKeys;
}



function showAllChildren(node) {
    children = Array.from(findParentsOfANode(node));
    for (length of test) {
        for (cNode of children) {
            findParentsOfANode(cNode).forEach(childrenNode => {
                children.push(childrenNode);
            })
        }
    }
    c = new Set(parent);
    return Array.from(c);
}