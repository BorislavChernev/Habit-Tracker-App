//SELECTORS
const taskInput = document.querySelector('.task-input');
const taskAddButton = document.querySelector('.task-button');
const taskList = document.querySelector('.todo-list');
const tasksFilterOptions = document.querySelector('.filter-tasks');

const editTaskTitle = document.querySelector('.edit-title span');
const editTaskDescription = document.querySelector('.edit-description span');
const editButton = document.querySelector('.edit-button button');

//EVENT LISTENERS
window.addEventListener('DOMContentLoaded', getTasks);
taskAddButton.addEventListener('click', addTask);
tasksFilterOptions.addEventListener('click', filterTasks);

//FUNCTIONS
function addTask(e) {
	e.preventDefault();
	if (taskInput.value == '') {
		return 0;
	}

	//CREATE taskDiv
	const taskDiv = document.createElement('div');
	taskDiv.classList.add('task');

	//CREATE completeButton
	const completeButton = document.createElement('button');
	let completeIcon = document.createElement('i');
	completeIcon.classList.add('fas');
	completeIcon.classList.add('fa-check');
	completeButton.classList.add('complete-btn');
	completeButton.addEventListener('click', completeTask);
	completeButton.appendChild(completeIcon);
	taskDiv.appendChild(completeButton);

	//CREATE li
	const li = document.createElement('li');
	li.textContent = taskInput.value;
	li.classList.add('task-item');
	taskDiv.appendChild(li);

	//ADD task to localStorage
	saveLocalTasks({
		text: taskInput.value,
		completed: false,
		description: '',
	});

	//CREATE deleteButton
	const deleteButton = document.createElement('button');
	let deleteIcon = document.createElement('i');
	deleteIcon.classList.add('fas');
	deleteIcon.classList.add('fa-trash');
	deleteButton.classList.add('delete-btn');
	deleteButton.addEventListener('click', deleteTask);
	deleteButton.appendChild(deleteIcon);
	taskDiv.appendChild(deleteButton);
	taskDiv.addEventListener('click', sendToEdit);
	taskList.appendChild(taskDiv);
	taskInput.value = '';
}

function completeTask(e) {
	e.preventDefault();
	const curr = e.target;
	const currParent = curr.parentElement;
	currParent.classList.toggle('completed');
	let tasks = JSON.parse(localStorage.getItem('tasks'));
	let currentTasks = tasks.find((x) => x.text == currParent.textContent);
	currentTasks.completed = !currentTasks.completed;
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(e) {
	e.preventDefault();
	const curr = e.target;
	const currParent = curr.parentElement;
	currParent.classList.add('fall');
	removeLocalTasks(currParent);
	currParent.addEventListener('transitionend', function () {
		currParent.remove();
	});
}

function filterTasks(e) {
	const tasks = taskList.childNodes;
	tasks.forEach(function (task) {
		switch (e.target.value) {
			case 'all':
				task.style.display = 'flex';
				break;
			case 'completed':
				if (task.classList.contains('completed')) {
					task.style.display = 'flex';
				} else {
					task.style.display = 'none';
				}
				break;
			case 'uncompleted':
				if (!task.classList.contains('completed')) {
					task.style.display = 'flex';
				} else {
					task.style.display = 'none';
				}
				break;
		}
	});
}

function saveLocalTasks(task) {
	let tasks = localStorageTasksFunc();
	tasks.push(task);
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
	let tasks = localStorageTasksFunc();
	tasks.forEach(function (task) {
		const taskDiv = document.createElement('div');
		taskDiv.classList.add('task');
		if (task.completed === true) {
			taskDiv.classList.add('completed');
		}
		//create completeButton
		const completeButton = document.createElement('button');
		let completeIcon = document.createElement('i');
		completeIcon.classList.add('fas');
		completeIcon.classList.add('fa-check');
		completeButton.classList.add('complete-btn');
		completeButton.addEventListener('click', completeTask);
		completeButton.appendChild(completeIcon);
		taskDiv.appendChild(completeButton);

		//create li
		const li = document.createElement('li');
		li.textContent = task.text;
		li.classList.add('task-item');
		taskDiv.appendChild(li);

		//create deleteButton
		const deleteButton = document.createElement('button');
		let deleteIcon = document.createElement('i');
		deleteIcon.classList.add('fas');
		deleteIcon.classList.add('fa-trash');
		deleteButton.classList.add('delete-btn');
		deleteButton.addEventListener('click', deleteTask);
		deleteButton.appendChild(deleteIcon);
		taskDiv.appendChild(deleteButton);
		taskDiv.addEventListener('click', sendToEdit);

		//append to list
		taskList.appendChild(taskDiv);
	});
}

//REMOVES current task from local storage
function removeLocalTasks(task) {
	let tasks = localStorageTasksFunc();
	const currTaskText = task.children[0].textContent;
	let currentTask = tasks.find((x) => x.text === currTaskText);
	tasks.splice(tasks.indexOf(currentTask), 1);
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

//FUNCTION used for getting tasks from the local storage
function localStorageTasksFunc() {
	let tasks;

	if (localStorage.getItem('tasks') === null) {
		tasks = [];
	} else {
		tasks = JSON.parse(localStorage.getItem('tasks'));
	}

	return tasks;
}

let editListener = null;
function sendToEdit(event) {
	let tasks = localStorageTasksFunc();
	debugger;
	event.preventDefault();
	if (event.target.tagName !== 'LI') {
		return;
	}

	let text = event.target.textContent;
	editTaskTitle.textContent = text;
	editTaskDescription.textContent = tasks.find(
		(x) => x.text === event.target.textContent
	).description;
	debugger;
	//let toModify = e.target.parentElement.children[1];

	editListener = editButton.addEventListener('click', () => editIt(event), {
		once: true,
	});
}

function editIt(e) {
	debugger;
	let tasks = localStorageTasksFunc();
	let currentTask = tasks.find((x) => x.text === e.target.textContent);
	if (editTaskDescription.textContent != '') {
		currentTask.description = editTaskDescription.textContent;
	}
	e.target.textContent = editTaskTitle.textContent;
	let index = tasks.indexOf(currentTask);
	debugger;
	currentTask.text = editTaskTitle.textContent;
	if (e.target.tagName == 'LI') {
		editTaskTitle.textContent = '';
		editTaskDescription.textContent = '';
	}

	debugger;
	tasks[index] = currentTask;
	localStorage.setItem('tasks', JSON.stringify(tasks));
	editButton.removeEventListener('click', editListener);
}
