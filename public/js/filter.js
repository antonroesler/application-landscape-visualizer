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

var allFilter = [];
var appliedFilters = [];

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
    if (filter === null) {

    } else {
        allFilter.push(filter);
        appendFilterCollection(generateFilterElement(filter));
        applyFilter(filter);
    }
}


/**
 * Reads the selected value from filter dropdown and applies that filter to the model.
 */
function filterDiagramFromSelect() {
    const selectedFilter = document.getElementById("filterSelect").value;
    filters = findFilter(selectedFilter);
    applyFilter(filters[0]);
}


/**
 * Applies a filter to the model.
 */
function applyFilter(f) {
    filterNodeArray = filterAppNodes(f);
    if (filterNodeArray.length === 0) {
        window.alert("there are no Nodes with this setting");
        return null;
    } else {
        console.log(appliedFilters);
        if (appliedFilters.length === 0) {
            appliedFilters.push(f.name);
            activateFilter(filterNodeArray);
            filterAppLinks(filterNodeArray);
        } else {
            previousFilter = findFilter(appliedFilters[appliedFilters.length - 1]);
            previousFilterNodeArray = filterAppNodes(previousFilter[0]);
            andFilterArray = applyAdditionalFilter(f, previousFilterNodeArray);
            activateFilter(andFilterArray);
            filterAppLinks(andFilterArray);
        }
    }
}


/**
 * Applies a and filter when there is more than one chosen
 */
function applyAdditionalFilter(nextFilter, previousFilterNodeArray) {
    nextFilterArray = filterAppNodes(nextFilter);
    andFilterArray = previousFilterNodeArray.filter(node => nextFilterArray.includes(node));
    console.log(andFilterArray);
    if (andFilterArray.length === 0) {
        alert("there is are no nodes with this combined filter");
    } else {
        return andFilterArray;
    }

}


/**
 * Rearranges nodeDataArray according to the filter properties
 */
function filterAppNodes(filter) {
    const filterNodeArray = model.nodeDataArray.filter(function (currentElement) {
        for (let key in filter.properties) {
            var currentElementProp = currentElement[key];
            var currentFilterProps = filter.properties[key];
            if (Array.isArray(currentElementProp)) {
                for (let property of currentElementProp) {
                    if (currentFilterProps.includes(property)) {
                        return true;
                    }
                }
            } else {
                if (currentFilterProps.includes(currentElementProp)) {
                    return true;
                }
            }
        }
        return false;
    });
    return filterNodeArray;
}


/**
 * updates the diagram model
 */
function activateFilter(filterNodeArray) {
    diagram.startTransaction();
    model.nodeDataArray = filterNodeArray;
    diagram.commitTransaction("filter node applied");
    return filterNodeArray;
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
    return len > 0;
}


/**
 * Function which checks, if an filterName already exists.
 * @param enteredName
 * @return {boolean}
 */
function checkFilterNameExists(enteredName) {
    for (element of allFilter) {
        if (element.name === enteredName) {
            return true;
        } else {
            return false;
        }
    }
}
/**
 * Removes filter from already created filters inside of array "allFilters"
 */
function removeFilterFromArray(filterName) {
    allFilter = allFilter.filter(function (currentElement) {
        if (filterName !== currentElement.name) {
            return true;
        }
        return false;
    })
    console.log(allFilter);
}
/**
 * Returns a filtered array with the wanted filter
 */
function findFilter(filterName) {
    const filters = allFilter.filter(obj => {
        return obj.name === filterName;
    });
    return filters;
}


/**
 * Function which generates a filterElement (li-tag) for the given filter.
 * @param filter Filter object which contains information how the diagram should be filtered.
 * @return {HTMLLIElement} Returns an filterElement.
 */
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

    li.onclick = function (event) {
        event.stopPropagation();
        changeFilterActivation(filter.name);
    };

    i.onclick = function (event) {
        event.stopPropagation();
        deleteFilterElementFromFilterCollection(filter.name);
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


/**
 * Function which takes a filterElement (li-tag) as parameter and appends the filterElement to the filter collection.
 * @param {HTMLLIElement}filterElement Is a li-tag.
 */
function appendFilterCollection(filterElement) {
    const collection = document.getElementById("filterCollection");
    collection.appendChild(filterElement);
}


/**
 * This function checks if the filterElement for the given parameter filterName is already acitve or not.
 * If active: Deactivate.
 * If deactivated: Activate.
 * @param filterName Is a string which identifies the filterElement.
 */
function changeFilterActivation(filterName) {
    const filterElement = document.getElementById(filterName);
    const activeBadge = filterElement.querySelector("span");
    // Disable filter
    if (activeBadge != null) {
        filterElement.classList.remove("active");
        activeBadge.remove();
        appliedFilters = [];
        filterOff();
        // Function to disable filter needs to be added
    }
    // Enable filter
    else {
        // Function to activate filter needs to be added
        filters = findFilter(filterName);
        applyFilter(filters[0]);

        let span = document.createElement("span");
        span.setAttribute("class", "new badge");
        span.innerHTML = "Active";
        filterElement.querySelector("a").appendChild(span);
        filterElement.classList.add("active");
    }
}


/**
 * Function which deletes the filterElement (li-tag) from the filter collection for the given parameter filterName.
 * @param {String} filterName Is a string which identifies the filterElement.
 */
function deleteFilterElementFromFilterCollection(filterName) {
    const collection = document.getElementById("filterCollection");
    const filterElement = document.getElementById(filterName);
    collection.removeChild(filterElement);
    filterOff();
    removeFilterFromArray(filterName);
}