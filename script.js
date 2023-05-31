'use strict';

// Form input fields
const scopeDOM = document.querySelector('.form__input--scope');
const deadlineDOM = document.querySelector('.form__input--deadline');
const busyDateDOM = document.querySelector('.form__input--busy__date');
const busyHoursDOM = document.querySelector('.form__input--hours');
const dataListDOM = document.querySelector('.data__list');
const containerDataDOM = document.querySelector('.container__data');

// Buttons
const btnAdd = document.querySelector('.btn--add');
const btnShow = document.querySelector('.btn--show');
const btnReset = document.querySelector('.btn--reset');
const btnScopeDeadline = document.querySelector('.btn--add__scope__deadline');

// DATA
const busyDates = []; // ATSIRANDA Pridedant busy date ir busy hours
const allDates = []; // Susigeneruoja pridedant work scope ir project deadline
const hoursInDay = 24;
const sleepingHours = 8;
const today = new Date();
let scope;

// Event listeners
btnScopeDeadline.addEventListener('click', function (e) {
	e.preventDefault();
	scope = +scopeDOM.value;
	const deadline = deadlineDOM.value;

	// Validation of scope
	if (scope === 0) return alert('Please fill scope of project.');
	if (scope < 0) return alert('Project scope can not be negative.');

	// Validation of deadline
	if (deadline === '') return alert('Please choose project deadline');

	// days until deadline
	const daysLeft = Math.floor(
		(new Date(deadline).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24)
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

	console.log(allDates);
});

btnAdd.addEventListener('click', (e) => {
	e.preventDefault();
	const busyDate = busyDateDOM.value;
	const busyHour = +busyHoursDOM.value;

	// Validation of reserverd hours
	if (busyHour > hoursInDay)
		return alert('Ouuuu nou there are no so many hours in a day! Only 24');

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
	console.log(allDates);
	// Update
	// Reset values
	busyDateDOM.value = busyHoursDOM.value = '';

	// Render busy dates and hours
	const html = `
    <li>${busyDate} for ${busyHour} ${busyHour === 1 ? 'hour' : 'hours'}</li>
    `;

	dataListDOM.insertAdjacentHTML('beforeend', html);
});

btnShow.addEventListener('click', function () {
	const freeHours = allDates.reduce((t, curr) => t + curr.freeHours, 0);
	console.log(freeHours);

	if (freeHours < scope)
		return alert(
			`Neturi pakankamai laiko uzbaigti projekto. Tau truksta ${
				scope - freeHours
			} valandu!`
		);

	containerDataDOM.innerHTML = '';

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

	// Render list
	allDates.forEach(({ date, _, plannedHours }) => {
		let html = `<li>You should spent ${plannedHours} ${
			plannedHours === 1 ? 'hour' : 'hours'
		} on ${date}</li> `;

		containerDataDOM.insertAdjacentHTML('beforeend', html);
	});
});
