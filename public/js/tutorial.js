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
 * Contains all functions to walk through the tutorial.
 *
 * @author Leonard Husske
 */

function toggleTutorial() {
    if (!tapTarget.isOpen) {
        tapTarget.open();
    }
    else {
        tapTarget.close();
    }
}

