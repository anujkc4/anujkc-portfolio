// text changing animation

const texts = ["Anuj kc", "अनुज के.सी"];
let index = 0;
const text = document.getElementById("switch-text");

setInterval(() => {
  text.classList.add("fade-out");

  setTimeout(() => {
    index = (index + 1) % texts.length;
    text.textContent = texts[index];
    text.classList.remove("fade-out");
  }, 500);
}, 4000);

// typing animation aauxa

var typed = new Typed("#bref-intro", {
  strings: [
    " full stack-developer.",
    " web-developer.",
    " web-designer",
    " student.",
  ],
  typeSpeed: 200,
  backSpeed: 450,
  backDelay: 3000,
  loop: true,
  showCursor: true,
});

// when project and about me button are clicked then it change right part of page

const aboutme = document.getElementById("about-me");
const project = document.getElementById("project");

// Function to load new page into parent iframe
function loadpage(page) {
  const parentIframe = window.parent.document.getElementById("rightFrame");
  if (parentIframe) {
    parentIframe.src = page;
  } else {
    return false;
  }
}

aboutme.addEventListener("click", () => {
  loadpage("aboutme.html");
});

project.addEventListener("click", () => {
  loadpage("project.html");
});

// change text color while changing into diff modes (dark and light)

const heading = document.querySelector("h1");
const projectIcon = document.querySelector("#project i");
const switchingText = document.querySelector("#switch-text");
const aboutMeBTN = document.querySelector("#about-me");
window.addEventListener("message", (el) => {
  if (el.data.theme == "dark") {
    document
      .querySelectorAll("*")
      .forEach((element) => (element.style.color = "#fff"));
    aboutMeBTN.style.border = "2px solid #fff";
    project.style.color = "#000";
    projectIcon.style.color = "#000";
    project.style.backgroundColor = "#fff";
    project.style.border = "2px solid #fff";
  } else {
    document
      .querySelectorAll("*")
      .forEach((element) => (element.style.color = "#000"));
    heading.style.color = "#00c2ff";
    switchingText.style.color = "#00c2ff";
    aboutMeBTN.style.border = "2px solid #000";
    project.style.border = "2px solid #000";
    project.style.backgroundColor = "#000";
    project.style.color = "#fff";
    projectIcon.style.color = "#fff";
  }
});
