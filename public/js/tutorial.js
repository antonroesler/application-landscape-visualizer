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
            setTourPages();
            break;
        case 3:
            changeCssTop(tourBox, 100);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Information Something");
            changeHighlightedElement(384, 410, 90, 1536);
            changeTourArrowStyle(tourBox, 30, 274, 90, "block");
            setTourPages();
            break;
        case 4:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Filter Landscape");
            changeHighlightedElement(384, 410, 500, 1536);
            tabs.select("filterTab");
            setTourPages();
            break;
        case 5:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Add Color");
            changeHighlightedElement(384, 410, 500, 1536);
            tabs.select("visualizationTab");
            setTourPages();
            break;
        case 6:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Create Histogram");
            changeHighlightedElement(384, 410, 500, 1536);
            tabs.select("histogramTab");
            setTourPages();
            break;
        case 7:
            changeCssTop(tourBox, 500);
            changeCssLeft(tourBox, 1235);
            changeTourBoxHeader("Create Heatmap");
            changeHighlightedElement(384, 410, 500, 1536);
            changeTourArrowStyle(tourBox, 30, 274, 90);
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
            setTourPages();
            nextBtn.innerHTML = "Finish"
            break;
        default:
            closeTour();
    }

}