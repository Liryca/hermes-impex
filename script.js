//smooth headline appearance  ..............................................................................................................

const animItems = document.querySelectorAll("._anim-items");

if (animItems.length > 0) {
  window.addEventListener("scroll", animOnScroll);

  function animOnScroll() {
    for (let index = 0; index < animItems.length; index++) {
      const animItem = animItems[index];
      const animItemHeight = animItem.offsetHeight;
      const animItemOffset = offset(animItem).top;
      const animStart = 4;

      let animItemPoint = window.innerHeight - animItemHeight / animStart;
      if (animItemHeight > window.innerHeight) {
        animItemPoint = window.innerHeight - window.innerHeight / animStart;
      }

      if (pageYOffset > animItemOffset - animItemPoint && pageYOffset < animItemOffset + animItemHeight) {
        animItem.classList.add("_active");
      } else {
        if (!animItem.classList.contains("_anim-no-hide")) {
          animItem.classList.remove("_active");
        }
      }
    }
  }
  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  setTimeout(() => {
    animOnScroll();
  }, 300);
}

// mobile burger menu..................................................................................................
const close = document.querySelector("#img");
const iconMenu = document.querySelector(".menu__hamburger");
const menuBody = document.querySelector(".menu__body");
const links = document.querySelectorAll(".menu__link");

if (iconMenu) {
  iconMenu.addEventListener("click", () => {
    iconMenu.classList.toggle("_active");
    menuBody.classList.toggle("_active");
  });
}

links.forEach((link) => {
  link.addEventListener("click", closeOnClick);
});

close.addEventListener("click", closeOnClick);

function closeOnClick() {
  menuBody.classList.remove("_active");
  iconMenu.classList.remove("_active");
}

// change style sticky header ...................................................................................

const HEADER_SCROLLED_CLASS = "header_scrolled";
const headerNode = document.querySelector(".header");
const stickyStartScroll = 20;

toggleBgHeader();
window.addEventListener("scroll", toggleBgHeader);

function toggleBgHeader() {
  if (window.scrollY >= 20 && !headerNode.classList.contains(HEADER_SCROLLED_CLASS)) {
    headerNode.classList.add(HEADER_SCROLLED_CLASS);
  } else if (window.scrollY < 20 && headerNode.classList.contains(HEADER_SCROLLED_CLASS)) {
    headerNode.classList.remove(HEADER_SCROLLED_CLASS);
  }
}

//Scroll to href........................................................................................................

const navClassName = "menu__body";
const navLinkClassName = "menu__link";
const navLinkActiveClassName = "menu__link-active";
const sectionClassName = "section";

const navNode = document.querySelector(`.${navClassName}`);
const navLinkNodes = document.querySelectorAll(`.${navLinkClassName}`);
const navActiveLinkNode = document.querySelector(`.${navLinkActiveClassName}`);
const sectionNodes = document.querySelectorAll(`.${sectionClassName}`);

console.log(navLinkClassName);

let indexActiveLink = 0;
let scrollAnimationId;
let currentScroll = window.scrollY;

changeNavActiveLink(navLinkNodes[indexActiveLink]);

navNode.addEventListener("click", (evt) => {
  evt.preventDefault();
  const linkNavNode = evt.target.closest("a");
  if (!linkNavNode) {
    return;
  }

  stopAnimationScroll();
  changeNavActiveLink(linkNavNode);

  currentScroll = window.scrollY;
  const newSectionName = linkNavNode.getAttribute("href").substring(1);
  const newSectionElement = document.getElementById(newSectionName);
  startAnimationScroll(newSectionElement.offsetTop);
});

window.addEventListener("scroll", () => {
  if (!scrollAnimationId) {
    setActiveLinkByScroll();
  }
});

function changeNavActiveLink(newNavLinkNode) {
  for (let i = 0; i < navLinkNodes.length; i++) {
    navLinkNodes[i].classList.remove(navLinkActiveClassName);
  }

  // newNavLinkNode.classList.add(navLinkActiveClassName);
}

function setActiveLinkByScroll() {
  const topSections = Array.from(sectionNodes).map((sectionNode) => sectionNode.offsetTop);

  let currentActiveIndex = 0;
  for (let i = 0; i < topSections.length; i++) {
    if (window.scrollY >= topSections[i]) {
      currentActiveIndex = i;
    }
  }

  if (indexActiveLink !== currentActiveIndex) {
    indexActiveLink = currentActiveIndex;
    changeNavActiveLink(navLinkNodes[indexActiveLink]);
  }
}

function startAnimationScroll(newScrollY) {
  const deltaScroll = newScrollY - currentScroll;

  currentScroll += deltaScroll * 0.15;
  window.scrollTo(0, currentScroll);

  if (Math.abs(deltaScroll) > 1) {
    scrollAnimationId = window.requestAnimationFrame(() => startAnimationScroll(newScrollY));
  } else {
    window.scrollTo(0, newScrollY);
    stopAnimationScroll();
  }
}

function stopAnimationScroll() {
  window.cancelAnimationFrame(scrollAnimationId);
  scrollAnimationId = undefined;
}

//send email.........................................................................................

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);
});

async function formSend(e) {
  e.preventDefault();

  let error = formValidate();
  let formData = new FormData(form);

  console.log(formData);

  if (error === 0) {
    form.classList.add("_sending");
    let response = await fetch("sendmail.php", {
      method: "POST",
      body: new FormData(form),
    });

    if (response.ok) {
      let result = await response.json();
      alert(result.message);
      form.reset();
      form.classList.remove("_sending");
    } else {
      alert("Ошибка");
      form.classList.remove("_sending");
    }
    // } else {
    // 	alert('Заполните обязательные поля');
  }
}

function formValidate() {
  let error = 0;
  let formReq = document.querySelectorAll("._req");

  for (let index = 0; index < formReq.length; index++) {
    const input = formReq[index];
    formRemoveError(input);

    if (input.classList.contains("_email")) {
      if (emailTest(input)) {
        formAddError(input);
        error++;
      }
    } else {
      if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
  }
  return error;
}

function formAddError(input) {
  input.parentElement.classList.add("_error");
  input.classList.add("_error");
}

function formRemoveError(input) {
  input.parentElement.classList.remove("_error");
  input.classList.remove("_error");
}

function emailTest(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
