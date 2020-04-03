"use strict";
import { $ } from "./modules/nQuery.js";
import { Ajax } from "./modules/Ajax.js";

const login = function() {
	let login = $("login");
	let loginForm = $("loginForm");
	let registrateForm = $("registrateForm");
	let registrate = $ ("registrate");
	login.addEventListener("click", function() {
		registrate.style.backgroundColor = "#f2f2f2";
		login.style.backgroundColor = "white";
		loginForm.style.display = "block";
		registrateForm.style.display = "none";
		login.style.border = "none";
		registrate.style.borderBottom = "1px solid black";
		registrate.style.borderLeft = "1px solid black";
		login.style.color = "black";
		registrate.style.color = "grey";
	});
}

const registrate = function() {
	let login = $("login");
	let loginForm = $("loginForm");
	let registrateForm = $("registrateForm");
	let registrate = $ ("registrate");
	registrate.addEventListener("click", function() {
		login.style.backgroundColor = "#f2f2f2";
		registrate.style.backgroundColor = "white";
		registrateForm.style.display = "block";
		loginForm.style.display = "none";
		registrate.style.border = "none";
		login.style.borderBottom = "1px solid black";
		login.style.borderRight = "1px solid black";
		registrate.style.color = "black";
		login.style.color = "grey";
	});
}

const init = function() {
	login();
	registrate();
}

window.addEventListener("load", init);