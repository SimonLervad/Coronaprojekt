"use strict";
import { $ } from "./modules/nQuery.js";
import { Ajax } from "./modules/Ajax.js";

const startDate = function() {
    let today = new Date();
    $("startDate").valueAsDate = today;
    $("deadline").valueAsDate = today;
    let min = new Date().toISOString().split("T")[0];
    $("deadline").setAttribute("min", min);
    $("startDate").setAttribute("min", min);
}

const init = function() {
	startDate();
}

window.addEventListener("load", init);