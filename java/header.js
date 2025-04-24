// Header Animation
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 30) {
            header.classList.add("show");
        } else {
            header.classList.remove("show");
        }
    });
}); 