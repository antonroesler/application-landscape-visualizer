/*
* Copyright (c) 2021 Ecore. All rights reserved.
*
* University:        Frankfurt University of Applied Sciences
* Study program:     Engineering Business Information Systems
* Module:            Advanced Programming 2021
* Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
* Date:              04.07.2021
*
*/

/**
 * Defines the event function, which is used to call all update functions after an event happens.
 * @author Anton Roesler
 */


/**
 * Called when an even happens. Updates the histogram, key figure info etc.
 */
function diagramEvent(){
    renderHistogramHandler();
    generateKeyFigureInfo();
    closeHeatmap();
}