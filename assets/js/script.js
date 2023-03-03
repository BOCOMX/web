/*==================== PRELOADER Y LLEVAR PÁGINA ARRIBA AL RECARGAR ====================*/
window.addEventListener('load', () => {
  const centrado = document.querySelector('.centrado');
  centrado.style.opacity = 0;
  centrado.style.visibility = 'hidden';
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 250);
});

'use strict';

/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * toggle navbar
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/* ACORDION */
var acc = document.getElementsByClassName("accordion");
var i;
var currentAccordion = null;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    if (currentAccordion && currentAccordion != this) {
      currentAccordion.classList.remove("activeacordion");
      currentAccordion.nextElementSibling.style.display = "none";
    }
    this.classList.toggle("activeacordion");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
    currentAccordion = this;
  });
}
