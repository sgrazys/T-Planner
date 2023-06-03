'use strict';

// Form input fields
const scopeDOM = document.querySelector('.form__input--scope');
const deadlineDOM = document.querySelector('.form__input--deadline');
const busyDateDOM = document.querySelector('.form__input--busy__date');
const busyHoursDOM = document.querySelector('.form__input--hours');

// Elements
const headlineDOM = document.querySelector('.headline');
const dataHeaderDOM = document.querySelector('.data__header');
const listDOM = document.querySelector('.list');
const modalDOM = document.querySelector('.modal');
const overlayDOM = document.querySelector('.overlay');
const containerDataDOM = document.querySelector('.container__data');
const logoContainer = document.querySelector('.logo__container');

// Buttons
const btnAddBusyTime = document.querySelector('.btn--add');
const btnShow = document.querySelector('.btn--show');
const btnReset = document.querySelector('.btn--reset');
const btnScopeDeadline = document.querySelector('.btn--add__scope__deadline');
const btnCloseModal = document.querySelector('.btn--close-modal');

// DATA
const busyDates = []; // ATSIRANDA Pridedant busy date ir busy hours
const allDates = []; // Susigeneruoja pridedant work scope ir project deadline
const hoursInDay = 24;
const sleepingHours = 8;
const today = new Date();
let scope = 0;

// Modal functions
const closeModal = () => {
	modalDOM.classList.add('hidden');
	overlayDOM.classList.add('hidden');
};

const openModal = () => {
	modalDOM.classList.remove('hidden');
	overlayDOM.classList.remove('hidden');
};

const modalText = function (message) {
	const modaltextDOM = document.querySelector('.modal__text');
	modaltextDOM.innerHTML = message;
};

// Delete logo
function deleteLogo() {
	logoContainer.remove();
}

// Add logo
function addLogo() {
	containerDataDOM.prepend(logoContainer);
}

// Event listeners
btnScopeDeadline.addEventListener('click', function (e) {
	e.preventDefault();
	scope = +scopeDOM.value;
	const deadline = deadlineDOM.value;

	// Validation of scope
	if (scope === 0 || scope < 0) {
		modalText('Please enter valid project scope.');
		openModal();
		return;
	}

	// Validation of deadline
	if (deadline === '') {
		modalText('Please choose project deadline.');
		openModal();
		return;
	}

	// days until deadline
	const daysLeft = Math.floor(
		(new Date(deadline).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24)
	);

	if (new Date(deadline).getTime() < today.getTime()) {
		modalText('Your project deadline cannot be any previous days.');
		openModal();
		return;
	}
	for (let i = 0; i < daysLeft; i++) {
		const nextDay = new Date(today);
		nextDay.setDate(today.getDate() + 1 + i);
		const formatedDate = nextDay.toISOString().split('T')[0];

		allDates.push({
			date: formatedDate,
			freeHours: hoursInDay - sleepingHours,
			plannedHours: 0,
		});
	}

	headlineDOM.innerHTML = `<p>Project scope: ${scope} ${
		scope === 1 ? 'hour' : 'hours'
	} </p> 
	<p>Deadline: ${deadline}</p>`;
});

btnAddBusyTime.addEventListener('click', (e) => {
	e.preventDefault();
	const busyDate = busyDateDOM.value;
	const busyHour = +busyHoursDOM.value;

	// Validations
	if (busyHour > hoursInDay - sleepingHours) {
		modalText(
			"You don't have as many available hours. The maximum is 16 hours, considering that you sleep for 8 hours per day."
		);
		openModal();
		return;
	}

	if (busyDate === '') {
		modalText('Please add your busy date.');
		openModal();
		return;
	}
	if (busyHour === 0) {
		modalText(
			'Please specify the number of hours you will be busy on that day.'
		);
		openModal();
		return;
	}

	if (
		new Date(busyDateDOM.value).getTime() >
		new Date(deadlineDOM.value).getTime()
	) {
		modalText(
			'You have selected a busy date that falls after the project deadline.'
		);
		openModal();
		return;
	}

	if (
		new Date(busyDateDOM.value).getTime() ===
		new Date(deadlineDOM.value).getTime()
	) {
		modalText("You have selected the project's deadline date.");
		openModal();
		return;
	}

	if (new Date(busyDateDOM.value).getTime() < today.getTime()) {
		modalText("Oops, you can't plan history.");
		openModal();
		return;
	}

	if (allDates.length === 0) {
		modalText('Please provide the project deadline.');
		openModal();
		return;
	}

	const busy = {
		date: busyDate,
		busyHours: busyHour,
	};
	busyDates.push(busy);

	// Surasti all dates masyve sutampancias datas ir atnaujinti freeHours
	const sameDate = allDates.find((e) => e.date === busyDate);

	sameDate.freeHours > busyHour
		? (sameDate.freeHours -= busyHour)
		: (sameDate.freeHours = 0);
	// Reset values
	busyDateDOM.value = busyHoursDOM.value = '';

	// Render busy dates and hours
	const htmlHeader = `Your are busy on:`;
	dataHeaderDOM.innerHTML = htmlHeader;

	const html = `
    <li>${busyDate} for ${busyHour} ${busyHour === 1 ? 'hour' : 'hours'}</li>
    `;

	deleteLogo();
	listDOM.insertAdjacentHTML('beforeend', html);
});

btnShow.addEventListener('click', function () {
	const freeHours = allDates.reduce((t, curr) => t + curr.freeHours, 0);

	if (freeHours < scope) {
		const missingHours = scope - freeHours;
		modalText(
			`Oops, you don't have enough time to complete your project. You need an additional ${missingHours} ${
				missingHours === 1 ? 'hour' : 'hours'
			}.`
		);
		openModal();
		return;
	}

	// Share available hours per day
	scope;
	while (scope > 0) {
		for (let i = 0; i < allDates.length; i++) {
			if (allDates[i].freeHours > 0) {
				scope--;
				allDates[i].freeHours--;
				allDates[i].plannedHours++;
				if (scope === 0) break;
			}
		}
	}

	listDOM.innerHTML = '';
	// Render list
	const htmlHeader = `You daily working plan:`;
	dataHeaderDOM.innerHTML = htmlHeader;

	allDates.forEach(({ date, _, plannedHours }) => {
		let html = `<li>${plannedHours} ${
			plannedHours < 2 ? 'hour' : 'hours'
		} on ${date}</li> `;

		listDOM.insertAdjacentHTML('beforeend', html);
	});
});

btnReset.addEventListener('click', function () {
	allDates.length = 0;
	busyDates.length = 0;
	scope = 0;
	scopeDOM.value = '';
	deadlineDOM.value = '';
	dataHeaderDOM.innerHTML = '';
	listDOM.innerHTML = '';
	busyDateDOM.value = '';
	busyHoursDOM.value = '';
	headlineDOM.innerHTML = "Let's Plan Project!";
	addLogo();
});

btnCloseModal.addEventListener('click', function () {
	closeModal();
});

document.addEventListener('keydown', function (e) {
	if (
		e.key === 'Escape' &&
		!modalDOM.classList.contains('hidden') &&
		!overlayDOM.classList.contains('hidden')
	) {
		closeModal();
	}
});
