/* CURRENT PAGE HIGHLIGHT */
const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for (item of menuItems) {
	currentPage.includes(item.getAttribute("href")) ? item.classList.add("active") : null
}
