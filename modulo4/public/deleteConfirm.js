/* DELETE CONFIRMATION */
const formDelete = document.querySelector("#formDelete")

formDelete.addEventListener("submit", (event) => {
	confirm("Você deseja realmente deletar?") ? null : event.preventDefault()
})
