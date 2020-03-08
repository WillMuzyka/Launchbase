const courses = document.querySelectorAll('.course');
const priceList = document.querySelector('.price__link');
const coursesGroup = document.querySelector('.courses');



coursesGroup.classList.contains('isSingleCourse') ? (
	priceList.href = priceList.classList[1],
	priceList.classList.remove(priceList.classList[1]),
	priceList.classList.add('show')
) : (
		courses.forEach(course => {
			course.addEventListener('click', () => {
				window.location.href = `/courses/${course.id}`;
			})
		}))
