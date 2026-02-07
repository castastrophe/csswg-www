let timer1, timer2;

function openMenuItem(menuItem, timer) {
    menuItem.classList.add("open");
    clearTimeout(timer);
}

function closeMenuItem() {
    // todo: should this be a look-up the event that fired this instead of a global document search?
    let openItem = document.querySelector(".has-submenu.open");
    if (!openItem) return;

    openItem.classList.remove("open");
    openItem.querySelector("a").setAttribute("aria-expanded", "false");
}

[...document.querySelectorAll("li.has-submenu")].forEach(function (menuItem) {
    menuItem.addEventListener("mouseover", () => {
        openMenuItem(menuItem, timer1);
    });

    menuItem.addEventListener("mouseout", () => {
        timer1 = setTimeout(() => {
            closeMenuItem();
        }, 1e3);
    });

    [...menuItem.querySelectorAll("a")].forEach(function (link) {
        link.addEventListener("focus", () => {
            openMenuItem(menuItem, timer2);
        });

        link.addEventListener("blur", () => {
            timer2 = setTimeout(() => {
                closeMenuItem();
            }, 10);
        });
    });
});