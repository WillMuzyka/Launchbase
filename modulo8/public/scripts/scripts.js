const Mask = {
	apply(input, func) {
		setTimeout(() => {
			input.value = Mask[func](input.value)
		}, 1)
	},
	formatBRL(value) {
		return new Intl.NumberFormat('pt-br', {
			style: "currency",
			currency: "BRL"
		}).format(value.replace(/\D/g, '') / 100)
	},
	cpfCnpj(value) {
		value = value.replace(/\D/g, "")
		if (value.length > 14) value = value.slice(0, -1)

		if (value.length > 11) {
			value = value
				.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5")
		} else {
			value = value
				.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4")
		}
		return value
	},
	cep(value) {
		value = value.replace(/\D/g, "")
		if (value.length > 8) value = value.slice(0, -1)
		return value.replace(/(\d{5})(\d)/, "$1-$2")
	},
}

const PhotosUpload = {
	input: "",
	preview: document.querySelector("#photos-preview"),
	uploadLimit: 6,
	files: [],
	handleFileInput(event) {
		const { files: fileList } = event.target
		PhotosUpload.input = event.target

		if (PhotosUpload.hasLimit(event)) return

		Array.from(fileList).forEach(file => {
			PhotosUpload.files.push(file)

			const reader = new FileReader()

			reader.onload = () => {
				const image = new Image()
				image.src = String(reader.result)

				const div = PhotosUpload.getContainer(image)
				PhotosUpload.preview.appendChild(div)
			}

			reader.readAsDataURL(file)
		})

		PhotosUpload.input.files = PhotosUpload.getAllFiles()
	},
	hasLimit(event) {
		const { uploadLimit, input, preview } = PhotosUpload
		const { files: fileList } = input

		if (fileList.length > uploadLimit) {
			alert(`Envie no máximo ${uploadLimit} fotos!`)
			event.preventDefault()
			return true
		}

		const photosDiv = []
		preview.childNodes.forEach(item => {
			if (item.classList && item.classList.value == "photo")
				photosDiv.push(item)
		})

		const totalPhotos = fileList.length + photosDiv.length

		if (totalPhotos > uploadLimit) {
			alert(`Você atingiu o limite de fotos!`)
			event.preventDefault()
			return true
		}

		return false
	},
	getAllFiles() {
		const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

		PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

		return dataTransfer.files
	},
	getContainer(image) {
		const div = document.createElement('div')
		div.classList.add('photo')

		div.onclick = PhotosUpload.removePhoto

		div.appendChild(image)
		div.appendChild(PhotosUpload.getRemoveButton())

		return div
	},
	getRemoveButton() {
		const button = document.createElement('i')
		button.classList.add('material-icons')
		button.innerHTML = "delete_forever"

		return button
	},
	removePhoto(event) {
		console.log("removing photo")
		const photoDiv = event.target.parentNode //<div class="photo">
		const photosArray = Array.from(PhotosUpload.preview.children)
		const index = photosArray.indexOf(photoDiv)

		PhotosUpload.files.splice(index - 1, 1)
		PhotosUpload.input.files = PhotosUpload.getAllFiles()

		photoDiv.remove()
	},
	removeOldPhoto(event) {
		const photoDiv = event.target.parentNode
		const deletedId = document.querySelector('input[name="deleted_id"]')

		deletedId.value += `${photoDiv.id},`

		photoDiv.remove()
	}
}

const ImageGallery = {
	highlight: document.querySelector('.gallery .highlight > img'),
	previews: document.querySelectorAll(".gallery-preview img"),
	setImage(event) {
		const { target } = event

		ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
		target.classList.add('active')

		ImageGallery.highlight.src = target.src
		Lightbox.image.src = target.src
	},

}

const Lightbox = {
	target: document.querySelector('.lightbox-target'),
	image: document.querySelector('.lightbox-target	img'),
	closeButton: document.querySelector('.lightbox-target	a.lightbox-close'),
	open() {
		Lightbox.target.style.opacity = 1
		Lightbox.target.style.top = 0
		Lightbox.target.style.bottom = 0
		Lightbox.closeButton.style.top = 0

	},
	close() {
		Lightbox.target.style.opacity = 0
		Lightbox.target.style.top = "-100%"
		Lightbox.target.style.bottom = "initial"
		Lightbox.closeButton.style.top = "-80px"
	}
}

const Validate = {
	apply(input, func) {
		Validate.clearErrors(input)

		let results = Validate[func](input.value)
		input.value = results.value

		if (results.error)
			Validate.displayError(input, results.error, results.focus)
	},
	displayError(input, error, focus) {
		const div = document.createElement("div")
		div.classList.add("error")
		div.innerHTML = error
		input.parentNode.appendChild(div)
		if (focus)
			input.focus()
	},
	clearErrors(input) {
		const errorDiv = input.parentElement.querySelector(".error")
		if (errorDiv)
			errorDiv.remove()
	},
	isEmail(value) {
		let error = null
		//wasdasd-asds.asdas@
		const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		if (!value.match(mailFormat))
			error = "E-mail inválido"

		return {
			error,
			value,
			focus: true
		}
	},
	isCpfCnpj(value) {
		let error = null
		const cleanValue = value.replace(/\D/g, "")

		if (cleanValue.length > 11 && cleanValue.length != 14)
			error = "CPNJ inválido"
		else if (cleanValue.length < 12 && cleanValue.length != 11)
			error = "CPF inválido"

		return {
			error,
			value,
			focus: true
		}
	},
	isCep(value) {
		let error = null
		const cleanValue = value.replace(/\D/g, "")

		if (cleanValue.length != 8)
			error = "CEP inválido"

		return {
			error,
			value,
			focus: true
		}
	},
	isFullName(value) {
		let error = null
		const nameFormat = /^\w+(\s\w+)*\s\w+$/
		if (!value.match(nameFormat))
			error = "Insira seu nome completo"

		return {
			error,
			value,
			focus: true
		}
	},
	isMatching(value) {
		let error = null
		const nameFormat = /^\w+(\s\w+)*\s\w+$/
		if (!value.match(nameFormat))
			error = "Insira seu nome completo"

		return {
			error,
			value,
			focus: false
		}
	},
}