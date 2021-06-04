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
 * This script contains the initialization of the materialize.js elements.
 * @author Leonard Husske
 */

/**
 * Global instance fo the sidenav
 */
let sidenav;

/**
 * EventListener "DOMContentLoaded" adds the following initialization of materialize.js elements
 * right after the html document was loaded for better user experience.
 */
document.addEventListener("DOMContentLoaded", function() {

    // Initialization of department chips for createNode modal.
    const departmentChips = document.querySelectorAll("#inputDepartments");
    M.Chips.init(departmentChips, {
        placeholder: "Department",
        secondaryPlaceholder: "+tag",
    });

    // Initialization of tag chips for createNode modal.
    const tagChips = document.querySelectorAll("#inputTags");
    M.Chips.init(tagChips, {
        placeholder: "Your tag",
        secondaryPlaceholder: "+tag",
    });

    // Initialization of tabs for sidebar.
    const sidebarTabs = document.querySelector(".tabs");
    M.Tabs.init(sidebarTabs, {
        swipeable: true
    });

    // Initialization of the sidenav.
    let sidenavElement = document.querySelector('.sidenav');
    M.Sidenav.init(sidenavElement, {
        draggable: true
    });
    sidenav = M.Sidenav.getInstance(sidenavElement);

    // Initialization of the collapsible for the sidenav.
    let collapsibleElement = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibleElement, {
        accordion: false
    });
});
