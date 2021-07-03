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

let tourPart = 1;
let tourLength = 8;

function toggleTutorial() {
    if (tapTarget.isOpen) {
        tapTarget.close();
        tapTarget.destroy();
    }
    else {
        tapTarget.open();
    }
}

function closeTour() {
    const tourLayout = document.getElementsByClassName("tour-layout");
    const nextBtn = document.getElementById("btnTourNext");
    tourLayout[0].style.display = "none";
    nextBtn.innerHTML = "Next";
    tourPart = 1;
    tabs.select("filterTab");
}

function startTour() {
    toggleTutorial();
    const tourLayout = document.getElementsByClassName("tour-layout");
    tourLayout[0].style.display = "block"
    tour();
}

function changeCssTop(htmlElement, value) {
    htmlElement.style.top = `${value}px`;
}

function changeCssLeft(htmlElement, value) {
    htmlElement.style.left = `${value}px`;
}

function setTourPages() {
    const tourPages = document.getElementById("tourPages");
    tourPages.innerHTML = `${tourPart} / ${tourLength}`
}

function changeHighlightedElement(width, height, top, left) {
    const element = document.getElementById("highlightedElement");
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
}

function changeTourArrowStyle(htmlElement, top, left, rotate, display) {
    htmlElement.style.setProperty("--tut-pseudo-transform", `rotate(${rotate}deg)`);
    htmlElement.style.setProperty("--tut-pseudo-top", `${top}px`);
    htmlElement.style.setProperty("--tut-pseudo-left", `${left}px`);
    htmlElement.style.setProperty("--tut-pseudo-display", display);
}

function changeTourBoxHeader(text) {
    const header = document.getElementsByClassName("tour-box-header")[0];
    header.innerHTML = text;
}

function changeTourBoxText(text) {
    const pText = document.getElementsByClassName("tour-box-text")[0];
    pText.innerHTML = text;
}


function changeTourImage(imgPath) {
    document.getElementById('tour-img').src = 'img/tour/'+imgPath;

}

function changeTourText(val) {
    document.getElementById('tour-box-text').innerText = tourText[val];
}

function tour(clickedBtnId) {
    const tourBox = document.getElementById("tourBox");
    const backBtn = document.getElementById("btnTourBack");
    const nextBtn = document.getElementById("btnTourNext");

    if(window.innerWidth != 1920 && window.innerHeight !=1080) {
        alert("Screen size needs to be 1920 x 1080 to start tutorial.");
        closeTour();
    }

    if(clickedBtnId === "btnTourNext") {
        tourPart++;
    } else if(clickedBtnId === "btnTourBack") {
        tourPart--;
    }

    switch (tourPart) {
        case 1:
            changeCssTop(tourBox, 100);
            changeCssLeft(tourBox, 600);
            changeTourBoxHeader("Create Applications");
            changeHighlightedElement(155, 40, 50, 580);
            changeTourArrowStyle(tourBox, -12, 25, 0, "block");
            changeTourImage('node.png')
            changeTourText('create');
            backBtn.disabled = true;
            setTourPages();
            break;
        case 2:
            backBtn.disabled = false;
            changeCssTop(tourBox, 400);
            changeCssLeft(tourBox, 600);
            changeTourBoxHeader("Connect Applications");
            changeHighlightedElement(1536, 819, 90, 0);
            changeTourArrowStyle(tourBox, 0, 25, 0, "none");
            changeTourImage('connect.gif');
            changeTourText('connect');
            setTourPages();
            break;
        case 3:
            changeCssTop(tourBox, 100);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Information Something");
            changeHighlightedElement(384, 410, 90, 1536);
            changeTourArrowStyle(tourBox, 30, 274, 90, "block");
            changeTourImage('click.gif');
            changeTourText('info');
            setTourPages();
            break;
        case 4:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Filter Landscape");
            changeHighlightedElement(384, 410, 500, 1536);
            changeTourImage('filter.gif');
            tabs.select("filterTab");
            changeTourText('filter');
            setTourPages();
            break;
        case 5:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Add Color");
            changeHighlightedElement(384, 410, 500, 1536);
            changeTourImage('color.gif');
            tabs.select("visualizationTab");
            changeTourText('color');
            setTourPages();
            break;
        case 6:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Create Histogram");
            changeHighlightedElement(384, 410, 500, 1536);
            changeTourImage('histogram.gif');
            tabs.select("histogramTab");
            changeTourText('histogram');
            setTourPages();
            break;
        case 7:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Create Heatmap");
            changeHighlightedElement(384, 410, 500, 1536);
            changeTourArrowStyle(tourBox, 30, 274, 90);
            changeTourImage('heatmap.png');
            changeTourText('heatmap');
            tabs.select("heatmapTab");
            setTourPages();
            nextBtn.innerHTML = "Next"
            break;
        case 8:
            changeCssTop(tourBox, 60);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Load Sample Landscape");
            changeHighlightedElement(55, 50, 0, 1445);
            changeTourArrowStyle(tourBox, -12, 220, 0);
            changeTourImage('load.png');
            changeTourText('load');
            setTourPages();
            nextBtn.innerHTML = "Finish"
            break;
        default:
            closeTour();
    }

}

tourText = {
    'create':'Create applications and specify attributes such as \'Name\', \'Description\', \'Tags\' and more for each application.',
    'connect': 'Drag an arrow from one application to another to create a connection between two. This connection can be a data flow or a business process.',
    'info': 'On the right side, if you have nothing selected, you will find some key figures for the diagram. If you select an application, you will find all the data for this application here and can also edit it. The same applies to connections.',
    'filter': 'You can create filters to display only certain applications. Filters can be applied to all possible attributes.',
    'histogram': 'Histograms can give you valuable insights into the value distribution of application attributes. In addition, graph properties can also be displayed as histograms. Small tip: A filter can be created by clicking on a bar.',
    'color': 'Applications can be colored here. You can select all possible attributes as the characteristic for coloring.',
    'heatmap': 'In the heatmap two attributes can be combined to find out how many applications there are for each combination of values.',
    'load': 'You can start by loading an example application landscape with up to 400 applications.'
}

















