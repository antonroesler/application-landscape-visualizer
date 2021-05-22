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
    model.nodeDataArray = modelWithoutFilter;
    diagram.commitTransaction("filter removed");

}


/** function to rerange model.nodeDataArray according to the filter properties */
function filterAppNodes() {
    const filter = readFilterProperties()
    filterArray = model.nodeDataArray.filter(function (currentElement) {
        for (var key in filter) {
            if (currentElement[key] === undefined || currentElement[key] != filter[key])
                return false;
        }
        return true;
    });

    if (filterArray.length === 0) {
        window.alert("there are no Nodes with this setting");
    } else {
        diagram.startTransaction();
        model.nodeDataArray = filterArray;
        diagram.commitTransaction("filter applied");
    }
}

