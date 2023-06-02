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

// Buttons
const btnAddBusyTime = document.querySelector('.btn--add');
const btnShow = document.querySelector('.btn--show');
const btnReset = document.querySelector('.btn--reset');
const btnScopeDeadline = document.querySelector('.btn--add__scope__deadline');

// DATA
const busyDates = []; // ATSIRANDA Pridedant busy date ir busy hours
const allDates = []; // Susigeneruoja pridedant work scope ir project deadline
const hoursInDay = 24;
const sleepingHours = 8;
const today = new Date();
let scope = 0;

// Event listeners
btnScopeDeadline.addEventListener('click', function (e) {
	e.preventDefault();
	scope = +scopeDOM.value;
	const deadline = deadlineDOM.value;

	// Validation of scope
	if (scope === 0) return alert('Please add valid scope of project.');
	if (scope < 0) return alert('Project scope can not be negative.');

	// Validation of deadline
	if (deadline === '') return alert('Please choose project deadline');

	// days until deadline
	const daysLeft = Math.floor(
		(new Date(deadline).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24)
	);

	if (new Date(deadline).getTime() <= today.getTime())
		return alert(
			'Your project deadline cannot be current day or previous days! '
		);

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
	if (busyHour > hoursInDay - sleepingHours)
		return alert(
			"Ouuuu nou you don't have so many available hours. Max - 16 , as you are sleeping 8 hours per day :)"
		);

	if (busyDate === '') return alert('Please add your busy date.');
	if (busyHour === 0)
		return alert('Please add your busy hours amount on that day.');

	if (
		new Date(busyDateDOM.value).getTime() >
		new Date(deadlineDOM.value).getTime()
	)
		return alert('You pick busy date after project deadline. ');
	if (
		new Date(busyDateDOM.value).getTime() ===
		new Date(deadlineDOM.value).getTime()
	)
		return alert('This is your deadline date.');
	if (new Date(busyDateDOM.value).getTime() < today.getTime())
		return alert('Ooops, you can not to plan history :)');

	if (allDates.length === 0) return alert('Please define project deadline ');

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
	// Update
	// Reset values
	busyDateDOM.value = busyHoursDOM.value = '';

	// Render busy dates and hours
	const htmlHeader = `Your are busy on:`;
	dataHeaderDOM.innerHTML = htmlHeader;

	const html = `
    <li>${busyDate} for ${busyHour} ${busyHour === 1 ? 'hour' : 'hours'}</li>
    `;

	listDOM.insertAdjacentHTML('beforeend', html);
});

btnShow.addEventListener('click', function () {
	const freeHours = allDates.reduce((t, curr) => t + curr.freeHours, 0);

	if (freeHours < scope)
		return alert(
			`Neturi pakankamai laiko uzbaigti projekto. Tau truksta ${
				scope - freeHours
			} valandu!`
		);

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
});
