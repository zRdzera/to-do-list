/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app-logic/project.js":
/*!**********************************!*\
  !*** ./src/app-logic/project.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Project)
/* harmony export */ });
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _task_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./task.js */ "./src/app-logic/task.js");



function Project(parameter){
    let _projectId;
    let _title;
    let _listOfTasks;

    // Used to create an object based on an existent (JSON object that comes from storage to Project object)
    if(typeof parameter === 'object'){
        _projectId = `${parameter._projectId}`;
        _title = parameter._title;
        _listOfTasks = parameter._listOfTasks.map(
            task => (0,_task_js__WEBPACK_IMPORTED_MODULE_1__["default"])(task.name, task.due_date, task.description, task.priority, task.id)
        );
    }
    else {
        _projectId = (0,_storage_js__WEBPACK_IMPORTED_MODULE_0__.generateNewProjectId)(); // Generate an identifier based on the last existent project
        _title = parameter;
        _listOfTasks = [];
    }

    // Getter for projectId
    const getProjectId = () => _projectId;

    // Getter and Setter for title
    const getTitle = () => _title;
    const setTitle = (newTitle) => _title = newTitle;

    // Methods to manipulate tasks inside a Project 
    const getAllTasks = () => _listOfTasks;
    const getTaskById = (taskIndex) => _listOfTasks.find(task => task.getTaskId() === taskIndex);
    const addTaskToProject = (task) => _listOfTasks.push(task);
    const removeTaskFromProject = (taskId) => {
        _listOfTasks = _listOfTasks.filter(task => task.getTaskId() !== taskId);
    }

    return {
        getProjectId,
        getTitle,
        setTitle,
        addTaskToProject,
        removeTaskFromProject,
        getAllTasks,
        getTaskById
    }
}

/***/ }),

/***/ "./src/app-logic/storage.js":
/*!**********************************!*\
  !*** ./src/app-logic/storage.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ saveProject),
/* harmony export */   generateNewProjectId: () => (/* binding */ generateNewProjectId),
/* harmony export */   generateNewTaskId: () => (/* binding */ generateNewTaskId),
/* harmony export */   getProjectById: () => (/* binding */ getProjectById),
/* harmony export */   getProjectListStorage: () => (/* binding */ getProjectListStorage),
/* harmony export */   removeProjectStorage: () => (/* binding */ removeProjectStorage),
/* harmony export */   updateExistentProject: () => (/* binding */ updateExistentProject)
/* harmony export */ });
// Add a new created project to the project-list JSON object stored
function saveProject(project){
    const allowSave = checkIfProjectExists(project.getTitle());

    // If the above function returns false, the project will not be stored
    if(allowSave === false) return false;
        
    const jsonProject = projectToJson(project);
    const projectsStorage = getProjectListStorage();
    projectsStorage.push(jsonProject);

    localStorage.setItem('projects-list', JSON.stringify(projectsStorage));
}

// Remove project and its tasks from storage
function removeProjectStorage(projectId){
    const projectsStorage = getProjectListStorage();
    const indexToRemove =  Array.from(projectsStorage)
        .findIndex(project => project._projectId === projectId);
    
    projectsStorage.splice(indexToRemove, 1);
    localStorage.setItem('projects-list', JSON.stringify(projectsStorage));
}

// Change some part of an existent project
function updateExistentProject(project){
    const jsonProject = projectToJson(project);
    const projectsStorage = getProjectListStorage();

    const indexOfProjectToAlter = Array.from(projectsStorage)
        .findIndex(storedProject => storedProject._projectId === project.getProjectId());

    projectsStorage[indexOfProjectToAlter] = jsonProject;

    localStorage.setItem('projects-list', JSON.stringify(projectsStorage));
}

// Generate an identifier for a new task created, based on the last task inside a project parent
function generateNewTaskId(project){
    const storedProjects = getProjectListStorage();

    const projectParent = Array.from(storedProjects)
        .find(storedProject => storedProject._projectId === project.getProjectId());

    if(projectParent._listOfTasks.length !== 0){
        let lastIdNumber = projectParent._listOfTasks.at(-1).id.split('_')[1];
        return `task_${++lastIdNumber}`;
    }
    else {
        return `task_${0}`;
    }
}

// Generate an identifier for a new project created, based on the last project existent
function generateNewProjectId(){
    const storedProjects = getProjectListStorage();

    if(storedProjects.length !== 0){
        let lastIdNumber = storedProjects.at(-1)._projectId.split('_')[1];
        return `project_${++lastIdNumber}`;
    }
    else{
        return `project_${0}`;
    }
}

function getProjectById(id){
    const storedProjects = getProjectListStorage();
    return storedProjects.find(project => project._projectId === id);
}

// Check if the project to be stored already exists in the storage
function checkIfProjectExists(projectTitle){
    const storedProjects = getProjectListStorage();
    const allowSave = storedProjects.every(project => project._title !== projectTitle);
    return allowSave;
}

// Retrieve user's projects storage. If it is user's first time using the tododoo, create a new list of projects
function getProjectListStorage(){
    if(!localStorage.getItem('projects-list')){
        localStorage.setItem('projects-list', JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem('projects-list'));
}

// Transform project object (that contains all functions) to a JSON object
function projectToJson(project){
    const _projectId = project.getProjectId();
    const _title = project.getTitle();
    const _listOfTasks = [];
   
    // Convert all tasks to JSON like objects
    Array.from(project.getAllTasks())
        .forEach(
            task => _listOfTasks.push(taskToJson(task))
        );

    return {
        _projectId,
        _title,
        _listOfTasks
    }
}

/* Transform task object (that contains all functions) to a JSON object,
to be properly stored in the localStorage together with corresponding project */
function taskToJson(task){
    const id = task.getTaskId();
    const name = task.getName();
    const description = task.getDescription();
    const due_date = task.getDueDate();
    const priority = task.getPriority();

    return {
        id,
        name,
        description,
        due_date,
        priority
    }
}

/***/ }),

/***/ "./src/app-logic/task.js":
/*!*******************************!*\
  !*** ./src/app-logic/task.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Task)
/* harmony export */ });
function Task(taskName, dueDate = 'none', description = 'none', priority = 'none', taskId){
    // Used to create an object based on an existent (JSON object that comes from storage to Task object)
    let _taskId = taskId;
    let _name = taskName;
    let _dueDate = dueDate;
    let _description = description;
    let _priority = priority;

    // Getter for taskId
    const getTaskId = () => _taskId;

    // Getter and Setter for title
    const getName = () => _name;
    const setName = (newTitle) => _name = newTitle;

    // Getter and Setter for dueDate
    const getDueDate = () => _dueDate;
    const setDueDate = (newDueDate) => _dueDate = newDueDate;

    // Getter and Setter for description
    const getDescription = () => _description;
    const setDescription = (newDescription) => _description = newDescription;

    // Getter and Setter for priority
    const getPriority = () => _priority;
    const setPriority = (newPriority) => _priority = newPriority;

    return {
        getTaskId,
        getName,
        setName,
        getDueDate,
        setDueDate,
        getDescription,
        setDescription,
        getPriority,
        setPriority
    }
}

/***/ }),

/***/ "./src/commonFunctions.js":
/*!********************************!*\
  !*** ./src/commonFunctions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonWithImg: () => (/* binding */ buttonWithImg),
/* harmony export */   buttonWithTextCreator: () => (/* binding */ buttonWithTextCreator),
/* harmony export */   cleanProjectId: () => (/* binding */ cleanProjectId),
/* harmony export */   clearMainAndAppendNode: () => (/* binding */ clearMainAndAppendNode),
/* harmony export */   createCommonTaskForm: () => (/* binding */ createCommonTaskForm),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   createEmptyHint: () => (/* binding */ createEmptyHint),
/* harmony export */   divCreator: () => (/* binding */ divCreator),
/* harmony export */   errorFieldCreator: () => (/* binding */ errorFieldCreator),
/* harmony export */   getTaskElements: () => (/* binding */ getTaskElements),
/* harmony export */   removeEmptyHint: () => (/* binding */ removeEmptyHint),
/* harmony export */   taskFormDataHandler: () => (/* binding */ taskFormDataHandler)
/* harmony export */ });
/* harmony import */ var _dom_manipulation_modal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-manipulation/modal.js */ "./src/dom-manipulation/modal.js");


// Function to select the parent project of a task, the list which the task it's inside and the task itself
function getTaskElements(task, projectId){
    const asideProjectElement = document.getElementById(`aside_${projectId}`);
    const tasksSectionAside = asideProjectElement.querySelector('.project-tasks-aside');
    const asideTaskElement = tasksSectionAside.querySelector(`#aside_${task.getTaskId()}`);

    const mainProjectElement = document.getElementById(`main_${projectId}`);
    const tasksSectionMain = mainProjectElement.querySelector('.project-tasks-main');
    const mainTaskElement = tasksSectionMain.querySelector(`#main_${task.getTaskId()}`);

    return {
        taskListAside: tasksSectionAside,
        taskAside: asideTaskElement,
        taskListMain: tasksSectionMain,
        taskMain: mainTaskElement
    }
}

// Clear main-content and append the 'expanded' project from aside
function clearMainAndAppendNode(element, ...rest){
    const mainContent = document.getElementById('main-content');
    while(mainContent.lastElementChild){
        mainContent.removeChild(mainContent.lastElementChild);
    }

    if(rest.length !== 0)
        mainContent.appendChild(rest[0]);

    if(element.length >= 1){
        element.forEach(e => mainContent.appendChild(e));
    }
    else {
        mainContent.appendChild(element);
    }
}

function createEmptyHint(taskList){
    const emptyHint = createElement('p', {elementClass: 'project-empty-hint', elementText: 'No tasks yet!'});
    taskList.appendChild(emptyHint);
}

function removeEmptyHint(taskList){
    taskList.removeChild(taskList.children[0]);
}

function createCommonTaskForm(){
    const form = createElement('form', {elementId: 'form-task'});
    
    const formTitle = createElement('h3', {elementClass: 'form-header'});

    const divTitle = divCreator('Title *', 'task-name-input', 'text', 'task_name');
    const divDueDate = divCreator('Due date', 'due-date-input', 'date', 'due_date');
    const divDescription = divCreator('Description', 'description-input', 'textarea', 'description');
   
    // Fieldset with radio buttons for priority selection
    const fieldsetPriorities = document.createElement('fieldset');
    const fieldsetPrioritiesLegend = document.createElement('legend');
    fieldsetPrioritiesLegend.textContent = 'Priority';
    
    // Default value for priority
    const divNoPriority = divCreator('No priority', 'no-priority', 'radio', 'priority');
    divNoPriority.lastElementChild.setAttribute('checked', '');
    const divPriorityLow = divCreator('Low', 'low', 'radio', 'priority');
    const divPriorityHigh = divCreator('High', 'high', 'radio', 'priority');

    // Form buttons (Add task and Cancel)
    const divButtons = document.createElement('div');
    divButtons.setAttribute('id', 'form-buttons');
    const submitButton = buttonWithTextCreator('Add Task', 'add-task', 'button');
    const cancelButton = buttonWithTextCreator('Cancel', 'cancel-task', 'button');
    cancelButton.addEventListener('click', () => (0,_dom_manipulation_modal_js__WEBPACK_IMPORTED_MODULE_0__.removeFromModal)(form));

    fieldsetPriorities.append(
        fieldsetPrioritiesLegend,
        divPriorityHigh,
        divPriorityLow,
        divNoPriority
    );
    
    divButtons.append(
        submitButton,
        cancelButton
    );

    form.append(
        formTitle,
        divTitle, 
        divDueDate, 
        divDescription,
        fieldsetPriorities,
        divButtons
    );

    return form;
}

// Extract the data that comes from the task form (edit and new task)
function taskFormDataHandler(form){
    const formData = new FormData(form);

    if(!formData.get('task_name')){
        errorFieldCreator(document.getElementById('task-name-input'));
        return;
    }
    else {
        let taskParameters = [];
        formData.forEach((value, key) => {
            if(value === '' || value === undefined)
                taskParameters.push({[`${key}`]: 'none'});
            else
                taskParameters.push({[`${key}`]: value});
        });

        return taskParameters;
    }
}

function errorFieldCreator(elementToAppendBelow){
    // Don't allow to create a lot of error advises
    if(elementToAppendBelow.nextElementSibling)
        return;

    const errorField = document.createElement('p');
    errorField.textContent = 'You need to fill this field!';
    errorField.style.cssText = 
        `width: max-content; 
        font-size: 11px; 
        margin-top: 2px;
        margin-left: 5px`;

    const parent = elementToAppendBelow.parentElement;
    parent.appendChild(errorField);
    setTimeout(() => parent.removeChild(errorField), 1500);
}

// Handy function to create a button with an image inside (right-side of a task elements and add new task button)
function buttonWithImg(elementClass, imgSrc, optionalSpanText){
    const button = document.createElement('button');
    button.setAttribute('class', `${elementClass}`);
    button.setAttribute('type', 'button');

    const img = document.createElement('img');
    img.src = `${imgSrc}`;

    if(optionalSpanText){
        const span = document.createElement('span');
        span.textContent = `${optionalSpanText}`;
        span.style.cssText = 'order: 2'; // change order of span, putting him after the img
        button.appendChild(span);
    }

    button.appendChild(img);
    return button;
}

// Function that comes in handy to create elements that goes inside a project
function createElement(tagName, ...rest){
    const restParameters = rest[0]; // Need this because it comes as an array
    const {elementClass, elementId, elementSrc, elementText} = restParameters;
    const element = document.createElement(`${tagName}`);

    if(elementId)
        element.setAttribute('id', `${elementId}`);

    if(elementClass)
        element.setAttribute('class', `${elementClass}`);

    if(elementSrc)
        element.src = elementSrc;

    if(elementText)
        element.textContent = elementText;

    return element;
}

// "Clean" the project identifier from the main-content or aside, using only the relevant part of him (e.g main_project_0 => project_0)
const cleanProjectId = (rawId) => rawId.slice(rawId.indexOf('_') + 1);

// Function that comes in handy to create elements that goes inside the form for a new task
function divCreator(labelText, inputId, inputType, inputName){
    const divWrapper = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', `${inputId}`);
    label.textContent = labelText;

    let input;
    if(inputType === 'textarea'){
        input = document.createElement('textarea');
        input.setAttribute('maxlength', '140');
    }
    else {
        input = document.createElement('input');
        input.setAttribute('type', `${inputType}`);

        if(inputType === 'text'){
            input.setAttribute('maxlength', '25');
        }
    }

    input.setAttribute('id', `${inputId}`);
    input.setAttribute('name', `${inputName}`);

    if(input.type === 'radio')
        input.setAttribute('value', `${inputId}`);

    divWrapper.append(label, input);
    return divWrapper;
}

// Handy function to create a button with a text
function buttonWithTextCreator(buttonText, buttonId, buttonType){
    const button = document.createElement('button');
    
    button.setAttribute('id', `${buttonId}`);
    button.setAttribute('type', `${buttonType}`)
    button.textContent = `${buttonText}`;

    return button;
}

/***/ }),

/***/ "./src/dom-manipulation/asideSection.js":
/*!**********************************************!*\
  !*** ./src/dom-manipulation/asideSection.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startUIAndListeners),
/* harmony export */   selectTab: () => (/* binding */ selectTab)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _projectAside_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projectAside.js */ "./src/dom-manipulation/projectAside.js");
/* harmony import */ var _todayAndWeekTasks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./todayAndWeekTasks.js */ "./src/dom-manipulation/todayAndWeekTasks.js");





// Function to start all eventListeners related to the user-projects section and initial elements (for projects stored previously)
function startUIAndListeners(){
    openCloseAside();
    
    // Start the today section, as the first selected
    const todayButton = document.getElementById('today-todo-button');
    todayButton.classList.add('tab-selected');
    (0,_todayAndWeekTasks_js__WEBPACK_IMPORTED_MODULE_3__.getFilteredTasks)('today');
    todayButton.addEventListener('click', () => {
        selectTab(todayButton);
        (0,_todayAndWeekTasks_js__WEBPACK_IMPORTED_MODULE_3__.getFilteredTasks)('today');
    });

    const weekButton = document.getElementById('week-todo-button');
    weekButton.addEventListener('click', () => {
        selectTab(weekButton);
        (0,_todayAndWeekTasks_js__WEBPACK_IMPORTED_MODULE_3__.getFilteredTasks)('week');
    })

    // Button to show/hide user's projects
    const userProjectsButton = document.getElementById('user-projects-button');
    userProjectsButton.addEventListener('click', () => openCloseMyProjects(userProjectsButton));

    // Button to create new project
    const addNewProjectButton = document.getElementById('add-new-project-button');
    addNewProjectButton.addEventListener('click', (event) => (0,_projectAside_js__WEBPACK_IMPORTED_MODULE_2__["default"])(event.currentTarget));

    // Get all user's projects and create a new element on the aside
    const allUserProjects = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectListStorage)();
    Array.from(allUserProjects).forEach(project => {
        const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project);
        (0,_projectAside_js__WEBPACK_IMPORTED_MODULE_2__.createProjectAside)(projectObject);
    });
};

function selectTab(elementClicked){
    const currentTabSelected = document.getElementsByClassName('tab-selected')[0];

    if(!(currentTabSelected === undefined)){
        currentTabSelected.classList.remove('tab-selected');
    }

    elementClicked.classList.add('tab-selected');
}

// Handle show/hide all user's projects (div that contains My Projects text)
function openCloseMyProjects(button){
    const iconInsideButton = button.getElementsByTagName('img')[0];

    if(button.getAttribute('class') === 'show'){
        button.setAttribute('class', 'hide');
       
        // Arrow effect using an animation defined in the css file, from open to closed (bottom to right)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms normal forwards;'
        , 150);

        hideProjects();
    }
    else {
        button.setAttribute('class', 'show');   
        
        // Arrow effect using an animation defined in the css file, from closed to open (right to bottom)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms reverse backwards;'
        , 150);

        showProjects();
    }
}

function showProjects(){
    const listOfProjects = document.getElementById('list-projects-user');
    listOfProjects.style.cssText = 'display: flex;';
}

function hideProjects(){
    const listOfProjects = document.getElementById('list-projects-user');
    listOfProjects.style.cssText = 'display: none;';
}

// Function to open and hide the aside menu when clicked
function openCloseAside(){
    const hamburguerMenu = document.getElementById('hamburguer-menu-button');
    hamburguerMenu.addEventListener('click', () => {
        const currentClass = hamburguerMenu.getAttribute('class');
        
        if(currentClass === 'show'){
            hamburguerMenu.setAttribute('class', 'hide');
            toggleAside();
        }
        else {
            hamburguerMenu.setAttribute('class', 'show');
            toggleAside();
        }
    });
}

function toggleAside(){
    const aside = document.getElementById('aside-navigation');

    if(aside.getAttribute('class') === 'aside-show'){
        aside.setAttribute('class', 'aside-hide');
        aside.style.cssText = 'display: none;';
    }
    else {
        aside.setAttribute('class', 'aside-show'); // Add this class to put main-content back to its place
        aside.style.cssText = 'display: flex;';
    }
}

/***/ }),

/***/ "./src/dom-manipulation/modal.js":
/*!***************************************!*\
  !*** ./src/dom-manipulation/modal.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appendToModal: () => (/* binding */ appendToModal),
/* harmony export */   changeModalState: () => (/* binding */ changeModalState),
/* harmony export */   removeFromModal: () => (/* binding */ removeFromModal)
/* harmony export */ });
function appendToModal(htmlElement){
    const modalBox = document.getElementById('modal-box');
    clearModal(modalBox);

    modalBox.appendChild(htmlElement);
    changeModalState(modalBox);
}

function removeFromModal(htmlElement){
    const modalBox = document.getElementById('modal-box');
    modalBox.removeChild(htmlElement);
    changeModalState(modalBox);
}

function changeModalState(modal){
    const currentClass = modal.getAttribute('class');

    if(currentClass === 'show')
        modal.setAttribute('class', 'hide');
    else
        modal.setAttribute('class', 'show');
}

function clearModal(modal){
    while(modal.firstElementChild){
        modal.removeChild(modal.lastElementChild);
    }
}

/***/ }),

/***/ "./src/dom-manipulation/projectAside.js":
/*!**********************************************!*\
  !*** ./src/dom-manipulation/projectAside.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createProjectAside: () => (/* binding */ createProjectAside),
/* harmony export */   createTaskElementAside: () => (/* binding */ createTaskElementAside),
/* harmony export */   "default": () => (/* binding */ createNewProjectForm)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");
/* harmony import */ var _asideSection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./asideSection.js */ "./src/dom-manipulation/asideSection.js");
/* harmony import */ var _projectMain_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./projectMain.js */ "./src/dom-manipulation/projectMain.js");






// Function to generate a form to create a new project
function createNewProjectForm(buttonNewProject){
    buttonNewProject.style.cssText = 'opacity: 0'; // Hide 'plus' button
    const formWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('form', {elementId: 'form-add-project'});

    // Input to place the new project's name
    const projectNameInput = document.createElement('input');
    Object.assign(projectNameInput, {
        type: 'text',
        id: 'project-name',
        name: 'project_name',
        placeholder: `New project's name`
    });

    const projectNameDiv = document.createElement('div');
    projectNameDiv.appendChild(projectNameInput);

    // Button to confirm the creation of a new project
    const addButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('create-project-button', '/dist/assets/aside-icons/selected-icon.svg');
    addButton.addEventListener('click', () => newProjectHandler(formWrapper, buttonNewProject));

    // Button to cancel the creation of a new project
    const cancelButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('cancel-project-button', '/dist/assets/aside-icons/cancel-icon.svg');
    cancelButton.addEventListener('click', () => removeProjectForm(formWrapper, buttonNewProject));

    // Wrapper for cancel and create project buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.append(addButton, cancelButton);
    formWrapper.append(projectNameDiv, buttonsWrapper);

    // This elements are used to position the project form correctly
    const parentOfNewProjectButton = buttonNewProject.parentNode; // (#create-and-list-user-projects)
    const parentOfParent = parentOfNewProjectButton.parentNode; // (#user-projects)
    
    // parentOfParent.lastElementChild is the element used as a reference, to use insertBefore
    parentOfParent.insertBefore(formWrapper, parentOfParent.lastElementChild);
}

// Check if the project title input is filled, and create a new project (HTML and Storage)
function newProjectHandler(form, buttonNewProject){
    const formData = new FormData(form);

    if(!formData.get('project_name')){
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.errorFieldCreator)(document.getElementById('project-name'));
    }
    else {
        const project = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(formData.get('project_name'));

        if((0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__["default"])(project) !== false){
            createProjectAside(project);
            removeProjectForm(form, buttonNewProject);
        }
        else {
            // console.log("Project already exists!");
            return;
        }
    }
}

// Remove new project form and shows the 'plus' button again
function removeProjectForm(form, buttonNewProject){
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
    buttonNewProject.style.cssText = 'opacity: 1';
}

// Function used to create an HTML element for a new created project ()
function createProjectAside(projectObject){
    const projectId = projectObject.getProjectId();
    const projectTitle = projectObject.getTitle();
    const projectTasks = projectObject.getAllTasks();
    
    const arrowDownImage = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('img', {elementSrc: '/dist/assets/aside-icons/arrow-down-icon-22.png'});
    const buttonText = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('p', {elementText: `${projectTitle}`});
    const expandImage = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('img', {elementSrc: '/dist/assets/aside-icons/expand-icon.png', elementClass: 'expand-project-tasks'});
    const allTasksElements = projectTasks.map(task => createTaskElementAside(task));

    // Wrap buttons to show/hide and expand project to a div
    const divButtonsProjectName = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'project show'});
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);
    
    // eventListener to show/hide and expand a project
    newProjectButtonListener(divButtonsProjectName, expandImage);

    // Buttons to show/hide and expand project
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);
    
    // Wrapper for all tasks of the current project
    const allTasksWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'project-tasks-aside'});

    if(allTasksElements.length === 0)
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createEmptyHint)(allTasksWrapper);
    else 
        Array.from(allTasksElements).forEach(element => allTasksWrapper.appendChild(element));

    // Append all elements to a div that wraps all the content of a project
    const divWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'project-name-and-tasks', elementId: `aside_${projectId}`});
    divWrapper.append(divButtonsProjectName, allTasksWrapper);

    // Section that contains all user's projects
    const userProjectsSection = document.getElementById('list-projects-user');

    return userProjectsSection.appendChild(divWrapper);
}

// Create a task element to put inside the related project in the aside section
function createTaskElementAside(task){
    const taskWrapperAside = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {
        elementClass: 'task-aside', 
        elementId: `aside_${task.getTaskId()}`,
    })

    const spanPriority = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('span', {elementClass: `task-priority-aside ${task.getPriority()}`});
    const taskName = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('p', {elementText: `${task.getName()}`});
    taskWrapperAside.append(spanPriority, taskName);
    
    return taskWrapperAside;
}

// Set new project eventListeners, to show/hide and expand content to main-content div (not yet implemented)
function newProjectButtonListener(buttonShowHide, buttonExpand){
    buttonShowHide.addEventListener('click', () => openCloseProjectTasks(buttonShowHide));
    buttonExpand.addEventListener('click', (event) => {
        (0,_asideSection_js__WEBPACK_IMPORTED_MODULE_3__.selectTab)(buttonExpand.parentElement);
        (0,_projectMain_js__WEBPACK_IMPORTED_MODULE_4__.expandProjectTasks)(buttonExpand); // Expand means that the project will be expanded to the main-content
        event.stopPropagation();
    });
}

// Handle show/hide tasks of a project, by clicking in the project div
function openCloseProjectTasks(projectButton){
    const iconInsideButton = projectButton.getElementsByTagName('img')[0];

    if(projectButton.classList.contains('show')){
        projectButton.classList.remove('show');
        projectButton.classList.add('hide');
       
        // Arrow effect using an animation defined in the css file, from open to closed (bottom to right)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms normal forwards;'
        , 150);

        hideTasksOfProject(projectButton);
    }
    else {
        projectButton.classList.remove('hide');
        projectButton.classList.add('show');
        
        // Arrow effect using an animation defined in the css file, from closed to open (right to bottom)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms reverse backwards;'
        , 150);

        showTasksOfProject(projectButton);
    }

    // Function used to hide tasks of a project, by clicking in the project name (if open)
    function hideTasksOfProject(button){
        const parentProject = button.parentElement;
        const tasksOfProject = parentProject.lastElementChild;
        tasksOfProject.style.cssText = 'animation: delayAside 300ms reverse forwards;';
        setTimeout(() => tasksOfProject.style.cssText = 'display: none;', 300);
    }

    // Function used to show tasks of a project, by clicking in the project name (if closed)
    function showTasksOfProject(button){
        const parentProject = button.parentElement;
        const tasksOfProject = parentProject.lastElementChild;
        tasksOfProject.style.cssText = 'animation: delayAside 300ms forwards;';
        setTimeout(() => tasksOfProject.style.cssText = 'display: flex;', 300);
    }
}

/***/ }),

/***/ "./src/dom-manipulation/projectEdit.js":
/*!*********************************************!*\
  !*** ./src/dom-manipulation/projectEdit.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   editProjectHandler: () => (/* binding */ editProjectHandler)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");




function editProjectHandler(projectId){
    const projectWrapper = document.getElementById(`main_${projectId}`);
    const projectHeader = projectWrapper.querySelector('.project-header');
    const projectName = projectWrapper.querySelector('.project-name');
    const projectButtons = projectName.nextElementSibling; 
    projectButtons.style.cssText = 'opacity: 0'; // Hide the project buttons (edit and delete icons)
    
    const oldProjectName = projectName.textContent; // Used in case of user cancel the title edit
    projectName.setAttribute('contentEditable', 'true');
    projectName.style.cssText = 'border: 1px solid black;';
    projectName.focus();

    const confirmButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('confirm-project-name', '/dist/assets/main-icons/selected-icon-28.svg');
    confirmButton.addEventListener('click', () => titleEditHandler(projectName, projectButtons, projectId));
    const cancelButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('confirm-project-name', '/dist/assets/main-icons/cancel-icon-28.svg');
    cancelButton.addEventListener('click', () => removeTitleEdit(projectName, projectButtons, oldProjectName));
    const wrapperButtons = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'edit-project-buttons'});
    wrapperButtons.append(confirmButton, cancelButton);

    projectHeader.insertBefore(wrapperButtons, projectName.nextElementSibling);
}

function titleEditHandler(nameElement, projectButtons, projectId){
    const newTitle = nameElement.textContent;
    const project = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectById)(projectId);
    const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project);
    projectObject.setTitle(newTitle);
    (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.updateExistentProject)(projectObject);
    updateProjectElement(newTitle, projectId);
    removeTitleEdit(nameElement, projectButtons);
}

function updateProjectElement(newTitle, projectId){
    const projectAside = document.getElementById(`aside_${projectId}`);
    const titleAsideSection = projectAside.querySelector('.project');
    const projectTitleAside = titleAsideSection.querySelector('p');
    projectTitleAside.textContent = newTitle;

    const projectMain = document.getElementById(`main_${projectId}`);
    const titleMainSection = projectMain.querySelector('.project-name');
    titleMainSection.textContent = newTitle;
}

function removeTitleEdit(element, projectButtons, oldElementName){
    if(oldElementName)
        element.textContent = oldElementName;

    element.removeAttribute('contentEditable');
    element.style.cssText = 'border-color: transparent;';
    projectButtons.style.cssText = 'opacity: 1';
    
    const elementParent = element.parentElement;
    elementParent.removeChild(element.nextElementSibling);
}

/***/ }),

/***/ "./src/dom-manipulation/projectMain.js":
/*!*********************************************!*\
  !*** ./src/dom-manipulation/projectMain.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createProjectMain: () => (/* binding */ createProjectMain),
/* harmony export */   createTaskElementMain: () => (/* binding */ createTaskElementMain),
/* harmony export */   expandProjectTasks: () => (/* binding */ expandProjectTasks)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");
/* harmony import */ var _projectEdit_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./projectEdit.js */ "./src/dom-manipulation/projectEdit.js");
/* harmony import */ var _projectRemove_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./projectRemove.js */ "./src/dom-manipulation/projectRemove.js");
/* harmony import */ var _taskCreation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./taskCreation.js */ "./src/dom-manipulation/taskCreation.js");
/* harmony import */ var _taskEdit_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./taskEdit.js */ "./src/dom-manipulation/taskEdit.js");
/* harmony import */ var _taskExpand_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./taskExpand.js */ "./src/dom-manipulation/taskExpand.js");
/* harmony import */ var _taskRemove_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./taskRemove.js */ "./src/dom-manipulation/taskRemove.js");










// Expand a project in the main-content div (not yet implemented)
function expandProjectTasks(buttonThatTriggered){
    const selectedProjectDivParent = buttonThatTriggered.parentElement.parentElement;
    let parentProjectCleanId = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.cleanProjectId)(selectedProjectDivParent.getAttribute('id'));

    // Checks if the project exists
    const project = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectById)(parentProjectCleanId);
    
    if(project){
        const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project); // If projects exists, create a "new" object based on him, to be able to manipulate
        
        // Append the project expanded from aside and display it in the #main-content element
        const projectMainElement = createProjectMain(projectObject);
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.clearMainAndAppendNode)(projectMainElement);
    }
}

// Create a HTML project element to place in the #main-content
function createProjectMain(project){
    const projectId = project.getProjectId();
    const projectName = project.getTitle();
    const projectTasks = project.getAllTasks();

    const projectNameH3 = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('h3', {elementClass: 'project-name', elementText: `${projectName}`});
    const editButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('edit-project', '/dist/assets/main-icons/edit-icon-26.svg');
    editButton.addEventListener('click', () => (0,_projectEdit_js__WEBPACK_IMPORTED_MODULE_3__.editProjectHandler)(projectId));
    const removeButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('remove-project', '/dist/assets/main-icons/trash-icon-28.svg');
    removeButton.addEventListener('click', () => (0,_projectRemove_js__WEBPACK_IMPORTED_MODULE_4__.removeProjectHandler)(projectId));
    const projectButtons = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'project-buttons'});
    projectButtons.append(editButton, removeButton);
    const projectHeader = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'project-header'});
    projectHeader.append(projectNameH3, projectButtons);

    const projectTasksWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'project-tasks-main'});

    // Generate an HTML element for each existent task
    Array.from(projectTasks).map(task => {
        const taskElement = createTaskElementMain(task, projectId);
        projectTasksWrapper.appendChild(taskElement); // Append to the list that contains all tasks
    });
    
    // Button to add a new task to the project
    const newTaskButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('add-task', '/dist/assets/main-icons/plus-icon-task-add.svg', 'Add new task');
    newTaskButton.addEventListener('click', () => {
        let taskForm = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createCommonTaskForm)();
        (0,_taskCreation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(taskForm, projectId);
    });

    // Append all elements to the project wrapper (hold all tasks and infos of a single project)
    const projectWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementId: `main_${projectId}`, elementClass: 'project-wrapper'});
    projectWrapper.append(projectHeader, projectTasksWrapper, newTaskButton);

    return projectWrapper;
}

function createTaskElementMain(task, projectId){
    const taskWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementId: `main_${task.getTaskId()}`, elementClass: 'task-main'});

    // Left side of a task displayed in the #main-content
    const leftSideWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'task-left-side'});
    const priorityButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('button', {elementClass: `task-priority-main ${task.getPriority()}`});
    const taskNameAndDueDate = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'task-name-and-date'});
    const taskName = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('p', {elementClass: 'task-name', elementText: `${task.getName()}`});
    const taskDueDate = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('p', {elementClass: 'task-due-date', elementText: `${task.getDueDate()}`});
    taskNameAndDueDate.append(taskName, taskDueDate);
    leftSideWrapper.append(priorityButton, taskNameAndDueDate);
    
    // Right side (buttons to change state of a task) of a task displayed in the #main-content
    const rightSideWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {elementClass: 'task-right-side'});
    const expandButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('expand-task', '/dist/assets/main-icons/eye-icon.png');
    expandButton.addEventListener('click', () => {
        let taskForm = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createCommonTaskForm)();
        (0,_taskExpand_js__WEBPACK_IMPORTED_MODULE_7__.expandTasksInfo)(task, projectId, taskForm);
    });
    const editButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('edit-task', '/dist/assets/main-icons/edit-icon.svg');
    editButton.addEventListener('click', () => {
        let taskForm = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createCommonTaskForm)();
        (0,_taskEdit_js__WEBPACK_IMPORTED_MODULE_6__.editTaskForm)(task, projectId, taskForm);
    });
    const removeButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)('delete-task', '/dist/assets/main-icons/remove-icon.svg');
    removeButton.addEventListener('click', () => (0,_taskRemove_js__WEBPACK_IMPORTED_MODULE_8__.deleteTaskFromProject)(task, projectId));
    rightSideWrapper.append(expandButton, editButton, removeButton);

    // Append to the task wrapper
    taskWrapper.append(leftSideWrapper, rightSideWrapper);

    return taskWrapper;
}

/***/ }),

/***/ "./src/dom-manipulation/projectRemove.js":
/*!***********************************************!*\
  !*** ./src/dom-manipulation/projectRemove.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   removeProjectHandler: () => (/* binding */ removeProjectHandler)
/* harmony export */ });
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");


function removeProjectHandler(projectId){
    const mainContent = document.getElementById('main-content');
    const projectMainToRemove = mainContent.querySelector(`#main_${projectId}`);
    mainContent.removeChild(projectMainToRemove);

    const asideProjectsList = document.getElementById('list-projects-user');
    const projectAsideToRemove = asideProjectsList.querySelector(`#aside_${projectId}`);
    asideProjectsList.removeChild(projectAsideToRemove);

    (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_0__.removeProjectStorage)(projectId);
}

/***/ }),

/***/ "./src/dom-manipulation/taskCreation.js":
/*!**********************************************!*\
  !*** ./src/dom-manipulation/taskCreation.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ newTaskForm)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_task_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/task.js */ "./src/app-logic/task.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modal.js */ "./src/dom-manipulation/modal.js");
/* harmony import */ var _projectAside_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./projectAside.js */ "./src/dom-manipulation/projectAside.js");
/* harmony import */ var _projectMain_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./projectMain.js */ "./src/dom-manipulation/projectMain.js");








// Function to generate a form to create a new task, inside an existent project
function newTaskForm(form, projectId){
    const formTitle = form.querySelector('.form-header');
    formTitle.textContent = 'Add a new task';
    const submitButton = form.querySelector('#add-task');
    submitButton.addEventListener('click', () => newTaskHandler(form, projectId));
    (0,_modal_js__WEBPACK_IMPORTED_MODULE_4__.appendToModal)(form);
}

// If user clicks on the add task button, the info that comes from the form is handled
function newTaskHandler(form, projectId){
    const taskParameters = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_3__.taskFormDataHandler)(form, projectId);
    
    if(taskParameters){
        const newTask = saveTaskToProject(taskParameters, projectId);
        createTaskElement(newTask, projectId);
        (0,_modal_js__WEBPACK_IMPORTED_MODULE_4__.removeFromModal)(form);
    }
}

// Get project from storage and transform him in a project object to store the new task inside of it via the method addTaskToProject()
function saveTaskToProject(taskParameters, parentProjectId){
    let task_name, due_date, description, priority;
    [{task_name}, {due_date}, {description}, {priority}] = taskParameters;

    // Checks if the project exists
    const projectFromStorage = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_2__.getProjectById)(parentProjectId);

    if(projectFromStorage){
        const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(projectFromStorage);
        const newTask = (0,_app_logic_task_js__WEBPACK_IMPORTED_MODULE_1__["default"])(task_name, due_date, description, priority, (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_2__.generateNewTaskId)(projectObject));
        
        projectObject.addTaskToProject(newTask);
        (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_2__.updateExistentProject)(projectObject); // Update the project in the storage with the new task

        return newTask;
    }
}

// Generate a new task element in both parent project sections (aside and main-content)
function createTaskElement(task, projectId){
    const {taskListAside, taskListMain} = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_3__.getTaskElements)(task, projectId);

    if(taskListAside.children[0].getAttribute('class') === 'project-empty-hint') 
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_3__.removeEmptyHint)(taskListAside);

    // Place the new element within the project in the aside
    const taskElementAside = (0,_projectAside_js__WEBPACK_IMPORTED_MODULE_5__.createTaskElementAside)(task);
    taskListAside.appendChild(taskElementAside);

    // Place the new element within the project in the main-content
    const taskElementMain = (0,_projectMain_js__WEBPACK_IMPORTED_MODULE_6__.createTaskElementMain)(task, projectId);
    taskListMain.appendChild(taskElementMain);
}


/***/ }),

/***/ "./src/dom-manipulation/taskEdit.js":
/*!******************************************!*\
  !*** ./src/dom-manipulation/taskEdit.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   editTaskForm: () => (/* binding */ editTaskForm)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modal.js */ "./src/dom-manipulation/modal.js");
/* harmony import */ var _projectAside_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./projectAside.js */ "./src/dom-manipulation/projectAside.js");
/* harmony import */ var _projectMain_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./projectMain.js */ "./src/dom-manipulation/projectMain.js");
/* harmony import */ var _todayAndWeekTasks_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./todayAndWeekTasks.js */ "./src/dom-manipulation/todayAndWeekTasks.js");








function editTaskForm(task, projectId, form){
    const formTitle = form.querySelector('.form-header');
    formTitle.textContent = 'Edit task';

    const taskInputName = form.querySelector('#task-name-input');
    taskInputName.setAttribute('value', `${task.getName()}`);

    const taskInputDueDate= form.querySelector('#due-date-input');
    if(task.getDueDate() === 'none'){
        taskInputDueDate.setAttribute('value', '');
    }
    else {
        taskInputDueDate.setAttribute('value', `${task.getDueDate()}`);
    }

    const taskInputDescription = form.querySelector('#description-input');
    taskInputDescription.textContent = `${task.getDescription()}`;

    const taskPriority = task.getPriority();
    const formPriorities = form.querySelectorAll("[name='priority']");
    Array.from(formPriorities).forEach(element => {
        if(element.getAttribute('id') === taskPriority)
            element.setAttribute('checked', '');
    });

    const submitButton = form.querySelector('#add-task');
    submitButton.textContent = 'Edit task';
    submitButton.addEventListener('click', () => editTaskHandler(form, projectId));

    const taskId = document.createElement('input');
    Object.assign(taskId, {
        id: 'task-id',
        type: 'hidden',
        name: 'task_id',
        value: `${task.getTaskId()}`
    });

    form.appendChild(taskId);
    (0,_modal_js__WEBPACK_IMPORTED_MODULE_3__.appendToModal)(form);
}

function editTaskHandler(form, projectId){
    const taskParameters = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.taskFormDataHandler)(form, projectId);
    
    if(taskParameters){
        const changedTask = saveModTaskToProject(taskParameters, projectId);
        updateTaskElement(changedTask, projectId);
        (0,_modal_js__WEBPACK_IMPORTED_MODULE_3__.removeFromModal)(form);
    }
}

function saveModTaskToProject(taskParameters, parentProjectId){
    let task_id, task_name, due_date, description, priority;
    [{task_name}, {due_date}, {description}, {priority}, {task_id}] = taskParameters;

    // Checks if the project exists
    const projectFromStorage = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectById)(parentProjectId);

    if(projectFromStorage){
        const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(projectFromStorage);
        const taskToChange = projectObject.getTaskById(task_id);
        
        taskToChange.setName(task_name);
        taskToChange.setDueDate(due_date);
        taskToChange.setDescription(description);
        taskToChange.setPriority(priority);

        (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.updateExistentProject)(projectObject); // Update the project in the storage with the modified task 

        return taskToChange;
    }
}

function checkIfTodayOrWeek(){
    const main = document.getElementById('main-content');
    const todayIdentifier = main.querySelector('#today-header');
    const weekIdentifier = main.querySelector('#week-header');

    if(main.firstElementChild === todayIdentifier)
        return 'today';

    if(main.firstElementChild === weekIdentifier)
        return 'week';

    return false;
}

// Update the element in the DOM with the new values (aside and main sections)
function updateTaskElement(task, projectId){
    const {taskListAside, taskAside, taskListMain, taskMain} = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.getTaskElements)(task, projectId);

    // Update task element within the project in the aside (remove the old task and place it the new)
    const updatedAsideTask = (0,_projectAside_js__WEBPACK_IMPORTED_MODULE_4__.createTaskElementAside)(task);
    taskListAside.insertBefore(updatedAsideTask, taskAside);
    taskListAside.removeChild(taskAside);

    const sectionToUpdate = checkIfTodayOrWeek();
    if(sectionToUpdate){
        (0,_todayAndWeekTasks_js__WEBPACK_IMPORTED_MODULE_6__.getFilteredTasks)(`${sectionToUpdate}`);
    }
    else {
        // Update task element within the project in the main-content (remove the old task and place it the new)
        const updatedMainTask = (0,_projectMain_js__WEBPACK_IMPORTED_MODULE_5__.createTaskElementMain)(task, projectId);
        taskListMain.insertBefore(updatedMainTask, taskMain);
        taskListMain.removeChild(taskMain);
    }
}

/***/ }),

/***/ "./src/dom-manipulation/taskExpand.js":
/*!********************************************!*\
  !*** ./src/dom-manipulation/taskExpand.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   expandTasksInfo: () => (/* binding */ expandTasksInfo)
/* harmony export */ });
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal.js */ "./src/dom-manipulation/modal.js");



function expandTasksInfo(task, projectId, taskForm){
    const taskTitle = task.getName();
    const taskDueDate = task.getDueDate();
    const taskDescription = task.getDescription();
    let taskPriority = task.getPriority();
    taskPriority = taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1);

    const formTitle = taskForm.querySelector('.form-header');
    formTitle.textContent = `${taskTitle}`;
    taskForm.removeChild(formTitle.nextElementSibling); // Remove the task name input

    const formDueDate = taskForm.querySelector('#due-date-input');
    formDueDate.value = `${taskDueDate}`;
    formDueDate.readOnly = true;

    const formDescription = taskForm.querySelector('#description-input');
    formDescription.textContent = `${taskDescription}`;
    formDescription.readOnly = true;
    formDescription.style.cssText = 'resize: none';

    const formPriority = taskForm.querySelector('fieldset');
    while(formPriority.children.length > 1){
        formPriority.removeChild(formPriority.lastElementChild);
    }
    const priorityText = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {elementText: `${taskPriority}`});
    formPriority.appendChild(priorityText);

    const cancelButton = taskForm.querySelector('#cancel-task');
    cancelButton.textContent = 'Go back';
    cancelButton.parentElement.removeChild(cancelButton.previousElementSibling);
    cancelButton.parentElement.style.cssText = 'justify-content: flex-end';

    (0,_modal_js__WEBPACK_IMPORTED_MODULE_1__.appendToModal)(taskForm);
}

/***/ }),

/***/ "./src/dom-manipulation/taskRemove.js":
/*!********************************************!*\
  !*** ./src/dom-manipulation/taskRemove.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteTaskFromProject: () => (/* binding */ deleteTaskFromProject)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");




function deleteTaskFromProject(task, projectId){
    const {taskListAside, taskAside, taskListMain, taskMain} = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.getTaskElements)(task, projectId);

    taskListAside.removeChild(taskAside);
    taskListMain.removeChild(taskMain);

    if(taskListAside.children.length === 0) 
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createEmptyHint)(taskListAside);

    if(taskListMain.children.length === 0)
        updateMainToday(projectId);

    // Checks if the project exists
    const projectFromStorage = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectById)(projectId);

    if(projectFromStorage){
        const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(projectFromStorage);
        projectObject.removeTaskFromProject(task.getTaskId());
        
        (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.updateExistentProject)(projectObject);
    }
}

// Update main content when user remove any task (of any project) in the today section
// E.g if the user removes a task of a project and this project doesn't have no more tasks, remove it from the main content
function updateMainToday(projectId){
    const main = document.getElementById('main-content');
    const projectWrapper = main.querySelector(`#main_${projectId}`);
    main.removeChild(projectWrapper);
}

/***/ }),

/***/ "./src/dom-manipulation/todayAndWeekTasks.js":
/*!***************************************************!*\
  !*** ./src/dom-manipulation/todayAndWeekTasks.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFilteredTasks: () => (/* binding */ getFilteredTasks)
/* harmony export */ });
/* harmony import */ var _app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app-logic/project.js */ "./src/app-logic/project.js");
/* harmony import */ var _app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app-logic/storage.js */ "./src/app-logic/storage.js");
/* harmony import */ var _commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../commonFunctions.js */ "./src/commonFunctions.js");
/* harmony import */ var _projectMain_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./projectMain.js */ "./src/dom-manipulation/projectMain.js");





function getFilteredTasks(action){
    const userProjects = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectListStorage)();
    let tasksFiltered, projectAndTasksElements, headerSection;

    if(action === 'today'){
        tasksFiltered = Array.from(userProjects)
            .map(project => getTodayTasks(project))
            .filter(project => project !== undefined);

        headerSection = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('h3', {elementId: 'today-header', elementText: `Today's tasks`});
    }
    else {
        tasksFiltered = Array.from(userProjects)
            .map(project => getWeekTasks(project))
            .filter(project => project !== undefined);

        headerSection = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)('h3', {elementId: 'week-header', elementText: `Week tasks`});
    }
    
    projectAndTasksElements = tasksFiltered.map(project => {
        const projectElement = (0,_projectMain_js__WEBPACK_IMPORTED_MODULE_3__.createProjectMain)(project);
        projectElement.removeChild(projectElement.querySelector('.add-task'));
        return projectElement;
    });

    if(projectAndTasksElements.length !== 0)
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.clearMainAndAppendNode)(projectAndTasksElements, headerSection);
    else
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.clearMainAndAppendNode)(headerSection);
}

// Get today's tasks of a project and return them in a "new" project object
function getTodayTasks(project){
    const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project);
    projectObject.getAllTasks().map(task => {
        if(!(task.getDueDate() === new Date().toLocaleDateString('en-CA'))){
            projectObject.removeTaskFromProject(task.getTaskId());
        }
    });

    if(!(projectObject.getAllTasks().length === 0))
        return projectObject;
}

function getWeekTasks(project){
    const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project);
    projectObject.getAllTasks().map(task => {
        if(!(isBetweenThisWeek(task.getDueDate()))){
            projectObject.removeTaskFromProject(task.getTaskId());
        }
    });

    if(!(projectObject.getAllTasks().length === 0))
        return projectObject;
}

function isBetweenThisWeek(date){
    const today = new Date();
    const dayStartWeek = new Date(today.setDate(today.getDate() - today.getDay())).toLocaleDateString('en-CA');
    const dayEndWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toLocaleDateString('en-CA');

    return date >= dayStartWeek && date <= dayEndWeek ? true : false;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/app-logic/index.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_manipulation_asideSection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-manipulation/asideSection.js */ "./src/dom-manipulation/asideSection.js");


(0,_dom_manipulation_asideSection_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFvRDtBQUN2QjtBQUM3QjtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3QztBQUNBO0FBQ0Esb0JBQW9CLG9EQUFJO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixpRUFBb0IsSUFBSTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlDQTtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixlQUFlO0FBQ3RDO0FBQ0E7QUFDQSx1QkFBdUIsRUFBRTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsZUFBZTtBQUN6QztBQUNBO0FBQ0EsMEJBQTBCLEVBQUU7QUFDNUI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzFIZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEM4RDtBQUM5RDtBQUNBO0FBQ087QUFDUCxpRUFBaUUsVUFBVTtBQUMzRTtBQUNBLHVFQUF1RSxpQkFBaUI7QUFDeEY7QUFDQSwrREFBK0QsVUFBVTtBQUN6RTtBQUNBLG9FQUFvRSxpQkFBaUI7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCwwQ0FBMEMsaUVBQWlFO0FBQzNHO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUCx3Q0FBd0MsdUJBQXVCO0FBQy9EO0FBQ0EsMkNBQTJDLDRCQUE0QjtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsMkVBQWU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsSUFBSSxJQUFJLFdBQVc7QUFDeEQ7QUFDQSxxQ0FBcUMsSUFBSSxJQUFJLFVBQVU7QUFDdkQsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxvQ0FBb0MsYUFBYTtBQUNqRDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsaUJBQWlCO0FBQy9DLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxvQ0FBb0M7QUFDcEMsV0FBVyxrREFBa0Q7QUFDN0QsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBLHNDQUFzQyxVQUFVO0FBQ2hEO0FBQ0E7QUFDQSx5Q0FBeUMsYUFBYTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsUUFBUTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsVUFBVTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsUUFBUTtBQUN4QyxrQ0FBa0MsVUFBVTtBQUM1QztBQUNBO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUMsbUNBQW1DLFdBQVc7QUFDOUMsNEJBQTRCLFdBQVc7QUFDdkM7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOU44QztBQUNrQjtBQUN3QjtBQUNoQjtBQUN4RTtBQUNBO0FBQ2U7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1RUFBZ0I7QUFDcEI7QUFDQTtBQUNBLFFBQVEsdUVBQWdCO0FBQ3hCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUVBQWdCO0FBQ3hCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCw0REFBb0I7QUFDakY7QUFDQTtBQUNBLDRCQUE0Qiw0RUFBcUI7QUFDakQ7QUFDQSw4QkFBOEIsaUVBQU87QUFDckMsUUFBUSxvRUFBa0I7QUFDMUIsS0FBSztBQUNMO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQSxxSEFBcUg7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBLHVIQUF1SDtBQUN2SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQsNkNBQTZDO0FBQzdDO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwSE87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNCOEM7QUFDSTtBQUN1RDtBQUMzRDtBQUNRO0FBQ3REO0FBQ0E7QUFDZTtBQUNmLG1EQUFtRDtBQUNuRCx3QkFBd0Isa0VBQWEsVUFBVSw4QkFBOEI7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGtFQUFhO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixrRUFBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0VBQWlCO0FBQ3pCO0FBQ0E7QUFDQSx3QkFBd0IsaUVBQU87QUFDL0I7QUFDQSxXQUFXLGlFQUFXO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsa0VBQWEsU0FBUyw4REFBOEQ7QUFDL0csdUJBQXVCLGtFQUFhLE9BQU8sZ0JBQWdCLGFBQWEsRUFBRTtBQUMxRSx3QkFBd0Isa0VBQWEsU0FBUyw2RkFBNkY7QUFDM0k7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGtFQUFhLFNBQVMsNkJBQTZCO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixrRUFBYSxTQUFTLG9DQUFvQztBQUN0RjtBQUNBO0FBQ0EsUUFBUSxvRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrRUFBYSxTQUFTLDREQUE0RCxVQUFVLEVBQUU7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCw2QkFBNkIsa0VBQWE7QUFDMUM7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDLEtBQUs7QUFDTDtBQUNBLHlCQUF5QixrRUFBYSxVQUFVLHFDQUFxQyxtQkFBbUIsRUFBRTtBQUMxRyxxQkFBcUIsa0VBQWEsT0FBTyxnQkFBZ0IsZUFBZSxFQUFFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsMkRBQVM7QUFDakIsUUFBUSxtRUFBa0IsZ0JBQWdCO0FBQzFDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQSxxSEFBcUg7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0EsdUhBQXVIO0FBQ3ZIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRjtBQUNyRix1RUFBdUU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFO0FBQzdFLHVFQUF1RTtBQUN2RTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25MOEM7QUFDa0M7QUFDWDtBQUNyRTtBQUNPO0FBQ1AsMkRBQTJELFVBQVU7QUFDckU7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0EseURBQXlEO0FBQ3pEO0FBQ0E7QUFDQSwwQkFBMEIsa0VBQWE7QUFDdkM7QUFDQSx5QkFBeUIsa0VBQWE7QUFDdEM7QUFDQSwyQkFBMkIsa0VBQWEsU0FBUyxxQ0FBcUM7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IscUVBQWM7QUFDbEMsMEJBQTBCLGlFQUFPO0FBQ2pDO0FBQ0EsSUFBSSw0RUFBcUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxVQUFVO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELFVBQVU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6RDhDO0FBQ1c7QUFDMEU7QUFDN0U7QUFDSTtBQUNDO0FBQ2Q7QUFDSztBQUNNO0FBQ3hEO0FBQ0E7QUFDTztBQUNQO0FBQ0EsK0JBQStCLG1FQUFjO0FBQzdDO0FBQ0E7QUFDQSxvQkFBb0IscUVBQWM7QUFDbEM7QUFDQTtBQUNBLDhCQUE4QixpRUFBTyxXQUFXO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsMkVBQXNCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixrRUFBYSxRQUFRLDhDQUE4QyxZQUFZLEVBQUU7QUFDM0csdUJBQXVCLGtFQUFhO0FBQ3BDLCtDQUErQyxtRUFBa0I7QUFDakUseUJBQXlCLGtFQUFhO0FBQ3RDLGlEQUFpRCx1RUFBb0I7QUFDckUsMkJBQTJCLGtFQUFhLFNBQVMsZ0NBQWdDO0FBQ2pGO0FBQ0EsMEJBQTBCLGtFQUFhLFNBQVMsK0JBQStCO0FBQy9FO0FBQ0E7QUFDQSxnQ0FBZ0Msa0VBQWEsU0FBUyxtQ0FBbUM7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQsS0FBSztBQUNMO0FBQ0E7QUFDQSwwQkFBMEIsa0VBQWE7QUFDdkM7QUFDQSx1QkFBdUIseUVBQW9CO0FBQzNDLFFBQVEsNERBQVc7QUFDbkIsS0FBSztBQUNMO0FBQ0E7QUFDQSwyQkFBMkIsa0VBQWEsU0FBUyxtQkFBbUIsVUFBVSxtQ0FBbUM7QUFDakg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1Asd0JBQXdCLGtFQUFhLFNBQVMsbUJBQW1CLGlCQUFpQiw2QkFBNkI7QUFDL0c7QUFDQTtBQUNBLDRCQUE0QixrRUFBYSxTQUFTLCtCQUErQjtBQUNqRiwyQkFBMkIsa0VBQWEsWUFBWSxvQ0FBb0MsbUJBQW1CLEVBQUU7QUFDN0csK0JBQStCLGtFQUFhLFNBQVMsbUNBQW1DO0FBQ3hGLHFCQUFxQixrRUFBYSxPQUFPLDJDQUEyQyxlQUFlLEVBQUU7QUFDckcsd0JBQXdCLGtFQUFhLE9BQU8sK0NBQStDLGtCQUFrQixFQUFFO0FBQy9HO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGtFQUFhLFNBQVMsZ0NBQWdDO0FBQ25GLHlCQUF5QixrRUFBYTtBQUN0QztBQUNBLHVCQUF1Qix5RUFBb0I7QUFDM0MsUUFBUSwrREFBZTtBQUN2QixLQUFLO0FBQ0wsdUJBQXVCLGtFQUFhO0FBQ3BDO0FBQ0EsdUJBQXVCLHlFQUFvQjtBQUMzQyxRQUFRLDBEQUFZO0FBQ3BCLEtBQUs7QUFDTCx5QkFBeUIsa0VBQWE7QUFDdEMsaURBQWlELHFFQUFxQjtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDakcrRDtBQUMvRDtBQUNPO0FBQ1A7QUFDQSxtRUFBbUUsVUFBVTtBQUM3RTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsVUFBVTtBQUNyRjtBQUNBO0FBQ0EsSUFBSSwyRUFBb0I7QUFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1o4QztBQUNOO0FBQzJEO0FBQ0w7QUFDbEM7QUFDRDtBQUNGO0FBQ3pEO0FBQ0E7QUFDZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx3REFBYTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3RUFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLDBEQUFlO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sVUFBVSxHQUFHLFNBQVMsR0FBRyxZQUFZLEdBQUcsU0FBUztBQUN2RDtBQUNBO0FBQ0EsK0JBQStCLHFFQUFjO0FBQzdDO0FBQ0E7QUFDQSw4QkFBOEIsaUVBQU87QUFDckMsd0JBQXdCLDhEQUFJLDZDQUE2Qyx3RUFBaUI7QUFDMUY7QUFDQTtBQUNBLFFBQVEsNEVBQXFCLGlCQUFpQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsNkJBQTZCLEVBQUUsb0VBQWU7QUFDekQ7QUFDQTtBQUNBLFFBQVEsb0VBQWU7QUFDdkI7QUFDQTtBQUNBLDZCQUE2Qix3RUFBc0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHNFQUFxQjtBQUNqRDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0Q4QztBQUN5RDtBQUMxQjtBQUNqQjtBQUNEO0FBQ0Y7QUFDQztBQUMxRDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsZUFBZTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Qsa0JBQWtCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxzQkFBc0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksd0RBQWE7QUFDakI7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdFQUFtQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsMERBQWU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sVUFBVSxHQUFHLFNBQVMsR0FBRyxZQUFZLEdBQUcsU0FBUyxHQUFHLFFBQVE7QUFDbEU7QUFDQTtBQUNBLCtCQUErQixxRUFBYztBQUM3QztBQUNBO0FBQ0EsOEJBQThCLGlFQUFPO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSw0RUFBcUIsaUJBQWlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsa0RBQWtELEVBQUUsb0VBQWU7QUFDOUU7QUFDQTtBQUNBLDZCQUE2Qix3RUFBc0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUVBQWdCLElBQUksZ0JBQWdCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxzRUFBcUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsSHNEO0FBQ1g7QUFDM0M7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFVBQVU7QUFDekMsd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsZ0JBQWdCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGtFQUFhLE9BQU8sZ0JBQWdCLGFBQWEsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksd0RBQWE7QUFDakI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEM4QztBQUNrQztBQUNQO0FBQ3pFO0FBQ087QUFDUCxXQUFXLGtEQUFrRCxFQUFFLG9FQUFlO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9FQUFlO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IscUVBQWM7QUFDN0M7QUFDQTtBQUNBLDhCQUE4QixpRUFBTztBQUNyQztBQUNBO0FBQ0EsUUFBUSw0RUFBcUI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsVUFBVTtBQUNqRTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQzhDO0FBQ2tCO0FBQ2M7QUFDekI7QUFDckQ7QUFDTztBQUNQLHlCQUF5Qiw0RUFBcUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0VBQWEsUUFBUSx3REFBd0Q7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtFQUFhLFFBQVEsb0RBQW9EO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixrRUFBaUI7QUFDaEQ7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsUUFBUSwyRUFBc0I7QUFDOUI7QUFDQSxRQUFRLDJFQUFzQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixpRUFBTztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsaUVBQU87QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNuRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05xRjtBQUNyRjtBQUNBLDZFQUFtQixHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9hcHAtbG9naWMvcHJvamVjdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2FwcC1sb2dpYy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvYXBwLWxvZ2ljL3Rhc2suanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9jb21tb25GdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL2FzaWRlU2VjdGlvbi5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vbW9kYWwuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL3Byb2plY3RBc2lkZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vcHJvamVjdEVkaXQuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL3Byb2plY3RNYWluLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9wcm9qZWN0UmVtb3ZlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi90YXNrQ3JlYXRpb24uanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL3Rhc2tFZGl0LmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi90YXNrRXhwYW5kLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi90YXNrUmVtb3ZlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi90b2RheUFuZFdlZWtUYXNrcy5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9hcHAtbG9naWMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuZXJhdGVOZXdQcm9qZWN0SWQgfSBmcm9tIFwiLi9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCBUYXNrIGZyb20gXCIuL3Rhc2suanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2plY3QocGFyYW1ldGVyKXtcclxuICAgIGxldCBfcHJvamVjdElkO1xyXG4gICAgbGV0IF90aXRsZTtcclxuICAgIGxldCBfbGlzdE9mVGFza3M7XHJcblxyXG4gICAgLy8gVXNlZCB0byBjcmVhdGUgYW4gb2JqZWN0IGJhc2VkIG9uIGFuIGV4aXN0ZW50IChKU09OIG9iamVjdCB0aGF0IGNvbWVzIGZyb20gc3RvcmFnZSB0byBQcm9qZWN0IG9iamVjdClcclxuICAgIGlmKHR5cGVvZiBwYXJhbWV0ZXIgPT09ICdvYmplY3QnKXtcclxuICAgICAgICBfcHJvamVjdElkID0gYCR7cGFyYW1ldGVyLl9wcm9qZWN0SWR9YDtcclxuICAgICAgICBfdGl0bGUgPSBwYXJhbWV0ZXIuX3RpdGxlO1xyXG4gICAgICAgIF9saXN0T2ZUYXNrcyA9IHBhcmFtZXRlci5fbGlzdE9mVGFza3MubWFwKFxyXG4gICAgICAgICAgICB0YXNrID0+IFRhc2sodGFzay5uYW1lLCB0YXNrLmR1ZV9kYXRlLCB0YXNrLmRlc2NyaXB0aW9uLCB0YXNrLnByaW9yaXR5LCB0YXNrLmlkKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfcHJvamVjdElkID0gZ2VuZXJhdGVOZXdQcm9qZWN0SWQoKTsgLy8gR2VuZXJhdGUgYW4gaWRlbnRpZmllciBiYXNlZCBvbiB0aGUgbGFzdCBleGlzdGVudCBwcm9qZWN0XHJcbiAgICAgICAgX3RpdGxlID0gcGFyYW1ldGVyO1xyXG4gICAgICAgIF9saXN0T2ZUYXNrcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldHRlciBmb3IgcHJvamVjdElkXHJcbiAgICBjb25zdCBnZXRQcm9qZWN0SWQgPSAoKSA9PiBfcHJvamVjdElkO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciB0aXRsZVxyXG4gICAgY29uc3QgZ2V0VGl0bGUgPSAoKSA9PiBfdGl0bGU7XHJcbiAgICBjb25zdCBzZXRUaXRsZSA9IChuZXdUaXRsZSkgPT4gX3RpdGxlID0gbmV3VGl0bGU7XHJcblxyXG4gICAgLy8gTWV0aG9kcyB0byBtYW5pcHVsYXRlIHRhc2tzIGluc2lkZSBhIFByb2plY3QgXHJcbiAgICBjb25zdCBnZXRBbGxUYXNrcyA9ICgpID0+IF9saXN0T2ZUYXNrcztcclxuICAgIGNvbnN0IGdldFRhc2tCeUlkID0gKHRhc2tJbmRleCkgPT4gX2xpc3RPZlRhc2tzLmZpbmQodGFzayA9PiB0YXNrLmdldFRhc2tJZCgpID09PSB0YXNrSW5kZXgpO1xyXG4gICAgY29uc3QgYWRkVGFza1RvUHJvamVjdCA9ICh0YXNrKSA9PiBfbGlzdE9mVGFza3MucHVzaCh0YXNrKTtcclxuICAgIGNvbnN0IHJlbW92ZVRhc2tGcm9tUHJvamVjdCA9ICh0YXNrSWQpID0+IHtcclxuICAgICAgICBfbGlzdE9mVGFza3MgPSBfbGlzdE9mVGFza3MuZmlsdGVyKHRhc2sgPT4gdGFzay5nZXRUYXNrSWQoKSAhPT0gdGFza0lkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFByb2plY3RJZCxcclxuICAgICAgICBnZXRUaXRsZSxcclxuICAgICAgICBzZXRUaXRsZSxcclxuICAgICAgICBhZGRUYXNrVG9Qcm9qZWN0LFxyXG4gICAgICAgIHJlbW92ZVRhc2tGcm9tUHJvamVjdCxcclxuICAgICAgICBnZXRBbGxUYXNrcyxcclxuICAgICAgICBnZXRUYXNrQnlJZFxyXG4gICAgfVxyXG59IiwiLy8gQWRkIGEgbmV3IGNyZWF0ZWQgcHJvamVjdCB0byB0aGUgcHJvamVjdC1saXN0IEpTT04gb2JqZWN0IHN0b3JlZFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYXZlUHJvamVjdChwcm9qZWN0KXtcclxuICAgIGNvbnN0IGFsbG93U2F2ZSA9IGNoZWNrSWZQcm9qZWN0RXhpc3RzKHByb2plY3QuZ2V0VGl0bGUoKSk7XHJcblxyXG4gICAgLy8gSWYgdGhlIGFib3ZlIGZ1bmN0aW9uIHJldHVybnMgZmFsc2UsIHRoZSBwcm9qZWN0IHdpbGwgbm90IGJlIHN0b3JlZFxyXG4gICAgaWYoYWxsb3dTYXZlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgY29uc3QganNvblByb2plY3QgPSBwcm9qZWN0VG9Kc29uKHByb2plY3QpO1xyXG4gICAgY29uc3QgcHJvamVjdHNTdG9yYWdlID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBwcm9qZWN0c1N0b3JhZ2UucHVzaChqc29uUHJvamVjdCk7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzLWxpc3QnLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0c1N0b3JhZ2UpKTtcclxufVxyXG5cclxuLy8gUmVtb3ZlIHByb2plY3QgYW5kIGl0cyB0YXNrcyBmcm9tIHN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVByb2plY3RTdG9yYWdlKHByb2plY3RJZCl7XHJcbiAgICBjb25zdCBwcm9qZWN0c1N0b3JhZ2UgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuICAgIGNvbnN0IGluZGV4VG9SZW1vdmUgPSAgQXJyYXkuZnJvbShwcm9qZWN0c1N0b3JhZ2UpXHJcbiAgICAgICAgLmZpbmRJbmRleChwcm9qZWN0ID0+IHByb2plY3QuX3Byb2plY3RJZCA9PT0gcHJvamVjdElkKTtcclxuICAgIFxyXG4gICAgcHJvamVjdHNTdG9yYWdlLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9qZWN0cy1saXN0JywgSlNPTi5zdHJpbmdpZnkocHJvamVjdHNTdG9yYWdlKSk7XHJcbn1cclxuXHJcbi8vIENoYW5nZSBzb21lIHBhcnQgb2YgYW4gZXhpc3RlbnQgcHJvamVjdFxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRXhpc3RlbnRQcm9qZWN0KHByb2plY3Qpe1xyXG4gICAgY29uc3QganNvblByb2plY3QgPSBwcm9qZWN0VG9Kc29uKHByb2plY3QpO1xyXG4gICAgY29uc3QgcHJvamVjdHNTdG9yYWdlID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcblxyXG4gICAgY29uc3QgaW5kZXhPZlByb2plY3RUb0FsdGVyID0gQXJyYXkuZnJvbShwcm9qZWN0c1N0b3JhZ2UpXHJcbiAgICAgICAgLmZpbmRJbmRleChzdG9yZWRQcm9qZWN0ID0+IHN0b3JlZFByb2plY3QuX3Byb2plY3RJZCA9PT0gcHJvamVjdC5nZXRQcm9qZWN0SWQoKSk7XHJcblxyXG4gICAgcHJvamVjdHNTdG9yYWdlW2luZGV4T2ZQcm9qZWN0VG9BbHRlcl0gPSBqc29uUHJvamVjdDtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvamVjdHMtbGlzdCcsIEpTT04uc3RyaW5naWZ5KHByb2plY3RzU3RvcmFnZSkpO1xyXG59XHJcblxyXG4vLyBHZW5lcmF0ZSBhbiBpZGVudGlmaWVyIGZvciBhIG5ldyB0YXNrIGNyZWF0ZWQsIGJhc2VkIG9uIHRoZSBsYXN0IHRhc2sgaW5zaWRlIGEgcHJvamVjdCBwYXJlbnRcclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTmV3VGFza0lkKHByb2plY3Qpe1xyXG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0UGFyZW50ID0gQXJyYXkuZnJvbShzdG9yZWRQcm9qZWN0cylcclxuICAgICAgICAuZmluZChzdG9yZWRQcm9qZWN0ID0+IHN0b3JlZFByb2plY3QuX3Byb2plY3RJZCA9PT0gcHJvamVjdC5nZXRQcm9qZWN0SWQoKSk7XHJcblxyXG4gICAgaWYocHJvamVjdFBhcmVudC5fbGlzdE9mVGFza3MubGVuZ3RoICE9PSAwKXtcclxuICAgICAgICBsZXQgbGFzdElkTnVtYmVyID0gcHJvamVjdFBhcmVudC5fbGlzdE9mVGFza3MuYXQoLTEpLmlkLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgcmV0dXJuIGB0YXNrXyR7KytsYXN0SWROdW1iZXJ9YDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBgdGFza18kezB9YDtcclxuICAgIH1cclxufVxyXG5cclxuLy8gR2VuZXJhdGUgYW4gaWRlbnRpZmllciBmb3IgYSBuZXcgcHJvamVjdCBjcmVhdGVkLCBiYXNlZCBvbiB0aGUgbGFzdCBwcm9qZWN0IGV4aXN0ZW50XHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU5ld1Byb2plY3RJZCgpe1xyXG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuXHJcbiAgICBpZihzdG9yZWRQcm9qZWN0cy5sZW5ndGggIT09IDApe1xyXG4gICAgICAgIGxldCBsYXN0SWROdW1iZXIgPSBzdG9yZWRQcm9qZWN0cy5hdCgtMSkuX3Byb2plY3RJZC5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIHJldHVybiBgcHJvamVjdF8keysrbGFzdElkTnVtYmVyfWA7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIHJldHVybiBgcHJvamVjdF8kezB9YDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3RCeUlkKGlkKXtcclxuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICByZXR1cm4gc3RvcmVkUHJvamVjdHMuZmluZChwcm9qZWN0ID0+IHByb2plY3QuX3Byb2plY3RJZCA9PT0gaWQpO1xyXG59XHJcblxyXG4vLyBDaGVjayBpZiB0aGUgcHJvamVjdCB0byBiZSBzdG9yZWQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN0b3JhZ2VcclxuZnVuY3Rpb24gY2hlY2tJZlByb2plY3RFeGlzdHMocHJvamVjdFRpdGxlKXtcclxuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBjb25zdCBhbGxvd1NhdmUgPSBzdG9yZWRQcm9qZWN0cy5ldmVyeShwcm9qZWN0ID0+IHByb2plY3QuX3RpdGxlICE9PSBwcm9qZWN0VGl0bGUpO1xyXG4gICAgcmV0dXJuIGFsbG93U2F2ZTtcclxufVxyXG5cclxuLy8gUmV0cmlldmUgdXNlcidzIHByb2plY3RzIHN0b3JhZ2UuIElmIGl0IGlzIHVzZXIncyBmaXJzdCB0aW1lIHVzaW5nIHRoZSB0b2RvZG9vLCBjcmVhdGUgYSBuZXcgbGlzdCBvZiBwcm9qZWN0c1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCl7XHJcbiAgICBpZighbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2plY3RzLWxpc3QnKSl7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzLWxpc3QnLCBKU09OLnN0cmluZ2lmeShbXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9qZWN0cy1saXN0JykpO1xyXG59XHJcblxyXG4vLyBUcmFuc2Zvcm0gcHJvamVjdCBvYmplY3QgKHRoYXQgY29udGFpbnMgYWxsIGZ1bmN0aW9ucykgdG8gYSBKU09OIG9iamVjdFxyXG5mdW5jdGlvbiBwcm9qZWN0VG9Kc29uKHByb2plY3Qpe1xyXG4gICAgY29uc3QgX3Byb2plY3RJZCA9IHByb2plY3QuZ2V0UHJvamVjdElkKCk7XHJcbiAgICBjb25zdCBfdGl0bGUgPSBwcm9qZWN0LmdldFRpdGxlKCk7XHJcbiAgICBjb25zdCBfbGlzdE9mVGFza3MgPSBbXTtcclxuICAgXHJcbiAgICAvLyBDb252ZXJ0IGFsbCB0YXNrcyB0byBKU09OIGxpa2Ugb2JqZWN0c1xyXG4gICAgQXJyYXkuZnJvbShwcm9qZWN0LmdldEFsbFRhc2tzKCkpXHJcbiAgICAgICAgLmZvckVhY2goXHJcbiAgICAgICAgICAgIHRhc2sgPT4gX2xpc3RPZlRhc2tzLnB1c2godGFza1RvSnNvbih0YXNrKSlcclxuICAgICAgICApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgX3Byb2plY3RJZCxcclxuICAgICAgICBfdGl0bGUsXHJcbiAgICAgICAgX2xpc3RPZlRhc2tzXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIFRyYW5zZm9ybSB0YXNrIG9iamVjdCAodGhhdCBjb250YWlucyBhbGwgZnVuY3Rpb25zKSB0byBhIEpTT04gb2JqZWN0LFxyXG50byBiZSBwcm9wZXJseSBzdG9yZWQgaW4gdGhlIGxvY2FsU3RvcmFnZSB0b2dldGhlciB3aXRoIGNvcnJlc3BvbmRpbmcgcHJvamVjdCAqL1xyXG5mdW5jdGlvbiB0YXNrVG9Kc29uKHRhc2spe1xyXG4gICAgY29uc3QgaWQgPSB0YXNrLmdldFRhc2tJZCgpO1xyXG4gICAgY29uc3QgbmFtZSA9IHRhc2suZ2V0TmFtZSgpO1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0YXNrLmdldERlc2NyaXB0aW9uKCk7XHJcbiAgICBjb25zdCBkdWVfZGF0ZSA9IHRhc2suZ2V0RHVlRGF0ZSgpO1xyXG4gICAgY29uc3QgcHJpb3JpdHkgPSB0YXNrLmdldFByaW9yaXR5KCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIGR1ZV9kYXRlLFxyXG4gICAgICAgIHByaW9yaXR5XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUYXNrKHRhc2tOYW1lLCBkdWVEYXRlID0gJ25vbmUnLCBkZXNjcmlwdGlvbiA9ICdub25lJywgcHJpb3JpdHkgPSAnbm9uZScsIHRhc2tJZCl7XHJcbiAgICAvLyBVc2VkIHRvIGNyZWF0ZSBhbiBvYmplY3QgYmFzZWQgb24gYW4gZXhpc3RlbnQgKEpTT04gb2JqZWN0IHRoYXQgY29tZXMgZnJvbSBzdG9yYWdlIHRvIFRhc2sgb2JqZWN0KVxyXG4gICAgbGV0IF90YXNrSWQgPSB0YXNrSWQ7XHJcbiAgICBsZXQgX25hbWUgPSB0YXNrTmFtZTtcclxuICAgIGxldCBfZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgICBsZXQgX2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICBsZXQgX3ByaW9yaXR5ID0gcHJpb3JpdHk7XHJcblxyXG4gICAgLy8gR2V0dGVyIGZvciB0YXNrSWRcclxuICAgIGNvbnN0IGdldFRhc2tJZCA9ICgpID0+IF90YXNrSWQ7XHJcblxyXG4gICAgLy8gR2V0dGVyIGFuZCBTZXR0ZXIgZm9yIHRpdGxlXHJcbiAgICBjb25zdCBnZXROYW1lID0gKCkgPT4gX25hbWU7XHJcbiAgICBjb25zdCBzZXROYW1lID0gKG5ld1RpdGxlKSA9PiBfbmFtZSA9IG5ld1RpdGxlO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciBkdWVEYXRlXHJcbiAgICBjb25zdCBnZXREdWVEYXRlID0gKCkgPT4gX2R1ZURhdGU7XHJcbiAgICBjb25zdCBzZXREdWVEYXRlID0gKG5ld0R1ZURhdGUpID0+IF9kdWVEYXRlID0gbmV3RHVlRGF0ZTtcclxuXHJcbiAgICAvLyBHZXR0ZXIgYW5kIFNldHRlciBmb3IgZGVzY3JpcHRpb25cclxuICAgIGNvbnN0IGdldERlc2NyaXB0aW9uID0gKCkgPT4gX2Rlc2NyaXB0aW9uO1xyXG4gICAgY29uc3Qgc2V0RGVzY3JpcHRpb24gPSAobmV3RGVzY3JpcHRpb24pID0+IF9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciBwcmlvcml0eVxyXG4gICAgY29uc3QgZ2V0UHJpb3JpdHkgPSAoKSA9PiBfcHJpb3JpdHk7XHJcbiAgICBjb25zdCBzZXRQcmlvcml0eSA9IChuZXdQcmlvcml0eSkgPT4gX3ByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRUYXNrSWQsXHJcbiAgICAgICAgZ2V0TmFtZSxcclxuICAgICAgICBzZXROYW1lLFxyXG4gICAgICAgIGdldER1ZURhdGUsXHJcbiAgICAgICAgc2V0RHVlRGF0ZSxcclxuICAgICAgICBnZXREZXNjcmlwdGlvbixcclxuICAgICAgICBzZXREZXNjcmlwdGlvbixcclxuICAgICAgICBnZXRQcmlvcml0eSxcclxuICAgICAgICBzZXRQcmlvcml0eVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgcmVtb3ZlRnJvbU1vZGFsIH0gZnJvbSBcIi4vZG9tLW1hbmlwdWxhdGlvbi9tb2RhbC5qc1wiO1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gc2VsZWN0IHRoZSBwYXJlbnQgcHJvamVjdCBvZiBhIHRhc2ssIHRoZSBsaXN0IHdoaWNoIHRoZSB0YXNrIGl0J3MgaW5zaWRlIGFuZCB0aGUgdGFzayBpdHNlbGZcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhc2tFbGVtZW50cyh0YXNrLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgYXNpZGVQcm9qZWN0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRhc2tzU2VjdGlvbkFzaWRlID0gYXNpZGVQcm9qZWN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC10YXNrcy1hc2lkZScpO1xyXG4gICAgY29uc3QgYXNpZGVUYXNrRWxlbWVudCA9IHRhc2tzU2VjdGlvbkFzaWRlLnF1ZXJ5U2VsZWN0b3IoYCNhc2lkZV8ke3Rhc2suZ2V0VGFza0lkKCl9YCk7XHJcblxyXG4gICAgY29uc3QgbWFpblByb2plY3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYG1haW5fJHtwcm9qZWN0SWR9YCk7XHJcbiAgICBjb25zdCB0YXNrc1NlY3Rpb25NYWluID0gbWFpblByb2plY3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0LXRhc2tzLW1haW4nKTtcclxuICAgIGNvbnN0IG1haW5UYXNrRWxlbWVudCA9IHRhc2tzU2VjdGlvbk1haW4ucXVlcnlTZWxlY3RvcihgI21haW5fJHt0YXNrLmdldFRhc2tJZCgpfWApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFza0xpc3RBc2lkZTogdGFza3NTZWN0aW9uQXNpZGUsXHJcbiAgICAgICAgdGFza0FzaWRlOiBhc2lkZVRhc2tFbGVtZW50LFxyXG4gICAgICAgIHRhc2tMaXN0TWFpbjogdGFza3NTZWN0aW9uTWFpbixcclxuICAgICAgICB0YXNrTWFpbjogbWFpblRhc2tFbGVtZW50XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENsZWFyIG1haW4tY29udGVudCBhbmQgYXBwZW5kIHRoZSAnZXhwYW5kZWQnIHByb2plY3QgZnJvbSBhc2lkZVxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNYWluQW5kQXBwZW5kTm9kZShlbGVtZW50LCAuLi5yZXN0KXtcclxuICAgIGNvbnN0IG1haW5Db250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpO1xyXG4gICAgd2hpbGUobWFpbkNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZCl7XHJcbiAgICAgICAgbWFpbkNvbnRlbnQucmVtb3ZlQ2hpbGQobWFpbkNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYocmVzdC5sZW5ndGggIT09IDApXHJcbiAgICAgICAgbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQocmVzdFswXSk7XHJcblxyXG4gICAgaWYoZWxlbWVudC5sZW5ndGggPj0gMSl7XHJcbiAgICAgICAgZWxlbWVudC5mb3JFYWNoKGUgPT4gbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQoZSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUhpbnQodGFza0xpc3Qpe1xyXG4gICAgY29uc3QgZW1wdHlIaW50ID0gY3JlYXRlRWxlbWVudCgncCcsIHtlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LWVtcHR5LWhpbnQnLCBlbGVtZW50VGV4dDogJ05vIHRhc2tzIHlldCEnfSk7XHJcbiAgICB0YXNrTGlzdC5hcHBlbmRDaGlsZChlbXB0eUhpbnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRW1wdHlIaW50KHRhc2tMaXN0KXtcclxuICAgIHRhc2tMaXN0LnJlbW92ZUNoaWxkKHRhc2tMaXN0LmNoaWxkcmVuWzBdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbW1vblRhc2tGb3JtKCl7XHJcbiAgICBjb25zdCBmb3JtID0gY3JlYXRlRWxlbWVudCgnZm9ybScsIHtlbGVtZW50SWQ6ICdmb3JtLXRhc2snfSk7XHJcbiAgICBcclxuICAgIGNvbnN0IGZvcm1UaXRsZSA9IGNyZWF0ZUVsZW1lbnQoJ2gzJywge2VsZW1lbnRDbGFzczogJ2Zvcm0taGVhZGVyJ30pO1xyXG5cclxuICAgIGNvbnN0IGRpdlRpdGxlID0gZGl2Q3JlYXRvcignVGl0bGUgKicsICd0YXNrLW5hbWUtaW5wdXQnLCAndGV4dCcsICd0YXNrX25hbWUnKTtcclxuICAgIGNvbnN0IGRpdkR1ZURhdGUgPSBkaXZDcmVhdG9yKCdEdWUgZGF0ZScsICdkdWUtZGF0ZS1pbnB1dCcsICdkYXRlJywgJ2R1ZV9kYXRlJyk7XHJcbiAgICBjb25zdCBkaXZEZXNjcmlwdGlvbiA9IGRpdkNyZWF0b3IoJ0Rlc2NyaXB0aW9uJywgJ2Rlc2NyaXB0aW9uLWlucHV0JywgJ3RleHRhcmVhJywgJ2Rlc2NyaXB0aW9uJyk7XHJcbiAgIFxyXG4gICAgLy8gRmllbGRzZXQgd2l0aCByYWRpbyBidXR0b25zIGZvciBwcmlvcml0eSBzZWxlY3Rpb25cclxuICAgIGNvbnN0IGZpZWxkc2V0UHJpb3JpdGllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZWxkc2V0Jyk7XHJcbiAgICBjb25zdCBmaWVsZHNldFByaW9yaXRpZXNMZWdlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsZWdlbmQnKTtcclxuICAgIGZpZWxkc2V0UHJpb3JpdGllc0xlZ2VuZC50ZXh0Q29udGVudCA9ICdQcmlvcml0eSc7XHJcbiAgICBcclxuICAgIC8vIERlZmF1bHQgdmFsdWUgZm9yIHByaW9yaXR5XHJcbiAgICBjb25zdCBkaXZOb1ByaW9yaXR5ID0gZGl2Q3JlYXRvcignTm8gcHJpb3JpdHknLCAnbm8tcHJpb3JpdHknLCAncmFkaW8nLCAncHJpb3JpdHknKTtcclxuICAgIGRpdk5vUHJpb3JpdHkubGFzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnJyk7XHJcbiAgICBjb25zdCBkaXZQcmlvcml0eUxvdyA9IGRpdkNyZWF0b3IoJ0xvdycsICdsb3cnLCAncmFkaW8nLCAncHJpb3JpdHknKTtcclxuICAgIGNvbnN0IGRpdlByaW9yaXR5SGlnaCA9IGRpdkNyZWF0b3IoJ0hpZ2gnLCAnaGlnaCcsICdyYWRpbycsICdwcmlvcml0eScpO1xyXG5cclxuICAgIC8vIEZvcm0gYnV0dG9ucyAoQWRkIHRhc2sgYW5kIENhbmNlbClcclxuICAgIGNvbnN0IGRpdkJ1dHRvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdkJ1dHRvbnMuc2V0QXR0cmlidXRlKCdpZCcsICdmb3JtLWJ1dHRvbnMnKTtcclxuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGJ1dHRvbldpdGhUZXh0Q3JlYXRvcignQWRkIFRhc2snLCAnYWRkLXRhc2snLCAnYnV0dG9uJyk7XHJcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBidXR0b25XaXRoVGV4dENyZWF0b3IoJ0NhbmNlbCcsICdjYW5jZWwtdGFzaycsICdidXR0b24nKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZUZyb21Nb2RhbChmb3JtKSk7XHJcblxyXG4gICAgZmllbGRzZXRQcmlvcml0aWVzLmFwcGVuZChcclxuICAgICAgICBmaWVsZHNldFByaW9yaXRpZXNMZWdlbmQsXHJcbiAgICAgICAgZGl2UHJpb3JpdHlIaWdoLFxyXG4gICAgICAgIGRpdlByaW9yaXR5TG93LFxyXG4gICAgICAgIGRpdk5vUHJpb3JpdHlcclxuICAgICk7XHJcbiAgICBcclxuICAgIGRpdkJ1dHRvbnMuYXBwZW5kKFxyXG4gICAgICAgIHN1Ym1pdEJ1dHRvbixcclxuICAgICAgICBjYW5jZWxCdXR0b25cclxuICAgICk7XHJcblxyXG4gICAgZm9ybS5hcHBlbmQoXHJcbiAgICAgICAgZm9ybVRpdGxlLFxyXG4gICAgICAgIGRpdlRpdGxlLCBcclxuICAgICAgICBkaXZEdWVEYXRlLCBcclxuICAgICAgICBkaXZEZXNjcmlwdGlvbixcclxuICAgICAgICBmaWVsZHNldFByaW9yaXRpZXMsXHJcbiAgICAgICAgZGl2QnV0dG9uc1xyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZm9ybTtcclxufVxyXG5cclxuLy8gRXh0cmFjdCB0aGUgZGF0YSB0aGF0IGNvbWVzIGZyb20gdGhlIHRhc2sgZm9ybSAoZWRpdCBhbmQgbmV3IHRhc2spXHJcbmV4cG9ydCBmdW5jdGlvbiB0YXNrRm9ybURhdGFIYW5kbGVyKGZvcm0pe1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgaWYoIWZvcm1EYXRhLmdldCgndGFza19uYW1lJykpe1xyXG4gICAgICAgIGVycm9yRmllbGRDcmVhdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLW5hbWUtaW5wdXQnKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHRhc2tQYXJhbWV0ZXJzID0gW107XHJcbiAgICAgICAgZm9ybURhdGEuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZih2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHRhc2tQYXJhbWV0ZXJzLnB1c2goe1tgJHtrZXl9YF06ICdub25lJ30pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0YXNrUGFyYW1ldGVycy5wdXNoKHtbYCR7a2V5fWBdOiB2YWx1ZX0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFza1BhcmFtZXRlcnM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlcnJvckZpZWxkQ3JlYXRvcihlbGVtZW50VG9BcHBlbmRCZWxvdyl7XHJcbiAgICAvLyBEb24ndCBhbGxvdyB0byBjcmVhdGUgYSBsb3Qgb2YgZXJyb3IgYWR2aXNlc1xyXG4gICAgaWYoZWxlbWVudFRvQXBwZW5kQmVsb3cubmV4dEVsZW1lbnRTaWJsaW5nKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBlcnJvckZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgZXJyb3JGaWVsZC50ZXh0Q29udGVudCA9ICdZb3UgbmVlZCB0byBmaWxsIHRoaXMgZmllbGQhJztcclxuICAgIGVycm9yRmllbGQuc3R5bGUuY3NzVGV4dCA9IFxyXG4gICAgICAgIGB3aWR0aDogbWF4LWNvbnRlbnQ7IFxyXG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDsgXHJcbiAgICAgICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiA1cHhgO1xyXG5cclxuICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnRUb0FwcGVuZEJlbG93LnBhcmVudEVsZW1lbnQ7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZXJyb3JGaWVsZCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHBhcmVudC5yZW1vdmVDaGlsZChlcnJvckZpZWxkKSwgMTUwMCk7XHJcbn1cclxuXHJcbi8vIEhhbmR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGJ1dHRvbiB3aXRoIGFuIGltYWdlIGluc2lkZSAocmlnaHQtc2lkZSBvZiBhIHRhc2sgZWxlbWVudHMgYW5kIGFkZCBuZXcgdGFzayBidXR0b24pXHJcbmV4cG9ydCBmdW5jdGlvbiBidXR0b25XaXRoSW1nKGVsZW1lbnRDbGFzcywgaW1nU3JjLCBvcHRpb25hbFNwYW5UZXh0KXtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgJHtlbGVtZW50Q2xhc3N9YCk7XHJcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xyXG5cclxuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgaW1nLnNyYyA9IGAke2ltZ1NyY31gO1xyXG5cclxuICAgIGlmKG9wdGlvbmFsU3BhblRleHQpe1xyXG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGAke29wdGlvbmFsU3BhblRleHR9YDtcclxuICAgICAgICBzcGFuLnN0eWxlLmNzc1RleHQgPSAnb3JkZXI6IDInOyAvLyBjaGFuZ2Ugb3JkZXIgb2Ygc3BhbiwgcHV0dGluZyBoaW0gYWZ0ZXIgdGhlIGltZ1xyXG4gICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgIH1cclxuXHJcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRoYXQgY29tZXMgaW4gaGFuZHkgdG8gY3JlYXRlIGVsZW1lbnRzIHRoYXQgZ29lcyBpbnNpZGUgYSBwcm9qZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZ05hbWUsIC4uLnJlc3Qpe1xyXG4gICAgY29uc3QgcmVzdFBhcmFtZXRlcnMgPSByZXN0WzBdOyAvLyBOZWVkIHRoaXMgYmVjYXVzZSBpdCBjb21lcyBhcyBhbiBhcnJheVxyXG4gICAgY29uc3Qge2VsZW1lbnRDbGFzcywgZWxlbWVudElkLCBlbGVtZW50U3JjLCBlbGVtZW50VGV4dH0gPSByZXN0UGFyYW1ldGVycztcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGAke3RhZ05hbWV9YCk7XHJcblxyXG4gICAgaWYoZWxlbWVudElkKVxyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGAke2VsZW1lbnRJZH1gKTtcclxuXHJcbiAgICBpZihlbGVtZW50Q2xhc3MpXHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYCR7ZWxlbWVudENsYXNzfWApO1xyXG5cclxuICAgIGlmKGVsZW1lbnRTcmMpXHJcbiAgICAgICAgZWxlbWVudC5zcmMgPSBlbGVtZW50U3JjO1xyXG5cclxuICAgIGlmKGVsZW1lbnRUZXh0KVxyXG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBlbGVtZW50VGV4dDtcclxuXHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxufVxyXG5cclxuLy8gXCJDbGVhblwiIHRoZSBwcm9qZWN0IGlkZW50aWZpZXIgZnJvbSB0aGUgbWFpbi1jb250ZW50IG9yIGFzaWRlLCB1c2luZyBvbmx5IHRoZSByZWxldmFudCBwYXJ0IG9mIGhpbSAoZS5nIG1haW5fcHJvamVjdF8wID0+IHByb2plY3RfMClcclxuZXhwb3J0IGNvbnN0IGNsZWFuUHJvamVjdElkID0gKHJhd0lkKSA9PiByYXdJZC5zbGljZShyYXdJZC5pbmRleE9mKCdfJykgKyAxKTtcclxuXHJcbi8vIEZ1bmN0aW9uIHRoYXQgY29tZXMgaW4gaGFuZHkgdG8gY3JlYXRlIGVsZW1lbnRzIHRoYXQgZ29lcyBpbnNpZGUgdGhlIGZvcm0gZm9yIGEgbmV3IHRhc2tcclxuZXhwb3J0IGZ1bmN0aW9uIGRpdkNyZWF0b3IobGFiZWxUZXh0LCBpbnB1dElkLCBpbnB1dFR5cGUsIGlucHV0TmFtZSl7XHJcbiAgICBjb25zdCBkaXZXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBgJHtpbnB1dElkfWApO1xyXG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbFRleHQ7XHJcblxyXG4gICAgbGV0IGlucHV0O1xyXG4gICAgaWYoaW5wdXRUeXBlID09PSAndGV4dGFyZWEnKXtcclxuICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnLCAnMTQwJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgYCR7aW5wdXRUeXBlfWApO1xyXG5cclxuICAgICAgICBpZihpbnB1dFR5cGUgPT09ICd0ZXh0Jyl7XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgJzI1Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpbnB1dElkfWApO1xyXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgYCR7aW5wdXROYW1lfWApO1xyXG5cclxuICAgIGlmKGlucHV0LnR5cGUgPT09ICdyYWRpbycpXHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGAke2lucHV0SWR9YCk7XHJcblxyXG4gICAgZGl2V3JhcHBlci5hcHBlbmQobGFiZWwsIGlucHV0KTtcclxuICAgIHJldHVybiBkaXZXcmFwcGVyO1xyXG59XHJcblxyXG4vLyBIYW5keSBmdW5jdGlvbiB0byBjcmVhdGUgYSBidXR0b24gd2l0aCBhIHRleHRcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1dHRvbldpdGhUZXh0Q3JlYXRvcihidXR0b25UZXh0LCBidXR0b25JZCwgYnV0dG9uVHlwZSl7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIFxyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtidXR0b25JZH1gKTtcclxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCBgJHtidXR0b25UeXBlfWApXHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBgJHtidXR0b25UZXh0fWA7XHJcblxyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxufSIsImltcG9ydCBQcm9qZWN0IGZyb20gXCIuLi9hcHAtbG9naWMvcHJvamVjdC5qc1wiO1xyXG5pbXBvcnQgeyBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBjcmVhdGVOZXdQcm9qZWN0Rm9ybSwgY3JlYXRlUHJvamVjdEFzaWRlIH0gZnJvbSBcIi4vcHJvamVjdEFzaWRlLmpzXCI7XHJcbmltcG9ydCB7IGdldFdlZWtUYXNrcywgZ2V0RmlsdGVyZWRUYXNrcyB9IGZyb20gXCIuL3RvZGF5QW5kV2Vla1Rhc2tzLmpzXCI7XHJcblxyXG4vLyBGdW5jdGlvbiB0byBzdGFydCBhbGwgZXZlbnRMaXN0ZW5lcnMgcmVsYXRlZCB0byB0aGUgdXNlci1wcm9qZWN0cyBzZWN0aW9uIGFuZCBpbml0aWFsIGVsZW1lbnRzIChmb3IgcHJvamVjdHMgc3RvcmVkIHByZXZpb3VzbHkpXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXJ0VUlBbmRMaXN0ZW5lcnMoKXtcclxuICAgIG9wZW5DbG9zZUFzaWRlKCk7XHJcbiAgICBcclxuICAgIC8vIFN0YXJ0IHRoZSB0b2RheSBzZWN0aW9uLCBhcyB0aGUgZmlyc3Qgc2VsZWN0ZWRcclxuICAgIGNvbnN0IHRvZGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZGF5LXRvZG8tYnV0dG9uJyk7XHJcbiAgICB0b2RheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd0YWItc2VsZWN0ZWQnKTtcclxuICAgIGdldEZpbHRlcmVkVGFza3MoJ3RvZGF5Jyk7XHJcbiAgICB0b2RheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBzZWxlY3RUYWIodG9kYXlCdXR0b24pO1xyXG4gICAgICAgIGdldEZpbHRlcmVkVGFza3MoJ3RvZGF5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB3ZWVrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlZWstdG9kby1idXR0b24nKTtcclxuICAgIHdlZWtCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgc2VsZWN0VGFiKHdlZWtCdXR0b24pO1xyXG4gICAgICAgIGdldEZpbHRlcmVkVGFza3MoJ3dlZWsnKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQnV0dG9uIHRvIHNob3cvaGlkZSB1c2VyJ3MgcHJvamVjdHNcclxuICAgIGNvbnN0IHVzZXJQcm9qZWN0c0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLXByb2plY3RzLWJ1dHRvbicpO1xyXG4gICAgdXNlclByb2plY3RzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gb3BlbkNsb3NlTXlQcm9qZWN0cyh1c2VyUHJvamVjdHNCdXR0b24pKTtcclxuXHJcbiAgICAvLyBCdXR0b24gdG8gY3JlYXRlIG5ldyBwcm9qZWN0XHJcbiAgICBjb25zdCBhZGROZXdQcm9qZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1uZXctcHJvamVjdC1idXR0b24nKTtcclxuICAgIGFkZE5ld1Byb2plY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IGNyZWF0ZU5ld1Byb2plY3RGb3JtKGV2ZW50LmN1cnJlbnRUYXJnZXQpKTtcclxuXHJcbiAgICAvLyBHZXQgYWxsIHVzZXIncyBwcm9qZWN0cyBhbmQgY3JlYXRlIGEgbmV3IGVsZW1lbnQgb24gdGhlIGFzaWRlXHJcbiAgICBjb25zdCBhbGxVc2VyUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuICAgIEFycmF5LmZyb20oYWxsVXNlclByb2plY3RzKS5mb3JFYWNoKHByb2plY3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpO1xyXG4gICAgICAgIGNyZWF0ZVByb2plY3RBc2lkZShwcm9qZWN0T2JqZWN0KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdFRhYihlbGVtZW50Q2xpY2tlZCl7XHJcbiAgICBjb25zdCBjdXJyZW50VGFiU2VsZWN0ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWItc2VsZWN0ZWQnKVswXTtcclxuXHJcbiAgICBpZighKGN1cnJlbnRUYWJTZWxlY3RlZCA9PT0gdW5kZWZpbmVkKSl7XHJcbiAgICAgICAgY3VycmVudFRhYlNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3RhYi1zZWxlY3RlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRDbGlja2VkLmNsYXNzTGlzdC5hZGQoJ3RhYi1zZWxlY3RlZCcpO1xyXG59XHJcblxyXG4vLyBIYW5kbGUgc2hvdy9oaWRlIGFsbCB1c2VyJ3MgcHJvamVjdHMgKGRpdiB0aGF0IGNvbnRhaW5zIE15IFByb2plY3RzIHRleHQpXHJcbmZ1bmN0aW9uIG9wZW5DbG9zZU15UHJvamVjdHMoYnV0dG9uKXtcclxuICAgIGNvbnN0IGljb25JbnNpZGVCdXR0b24gPSBidXR0b24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdO1xyXG5cclxuICAgIGlmKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT09ICdzaG93Jyl7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaGlkZScpO1xyXG4gICAgICAgXHJcbiAgICAgICAgLy8gQXJyb3cgZWZmZWN0IHVzaW5nIGFuIGFuaW1hdGlvbiBkZWZpbmVkIGluIHRoZSBjc3MgZmlsZSwgZnJvbSBvcGVuIHRvIGNsb3NlZCAoYm90dG9tIHRvIHJpZ2h0KVxyXG4gICAgICAgIGljb25JbnNpZGVCdXR0b24uc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwOyc7XHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ2FuaW1hdGlvbjogcHJvamVjdHNCdXR0b25DaGFuZ2luZ0RpcmVjdGlvbiAxNTBtcyBub3JtYWwgZm9yd2FyZHM7J1xyXG4gICAgICAgICwgMTUwKTtcclxuXHJcbiAgICAgICAgaGlkZVByb2plY3RzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzaG93Jyk7ICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQXJyb3cgZWZmZWN0IHVzaW5nIGFuIGFuaW1hdGlvbiBkZWZpbmVkIGluIHRoZSBjc3MgZmlsZSwgZnJvbSBjbG9zZWQgdG8gb3BlbiAocmlnaHQgdG8gYm90dG9tKVxyXG4gICAgICAgIGljb25JbnNpZGVCdXR0b24uc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwOyc7XHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ2FuaW1hdGlvbjogcHJvamVjdHNCdXR0b25DaGFuZ2luZ0RpcmVjdGlvbiAxNTBtcyByZXZlcnNlIGJhY2t3YXJkczsnXHJcbiAgICAgICAgLCAxNTApO1xyXG5cclxuICAgICAgICBzaG93UHJvamVjdHMoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1Byb2plY3RzKCl7XHJcbiAgICBjb25zdCBsaXN0T2ZQcm9qZWN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXByb2plY3RzLXVzZXInKTtcclxuICAgIGxpc3RPZlByb2plY3RzLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleDsnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlUHJvamVjdHMoKXtcclxuICAgIGNvbnN0IGxpc3RPZlByb2plY3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtcHJvamVjdHMtdXNlcicpO1xyXG4gICAgbGlzdE9mUHJvamVjdHMuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lOyc7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRvIG9wZW4gYW5kIGhpZGUgdGhlIGFzaWRlIG1lbnUgd2hlbiBjbGlja2VkXHJcbmZ1bmN0aW9uIG9wZW5DbG9zZUFzaWRlKCl7XHJcbiAgICBjb25zdCBoYW1idXJndWVyTWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoYW1idXJndWVyLW1lbnUtYnV0dG9uJyk7XHJcbiAgICBoYW1idXJndWVyTWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3MgPSBoYW1idXJndWVyTWVudS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoY3VycmVudENsYXNzID09PSAnc2hvdycpe1xyXG4gICAgICAgICAgICBoYW1idXJndWVyTWVudS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2hpZGUnKTtcclxuICAgICAgICAgICAgdG9nZ2xlQXNpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhhbWJ1cmd1ZXJNZW51LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2hvdycpO1xyXG4gICAgICAgICAgICB0b2dnbGVBc2lkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVBc2lkZSgpe1xyXG4gICAgY29uc3QgYXNpZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNpZGUtbmF2aWdhdGlvbicpO1xyXG5cclxuICAgIGlmKGFzaWRlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA9PT0gJ2FzaWRlLXNob3cnKXtcclxuICAgICAgICBhc2lkZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2FzaWRlLWhpZGUnKTtcclxuICAgICAgICBhc2lkZS5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGFzaWRlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXNpZGUtc2hvdycpOyAvLyBBZGQgdGhpcyBjbGFzcyB0byBwdXQgbWFpbi1jb250ZW50IGJhY2sgdG8gaXRzIHBsYWNlXHJcbiAgICAgICAgYXNpZGUuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4Oyc7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gYXBwZW5kVG9Nb2RhbChodG1sRWxlbWVudCl7XHJcbiAgICBjb25zdCBtb2RhbEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1ib3gnKTtcclxuICAgIGNsZWFyTW9kYWwobW9kYWxCb3gpO1xyXG5cclxuICAgIG1vZGFsQm94LmFwcGVuZENoaWxkKGh0bWxFbGVtZW50KTtcclxuICAgIGNoYW5nZU1vZGFsU3RhdGUobW9kYWxCb3gpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbU1vZGFsKGh0bWxFbGVtZW50KXtcclxuICAgIGNvbnN0IG1vZGFsQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWJveCcpO1xyXG4gICAgbW9kYWxCb3gucmVtb3ZlQ2hpbGQoaHRtbEVsZW1lbnQpO1xyXG4gICAgY2hhbmdlTW9kYWxTdGF0ZShtb2RhbEJveCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNb2RhbFN0YXRlKG1vZGFsKXtcclxuICAgIGNvbnN0IGN1cnJlbnRDbGFzcyA9IG1vZGFsLmdldEF0dHJpYnV0ZSgnY2xhc3MnKTtcclxuXHJcbiAgICBpZihjdXJyZW50Q2xhc3MgPT09ICdzaG93JylcclxuICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2hpZGUnKTtcclxuICAgIGVsc2VcclxuICAgICAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3Nob3cnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJNb2RhbChtb2RhbCl7XHJcbiAgICB3aGlsZShtb2RhbC5maXJzdEVsZW1lbnRDaGlsZCl7XHJcbiAgICAgICAgbW9kYWwucmVtb3ZlQ2hpbGQobW9kYWwubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHNhdmVQcm9qZWN0IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBidXR0b25XaXRoSW1nLCBjcmVhdGVFbGVtZW50LCBjcmVhdGVFbXB0eUhpbnQsIGVycm9yRmllbGRDcmVhdG9yIH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBzZWxlY3RUYWIgfSBmcm9tIFwiLi9hc2lkZVNlY3Rpb24uanNcIjtcclxuaW1wb3J0IHsgZXhwYW5kUHJvamVjdFRhc2tzIH0gZnJvbSBcIi4vcHJvamVjdE1haW4uanNcIjtcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgZm9ybSB0byBjcmVhdGUgYSBuZXcgcHJvamVjdFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVOZXdQcm9qZWN0Rm9ybShidXR0b25OZXdQcm9qZWN0KXtcclxuICAgIGJ1dHRvbk5ld1Byb2plY3Quc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwJzsgLy8gSGlkZSAncGx1cycgYnV0dG9uXHJcbiAgICBjb25zdCBmb3JtV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoJ2Zvcm0nLCB7ZWxlbWVudElkOiAnZm9ybS1hZGQtcHJvamVjdCd9KTtcclxuXHJcbiAgICAvLyBJbnB1dCB0byBwbGFjZSB0aGUgbmV3IHByb2plY3QncyBuYW1lXHJcbiAgICBjb25zdCBwcm9qZWN0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgIE9iamVjdC5hc3NpZ24ocHJvamVjdE5hbWVJbnB1dCwge1xyXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcclxuICAgICAgICBpZDogJ3Byb2plY3QtbmFtZScsXHJcbiAgICAgICAgbmFtZTogJ3Byb2plY3RfbmFtZScsXHJcbiAgICAgICAgcGxhY2Vob2xkZXI6IGBOZXcgcHJvamVjdCdzIG5hbWVgXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0TmFtZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgcHJvamVjdE5hbWVEaXYuYXBwZW5kQ2hpbGQocHJvamVjdE5hbWVJbnB1dCk7XHJcblxyXG4gICAgLy8gQnV0dG9uIHRvIGNvbmZpcm0gdGhlIGNyZWF0aW9uIG9mIGEgbmV3IHByb2plY3RcclxuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoJ2NyZWF0ZS1wcm9qZWN0LWJ1dHRvbicsICcvZGlzdC9hc3NldHMvYXNpZGUtaWNvbnMvc2VsZWN0ZWQtaWNvbi5zdmcnKTtcclxuICAgIGFkZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG5ld1Byb2plY3RIYW5kbGVyKGZvcm1XcmFwcGVyLCBidXR0b25OZXdQcm9qZWN0KSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIHRvIGNhbmNlbCB0aGUgY3JlYXRpb24gb2YgYSBuZXcgcHJvamVjdFxyXG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gYnV0dG9uV2l0aEltZygnY2FuY2VsLXByb2plY3QtYnV0dG9uJywgJy9kaXN0L2Fzc2V0cy9hc2lkZS1pY29ucy9jYW5jZWwtaWNvbi5zdmcnKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZVByb2plY3RGb3JtKGZvcm1XcmFwcGVyLCBidXR0b25OZXdQcm9qZWN0KSk7XHJcblxyXG4gICAgLy8gV3JhcHBlciBmb3IgY2FuY2VsIGFuZCBjcmVhdGUgcHJvamVjdCBidXR0b25zXHJcbiAgICBjb25zdCBidXR0b25zV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYnV0dG9uc1dyYXBwZXIuYXBwZW5kKGFkZEJ1dHRvbiwgY2FuY2VsQnV0dG9uKTtcclxuICAgIGZvcm1XcmFwcGVyLmFwcGVuZChwcm9qZWN0TmFtZURpdiwgYnV0dG9uc1dyYXBwZXIpO1xyXG5cclxuICAgIC8vIFRoaXMgZWxlbWVudHMgYXJlIHVzZWQgdG8gcG9zaXRpb24gdGhlIHByb2plY3QgZm9ybSBjb3JyZWN0bHlcclxuICAgIGNvbnN0IHBhcmVudE9mTmV3UHJvamVjdEJ1dHRvbiA9IGJ1dHRvbk5ld1Byb2plY3QucGFyZW50Tm9kZTsgLy8gKCNjcmVhdGUtYW5kLWxpc3QtdXNlci1wcm9qZWN0cylcclxuICAgIGNvbnN0IHBhcmVudE9mUGFyZW50ID0gcGFyZW50T2ZOZXdQcm9qZWN0QnV0dG9uLnBhcmVudE5vZGU7IC8vICgjdXNlci1wcm9qZWN0cylcclxuICAgIFxyXG4gICAgLy8gcGFyZW50T2ZQYXJlbnQubGFzdEVsZW1lbnRDaGlsZCBpcyB0aGUgZWxlbWVudCB1c2VkIGFzIGEgcmVmZXJlbmNlLCB0byB1c2UgaW5zZXJ0QmVmb3JlXHJcbiAgICBwYXJlbnRPZlBhcmVudC5pbnNlcnRCZWZvcmUoZm9ybVdyYXBwZXIsIHBhcmVudE9mUGFyZW50Lmxhc3RFbGVtZW50Q2hpbGQpO1xyXG59XHJcblxyXG4vLyBDaGVjayBpZiB0aGUgcHJvamVjdCB0aXRsZSBpbnB1dCBpcyBmaWxsZWQsIGFuZCBjcmVhdGUgYSBuZXcgcHJvamVjdCAoSFRNTCBhbmQgU3RvcmFnZSlcclxuZnVuY3Rpb24gbmV3UHJvamVjdEhhbmRsZXIoZm9ybSwgYnV0dG9uTmV3UHJvamVjdCl7XHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuXHJcbiAgICBpZighZm9ybURhdGEuZ2V0KCdwcm9qZWN0X25hbWUnKSl7XHJcbiAgICAgICAgZXJyb3JGaWVsZENyZWF0b3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2plY3QtbmFtZScpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBQcm9qZWN0KGZvcm1EYXRhLmdldCgncHJvamVjdF9uYW1lJykpO1xyXG5cclxuICAgICAgICBpZihzYXZlUHJvamVjdChwcm9qZWN0KSAhPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICBjcmVhdGVQcm9qZWN0QXNpZGUocHJvamVjdCk7XHJcbiAgICAgICAgICAgIHJlbW92ZVByb2plY3RGb3JtKGZvcm0sIGJ1dHRvbk5ld1Byb2plY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJQcm9qZWN0IGFscmVhZHkgZXhpc3RzIVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gUmVtb3ZlIG5ldyBwcm9qZWN0IGZvcm0gYW5kIHNob3dzIHRoZSAncGx1cycgYnV0dG9uIGFnYWluXHJcbmZ1bmN0aW9uIHJlbW92ZVByb2plY3RGb3JtKGZvcm0sIGJ1dHRvbk5ld1Byb2plY3Qpe1xyXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IGZvcm0ucGFyZW50RWxlbWVudDtcclxuICAgIHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZm9ybSk7XHJcbiAgICBidXR0b25OZXdQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSAnb3BhY2l0eTogMSc7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGFuIEhUTUwgZWxlbWVudCBmb3IgYSBuZXcgY3JlYXRlZCBwcm9qZWN0ICgpXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm9qZWN0QXNpZGUocHJvamVjdE9iamVjdCl7XHJcbiAgICBjb25zdCBwcm9qZWN0SWQgPSBwcm9qZWN0T2JqZWN0LmdldFByb2plY3RJZCgpO1xyXG4gICAgY29uc3QgcHJvamVjdFRpdGxlID0gcHJvamVjdE9iamVjdC5nZXRUaXRsZSgpO1xyXG4gICAgY29uc3QgcHJvamVjdFRhc2tzID0gcHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpO1xyXG4gICAgXHJcbiAgICBjb25zdCBhcnJvd0Rvd25JbWFnZSA9IGNyZWF0ZUVsZW1lbnQoJ2ltZycsIHtlbGVtZW50U3JjOiAnL2Rpc3QvYXNzZXRzL2FzaWRlLWljb25zL2Fycm93LWRvd24taWNvbi0yMi5wbmcnfSk7XHJcbiAgICBjb25zdCBidXR0b25UZXh0ID0gY3JlYXRlRWxlbWVudCgncCcsIHtlbGVtZW50VGV4dDogYCR7cHJvamVjdFRpdGxlfWB9KTtcclxuICAgIGNvbnN0IGV4cGFuZEltYWdlID0gY3JlYXRlRWxlbWVudCgnaW1nJywge2VsZW1lbnRTcmM6ICcvZGlzdC9hc3NldHMvYXNpZGUtaWNvbnMvZXhwYW5kLWljb24ucG5nJywgZWxlbWVudENsYXNzOiAnZXhwYW5kLXByb2plY3QtdGFza3MnfSk7XHJcbiAgICBjb25zdCBhbGxUYXNrc0VsZW1lbnRzID0gcHJvamVjdFRhc2tzLm1hcCh0YXNrID0+IGNyZWF0ZVRhc2tFbGVtZW50QXNpZGUodGFzaykpO1xyXG5cclxuICAgIC8vIFdyYXAgYnV0dG9ucyB0byBzaG93L2hpZGUgYW5kIGV4cGFuZCBwcm9qZWN0IHRvIGEgZGl2XHJcbiAgICBjb25zdCBkaXZCdXR0b25zUHJvamVjdE5hbWUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdCBzaG93J30pO1xyXG4gICAgZGl2QnV0dG9uc1Byb2plY3ROYW1lLmFwcGVuZChhcnJvd0Rvd25JbWFnZSwgYnV0dG9uVGV4dCwgZXhwYW5kSW1hZ2UpO1xyXG4gICAgXHJcbiAgICAvLyBldmVudExpc3RlbmVyIHRvIHNob3cvaGlkZSBhbmQgZXhwYW5kIGEgcHJvamVjdFxyXG4gICAgbmV3UHJvamVjdEJ1dHRvbkxpc3RlbmVyKGRpdkJ1dHRvbnNQcm9qZWN0TmFtZSwgZXhwYW5kSW1hZ2UpO1xyXG5cclxuICAgIC8vIEJ1dHRvbnMgdG8gc2hvdy9oaWRlIGFuZCBleHBhbmQgcHJvamVjdFxyXG4gICAgZGl2QnV0dG9uc1Byb2plY3ROYW1lLmFwcGVuZChhcnJvd0Rvd25JbWFnZSwgYnV0dG9uVGV4dCwgZXhwYW5kSW1hZ2UpO1xyXG4gICAgXHJcbiAgICAvLyBXcmFwcGVyIGZvciBhbGwgdGFza3Mgb2YgdGhlIGN1cnJlbnQgcHJvamVjdFxyXG4gICAgY29uc3QgYWxsVGFza3NXcmFwcGVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge2VsZW1lbnRDbGFzczogJ3Byb2plY3QtdGFza3MtYXNpZGUnfSk7XHJcblxyXG4gICAgaWYoYWxsVGFza3NFbGVtZW50cy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgY3JlYXRlRW1wdHlIaW50KGFsbFRhc2tzV3JhcHBlcik7XHJcbiAgICBlbHNlIFxyXG4gICAgICAgIEFycmF5LmZyb20oYWxsVGFza3NFbGVtZW50cykuZm9yRWFjaChlbGVtZW50ID0+IGFsbFRhc2tzV3JhcHBlci5hcHBlbmRDaGlsZChlbGVtZW50KSk7XHJcblxyXG4gICAgLy8gQXBwZW5kIGFsbCBlbGVtZW50cyB0byBhIGRpdiB0aGF0IHdyYXBzIGFsbCB0aGUgY29udGVudCBvZiBhIHByb2plY3RcclxuICAgIGNvbnN0IGRpdldyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdC1uYW1lLWFuZC10YXNrcycsIGVsZW1lbnRJZDogYGFzaWRlXyR7cHJvamVjdElkfWB9KTtcclxuICAgIGRpdldyYXBwZXIuYXBwZW5kKGRpdkJ1dHRvbnNQcm9qZWN0TmFtZSwgYWxsVGFza3NXcmFwcGVyKTtcclxuXHJcbiAgICAvLyBTZWN0aW9uIHRoYXQgY29udGFpbnMgYWxsIHVzZXIncyBwcm9qZWN0c1xyXG4gICAgY29uc3QgdXNlclByb2plY3RzU2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXByb2plY3RzLXVzZXInKTtcclxuXHJcbiAgICByZXR1cm4gdXNlclByb2plY3RzU2VjdGlvbi5hcHBlbmRDaGlsZChkaXZXcmFwcGVyKTtcclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgdGFzayBlbGVtZW50IHRvIHB1dCBpbnNpZGUgdGhlIHJlbGF0ZWQgcHJvamVjdCBpbiB0aGUgYXNpZGUgc2VjdGlvblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGFza0VsZW1lbnRBc2lkZSh0YXNrKXtcclxuICAgIGNvbnN0IHRhc2tXcmFwcGVyQXNpZGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiAndGFzay1hc2lkZScsIFxyXG4gICAgICAgIGVsZW1lbnRJZDogYGFzaWRlXyR7dGFzay5nZXRUYXNrSWQoKX1gLFxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBzcGFuUHJpb3JpdHkgPSBjcmVhdGVFbGVtZW50KCdzcGFuJywge2VsZW1lbnRDbGFzczogYHRhc2stcHJpb3JpdHktYXNpZGUgJHt0YXNrLmdldFByaW9yaXR5KCl9YH0pO1xyXG4gICAgY29uc3QgdGFza05hbWUgPSBjcmVhdGVFbGVtZW50KCdwJywge2VsZW1lbnRUZXh0OiBgJHt0YXNrLmdldE5hbWUoKX1gfSk7XHJcbiAgICB0YXNrV3JhcHBlckFzaWRlLmFwcGVuZChzcGFuUHJpb3JpdHksIHRhc2tOYW1lKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHRhc2tXcmFwcGVyQXNpZGU7XHJcbn1cclxuXHJcbi8vIFNldCBuZXcgcHJvamVjdCBldmVudExpc3RlbmVycywgdG8gc2hvdy9oaWRlIGFuZCBleHBhbmQgY29udGVudCB0byBtYWluLWNvbnRlbnQgZGl2IChub3QgeWV0IGltcGxlbWVudGVkKVxyXG5mdW5jdGlvbiBuZXdQcm9qZWN0QnV0dG9uTGlzdGVuZXIoYnV0dG9uU2hvd0hpZGUsIGJ1dHRvbkV4cGFuZCl7XHJcbiAgICBidXR0b25TaG93SGlkZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9wZW5DbG9zZVByb2plY3RUYXNrcyhidXR0b25TaG93SGlkZSkpO1xyXG4gICAgYnV0dG9uRXhwYW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgc2VsZWN0VGFiKGJ1dHRvbkV4cGFuZC5wYXJlbnRFbGVtZW50KTtcclxuICAgICAgICBleHBhbmRQcm9qZWN0VGFza3MoYnV0dG9uRXhwYW5kKTsgLy8gRXhwYW5kIG1lYW5zIHRoYXQgdGhlIHByb2plY3Qgd2lsbCBiZSBleHBhbmRlZCB0byB0aGUgbWFpbi1jb250ZW50XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gSGFuZGxlIHNob3cvaGlkZSB0YXNrcyBvZiBhIHByb2plY3QsIGJ5IGNsaWNraW5nIGluIHRoZSBwcm9qZWN0IGRpdlxyXG5mdW5jdGlvbiBvcGVuQ2xvc2VQcm9qZWN0VGFza3MocHJvamVjdEJ1dHRvbil7XHJcbiAgICBjb25zdCBpY29uSW5zaWRlQnV0dG9uID0gcHJvamVjdEJ1dHRvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF07XHJcblxyXG4gICAgaWYocHJvamVjdEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSl7XHJcbiAgICAgICAgcHJvamVjdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgcHJvamVjdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XHJcbiAgICAgICBcclxuICAgICAgICAvLyBBcnJvdyBlZmZlY3QgdXNpbmcgYW4gYW5pbWF0aW9uIGRlZmluZWQgaW4gdGhlIGNzcyBmaWxlLCBmcm9tIG9wZW4gdG8gY2xvc2VkIChib3R0b20gdG8gcmlnaHQpXHJcbiAgICAgICAgaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDA7JztcclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSAnYW5pbWF0aW9uOiBwcm9qZWN0c0J1dHRvbkNoYW5naW5nRGlyZWN0aW9uIDE1MG1zIG5vcm1hbCBmb3J3YXJkczsnXHJcbiAgICAgICAgLCAxNTApO1xyXG5cclxuICAgICAgICBoaWRlVGFza3NPZlByb2plY3QocHJvamVjdEJ1dHRvbik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgICAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBBcnJvdyBlZmZlY3QgdXNpbmcgYW4gYW5pbWF0aW9uIGRlZmluZWQgaW4gdGhlIGNzcyBmaWxlLCBmcm9tIGNsb3NlZCB0byBvcGVuIChyaWdodCB0byBib3R0b20pXHJcbiAgICAgICAgaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDA7JztcclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSAnYW5pbWF0aW9uOiBwcm9qZWN0c0J1dHRvbkNoYW5naW5nRGlyZWN0aW9uIDE1MG1zIHJldmVyc2UgYmFja3dhcmRzOydcclxuICAgICAgICAsIDE1MCk7XHJcblxyXG4gICAgICAgIHNob3dUYXNrc09mUHJvamVjdChwcm9qZWN0QnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB1c2VkIHRvIGhpZGUgdGFza3Mgb2YgYSBwcm9qZWN0LCBieSBjbGlja2luZyBpbiB0aGUgcHJvamVjdCBuYW1lIChpZiBvcGVuKVxyXG4gICAgZnVuY3Rpb24gaGlkZVRhc2tzT2ZQcm9qZWN0KGJ1dHRvbil7XHJcbiAgICAgICAgY29uc3QgcGFyZW50UHJvamVjdCA9IGJ1dHRvbi5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHRhc2tzT2ZQcm9qZWN0ID0gcGFyZW50UHJvamVjdC5sYXN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIHRhc2tzT2ZQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSAnYW5pbWF0aW9uOiBkZWxheUFzaWRlIDMwMG1zIHJldmVyc2UgZm9yd2FyZHM7JztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRhc2tzT2ZQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnLCAzMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHVzZWQgdG8gc2hvdyB0YXNrcyBvZiBhIHByb2plY3QsIGJ5IGNsaWNraW5nIGluIHRoZSBwcm9qZWN0IG5hbWUgKGlmIGNsb3NlZClcclxuICAgIGZ1bmN0aW9uIHNob3dUYXNrc09mUHJvamVjdChidXR0b24pe1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFByb2plY3QgPSBidXR0b24ucGFyZW50RWxlbWVudDtcclxuICAgICAgICBjb25zdCB0YXNrc09mUHJvamVjdCA9IHBhcmVudFByb2plY3QubGFzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICB0YXNrc09mUHJvamVjdC5zdHlsZS5jc3NUZXh0ID0gJ2FuaW1hdGlvbjogZGVsYXlBc2lkZSAzMDBtcyBmb3J3YXJkczsnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGFza3NPZlByb2plY3Quc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4OycsIDMwMCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdEJ5SWQsIHVwZGF0ZUV4aXN0ZW50UHJvamVjdCB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBidXR0b25XaXRoSW1nLCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRQcm9qZWN0SGFuZGxlcihwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbWFpbl8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHByb2plY3RIZWFkZXIgPSBwcm9qZWN0V3JhcHBlci5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC1oZWFkZXInKTtcclxuICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdFdyYXBwZXIucXVlcnlTZWxlY3RvcignLnByb2plY3QtbmFtZScpO1xyXG4gICAgY29uc3QgcHJvamVjdEJ1dHRvbnMgPSBwcm9qZWN0TmFtZS5uZXh0RWxlbWVudFNpYmxpbmc7IFxyXG4gICAgcHJvamVjdEJ1dHRvbnMuc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwJzsgLy8gSGlkZSB0aGUgcHJvamVjdCBidXR0b25zIChlZGl0IGFuZCBkZWxldGUgaWNvbnMpXHJcbiAgICBcclxuICAgIGNvbnN0IG9sZFByb2plY3ROYW1lID0gcHJvamVjdE5hbWUudGV4dENvbnRlbnQ7IC8vIFVzZWQgaW4gY2FzZSBvZiB1c2VyIGNhbmNlbCB0aGUgdGl0bGUgZWRpdFxyXG4gICAgcHJvamVjdE5hbWUuc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCAndHJ1ZScpO1xyXG4gICAgcHJvamVjdE5hbWUuc3R5bGUuY3NzVGV4dCA9ICdib3JkZXI6IDFweCBzb2xpZCBibGFjazsnO1xyXG4gICAgcHJvamVjdE5hbWUuZm9jdXMoKTtcclxuXHJcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gYnV0dG9uV2l0aEltZygnY29uZmlybS1wcm9qZWN0LW5hbWUnLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvc2VsZWN0ZWQtaWNvbi0yOC5zdmcnKTtcclxuICAgIGNvbmZpcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aXRsZUVkaXRIYW5kbGVyKHByb2plY3ROYW1lLCBwcm9qZWN0QnV0dG9ucywgcHJvamVjdElkKSk7XHJcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBidXR0b25XaXRoSW1nKCdjb25maXJtLXByb2plY3QtbmFtZScsICcvZGlzdC9hc3NldHMvbWFpbi1pY29ucy9jYW5jZWwtaWNvbi0yOC5zdmcnKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZVRpdGxlRWRpdChwcm9qZWN0TmFtZSwgcHJvamVjdEJ1dHRvbnMsIG9sZFByb2plY3ROYW1lKSk7XHJcbiAgICBjb25zdCB3cmFwcGVyQnV0dG9ucyA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50Q2xhc3M6ICdlZGl0LXByb2plY3QtYnV0dG9ucyd9KTtcclxuICAgIHdyYXBwZXJCdXR0b25zLmFwcGVuZChjb25maXJtQnV0dG9uLCBjYW5jZWxCdXR0b24pO1xyXG5cclxuICAgIHByb2plY3RIZWFkZXIuaW5zZXJ0QmVmb3JlKHdyYXBwZXJCdXR0b25zLCBwcm9qZWN0TmFtZS5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aXRsZUVkaXRIYW5kbGVyKG5hbWVFbGVtZW50LCBwcm9qZWN0QnV0dG9ucywgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IG5ld1RpdGxlID0gbmFtZUVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkKTtcclxuICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpO1xyXG4gICAgcHJvamVjdE9iamVjdC5zZXRUaXRsZShuZXdUaXRsZSk7XHJcbiAgICB1cGRhdGVFeGlzdGVudFByb2plY3QocHJvamVjdE9iamVjdCk7XHJcbiAgICB1cGRhdGVQcm9qZWN0RWxlbWVudChuZXdUaXRsZSwgcHJvamVjdElkKTtcclxuICAgIHJlbW92ZVRpdGxlRWRpdChuYW1lRWxlbWVudCwgcHJvamVjdEJ1dHRvbnMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVQcm9qZWN0RWxlbWVudChuZXdUaXRsZSwgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IHByb2plY3RBc2lkZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRpdGxlQXNpZGVTZWN0aW9uID0gcHJvamVjdEFzaWRlLnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0Jyk7XHJcbiAgICBjb25zdCBwcm9qZWN0VGl0bGVBc2lkZSA9IHRpdGxlQXNpZGVTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3AnKTtcclxuICAgIHByb2plY3RUaXRsZUFzaWRlLnRleHRDb250ZW50ID0gbmV3VGl0bGU7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdE1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbWFpbl8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRpdGxlTWFpblNlY3Rpb24gPSBwcm9qZWN0TWFpbi5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC1uYW1lJyk7XHJcbiAgICB0aXRsZU1haW5TZWN0aW9uLnRleHRDb250ZW50ID0gbmV3VGl0bGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRpdGxlRWRpdChlbGVtZW50LCBwcm9qZWN0QnV0dG9ucywgb2xkRWxlbWVudE5hbWUpe1xyXG4gICAgaWYob2xkRWxlbWVudE5hbWUpXHJcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IG9sZEVsZW1lbnROYW1lO1xyXG5cclxuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnKTtcclxuICAgIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdib3JkZXItY29sb3I6IHRyYW5zcGFyZW50Oyc7XHJcbiAgICBwcm9qZWN0QnV0dG9ucy5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDEnO1xyXG4gICAgXHJcbiAgICBjb25zdCBlbGVtZW50UGFyZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgZWxlbWVudFBhcmVudC5yZW1vdmVDaGlsZChlbGVtZW50Lm5leHRFbGVtZW50U2libGluZyk7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdEJ5SWQgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgYnV0dG9uV2l0aEltZywgY2xlYW5Qcm9qZWN0SWQsIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUsIGNyZWF0ZUNvbW1vblRhc2tGb3JtLCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBlZGl0UHJvamVjdEhhbmRsZXIgfSBmcm9tIFwiLi9wcm9qZWN0RWRpdC5qc1wiO1xyXG5pbXBvcnQgeyByZW1vdmVQcm9qZWN0SGFuZGxlciB9IGZyb20gXCIuL3Byb2plY3RSZW1vdmUuanNcIjtcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBuZXdUYXNrRm9ybSB9IGZyb20gXCIuL3Rhc2tDcmVhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBlZGl0VGFza0Zvcm0gfSBmcm9tIFwiLi90YXNrRWRpdC5qc1wiO1xyXG5pbXBvcnQgeyBleHBhbmRUYXNrc0luZm8gfSBmcm9tIFwiLi90YXNrRXhwYW5kLmpzXCI7XHJcbmltcG9ydCB7IGRlbGV0ZVRhc2tGcm9tUHJvamVjdCB9IGZyb20gXCIuL3Rhc2tSZW1vdmUuanNcIjtcclxuXHJcbi8vIEV4cGFuZCBhIHByb2plY3QgaW4gdGhlIG1haW4tY29udGVudCBkaXYgKG5vdCB5ZXQgaW1wbGVtZW50ZWQpXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRQcm9qZWN0VGFza3MoYnV0dG9uVGhhdFRyaWdnZXJlZCl7XHJcbiAgICBjb25zdCBzZWxlY3RlZFByb2plY3REaXZQYXJlbnQgPSBidXR0b25UaGF0VHJpZ2dlcmVkLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIGxldCBwYXJlbnRQcm9qZWN0Q2xlYW5JZCA9IGNsZWFuUHJvamVjdElkKHNlbGVjdGVkUHJvamVjdERpdlBhcmVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiB0aGUgcHJvamVjdCBleGlzdHNcclxuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0QnlJZChwYXJlbnRQcm9qZWN0Q2xlYW5JZCk7XHJcbiAgICBcclxuICAgIGlmKHByb2plY3Qpe1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpOyAvLyBJZiBwcm9qZWN0cyBleGlzdHMsIGNyZWF0ZSBhIFwibmV3XCIgb2JqZWN0IGJhc2VkIG9uIGhpbSwgdG8gYmUgYWJsZSB0byBtYW5pcHVsYXRlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBwcm9qZWN0IGV4cGFuZGVkIGZyb20gYXNpZGUgYW5kIGRpc3BsYXkgaXQgaW4gdGhlICNtYWluLWNvbnRlbnQgZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IHByb2plY3RNYWluRWxlbWVudCA9IGNyZWF0ZVByb2plY3RNYWluKHByb2plY3RPYmplY3QpO1xyXG4gICAgICAgIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUocHJvamVjdE1haW5FbGVtZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgSFRNTCBwcm9qZWN0IGVsZW1lbnQgdG8gcGxhY2UgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb2plY3RNYWluKHByb2plY3Qpe1xyXG4gICAgY29uc3QgcHJvamVjdElkID0gcHJvamVjdC5nZXRQcm9qZWN0SWQoKTtcclxuICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdC5nZXRUaXRsZSgpO1xyXG4gICAgY29uc3QgcHJvamVjdFRhc2tzID0gcHJvamVjdC5nZXRBbGxUYXNrcygpO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3ROYW1lSDMgPSBjcmVhdGVFbGVtZW50KCdoMycsIHtlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LW5hbWUnLCBlbGVtZW50VGV4dDogYCR7cHJvamVjdE5hbWV9YH0pO1xyXG4gICAgY29uc3QgZWRpdEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoJ2VkaXQtcHJvamVjdCcsICcvZGlzdC9hc3NldHMvbWFpbi1pY29ucy9lZGl0LWljb24tMjYuc3ZnJyk7XHJcbiAgICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZWRpdFByb2plY3RIYW5kbGVyKHByb2plY3RJZCkpO1xyXG4gICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYnV0dG9uV2l0aEltZygncmVtb3ZlLXByb2plY3QnLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvdHJhc2gtaWNvbi0yOC5zdmcnKTtcclxuICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZVByb2plY3RIYW5kbGVyKHByb2plY3RJZCkpO1xyXG4gICAgY29uc3QgcHJvamVjdEJ1dHRvbnMgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdC1idXR0b25zJ30pO1xyXG4gICAgcHJvamVjdEJ1dHRvbnMuYXBwZW5kKGVkaXRCdXR0b24sIHJlbW92ZUJ1dHRvbik7XHJcbiAgICBjb25zdCBwcm9qZWN0SGVhZGVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge2VsZW1lbnRDbGFzczogJ3Byb2plY3QtaGVhZGVyJ30pO1xyXG4gICAgcHJvamVjdEhlYWRlci5hcHBlbmQocHJvamVjdE5hbWVIMywgcHJvamVjdEJ1dHRvbnMpO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3RUYXNrc1dyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdC10YXNrcy1tYWluJ30pO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIGFuIEhUTUwgZWxlbWVudCBmb3IgZWFjaCBleGlzdGVudCB0YXNrXHJcbiAgICBBcnJheS5mcm9tKHByb2plY3RUYXNrcykubWFwKHRhc2sgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhc2tFbGVtZW50ID0gY3JlYXRlVGFza0VsZW1lbnRNYWluKHRhc2ssIHByb2plY3RJZCk7XHJcbiAgICAgICAgcHJvamVjdFRhc2tzV3JhcHBlci5hcHBlbmRDaGlsZCh0YXNrRWxlbWVudCk7IC8vIEFwcGVuZCB0byB0aGUgbGlzdCB0aGF0IGNvbnRhaW5zIGFsbCB0YXNrc1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vIEJ1dHRvbiB0byBhZGQgYSBuZXcgdGFzayB0byB0aGUgcHJvamVjdFxyXG4gICAgY29uc3QgbmV3VGFza0J1dHRvbiA9IGJ1dHRvbldpdGhJbWcoJ2FkZC10YXNrJywgJy9kaXN0L2Fzc2V0cy9tYWluLWljb25zL3BsdXMtaWNvbi10YXNrLWFkZC5zdmcnLCAnQWRkIG5ldyB0YXNrJyk7XHJcbiAgICBuZXdUYXNrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCB0YXNrRm9ybSA9IGNyZWF0ZUNvbW1vblRhc2tGb3JtKCk7XHJcbiAgICAgICAgbmV3VGFza0Zvcm0odGFza0Zvcm0sIHByb2plY3RJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBcHBlbmQgYWxsIGVsZW1lbnRzIHRvIHRoZSBwcm9qZWN0IHdyYXBwZXIgKGhvbGQgYWxsIHRhc2tzIGFuZCBpbmZvcyBvZiBhIHNpbmdsZSBwcm9qZWN0KVxyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudElkOiBgbWFpbl8ke3Byb2plY3RJZH1gLCBlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LXdyYXBwZXInfSk7XHJcbiAgICBwcm9qZWN0V3JhcHBlci5hcHBlbmQocHJvamVjdEhlYWRlciwgcHJvamVjdFRhc2tzV3JhcHBlciwgbmV3VGFza0J1dHRvbik7XHJcblxyXG4gICAgcmV0dXJuIHByb2plY3RXcmFwcGVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGFza0VsZW1lbnRNYWluKHRhc2ssIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB0YXNrV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50SWQ6IGBtYWluXyR7dGFzay5nZXRUYXNrSWQoKX1gLCBlbGVtZW50Q2xhc3M6ICd0YXNrLW1haW4nfSk7XHJcblxyXG4gICAgLy8gTGVmdCBzaWRlIG9mIGEgdGFzayBkaXNwbGF5ZWQgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuICAgIGNvbnN0IGxlZnRTaWRlV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50Q2xhc3M6ICd0YXNrLWxlZnQtc2lkZSd9KTtcclxuICAgIGNvbnN0IHByaW9yaXR5QnV0dG9uID0gY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge2VsZW1lbnRDbGFzczogYHRhc2stcHJpb3JpdHktbWFpbiAke3Rhc2suZ2V0UHJpb3JpdHkoKX1gfSk7XHJcbiAgICBjb25zdCB0YXNrTmFtZUFuZER1ZURhdGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAndGFzay1uYW1lLWFuZC1kYXRlJ30pO1xyXG4gICAgY29uc3QgdGFza05hbWUgPSBjcmVhdGVFbGVtZW50KCdwJywge2VsZW1lbnRDbGFzczogJ3Rhc2stbmFtZScsIGVsZW1lbnRUZXh0OiBgJHt0YXNrLmdldE5hbWUoKX1gfSk7XHJcbiAgICBjb25zdCB0YXNrRHVlRGF0ZSA9IGNyZWF0ZUVsZW1lbnQoJ3AnLCB7ZWxlbWVudENsYXNzOiAndGFzay1kdWUtZGF0ZScsIGVsZW1lbnRUZXh0OiBgJHt0YXNrLmdldER1ZURhdGUoKX1gfSk7XHJcbiAgICB0YXNrTmFtZUFuZER1ZURhdGUuYXBwZW5kKHRhc2tOYW1lLCB0YXNrRHVlRGF0ZSk7XHJcbiAgICBsZWZ0U2lkZVdyYXBwZXIuYXBwZW5kKHByaW9yaXR5QnV0dG9uLCB0YXNrTmFtZUFuZER1ZURhdGUpO1xyXG4gICAgXHJcbiAgICAvLyBSaWdodCBzaWRlIChidXR0b25zIHRvIGNoYW5nZSBzdGF0ZSBvZiBhIHRhc2spIG9mIGEgdGFzayBkaXNwbGF5ZWQgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuICAgIGNvbnN0IHJpZ2h0U2lkZVdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAndGFzay1yaWdodC1zaWRlJ30pO1xyXG4gICAgY29uc3QgZXhwYW5kQnV0dG9uID0gYnV0dG9uV2l0aEltZygnZXhwYW5kLXRhc2snLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvZXllLWljb24ucG5nJyk7XHJcbiAgICBleHBhbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHRhc2tGb3JtID0gY3JlYXRlQ29tbW9uVGFza0Zvcm0oKTtcclxuICAgICAgICBleHBhbmRUYXNrc0luZm8odGFzaywgcHJvamVjdElkLCB0YXNrRm9ybSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBidXR0b25XaXRoSW1nKCdlZGl0LXRhc2snLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvZWRpdC1pY29uLnN2ZycpO1xyXG4gICAgZWRpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBsZXQgdGFza0Zvcm0gPSBjcmVhdGVDb21tb25UYXNrRm9ybSgpO1xyXG4gICAgICAgIGVkaXRUYXNrRm9ybSh0YXNrLCBwcm9qZWN0SWQsIHRhc2tGb3JtKTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYnV0dG9uV2l0aEltZygnZGVsZXRlLXRhc2snLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvcmVtb3ZlLWljb24uc3ZnJyk7XHJcbiAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBkZWxldGVUYXNrRnJvbVByb2plY3QodGFzaywgcHJvamVjdElkKSk7XHJcbiAgICByaWdodFNpZGVXcmFwcGVyLmFwcGVuZChleHBhbmRCdXR0b24sIGVkaXRCdXR0b24sIHJlbW92ZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRvIHRoZSB0YXNrIHdyYXBwZXJcclxuICAgIHRhc2tXcmFwcGVyLmFwcGVuZChsZWZ0U2lkZVdyYXBwZXIsIHJpZ2h0U2lkZVdyYXBwZXIpO1xyXG5cclxuICAgIHJldHVybiB0YXNrV3JhcHBlcjtcclxufSIsImltcG9ydCB7IHJlbW92ZVByb2plY3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUHJvamVjdEhhbmRsZXIocHJvamVjdElkKXtcclxuICAgIGNvbnN0IG1haW5Db250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpO1xyXG4gICAgY29uc3QgcHJvamVjdE1haW5Ub1JlbW92ZSA9IG1haW5Db250ZW50LnF1ZXJ5U2VsZWN0b3IoYCNtYWluXyR7cHJvamVjdElkfWApO1xyXG4gICAgbWFpbkNvbnRlbnQucmVtb3ZlQ2hpbGQocHJvamVjdE1haW5Ub1JlbW92ZSk7XHJcblxyXG4gICAgY29uc3QgYXNpZGVQcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC1wcm9qZWN0cy11c2VyJyk7XHJcbiAgICBjb25zdCBwcm9qZWN0QXNpZGVUb1JlbW92ZSA9IGFzaWRlUHJvamVjdHNMaXN0LnF1ZXJ5U2VsZWN0b3IoYCNhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGFzaWRlUHJvamVjdHNMaXN0LnJlbW92ZUNoaWxkKHByb2plY3RBc2lkZVRvUmVtb3ZlKTtcclxuXHJcbiAgICByZW1vdmVQcm9qZWN0U3RvcmFnZShwcm9qZWN0SWQpO1xyXG59IiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4uL2FwcC1sb2dpYy9wcm9qZWN0LmpzXCI7XHJcbmltcG9ydCBUYXNrIGZyb20gXCIuLi9hcHAtbG9naWMvdGFzay5qc1wiO1xyXG5pbXBvcnQgeyB1cGRhdGVFeGlzdGVudFByb2plY3QsIGdlbmVyYXRlTmV3VGFza0lkLCBnZXRQcm9qZWN0QnlJZCB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBnZXRUYXNrRWxlbWVudHMsIHJlbW92ZUVtcHR5SGludCwgdGFza0Zvcm1EYXRhSGFuZGxlciB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuaW1wb3J0IHsgYXBwZW5kVG9Nb2RhbCwgcmVtb3ZlRnJvbU1vZGFsIH0gZnJvbSBcIi4vbW9kYWwuanNcIjtcclxuaW1wb3J0IHsgY3JlYXRlVGFza0VsZW1lbnRBc2lkZSB9IGZyb20gXCIuL3Byb2plY3RBc2lkZS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVUYXNrRWxlbWVudE1haW4gfSBmcm9tIFwiLi9wcm9qZWN0TWFpbi5qc1wiO1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSBmb3JtIHRvIGNyZWF0ZSBhIG5ldyB0YXNrLCBpbnNpZGUgYW4gZXhpc3RlbnQgcHJvamVjdFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuZXdUYXNrRm9ybShmb3JtLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgZm9ybVRpdGxlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1oZWFkZXInKTtcclxuICAgIGZvcm1UaXRsZS50ZXh0Q29udGVudCA9ICdBZGQgYSBuZXcgdGFzayc7XHJcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdGFzaycpO1xyXG4gICAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gbmV3VGFza0hhbmRsZXIoZm9ybSwgcHJvamVjdElkKSk7XHJcbiAgICBhcHBlbmRUb01vZGFsKGZvcm0pO1xyXG59XHJcblxyXG4vLyBJZiB1c2VyIGNsaWNrcyBvbiB0aGUgYWRkIHRhc2sgYnV0dG9uLCB0aGUgaW5mbyB0aGF0IGNvbWVzIGZyb20gdGhlIGZvcm0gaXMgaGFuZGxlZFxyXG5mdW5jdGlvbiBuZXdUYXNrSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgdGFza1BhcmFtZXRlcnMgPSB0YXNrRm9ybURhdGFIYW5kbGVyKGZvcm0sIHByb2plY3RJZCk7XHJcbiAgICBcclxuICAgIGlmKHRhc2tQYXJhbWV0ZXJzKXtcclxuICAgICAgICBjb25zdCBuZXdUYXNrID0gc2F2ZVRhc2tUb1Byb2plY3QodGFza1BhcmFtZXRlcnMsIHByb2plY3RJZCk7XHJcbiAgICAgICAgY3JlYXRlVGFza0VsZW1lbnQobmV3VGFzaywgcHJvamVjdElkKTtcclxuICAgICAgICByZW1vdmVGcm9tTW9kYWwoZm9ybSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdldCBwcm9qZWN0IGZyb20gc3RvcmFnZSBhbmQgdHJhbnNmb3JtIGhpbSBpbiBhIHByb2plY3Qgb2JqZWN0IHRvIHN0b3JlIHRoZSBuZXcgdGFzayBpbnNpZGUgb2YgaXQgdmlhIHRoZSBtZXRob2QgYWRkVGFza1RvUHJvamVjdCgpXHJcbmZ1bmN0aW9uIHNhdmVUYXNrVG9Qcm9qZWN0KHRhc2tQYXJhbWV0ZXJzLCBwYXJlbnRQcm9qZWN0SWQpe1xyXG4gICAgbGV0IHRhc2tfbmFtZSwgZHVlX2RhdGUsIGRlc2NyaXB0aW9uLCBwcmlvcml0eTtcclxuICAgIFt7dGFza19uYW1lfSwge2R1ZV9kYXRlfSwge2Rlc2NyaXB0aW9ufSwge3ByaW9yaXR5fV0gPSB0YXNrUGFyYW1ldGVycztcclxuXHJcbiAgICAvLyBDaGVja3MgaWYgdGhlIHByb2plY3QgZXhpc3RzXHJcbiAgICBjb25zdCBwcm9qZWN0RnJvbVN0b3JhZ2UgPSBnZXRQcm9qZWN0QnlJZChwYXJlbnRQcm9qZWN0SWQpO1xyXG5cclxuICAgIGlmKHByb2plY3RGcm9tU3RvcmFnZSl7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdEZyb21TdG9yYWdlKTtcclxuICAgICAgICBjb25zdCBuZXdUYXNrID0gVGFzayh0YXNrX25hbWUsIGR1ZV9kYXRlLCBkZXNjcmlwdGlvbiwgcHJpb3JpdHksIGdlbmVyYXRlTmV3VGFza0lkKHByb2plY3RPYmplY3QpKTtcclxuICAgICAgICBcclxuICAgICAgICBwcm9qZWN0T2JqZWN0LmFkZFRhc2tUb1Byb2plY3QobmV3VGFzayk7XHJcbiAgICAgICAgdXBkYXRlRXhpc3RlbnRQcm9qZWN0KHByb2plY3RPYmplY3QpOyAvLyBVcGRhdGUgdGhlIHByb2plY3QgaW4gdGhlIHN0b3JhZ2Ugd2l0aCB0aGUgbmV3IHRhc2tcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1Rhc2s7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdlbmVyYXRlIGEgbmV3IHRhc2sgZWxlbWVudCBpbiBib3RoIHBhcmVudCBwcm9qZWN0IHNlY3Rpb25zIChhc2lkZSBhbmQgbWFpbi1jb250ZW50KVxyXG5mdW5jdGlvbiBjcmVhdGVUYXNrRWxlbWVudCh0YXNrLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3Qge3Rhc2tMaXN0QXNpZGUsIHRhc2tMaXN0TWFpbn0gPSBnZXRUYXNrRWxlbWVudHModGFzaywgcHJvamVjdElkKTtcclxuXHJcbiAgICBpZih0YXNrTGlzdEFzaWRlLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA9PT0gJ3Byb2plY3QtZW1wdHktaGludCcpIFxyXG4gICAgICAgIHJlbW92ZUVtcHR5SGludCh0YXNrTGlzdEFzaWRlKTtcclxuXHJcbiAgICAvLyBQbGFjZSB0aGUgbmV3IGVsZW1lbnQgd2l0aGluIHRoZSBwcm9qZWN0IGluIHRoZSBhc2lkZVxyXG4gICAgY29uc3QgdGFza0VsZW1lbnRBc2lkZSA9IGNyZWF0ZVRhc2tFbGVtZW50QXNpZGUodGFzayk7XHJcbiAgICB0YXNrTGlzdEFzaWRlLmFwcGVuZENoaWxkKHRhc2tFbGVtZW50QXNpZGUpO1xyXG5cclxuICAgIC8vIFBsYWNlIHRoZSBuZXcgZWxlbWVudCB3aXRoaW4gdGhlIHByb2plY3QgaW4gdGhlIG1haW4tY29udGVudFxyXG4gICAgY29uc3QgdGFza0VsZW1lbnRNYWluID0gY3JlYXRlVGFza0VsZW1lbnRNYWluKHRhc2ssIHByb2plY3RJZCk7XHJcbiAgICB0YXNrTGlzdE1haW4uYXBwZW5kQ2hpbGQodGFza0VsZW1lbnRNYWluKTtcclxufVxyXG4iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgdXBkYXRlRXhpc3RlbnRQcm9qZWN0LCBnZXRQcm9qZWN0QnlJZCwgZ2V0UHJvamVjdExpc3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGdldFRhc2tFbGVtZW50cywgdGFza0Zvcm1EYXRhSGFuZGxlciB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuaW1wb3J0IHsgYXBwZW5kVG9Nb2RhbCwgcmVtb3ZlRnJvbU1vZGFsIH0gZnJvbSBcIi4vbW9kYWwuanNcIjtcclxuaW1wb3J0IHsgY3JlYXRlVGFza0VsZW1lbnRBc2lkZSB9IGZyb20gXCIuL3Byb2plY3RBc2lkZS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVUYXNrRWxlbWVudE1haW4gfSBmcm9tIFwiLi9wcm9qZWN0TWFpbi5qc1wiO1xyXG5pbXBvcnQgeyBnZXRGaWx0ZXJlZFRhc2tzIH0gZnJvbSBcIi4vdG9kYXlBbmRXZWVrVGFza3MuanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlZGl0VGFza0Zvcm0odGFzaywgcHJvamVjdElkLCBmb3JtKXtcclxuICAgIGNvbnN0IGZvcm1UaXRsZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm0taGVhZGVyJyk7XHJcbiAgICBmb3JtVGl0bGUudGV4dENvbnRlbnQgPSAnRWRpdCB0YXNrJztcclxuXHJcbiAgICBjb25zdCB0YXNrSW5wdXROYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcjdGFzay1uYW1lLWlucHV0Jyk7XHJcbiAgICB0YXNrSW5wdXROYW1lLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBgJHt0YXNrLmdldE5hbWUoKX1gKTtcclxuXHJcbiAgICBjb25zdCB0YXNrSW5wdXREdWVEYXRlPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNkdWUtZGF0ZS1pbnB1dCcpO1xyXG4gICAgaWYodGFzay5nZXREdWVEYXRlKCkgPT09ICdub25lJyl7XHJcbiAgICAgICAgdGFza0lucHV0RHVlRGF0ZS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGFza0lucHV0RHVlRGF0ZS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgYCR7dGFzay5nZXREdWVEYXRlKCl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGFza0lucHV0RGVzY3JpcHRpb24gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNkZXNjcmlwdGlvbi1pbnB1dCcpO1xyXG4gICAgdGFza0lucHV0RGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBgJHt0YXNrLmdldERlc2NyaXB0aW9uKCl9YDtcclxuXHJcbiAgICBjb25zdCB0YXNrUHJpb3JpdHkgPSB0YXNrLmdldFByaW9yaXR5KCk7XHJcbiAgICBjb25zdCBmb3JtUHJpb3JpdGllcyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcIltuYW1lPSdwcmlvcml0eSddXCIpO1xyXG4gICAgQXJyYXkuZnJvbShmb3JtUHJpb3JpdGllcykuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBpZihlbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gdGFza1ByaW9yaXR5KVxyXG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICcnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignI2FkZC10YXNrJyk7XHJcbiAgICBzdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSAnRWRpdCB0YXNrJztcclxuICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGVkaXRUYXNrSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpKTtcclxuXHJcbiAgICBjb25zdCB0YXNrSWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0YXNrSWQsIHtcclxuICAgICAgICBpZDogJ3Rhc2staWQnLFxyXG4gICAgICAgIHR5cGU6ICdoaWRkZW4nLFxyXG4gICAgICAgIG5hbWU6ICd0YXNrX2lkJyxcclxuICAgICAgICB2YWx1ZTogYCR7dGFzay5nZXRUYXNrSWQoKX1gXHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3JtLmFwcGVuZENoaWxkKHRhc2tJZCk7XHJcbiAgICBhcHBlbmRUb01vZGFsKGZvcm0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlZGl0VGFza0hhbmRsZXIoZm9ybSwgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IHRhc2tQYXJhbWV0ZXJzID0gdGFza0Zvcm1EYXRhSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpO1xyXG4gICAgXHJcbiAgICBpZih0YXNrUGFyYW1ldGVycyl7XHJcbiAgICAgICAgY29uc3QgY2hhbmdlZFRhc2sgPSBzYXZlTW9kVGFza1RvUHJvamVjdCh0YXNrUGFyYW1ldGVycywgcHJvamVjdElkKTtcclxuICAgICAgICB1cGRhdGVUYXNrRWxlbWVudChjaGFuZ2VkVGFzaywgcHJvamVjdElkKTtcclxuICAgICAgICByZW1vdmVGcm9tTW9kYWwoZm9ybSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVNb2RUYXNrVG9Qcm9qZWN0KHRhc2tQYXJhbWV0ZXJzLCBwYXJlbnRQcm9qZWN0SWQpe1xyXG4gICAgbGV0IHRhc2tfaWQsIHRhc2tfbmFtZSwgZHVlX2RhdGUsIGRlc2NyaXB0aW9uLCBwcmlvcml0eTtcclxuICAgIFt7dGFza19uYW1lfSwge2R1ZV9kYXRlfSwge2Rlc2NyaXB0aW9ufSwge3ByaW9yaXR5fSwge3Rhc2tfaWR9XSA9IHRhc2tQYXJhbWV0ZXJzO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiB0aGUgcHJvamVjdCBleGlzdHNcclxuICAgIGNvbnN0IHByb2plY3RGcm9tU3RvcmFnZSA9IGdldFByb2plY3RCeUlkKHBhcmVudFByb2plY3RJZCk7XHJcblxyXG4gICAgaWYocHJvamVjdEZyb21TdG9yYWdlKXtcclxuICAgICAgICBjb25zdCBwcm9qZWN0T2JqZWN0ID0gUHJvamVjdChwcm9qZWN0RnJvbVN0b3JhZ2UpO1xyXG4gICAgICAgIGNvbnN0IHRhc2tUb0NoYW5nZSA9IHByb2plY3RPYmplY3QuZ2V0VGFza0J5SWQodGFza19pZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGFza1RvQ2hhbmdlLnNldE5hbWUodGFza19uYW1lKTtcclxuICAgICAgICB0YXNrVG9DaGFuZ2Uuc2V0RHVlRGF0ZShkdWVfZGF0ZSk7XHJcbiAgICAgICAgdGFza1RvQ2hhbmdlLnNldERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKTtcclxuICAgICAgICB0YXNrVG9DaGFuZ2Uuc2V0UHJpb3JpdHkocHJpb3JpdHkpO1xyXG5cclxuICAgICAgICB1cGRhdGVFeGlzdGVudFByb2plY3QocHJvamVjdE9iamVjdCk7IC8vIFVwZGF0ZSB0aGUgcHJvamVjdCBpbiB0aGUgc3RvcmFnZSB3aXRoIHRoZSBtb2RpZmllZCB0YXNrIFxyXG5cclxuICAgICAgICByZXR1cm4gdGFza1RvQ2hhbmdlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0lmVG9kYXlPcldlZWsoKXtcclxuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jb250ZW50Jyk7XHJcbiAgICBjb25zdCB0b2RheUlkZW50aWZpZXIgPSBtYWluLnF1ZXJ5U2VsZWN0b3IoJyN0b2RheS1oZWFkZXInKTtcclxuICAgIGNvbnN0IHdlZWtJZGVudGlmaWVyID0gbWFpbi5xdWVyeVNlbGVjdG9yKCcjd2Vlay1oZWFkZXInKTtcclxuXHJcbiAgICBpZihtYWluLmZpcnN0RWxlbWVudENoaWxkID09PSB0b2RheUlkZW50aWZpZXIpXHJcbiAgICAgICAgcmV0dXJuICd0b2RheSc7XHJcblxyXG4gICAgaWYobWFpbi5maXJzdEVsZW1lbnRDaGlsZCA9PT0gd2Vla0lkZW50aWZpZXIpXHJcbiAgICAgICAgcmV0dXJuICd3ZWVrJztcclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIFVwZGF0ZSB0aGUgZWxlbWVudCBpbiB0aGUgRE9NIHdpdGggdGhlIG5ldyB2YWx1ZXMgKGFzaWRlIGFuZCBtYWluIHNlY3Rpb25zKVxyXG5mdW5jdGlvbiB1cGRhdGVUYXNrRWxlbWVudCh0YXNrLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3Qge3Rhc2tMaXN0QXNpZGUsIHRhc2tBc2lkZSwgdGFza0xpc3RNYWluLCB0YXNrTWFpbn0gPSBnZXRUYXNrRWxlbWVudHModGFzaywgcHJvamVjdElkKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGFzayBlbGVtZW50IHdpdGhpbiB0aGUgcHJvamVjdCBpbiB0aGUgYXNpZGUgKHJlbW92ZSB0aGUgb2xkIHRhc2sgYW5kIHBsYWNlIGl0IHRoZSBuZXcpXHJcbiAgICBjb25zdCB1cGRhdGVkQXNpZGVUYXNrID0gY3JlYXRlVGFza0VsZW1lbnRBc2lkZSh0YXNrKTtcclxuICAgIHRhc2tMaXN0QXNpZGUuaW5zZXJ0QmVmb3JlKHVwZGF0ZWRBc2lkZVRhc2ssIHRhc2tBc2lkZSk7XHJcbiAgICB0YXNrTGlzdEFzaWRlLnJlbW92ZUNoaWxkKHRhc2tBc2lkZSk7XHJcblxyXG4gICAgY29uc3Qgc2VjdGlvblRvVXBkYXRlID0gY2hlY2tJZlRvZGF5T3JXZWVrKCk7XHJcbiAgICBpZihzZWN0aW9uVG9VcGRhdGUpe1xyXG4gICAgICAgIGdldEZpbHRlcmVkVGFza3MoYCR7c2VjdGlvblRvVXBkYXRlfWApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIHRhc2sgZWxlbWVudCB3aXRoaW4gdGhlIHByb2plY3QgaW4gdGhlIG1haW4tY29udGVudCAocmVtb3ZlIHRoZSBvbGQgdGFzayBhbmQgcGxhY2UgaXQgdGhlIG5ldylcclxuICAgICAgICBjb25zdCB1cGRhdGVkTWFpblRhc2sgPSBjcmVhdGVUYXNrRWxlbWVudE1haW4odGFzaywgcHJvamVjdElkKTtcclxuICAgICAgICB0YXNrTGlzdE1haW4uaW5zZXJ0QmVmb3JlKHVwZGF0ZWRNYWluVGFzaywgdGFza01haW4pO1xyXG4gICAgICAgIHRhc2tMaXN0TWFpbi5yZW1vdmVDaGlsZCh0YXNrTWFpbik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBhcHBlbmRUb01vZGFsIH0gZnJvbSBcIi4vbW9kYWwuanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRUYXNrc0luZm8odGFzaywgcHJvamVjdElkLCB0YXNrRm9ybSl7XHJcbiAgICBjb25zdCB0YXNrVGl0bGUgPSB0YXNrLmdldE5hbWUoKTtcclxuICAgIGNvbnN0IHRhc2tEdWVEYXRlID0gdGFzay5nZXREdWVEYXRlKCk7XHJcbiAgICBjb25zdCB0YXNrRGVzY3JpcHRpb24gPSB0YXNrLmdldERlc2NyaXB0aW9uKCk7XHJcbiAgICBsZXQgdGFza1ByaW9yaXR5ID0gdGFzay5nZXRQcmlvcml0eSgpO1xyXG4gICAgdGFza1ByaW9yaXR5ID0gdGFza1ByaW9yaXR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGFza1ByaW9yaXR5LnNsaWNlKDEpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1UaXRsZSA9IHRhc2tGb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWhlYWRlcicpO1xyXG4gICAgZm9ybVRpdGxlLnRleHRDb250ZW50ID0gYCR7dGFza1RpdGxlfWA7XHJcbiAgICB0YXNrRm9ybS5yZW1vdmVDaGlsZChmb3JtVGl0bGUubmV4dEVsZW1lbnRTaWJsaW5nKTsgLy8gUmVtb3ZlIHRoZSB0YXNrIG5hbWUgaW5wdXRcclxuXHJcbiAgICBjb25zdCBmb3JtRHVlRGF0ZSA9IHRhc2tGb3JtLnF1ZXJ5U2VsZWN0b3IoJyNkdWUtZGF0ZS1pbnB1dCcpO1xyXG4gICAgZm9ybUR1ZURhdGUudmFsdWUgPSBgJHt0YXNrRHVlRGF0ZX1gO1xyXG4gICAgZm9ybUR1ZURhdGUucmVhZE9ubHkgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EZXNjcmlwdGlvbiA9IHRhc2tGb3JtLnF1ZXJ5U2VsZWN0b3IoJyNkZXNjcmlwdGlvbi1pbnB1dCcpO1xyXG4gICAgZm9ybURlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gYCR7dGFza0Rlc2NyaXB0aW9ufWA7XHJcbiAgICBmb3JtRGVzY3JpcHRpb24ucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgZm9ybURlc2NyaXB0aW9uLnN0eWxlLmNzc1RleHQgPSAncmVzaXplOiBub25lJztcclxuXHJcbiAgICBjb25zdCBmb3JtUHJpb3JpdHkgPSB0YXNrRm9ybS5xdWVyeVNlbGVjdG9yKCdmaWVsZHNldCcpO1xyXG4gICAgd2hpbGUoZm9ybVByaW9yaXR5LmNoaWxkcmVuLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgIGZvcm1Qcmlvcml0eS5yZW1vdmVDaGlsZChmb3JtUHJpb3JpdHkubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcmlvcml0eVRleHQgPSBjcmVhdGVFbGVtZW50KCdwJywge2VsZW1lbnRUZXh0OiBgJHt0YXNrUHJpb3JpdHl9YH0pO1xyXG4gICAgZm9ybVByaW9yaXR5LmFwcGVuZENoaWxkKHByaW9yaXR5VGV4dCk7XHJcblxyXG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignI2NhbmNlbC10YXNrJyk7XHJcbiAgICBjYW5jZWxCdXR0b24udGV4dENvbnRlbnQgPSAnR28gYmFjayc7XHJcbiAgICBjYW5jZWxCdXR0b24ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChjYW5jZWxCdXR0b24ucHJldmlvdXNFbGVtZW50U2libGluZyk7XHJcbiAgICBjYW5jZWxCdXR0b24ucGFyZW50RWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ2p1c3RpZnktY29udGVudDogZmxleC1lbmQnO1xyXG5cclxuICAgIGFwcGVuZFRvTW9kYWwodGFza0Zvcm0pO1xyXG59IiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4uL2FwcC1sb2dpYy9wcm9qZWN0LmpzXCI7XHJcbmltcG9ydCB7IHVwZGF0ZUV4aXN0ZW50UHJvamVjdCwgZ2V0UHJvamVjdEJ5SWQgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgY3JlYXRlRW1wdHlIaW50LCBnZXRUYXNrRWxlbWVudHMgfSBmcm9tIFwiLi4vY29tbW9uRnVuY3Rpb25zLmpzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlVGFza0Zyb21Qcm9qZWN0KHRhc2ssIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB7dGFza0xpc3RBc2lkZSwgdGFza0FzaWRlLCB0YXNrTGlzdE1haW4sIHRhc2tNYWlufSA9IGdldFRhc2tFbGVtZW50cyh0YXNrLCBwcm9qZWN0SWQpO1xyXG5cclxuICAgIHRhc2tMaXN0QXNpZGUucmVtb3ZlQ2hpbGQodGFza0FzaWRlKTtcclxuICAgIHRhc2tMaXN0TWFpbi5yZW1vdmVDaGlsZCh0YXNrTWFpbik7XHJcblxyXG4gICAgaWYodGFza0xpc3RBc2lkZS5jaGlsZHJlbi5sZW5ndGggPT09IDApIFxyXG4gICAgICAgIGNyZWF0ZUVtcHR5SGludCh0YXNrTGlzdEFzaWRlKTtcclxuXHJcbiAgICBpZih0YXNrTGlzdE1haW4uY2hpbGRyZW4ubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHVwZGF0ZU1haW5Ub2RheShwcm9qZWN0SWQpO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiB0aGUgcHJvamVjdCBleGlzdHNcclxuICAgIGNvbnN0IHByb2plY3RGcm9tU3RvcmFnZSA9IGdldFByb2plY3RCeUlkKHByb2plY3RJZCk7XHJcblxyXG4gICAgaWYocHJvamVjdEZyb21TdG9yYWdlKXtcclxuICAgICAgICBjb25zdCBwcm9qZWN0T2JqZWN0ID0gUHJvamVjdChwcm9qZWN0RnJvbVN0b3JhZ2UpO1xyXG4gICAgICAgIHByb2plY3RPYmplY3QucmVtb3ZlVGFza0Zyb21Qcm9qZWN0KHRhc2suZ2V0VGFza0lkKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHVwZGF0ZUV4aXN0ZW50UHJvamVjdChwcm9qZWN0T2JqZWN0KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gVXBkYXRlIG1haW4gY29udGVudCB3aGVuIHVzZXIgcmVtb3ZlIGFueSB0YXNrIChvZiBhbnkgcHJvamVjdCkgaW4gdGhlIHRvZGF5IHNlY3Rpb25cclxuLy8gRS5nIGlmIHRoZSB1c2VyIHJlbW92ZXMgYSB0YXNrIG9mIGEgcHJvamVjdCBhbmQgdGhpcyBwcm9qZWN0IGRvZXNuJ3QgaGF2ZSBubyBtb3JlIHRhc2tzLCByZW1vdmUgaXQgZnJvbSB0aGUgbWFpbiBjb250ZW50XHJcbmZ1bmN0aW9uIHVwZGF0ZU1haW5Ub2RheShwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRlbnQnKTtcclxuICAgIGNvbnN0IHByb2plY3RXcmFwcGVyID0gbWFpbi5xdWVyeVNlbGVjdG9yKGAjbWFpbl8ke3Byb2plY3RJZH1gKTtcclxuICAgIG1haW4ucmVtb3ZlQ2hpbGQocHJvamVjdFdyYXBwZXIpO1xyXG59IiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4uL2FwcC1sb2dpYy9wcm9qZWN0LmpzXCI7XHJcbmltcG9ydCB7IGdldFByb2plY3RMaXN0U3RvcmFnZSB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBjbGVhck1haW5BbmRBcHBlbmROb2RlLCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVQcm9qZWN0TWFpbiB9IGZyb20gXCIuL3Byb2plY3RNYWluLmpzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyZWRUYXNrcyhhY3Rpb24pe1xyXG4gICAgY29uc3QgdXNlclByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBsZXQgdGFza3NGaWx0ZXJlZCwgcHJvamVjdEFuZFRhc2tzRWxlbWVudHMsIGhlYWRlclNlY3Rpb247XHJcblxyXG4gICAgaWYoYWN0aW9uID09PSAndG9kYXknKXtcclxuICAgICAgICB0YXNrc0ZpbHRlcmVkID0gQXJyYXkuZnJvbSh1c2VyUHJvamVjdHMpXHJcbiAgICAgICAgICAgIC5tYXAocHJvamVjdCA9PiBnZXRUb2RheVRhc2tzKHByb2plY3QpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHByb2plY3QgPT4gcHJvamVjdCAhPT0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgaGVhZGVyU2VjdGlvbiA9IGNyZWF0ZUVsZW1lbnQoJ2gzJywge2VsZW1lbnRJZDogJ3RvZGF5LWhlYWRlcicsIGVsZW1lbnRUZXh0OiBgVG9kYXkncyB0YXNrc2B9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRhc2tzRmlsdGVyZWQgPSBBcnJheS5mcm9tKHVzZXJQcm9qZWN0cylcclxuICAgICAgICAgICAgLm1hcChwcm9qZWN0ID0+IGdldFdlZWtUYXNrcyhwcm9qZWN0KSlcclxuICAgICAgICAgICAgLmZpbHRlcihwcm9qZWN0ID0+IHByb2plY3QgIT09IHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgIGhlYWRlclNlY3Rpb24gPSBjcmVhdGVFbGVtZW50KCdoMycsIHtlbGVtZW50SWQ6ICd3ZWVrLWhlYWRlcicsIGVsZW1lbnRUZXh0OiBgV2VlayB0YXNrc2B9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvamVjdEFuZFRhc2tzRWxlbWVudHMgPSB0YXNrc0ZpbHRlcmVkLm1hcChwcm9qZWN0ID0+IHtcclxuICAgICAgICBjb25zdCBwcm9qZWN0RWxlbWVudCA9IGNyZWF0ZVByb2plY3RNYWluKHByb2plY3QpO1xyXG4gICAgICAgIHByb2plY3RFbGVtZW50LnJlbW92ZUNoaWxkKHByb2plY3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdGFzaycpKTtcclxuICAgICAgICByZXR1cm4gcHJvamVjdEVsZW1lbnQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZihwcm9qZWN0QW5kVGFza3NFbGVtZW50cy5sZW5ndGggIT09IDApXHJcbiAgICAgICAgY2xlYXJNYWluQW5kQXBwZW5kTm9kZShwcm9qZWN0QW5kVGFza3NFbGVtZW50cywgaGVhZGVyU2VjdGlvbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgY2xlYXJNYWluQW5kQXBwZW5kTm9kZShoZWFkZXJTZWN0aW9uKTtcclxufVxyXG5cclxuLy8gR2V0IHRvZGF5J3MgdGFza3Mgb2YgYSBwcm9qZWN0IGFuZCByZXR1cm4gdGhlbSBpbiBhIFwibmV3XCIgcHJvamVjdCBvYmplY3RcclxuZnVuY3Rpb24gZ2V0VG9kYXlUYXNrcyhwcm9qZWN0KXtcclxuICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpO1xyXG4gICAgcHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpLm1hcCh0YXNrID0+IHtcclxuICAgICAgICBpZighKHRhc2suZ2V0RHVlRGF0ZSgpID09PSBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tQ0EnKSkpe1xyXG4gICAgICAgICAgICBwcm9qZWN0T2JqZWN0LnJlbW92ZVRhc2tGcm9tUHJvamVjdCh0YXNrLmdldFRhc2tJZCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZighKHByb2plY3RPYmplY3QuZ2V0QWxsVGFza3MoKS5sZW5ndGggPT09IDApKVxyXG4gICAgICAgIHJldHVybiBwcm9qZWN0T2JqZWN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXZWVrVGFza3MocHJvamVjdCl7XHJcbiAgICBjb25zdCBwcm9qZWN0T2JqZWN0ID0gUHJvamVjdChwcm9qZWN0KTtcclxuICAgIHByb2plY3RPYmplY3QuZ2V0QWxsVGFza3MoKS5tYXAodGFzayA9PiB7XHJcbiAgICAgICAgaWYoIShpc0JldHdlZW5UaGlzV2Vlayh0YXNrLmdldER1ZURhdGUoKSkpKXtcclxuICAgICAgICAgICAgcHJvamVjdE9iamVjdC5yZW1vdmVUYXNrRnJvbVByb2plY3QodGFzay5nZXRUYXNrSWQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYoIShwcm9qZWN0T2JqZWN0LmdldEFsbFRhc2tzKCkubGVuZ3RoID09PSAwKSlcclxuICAgICAgICByZXR1cm4gcHJvamVjdE9iamVjdDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNCZXR3ZWVuVGhpc1dlZWsoZGF0ZSl7XHJcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBkYXlTdGFydFdlZWsgPSBuZXcgRGF0ZSh0b2RheS5zZXREYXRlKHRvZGF5LmdldERhdGUoKSAtIHRvZGF5LmdldERheSgpKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1DQScpO1xyXG4gICAgY29uc3QgZGF5RW5kV2VlayA9IG5ldyBEYXRlKHRvZGF5LnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpIC0gdG9kYXkuZ2V0RGF5KCkgKyA2KSkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1DQScpO1xyXG5cclxuICAgIHJldHVybiBkYXRlID49IGRheVN0YXJ0V2VlayAmJiBkYXRlIDw9IGRheUVuZFdlZWsgPyB0cnVlIDogZmFsc2U7XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGRlZmF1bHQgYXMgc3RhcnRVSUFuZExpc3RlbmVycyB9IGZyb20gJy4uL2RvbS1tYW5pcHVsYXRpb24vYXNpZGVTZWN0aW9uLmpzJztcclxuXHJcbnN0YXJ0VUlBbmRMaXN0ZW5lcnMoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=