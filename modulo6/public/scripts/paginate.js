const pagination = document.querySelector(".pagination")
let elements = ""

paginate = (totalPages, currentPageNumber) => {
	let pages = [1]
	if (currentPageNumber == 5) pages.push(2)
	else if (currentPageNumber > 5) pages.push("...")

	for (i = -2; i <= 2; i++) {
		if (currentPageNumber + i > 1 && currentPageNumber + i < totalPages)
			pages.push(currentPageNumber + i)
	}

	if (currentPageNumber == totalPages - 4) pages.push(totalPages - 1)
	else if (currentPageNumber < totalPages - 4) pages.push("...")

	if (totalPages > 1) pages.push(totalPages)
	return pages
}

const total = +pagination.dataset.total
const page = +pagination.dataset.page
const filter = pagination.dataset.filter

let filterText = ""
if (filter) filterText = `filter=${filter}&`

const pagesArray = paginate(total, page)
if (pagesArray.length > 1) {
	for (pageNum of pagesArray) {
		if (String(pageNum).includes("...")) {
			elements += `<span>${pageNum}</span>`
		} else {
			elements += `<a href="?${filterText}page=${pageNum}">${pageNum}</a>`
		}
	}
}

pagination.innerHTML = elements