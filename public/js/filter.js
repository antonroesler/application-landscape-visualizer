/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              21.04.2021
*
*/

/**
 * Contains all functions that are used to filter the diagram.
 *
 * @author Leonard Hußke , Feng Yi Lu, Anton Roesler
 */

/** function to remove filter */
function filterOff() {
    diagram.startTransaction();
    model.nodeDataArray = modelNodeWithoutFilter;
    model.linkDataArray = modelLinkWithoutFilter;
    diagram.commitTransaction("filter removed");

}

function filterDiagram() {
    filterAppLinks(filterAppNodes());
}


/** function to rerange model.nodeDataArray according to the filter properties */
function filterAppNodes() {
    const filter = readFilterProperties()
    filterNodeArray = model.nodeDataArray.filter(function (currentElement) {
        for (var key in filter) {
            if (currentElement[key] === undefined || currentElement[key] != filter[key])
                return false;
        }
        return true;
    });

    if (filterNodeArray.length === 0) {
        window.alert("there are no Nodes with this setting");
        return null;
    } else {
        diagram.startTransaction();
        model.nodeDataArray = filterNodeArray;
        diagram.commitTransaction("filter node applied");
        return filterNodeArray;
    }
}


/** function to rerange model.linkDataArray according to the filter  */
function filterAppLinks(filterNodeArray) {
    filterLinkArray = [];
    filterNodeArray.forEach(node => {
        model.linkDataArray.forEach(link => {
            if (link.to === node.key) {
                if (checkLinks(link, filterNodeArray) === true) {
                    filterLinkArray.push(link);
                }
            }
        });
    });
    diagram.startTransaction();
    model.linkDataArray = filterLinkArray;
    diagram.commitTransaction("filter link applied");

}

/** function to check if every link.to that is pointing to a filtered node 
 * has a link.from that exists in the filtered nodes */
function checkLinks(link, filterNodeArray) {
    fromExists = false;
    filterNodeArray.forEach(node => {
        if (link.from === node.key) {
            return fromExists = true;
        }
    })
    return fromExists;
}