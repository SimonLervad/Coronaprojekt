"use strict";
import { $ } from "./modules/nQuery.js";
import { Ajax } from "./modules/Ajax.js";

 const adminPanel = function (ev) { // ajax call for admin user panel
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
    if (session.user.admin) {           // creates a link for admin panel, if the user is admin
    	let link = document.createElement("A");
    	link.setAttribute("href", "/users/adminPanel");
    	link.innerHTML = "admin panel";
    	menu.appendChild(link);
    }
}

 const todoApp = function (ev) {    // Ajax call for todo's
    let req = Object.create(Ajax);
    req.init();
    req.getFile(`/users/todoApp`, showTodo);
};

const showTodo = function (e) {
    console.log(e.target.getResponseHeader("Content-Type"));
    let todo = JSON.parse(e.target.responseText);
    console.log(todo);
    let table = $("todoApp");
    if (todo.length === 0) {
        table.style.display = "none";
    } else {
        for (var i = 0; i < todo.length; i++) {
            let link = $("startDate" + todo[i]._id);
            link.innerHTML = todo[i].startDate.split("T")[0];
            let link2 = $("deadline" + todo[i]._id);
            link2.innerHTML = todo[i].deadline.split("T")[0];
        }
    }/*else {
        for (var i = 0; i < todo.length; i++) {
            let row = document.createElement("tr");
            let title = document.createElement("td");
            let pati = document.createElement("p");
            pati.innerHTML = todo[i].title;
            title.appendChild(pati);
            row.appendChild(title);
            let content = document.createElement("td");
            let paco = document.createElement("p");
            paco.innerHTML = todo[i].content;
            content.appendChild(paco);
            row.appendChild(content);
            let startDate = document.createElement("td");
            let past = document.createElement("p");
            past.innerHTML = todo[i].startDate.split("T")[0];
            startDate.appendChild(past);
            row.appendChild(startDate);
            let deadline = document.createElement("td");
            let pade = document.createElement("p");
            pade.innerHTML = todo[i].deadline.split("T")[0];
            deadline.appendChild(pade);
            row.appendChild(deadline);
            let priority = document.createElement("td");
            let papr = document.createElement("p");
            if (todo[i].priority === 1) {
                papr.innerHTML = "Very low";
            } else if (todo[i].priority === 2) {
                papr.innerHTML = "Low";
            } else if (todo[i].priority === 3) {
                papr.innerHTML = "Normal";
            } else if (todo[i].priority === 4) {
                papr.innerHTML = "High";
            } else {
                papr.innerHTML = "Very High";
            }
            priority.appendChild(papr);
            row.appendChild(priority);
            let complete = document.createElement("td");
            let pacom = document.createElement("p");
            pacom.innerHTML = todo[i].complete;
            complete.appendChild(pacom);
            row.appendChild(complete);
            table.appendChild(row);
        }
    }*/
}

const init = function() {
	adminPanel();
    todoApp();
}

window.addEventListener("load", init);