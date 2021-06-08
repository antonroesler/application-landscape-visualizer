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
 * Contains functions to handle all events that deal with the searchbar.
 *
 * @author Leonard Husske, Anton Roesler
 */

function searchbarInput(){
    const searchtext = document.getElementById("searchbar").value
    if (searchtext === ""){
        makeAllNodesFullOpacity()
    } else {
        model.nodeDataArray.forEach(node => {
            if (node.name.toLowerCase().startsWith(searchtext.toLowerCase())) {
                setOpacity(node, 1)
            }
            else {
                setOpacity(node)
            }
        })
    }
    setLinkOpacity()

}

/**
 * Adds the class active-s to the searchbar, which activates the transition and extends the searchbar.
 */
function toggleSearchbar() {
    const search = document.querySelector(".search");
    const input = document.querySelector("#searchbar");

    search.classList.toggle("active-s");
    input.focus();
}


/**
 * Removes the stroke on the diagram and clear the value in the input of the searchbar.
 */
function resetSearchInput() {
    document.getElementById("searchbar").value = "";
    makeAllNodesFullOpacity();
    setLinkOpacity();
}