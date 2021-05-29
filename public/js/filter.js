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

/* function to create a filter**/
function filterDiagram() {
    const filter = readFilterProperties();
    allFilter.push(filter);
    showFilterNames();
    filterAppLinks(filterAppNodes(filter));

}

/* function to use a created filter**/
function filterDiagramSelect() {
    const selectedFilter = document.getElementById("filterSelect").value;
    let filter = allFilter.find(obj => {
        return obj.name = selectedFilter;
    })
    filterAppLinks(filterAppNodes(filter));

}


/** function to rearrange model.nodeDataArray according to the filter properties */
function filterAppNodes(filter) {
    console.log("XXXX")
    const filterNodeArray = model.nodeDataArray.filter(function (currentElement) {
        for (let key in filter.properties) {
            console.log(key)
            console.log(filter.properties[key])
            console.log(currentElement)
            console.log(currentElement[key])
            if (currentElement[key] === undefined || currentElement[key] != filter.properties[key]) {
                return false;
            }
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


/** function to rearrange model.linkDataArray according to the filter  */
function filterAppLinks(filterNodeArray) {
    const filterLinkArray = [];
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
    let fromExists = false;
    filterNodeArray.forEach(node => {
        if (link.from === node.key) {
            return fromExists = true;
        }
    })
    return fromExists;
}


/* function to display created filters **/
function showFilterNames() {
    const select = document.getElementById("filterSelect");
    const length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
    for (let i = 0; i < allFilter.length; i++) {
        const opt = allFilter[i].filterName;
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}