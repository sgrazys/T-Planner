'use strict';

// Form input fields
const scopeDOM = document.querySelector('.form__input--scope');
const deadlineDOM = document.querySelector('.form__input--deadline');
const busyDateDOM = document.querySelector('.form__input--busy__date');
const busyHoursDOM = document.querySelector('.form__input--hours');
const dataListDOM = document.querySelector('.data__list');

// Buttons
const btnAdd = document.querySelector('.btn--add');
const btnShow = document.querySelector('.btn--show');
const btnReset = document.querySelector('.btn--reset');

// DATA
const busyDates = [];

// Event listeners
btnAdd.addEventListener('click', (e) => {
	e.preventDefault();

	const busyDate = busyDateDOM.value;
	const busyHour = +busyHoursDOM.value;

	const busy = {
		date: busyDate,
		busyHour,
	};

	busyDates.push(busy);
	busyDateDOM.value = busyHoursDOM.value = '';

	const html = `
    <li>${busyDate} for ${busyHour} hours</li>
    `;

	dataListDOM.insertAdjacentHTML('beforeend', html);
});
