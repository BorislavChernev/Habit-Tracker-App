//SELECTORS
const habitInput = document.querySelector('.habit-input');
const habitAddButton = document.querySelector('.habit-button');
const habitList = document.querySelector('.habit-list');
const habitsFilterOptions = document.querySelector('.filter-habits');

//EVENT LISTENERS
window.addEventListener('DOMContentLoaded', getHabits);
habitAddButton.addEventListener('click', addHabit);
habitsFilterOptions.addEventListener('click', filterHabits);

//FUNCTIONS
function addHabit(e) {
	e.preventDefault();
	if (habitInput.value == '') {
		return 0;
	}

	const currentDate = getCurrentDate();

	//CREATE habitDiv
	const habitDiv = document.createElement('div');
	habitDiv.classList.add('habit');

	// [0] [0]
	const habitIconDiv = document.createElement('div');
	habitIconDiv.classList.add('flex-center');
	const imageIcon = document.createElement('img');
	imageIcon.src = './images/habit-icons/glass-of-water.png';
	imageIcon.classList.add('habit-icon');
	habitIconDiv.appendChild(imageIcon);
	habitDiv.appendChild(habitIconDiv);

	// [0] [1]
	const habitPDiv = document.createElement('div');
	habitPDiv.classList.add('habit-p');
	const p = document.createElement('p');
	p.classList.add('p');
	p.textContent = habitInput.value;
	habitPDiv.appendChild(p);
	habitDiv.appendChild(habitPDiv);

	// [0] [2]
	const div02 = document.createElement('div');
	const checkDiv = document.createElement('div');
	checkDiv.classList.add('check');
	checkDiv.classList.add('flex-center');
	const checkButton = document.createElement('button');
	checkButton.addEventListener('click', completeHabit);
	const iCheck = document.createElement('i');
	iCheck.classList.add('fas');
	iCheck.classList.add('fa-check');
	checkButton.appendChild(iCheck);
	checkDiv.appendChild(checkButton);
	habitDiv.appendChild(checkDiv);

	// [1] [0]
	const div10 = document.createElement('div');
	div10.classList.add('flex-center');
	const hotStreakDiv = document.createElement('div');
	hotStreakDiv.classList.add('hot-streak');
	hotStreakDiv.classList.add('flex-center');
	const hotStreakP = document.createElement('p');
	hotStreakP.classList.add('hot-streak-number');
	hotStreakP.textContent = 0;
	const hotStreakImage = document.createElement('img');
	hotStreakImage.classList.add('hot-streak-icon');
	hotStreakImage.src = './images/habit-icons/flame.png';
	hotStreakDiv.appendChild(hotStreakP);
	hotStreakDiv.appendChild(hotStreakImage);
	div10.appendChild(hotStreakDiv);
	habitDiv.appendChild(div10);

	// [1] [1]
	const div11 = document.createElement('div');
	div11.classList.add('current-streak');
	div11.classList.add('flex-center');
	const currentStreakDiv = document.createElement('div');
	currentStreakDiv.classList.add('flex-center');
	const currentStreakP = document.createElement('p');
	currentStreakP.classList.add('current-streak-number');
	currentStreakP.textContent = 0;
	const currentStreakImage = document.createElement('img');
	currentStreakImage.classList.add('current-streak-icon');
	currentStreakImage.src = './images/habit-icons/light-bulb.png';
	currentStreakDiv.appendChild(currentStreakP);
	currentStreakDiv.appendChild(currentStreakImage);
	div11.appendChild(currentStreakDiv);
	habitDiv.appendChild(div11);

	// [1] [2]
	const lastDiv = document.createElement('div');
	const trashDiv = document.createElement('div');
	trashDiv.classList.add('trash');
	trashDiv.classList.add('flex-center');
	const trashButton = document.createElement('button');
	const trashI = document.createElement('i');
	trashI.classList.add('fas');
	trashI.classList.add('fa-trash');
	trashButton.appendChild(trashI);
	trashButton.addEventListener('click', deleteHabit);
	trashDiv.appendChild(trashButton);
	lastDiv.appendChild(trashDiv);
	habitDiv.appendChild(lastDiv);

	habitList.appendChild(habitDiv);
	//ADD habit to localStorage

	saveLocalHabits({
		text: habitInput.value,
		currentStreak: 0,
		hotStreak: 0,
		iconLink: imageIcon.src,
		day: currentDate.subtract(1, 'days').toString(),
	});

	habitInput.value = '';
}

function completeHabit(e) {
	e.preventDefault();
	const currentDate = getCurrentDate();

	let currentStreakValue =
		e.target.parentElement.parentElement.children[4].children[0].children[0];
	let currentHotStreakValue =
		e.target.parentElement.parentElement.children[3].children[0].children[0];

	const curr = e.target;
	const currParent = curr.parentElement.parentElement;
	currParent.classList.toggle('completed-habit');
	let habits = JSON.parse(localStorage.getItem('habits'));
	let currentHabit = habits.find(
		(x) => x.text == currParent.children[1].textContent
	);

	if (currParent.classList.contains('completed-habit')) {
		if (moment(currentHabit.day).add(2, 'days').isAfter(currentDate)) {
			currentHabit.day = currentDate.toString();
			currentHabit.currentStreak++;
		} else {
			currentHabit.day = currentDate.toString();
			currentHabit.currentStreak = 1;
		}
	} else {
		if (moment(currentHabit.day).add(2, 'days').isAfter(currentDate)) {
			currentHabit.day = currentDate.subtract(1, 'days').toString();
			currentHabit.currentStreak--;
		} else {
			currentHabit.day = currentDate.toString();
			currentHabit.currentStreak = 1;
		}
	}
	if (currentHabit.hotStreak < currentHabit.currentStreak) {
		currentHabit.hotStreak = currentHabit.currentStreak;
		currentHotStreakValue.textContent = currentHabit.currentStreak;
	}
	currentStreakValue.textContent = currentHabit.currentStreak;
	localStorage.setItem('habits', JSON.stringify(habits));
}

function deleteHabit(e) {
	e.preventDefault();
	const curr = e.target;
	const currParent = curr.parentElement.parentElement.parentElement;
	currParent.classList.add('fall');
	removeLocalHabits(currParent);
	currParent.addEventListener('transitionend', function () {
		currParent.remove();
	});
}

function filterHabits(e) {
	const habits = habitList.children;
	for (let i = 0; i < habits.length; i++) {
		const habit = habits[i];
		switch (e.target.value) {
			case 'all':
				habit.style.display = 'grid';
				break;
			case 'completed-habit':
				if (habit.classList.contains('completed-habit')) {
					habit.style.display = 'grid';
				} else {
					habit.style.display = 'none';
				}
				break;
			case 'uncompleted':
				if (!habit.classList.contains('completed-habit')) {
					habit.style.display = 'grid';
				} else {
					habit.style.display = 'none';
				}
				break;
		}
	}
}

function saveLocalHabits(habit) {
	let habits = localStorageHabitsFunc();
	habits.push(habit);
	localStorage.setItem('habits', JSON.stringify(habits));
}

//GETTING Habits from the localStorage (when page reloaded)
function getHabits() {
	let habits = localStorageHabitsFunc();
	const currentDate = getCurrentDate();

	habits.forEach(function (habit) {
		//CREATE habitDiv
		const habitDiv = document.createElement('div');
		habitDiv.classList.add('habit');
		debugger;
		if (currentDate.isSame(moment(habit.day), 'day')) {
			habitDiv.classList.add('completed-habit');
		}

		// [0] [0]
		const habitIconDiv = document.createElement('div');
		habitIconDiv.classList.add('flex-center');
		const imageIcon = document.createElement('img');
		imageIcon.src = './images/habit-icons/glass-of-water.png';
		imageIcon.classList.add('habit-icon');
		habitIconDiv.appendChild(imageIcon);
		habitDiv.appendChild(habitIconDiv);

		// [0] [1]
		const habitPDiv = document.createElement('div');
		habitPDiv.classList.add('habit-p');
		const p = document.createElement('p');
		p.textContent = habit.text;
		p.classList.add('p');
		habitPDiv.appendChild(p);
		habitDiv.appendChild(habitPDiv);

		// [0] [2]
		const div02 = document.createElement('div');
		const checkDiv = document.createElement('div');
		checkDiv.classList.add('check');
		checkDiv.classList.add('flex-center');
		const checkButton = document.createElement('button');
		checkButton.addEventListener('click', completeHabit);
		const iCheck = document.createElement('i');
		iCheck.classList.add('fas');
		iCheck.classList.add('fa-check');
		checkButton.appendChild(iCheck);
		checkDiv.appendChild(checkButton);
		habitDiv.appendChild(checkDiv);

		// hotStreak div
		const div10 = document.createElement('div');
		div10.classList.add('flex-center');
		const hotStreakDiv = document.createElement('div');
		hotStreakDiv.classList.add('hot-streak');
		hotStreakDiv.classList.add('flex-center');
		const hotStreakP = document.createElement('p');
		hotStreakP.classList.add('hot-streak-number');
		hotStreakP.textContent = habit.hotStreak;
		const hotStreakImage = document.createElement('img');
		hotStreakImage.classList.add('hot-streak-icon');
		hotStreakImage.src = './images/habit-icons/flame.png';
		hotStreakDiv.appendChild(hotStreakP);
		hotStreakDiv.appendChild(hotStreakImage);
		div10.appendChild(hotStreakDiv);
		habitDiv.appendChild(div10);

		// currentStreak div
		const div11 = document.createElement('div');
		div11.classList.add('current-streak');
		div11.classList.add('flex-center');
		const currentStreakDiv = document.createElement('div');
		currentStreakDiv.classList.add('flex-center');
		const currentStreakP = document.createElement('p');
		currentStreakP.classList.add('current-streak-number');
		const currentStreakImage = document.createElement('img');
		currentStreakImage.classList.add('current-streak-icon');
		currentStreakImage.src = './images/habit-icons/light-bulb.png';
		currentStreakDiv.appendChild(currentStreakP);
		currentStreakDiv.appendChild(currentStreakImage);
		div11.appendChild(currentStreakDiv);
		habitDiv.appendChild(div11);

		// FUNCTIONALITY for currentStreak (when loading app)
		debugger;
		if (!moment(habit.day).add(2, 'days').isAfter(currentDate)) {
			habit.currentStreak = 0;
		}

		currentStreakP.textContent = habit.currentStreak;

		// [1] [2]
		const lastDiv = document.createElement('div');
		const trashDiv = document.createElement('div');
		trashDiv.classList.add('trash');
		trashDiv.classList.add('flex-center');
		const trashButton = document.createElement('button');
		const trashI = document.createElement('i');
		trashI.classList.add('fas');
		trashI.classList.add('fa-trash');
		trashButton.appendChild(trashI);
		trashButton.addEventListener('click', deleteHabit);
		trashDiv.appendChild(trashButton);
		lastDiv.appendChild(trashDiv);
		habitDiv.appendChild(lastDiv);

		habitList.appendChild(habitDiv);
	});

	localStorage.setItem('habits', JSON.stringify(habits));
}

//REMOVES current habit from local storage
function removeLocalHabits(habit) {
	let habits = localStorageHabitsFunc();
	const currHabitText = habit.children[1].textContent;
	let currentHabit = habits.find((x) => x.text === currHabitText);
	habits.splice(habits.indexOf(currentHabit), 1);
	localStorage.setItem('habits', JSON.stringify(habits));
}

//FUNCTION used for getting habits from the local storage
function localStorageHabitsFunc() {
	let habits;

	if (localStorage.getItem('habits') === null) {
		habits = [];
	} else {
		habits = JSON.parse(localStorage.getItem('habits'));
	}

	return habits;
}

function getCurrentDate() {
	return moment();
}
