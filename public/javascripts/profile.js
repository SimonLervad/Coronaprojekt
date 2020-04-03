"use strict";
import { $ } from "./modules/nQuery.js";
import { Ajax } from "./modules/Ajax.js";

 const adminPanel = function (ev) { //country
    let req = Object.create(Ajax);
    req.init();
    req.getFile(`/admin`, showAdmin);
};

const showAdmin = function (e) {
    console.log(e.target.getResponseHeader("Content-Type"));
    let menu = $("profile-menu");
    let session = JSON.parse(e.target.responseText);
    console.log(session);
    console.log(session.user.admin);
    if (session.user.admin) {
    	let link = document.createElement("A");
    	link.setAttribute("href", "/adminPanel");
    	link.innerHTML = "admin panel";
    	menu.appendChild(link);
    }
}

const init = function() {
	adminPanel();
}

window.addEventListener("load", init);