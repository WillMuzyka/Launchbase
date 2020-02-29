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