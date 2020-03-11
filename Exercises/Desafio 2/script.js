const modalContainer = document.querySelector('.modal-container');
const closeModal = document.querySelector('.close-modal');
const fullscreenModal = document.querySelector('.fullscreen-modal');
const iframe = document.querySelector('iframe');
const courses = document.querySelectorAll('.course');

console.log(courses);

courses.forEach(course =>
	course.addEventListener('click', () => {
		link = `https://rocketseat.com.br/${course.id}`;
		iframe.src = link;
		modalContainer.classList.add('active');
	}))

closeModal.addEventListener('click', () => {
	modalContainer.classList.remove('active');
	modalContainer.querySelector('.modal').classList.remove('fullscreen');
	fullscreenModal.querySelector('i').innerHTML = 'fullscreen';
	iframe.src = null;
});

fullscreenModal.addEventListener('click', () => {
	const isFullscreen = modalContainer.querySelector('.modal').classList.contains('fullscreen');
	console.log(isFullscreen);
	if (isFullscreen) {
		modalContainer.querySelector('.modal').classList.remove('fullscreen');
		fullscreenModal.querySelector('i').innerHTML = 'fullscreen';
	} else {
		modalContainer.querySelector('.modal').classList.add('fullscreen');
		fullscreenModal.querySelector('i').innerHTML = 'fullscreen_exit';
	}
});

