/* DELETE CONFIRMATION */
const formDelete = document.querySelector("#formDelete")
const formDeleteUser = document.querySelector(".user-dashboard #formDelete")

if (formDeleteUser) {
	formDeleteUser.addEventListener("submit", (event) => {
		confirm("Você deseja realmente deletar sua conta? Essa operação não poderá ser desfeita!") ? null : event.preventDefault()
	})
} else {
	formDelete.addEventListener("submit", (event) => {
		confirm("Você deseja realmente deletar?") ? null : event.preventDefault()
	})
}