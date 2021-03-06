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
var moreThanOneFilter = false;

/**
 * Used to add a new filter to the diagram from else where in the code. Pushes the filter to the all-Filter array,
 * applies the filter and adds it to the html.
 * @param filter
 */
function addAndApplyFilter(filter) {
    appliedFilters.push(filter.name);
    allFilter.push(filter);
    appendFilterCollection(generateFilterElement(filter));
    applyFilter(filter);
}

/**
 * Removes all filters from model.
 */
function filterOff() {
    var noDublicates = new Set(modelNodeWithoutFilter);
    moreThanOneFilter = false;
    diagram.startTransaction();
    model.nodeDataArray = Array.from(noDublicates);
    model.linkDataArray = modelLinkWithoutFilter;
    diagram.commitTransaction("filter removed");
    diagramEvent()
}

/**
 * Removes a active filter when parent child features is active.
 */
function filterOffWhenParentChildActive() {
    moreThanOneFilter = false;
    diagram.startTransaction();
    model.nodeDataArray = Array.from(diagramNodeParentChildBeforeFilterIsActive);
    model.linkDataArray = diagramLinkParentChildBeforeFilterIsActive;
    diagram.commitTransaction("filter removed");
    if (appliedFilters.length > 1) {
        diagramNodeParentChildBeforeFilterIsActive.clear();
        diagramLinkParentChildBeforeFilterIsActive = [];
    } else {
    }
}

function filterDiagramFromSidenav() {
    try {
        _filterDiagramFromSidenav();
        createToast("Filter added.", "success");
        toggleSidenav();
    } catch (e) {
        console.log(e);
        createToast(e, "fail");
    }
    diagramEvent()
}


/**
 * Reads user input from modal and creates a filter.
 */
function _filterDiagramFromSidenav() {
    const filter = readFilterPropertiesFromSideNav();

    appliedFilters.push(filter.name);
    allFilter.push(filter);
    appendFilterCollection(generateFilterElement(filter));
    applyFilter(filter);
}


/**
 * Applies a filter to the model.
 */
function applyFilter(f) {
    const filterNodeArray = filterAppNodes(f);
    if (filterNodeArray.length === 0) {
        createToast("There are no Applications with this property!", "fail");
        return false;
    } else {
        if (moreThanOneFilter === false) {
            moreThanOneFilter = true;
            activateFilter(filterNodeArray);
            filterAppLinks(filterNodeArray);
        } else {
            const previousFilter = findFilter(appliedFilters[appliedFilters.length - 1]);
            const previousFilterNodeArray = filterAppNodes(previousFilter[0]);
            const andFilterArray = applyAdditionalFilter(f, previousFilterNodeArray);
            activateFilter(andFilterArray);
            filterAppLinks(andFilterArray);
        }
        return true;
    }
}


/**
 * Applies a and filter when there is more than one chosen
 */
function applyAdditionalFilter(nextFilter, previousFilterNodeArray) {
    const nextFilterArray = filterAppNodes(nextFilter);
    const andFilterArray = previousFilterNodeArray.filter(node => nextFilterArray.includes(node));
    if (andFilterArray.length === 0) {
        alert("There is are no nodes with this combined filter!");
    } else {
        return andFilterArray;
    }

}

function applyAllFilterInAppliedFilters() {
    var noDublicates = new Set(modelNodeWithoutFilter);
    model.nodeDataArray = Array.from(noDublicates);
    model.linkDataArray = modelLinkWithoutFilter;
    applyAllFilters();
}

function applyAllFilters() {
    moreThanOneFilter = false;
    for (filterName of appliedFilters) {
        filter = findFilter(filterName);
        applyFilter(filter[0]);
    }
}

function hasProperty(filter) {
    for (let key in filter.properties) {
        if (!["shutdownDate", "startDate"].includes(key)) {
            return true;
        }
    }
    return false;
}

function isFilterWithDate(filter) {
    for (let key of Object.keys(filter.properties)) {
        if (key.endsWith("Date")) {
            return true;
        }
    }
    return false;
}

/**
 * Returns an array of all keys that do not end with 'Date'.
 * @param properties
 * @returns {*[]}
 */
function getFilterPropertiesNoDate(properties) {
    const props = [];
    for (let prop of Object.keys(properties)){
        if (!prop.endsWith("Date")){
            props.push(prop)
        }
    }
    return props;
}

/**
 * Rearranges nodeDataArray according to the filter properties
 */
function filterAppNodes(filter) {
    if (filter == undefined) return null;
    let filteredDateNodes = new Set;
    if (isFilterWithDate(filter)) {
        filteredDateNodes = filterDate(filter);
    }
    const newModelArray = model.nodeDataArray.filter(function (currentElement) {
        if (hasProperty(filter)) {
            for (let key of getFilterPropertiesNoDate(filter.properties)) {
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
        }
        return false;
    });
    return Array.from(new Set([...newModelArray, ...filteredDateNodes])); // Merge the two arrays
}


/**
 * Returns number if it's a number or false if its NaN.
 * @param number
 * @returns {boolean|*}
 */
function nConv(number) {
    if (number.isNaN) {
        return false;
    }
    return number
}

/**
 * Returns true if d1 is a bigger date than d2. Also returns true if d1 or d2 are undefined.
 * @param d1
 * @param d2
 * @returns {boolean}
 */
function isBiggerDate(d1, d2) {
    if (nConv(d1) && nConv(d2)) {
        return d1 >= d2;
    }
    return true;
}

/**
 * Returns true if d1 is smaller than d2 or if d2 is undefined. Returns false if d1 is undefined.
 * @param d1
 * @param d2
 * @returns {boolean}
 */
function isSmallerDate(d1, d2) {
    if (!d2) {
        return true;

    }
    if (nConv(d1) && nConv(d2)) {
        return d1 <= d2;
    }
    return false;
}

function isInRange(date, range) {
    return isBiggerDate(date, Date.parse(range[0])) && isSmallerDate(date, Date.parse(range[1]))
}


/**
 * Filters nodes by a date value. If a node does not have a date specified it is counted as a infinite value in the
 * future. E.g. 01.01.9999
 * @param filter
 * @returns {Set<any>}
 */
function filterDate(filter) {
    const hasValue = (element) => element.length !== 0;
    let filteredSet = new Set();
    for (let node of modelNodeWithoutFilter) {
        for (const d of ["shutdownDate", "startDate"]) {
            const cShutDown = Date.parse(node[d])
            if (filter.properties[d].some(hasValue)) {
                if (isInRange(cShutDown, filter.properties[d])) {
                    filteredSet.add(node)
                }
            }
        }
    }
    return filteredSet;
}


/**
 * updates the diagram model
 */
function activateFilter(filterNodeArray) {
    diagram.startTransaction();
    model.nodeDataArray = filterNodeArray;
    diagram.commitTransaction("filter node applied");
    diagramNodeWhenFilterIsActive = filterNodeArray;
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
    diagramLinkWhenFilterIsActive = filterLinkArray;
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
function filterNameExists(enteredName) {
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
}

/**
 * Removes filter name from array "appliedFilters"
 */
function removeAppliedFilterFromArray(filterName) {
    appliedFilters = appliedFilters.filter(function (currentElement) {
        if (filterName !== currentElement) {
            return true;
        }
        return false;
    })
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
        removeAppliedFilterFromArray(filterName);
        if (appliedFilters.length === 0) {
            if (parentChildFeatureOn === true) {
                filterOffWhenParentChildActive()
            } else {
                filterOff();
            }
        } else {
            if (parentChildFeatureOn === true) {
                filterOffWhenParentChildActive();
                applyAllFilters();
            } else {
                applyAllFilterInAppliedFilters();
            }
        }
        // Function to disable filter needs to be added
    }
    // Enable filter
    else {
        // Function to activate filter needs to be added
        if (appliedFilters.length === 0) {
            moreThanOneFilter = false;
        } else {

            moreThanOneFilter = true;
        }
        filters = findFilter(filterName);
        var check = applyFilter(filters[0]);
        if (check === true) {
            appliedFilters.push(filterName);
            let span = document.createElement("span");
            span.setAttribute("class", "new badge");
            span.innerHTML = "Active";
            filterElement.querySelector("a").appendChild(span);
            filterElement.classList.add("active");
        }
    }
}

function deactivateAllAppliedFilters() {
    moreThanOneFilter = false;
    for (filter of appliedFilters) {
        console.log(appliedFilters);
        console.log(filter);
        const filterElement = document.getElementById(filter);
        const activeBadge = filterElement.querySelector("span");
        filterElement.classList.remove("active");
        removeAppliedFilterFromArray(filter);
        activeBadge.remove();

    }
}

/**
 * Function which deletes the filterElement (li-tag) from the filter collection for the given parameter filterName.
 * @param {String} filterName Is a string which identifies the filterElement.
 */
function deleteFilterElementFromFilterCollection(filterName) {
    const collection = document.getElementById("filterCollection");
    const filterElement = document.getElementById(filterName);
    removeFilterFromArray(filterName);
    removeAppliedFilterFromArray(filterName);
    collection.removeChild(filterElement);
    if (appliedFilters.length === 0) {
        if (parentChildFeatureOn === true) {
            filterOffWhenParentChildActive()
        } else {
            filterOff();
        }
    } else {
        if (parentChildFeatureOn === true) {
            filterOffWhenParentChildActive();
            applyAllFilters();
        } else {
            applyAllFilterInAppliedFilters();
        }
    }
}

function linkHandlerWhileFilterOn() {
    model.linkDataArray.forEach(link => {
        console.log(link);
        if (modelLinkWithoutFilter.includes(link) === false) {
            modelLinkWithoutFilter.push(link);
        }
    })
}


function nodeLinkHandlerWhileFilterOn(deletedNodes) {
    modelNodeWithoutFilter = modelNodeWithoutFilter.filter(node => {
        if (deletedNodes.includes(node)) {
            return false;
        }
        return true;
    })
    modelLinkWithoutFilter = modelLinkWithoutFilter.filter(link => {
        for (node of deletedNodes) {
            if (node.key === link.from || node.key === link.to) {
                console.log(node);
                return false;
            } else {
                return true;
            }

        }
        return true;
    })
}

