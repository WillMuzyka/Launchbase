const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card');
const closeModal = document.querySelector('.close-modal');

cards.forEach(card =>
	card.addEventListener('click', () => {
		modalOverlay.classList.add('active');
		modalOverlay.querySelector('iframe').src = `https://www.youtube.com/embed/${getURL(card)}`;
	}))
closeModal.addEventListener('click', () => {
	modalOverlay.classList.remove('active');
	modalOverlay.querySelector('iframe').src = "";
});

const getURL = (card) => card.querySelector('img').src.split("/")[4];

/*
const infos = [];
cards.forEach(card => {
	infos.push([
		card.querySelector("img").src,
		card.querySelector(".card__content").innerText,
		card.querySelector(".card__info").innerText.split("\n")[0],
		card.querySelector(".card__info").innerText.split("\n")[2],
	])
}
);
console.log(JSON.stringify(infos))
*/