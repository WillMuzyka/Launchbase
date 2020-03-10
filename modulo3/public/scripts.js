const cards = document.querySelectorAll('.card');

cards.forEach(card =>
	card.addEventListener('click', () => {
		window.location.href = `video?id=${getID(card)}`;
	}))

const getID = (card) => card.querySelector('img').src.split("/")[4];

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