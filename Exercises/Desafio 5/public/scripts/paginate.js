const pagination = document.querySelector(".pagination")
const total = +pagination.dataset.total
const page = +pagination.dataset.page
const filter = pagination.dataset.filter

paginate = (page, total) => {
	if (total == 1) return
	//if it's bigger than 1, it will always start as:
	let pages = [1, 2]

	//if the current page is 6, it will not have ... but "3"
	if (page == 6) pages.push(3)
	else if (page > 6) pages.push("...")

	//2 numbers up and down the current page
	for (i = -2; i <= 2; i++) {
		const nextPush = page + i
		if (nextPush > 2 && nextPush < total - 1) pages.push(nextPush)
	}

	//similar to 6, but near the end
	if (page == total - 5) pages.push(total - 2)
	else if (page < total - 5) pages.push("...")

	//to add the last numbers just if it's big enough
	//without this could happen an array as [1, 2, 1, 2]
	if (total > 3) pages.push(total - 1, total)
	else if (total > 2) pages.push(total)
	return pages
}

let filterHref = ""
if (filter) filterHref = `filter=${filter}&`
let elements = ""
for (pageNum of paginate(page, total)) {
	if (String(pageNum).includes("...")) elements += `<span>${pageNum}</span>`
	else {
		if (pageNum == page) elements += `<a class="active" href="?${filterHref}page=${pageNum}">${pageNum}</a>`
		else elements += `<a href="?${filterHref}page=${pageNum}">${pageNum}</a>`
	}
}
pagination.innerHTML = elements