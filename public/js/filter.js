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

const allFilter = [];

/**
 * Removes all filters from model.
 */
function filterOff() {
    diagram.startTransaction();
    model.nodeDataArray = modelNodeWithoutFilter;
    model.linkDataArray = modelLinkWithoutFilter;
    diagram.commitTransaction("filter removed");
}

/**
 * Reads user input from modal and creates a filter.
 */
function filterDiagramFromModal() {
    const filter = readFilterPropertiesFromSideNav();
    allFilter.push(filter);
    showFilterNames();
    applyFilter(filter);
}

/**
 * Reads the selected value from filter dropdown and applies that filter to the model.
 */
function filterDiagramFromSelect() {
    const selectedFilter = document.getElementById("filterSelect").value;
    const filters = allFilter.filter(obj => {
        return obj.name == selectedFilter
    });
    applyFilter(filters[0]);
}

/**
 * Applies a filter to the model.
 */
function applyFilter(f){
    filterAppLinks(filterAppNodes(f));
    return f;
}

/**
 * Rearranges nodeDataArray according to the filter properties
 */
function filterAppNodes(filter) {
    const filterNodeArray = model.nodeDataArray.filter(function (currentElement) {
        for (let key in filter.properties) {
            if (currentElement[key.toString()] === undefined || currentElement[key] != filter.properties[key]) {
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


/**
 * Removes all links from the linkDataArray that aren't valid.
 */
function filterAppLinks(filterNodeArray) {
    const filterLinkArray = [];
    model.linkDataArray.forEach(link => {
        if (isValidLink(link, filterNodeArray)) {
            filterLinkArray.push(link);
        }
    });
    diagram.startTransaction();
    model.linkDataArray = filterLinkArray;
    diagram.commitTransaction("filter link applied");
}

/**
 * Checks if a Link is valid - thus has a from and a to node that exists within the given node array.
 */
function isValidLink(link, nodeArray) {
    return nodeWithKeyExists(link.from, nodeArray) && nodeWithKeyExists(link.to, nodeArray)
}

/**
 * Checks if a node with a given key exists in a given node array.
 */
function nodeWithKeyExists(key, nodeArray) {
    let len = 0;
    nodeArray.forEach(node => {
        if (node.key === key) {
            len++;
        }
    });
    return len>0;
}


/**
 * Adds every filter's name to the 'choose filter'-dropdown select menu.
 */
function showFilterNames() {
    const select = document.getElementById("filterSelect");
    const length = select.options.length;
    for (let i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
    for (let i = 0; i < allFilter.length; i++) {
        const opt = allFilter[i].name;
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

function generateFilterElement(filter) {
    let li = document.createElement("li");
    let div = document.createElement("div");
    let a = document.createElement("a");
    let span = document.createElement("span");
    let i = document.createElement("i");

    li.setAttribute("class", "collection-item active");
    li.setAttribute("id", filter.name);
    a.setAttribute("class", "secondary-content");
    span.setAttribute("class", "new badge");
    i.setAttribute("class", "material-icons");

    li.onclick = function() {changeFilterActivation(filter.name)};
    i.onclick = function() {
        alert("Function to delete specific filter needs to be added");
        deleteFilterElementFromFilterCollection(filter.name)
    }

    div.innerHTML = filter.name;
    span.innerHTML = "Active";
    i.innerHTML = "delete";

    li.appendChild(div);
    div.appendChild(a);
    a.appendChild(span);
    a.appendChild(i);

    return li;
}

function appendFilterCollection(filterElement) {
    document.getElementById("zeroFilterElement").style.display = "none";
    const collection = document.getElementById("filterCollection");
    collection.appendChild(filterElement);
}

function changeFilterActivation(filterName) {
    const filterElement = document.getElementById(filterName);
    const activeBadge = filterElement.querySelector("span");
    // Disable filter
    if(activeBadge != null) {
        filterElement.classList.remove("active");
        activeBadge.remove();
       // Function to disable filter needs to be added
    }
    // Enable filter
    else {
        // Function to activate filter needs to be added

        let span = document.createElement("span");
        span.setAttribute("class", "new badge");
        span.innerHTML = "Active";

        filterElement.querySelector("a").appendChild(span);
        filterElement.classList.add("active");
    }

}

function deleteFilterElementFromFilterCollection(filterName) {
    const collection = document.getElementById("filterCollection");
    const filterElement = document.getElementById(filterName);
    collection.removeChild(filterElement);

    if(collection.childElementCount === 1) {
        document.getElementById("zeroFilterElement").style.display = "list-item";
    }
}