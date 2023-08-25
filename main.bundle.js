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
function createNewProjectForm(buttonNewProject) {
    buttonNewProject.style.cssText = "opacity: 0"; // Hide 'plus' button
    const formWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("form", {
        elementId: "form-add-project",
    });

    // Input to place the new project's name
    const projectNameInput = document.createElement("input");
    Object.assign(projectNameInput, {
        type: "text",
        id: "project-name",
        name: "project_name",
        placeholder: `New project's name`,
    });

    const projectNameDiv = document.createElement("div");
    projectNameDiv.appendChild(projectNameInput);

    // Button to confirm the creation of a new project
    const addButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "create-project-button",
        "./assets/aside-icons/selected-icon.svg"
    );
    addButton.addEventListener("click", () =>
        newProjectHandler(formWrapper, buttonNewProject)
    );

    // Button to cancel the creation of a new project
    const cancelButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "cancel-project-button",
        "./assets/aside-icons/cancel-icon.svg"
    );
    cancelButton.addEventListener("click", () =>
        removeProjectForm(formWrapper, buttonNewProject)
    );

    // Wrapper for cancel and create project buttons
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.append(addButton, cancelButton);
    formWrapper.append(projectNameDiv, buttonsWrapper);

    // This elements are used to position the project form correctly
    const parentOfNewProjectButton = buttonNewProject.parentNode; // (#create-and-list-user-projects)
    const parentOfParent = parentOfNewProjectButton.parentNode; // (#user-projects)

    // parentOfParent.lastElementChild is the element used as a reference, to use insertBefore
    parentOfParent.insertBefore(formWrapper, parentOfParent.lastElementChild);
}

// Check if the project title input is filled, and create a new project (HTML and Storage)
function newProjectHandler(form, buttonNewProject) {
    const formData = new FormData(form);

    if (!formData.get("project_name")) {
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.errorFieldCreator)(document.getElementById("project-name"));
    } else {
        const project = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(formData.get("project_name"));

        if ((0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__["default"])(project) !== false) {
            createProjectAside(project);
            removeProjectForm(form, buttonNewProject);
        } else {
            // console.log("Project already exists!");
            return;
        }
    }
}

// Remove new project form and shows the 'plus' button again
function removeProjectForm(form, buttonNewProject) {
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
    buttonNewProject.style.cssText = "opacity: 1";
}

// Function used to create an HTML element for a new created project ()
function createProjectAside(projectObject) {
    const projectId = projectObject.getProjectId();
    const projectTitle = projectObject.getTitle();
    const projectTasks = projectObject.getAllTasks();

    const arrowDownImage = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("img", {
        elementSrc: "./assets/aside-icons/arrow-down-icon-22.png",
    });
    const buttonText = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("p", { elementText: `${projectTitle}` });
    const expandImage = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("img", {
        elementSrc: "./assets/aside-icons/expand-icon.png",
        elementClass: "expand-project-tasks",
    });
    const allTasksElements = projectTasks.map((task) =>
        createTaskElementAside(task)
    );

    // Wrap buttons to show/hide and expand project to a div
    const divButtonsProjectName = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "project show",
    });
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);

    // eventListener to show/hide and expand a project
    newProjectButtonListener(divButtonsProjectName, expandImage);

    // Buttons to show/hide and expand project
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);

    // Wrapper for all tasks of the current project
    const allTasksWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "project-tasks-aside",
    });

    if (allTasksElements.length === 0) (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createEmptyHint)(allTasksWrapper);
    else
        Array.from(allTasksElements).forEach((element) =>
            allTasksWrapper.appendChild(element)
        );

    // Append all elements to a div that wraps all the content of a project
    const divWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "project-name-and-tasks",
        elementId: `aside_${projectId}`,
    });
    divWrapper.append(divButtonsProjectName, allTasksWrapper);

    // Section that contains all user's projects
    const userProjectsSection = document.getElementById("list-projects-user");

    return userProjectsSection.appendChild(divWrapper);
}

// Create a task element to put inside the related project in the aside section
function createTaskElementAside(task) {
    const taskWrapperAside = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "task-aside",
        elementId: `aside_${task.getTaskId()}`,
    });

    const spanPriority = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("span", {
        elementClass: `task-priority-aside ${task.getPriority()}`,
    });
    const taskName = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("p", { elementText: `${task.getName()}` });
    taskWrapperAside.append(spanPriority, taskName);

    return taskWrapperAside;
}

// Set new project eventListeners, to show/hide and expand content to main-content div (not yet implemented)
function newProjectButtonListener(buttonShowHide, buttonExpand) {
    buttonShowHide.addEventListener("click", () =>
        openCloseProjectTasks(buttonShowHide)
    );
    buttonExpand.addEventListener("click", (event) => {
        (0,_asideSection_js__WEBPACK_IMPORTED_MODULE_3__.selectTab)(buttonExpand.parentElement);
        (0,_projectMain_js__WEBPACK_IMPORTED_MODULE_4__.expandProjectTasks)(buttonExpand); // Expand means that the project will be expanded to the main-content
        event.stopPropagation();
    });
}

// Handle show/hide tasks of a project, by clicking in the project div
function openCloseProjectTasks(projectButton) {
    const iconInsideButton = projectButton.getElementsByTagName("img")[0];

    if (projectButton.classList.contains("show")) {
        projectButton.classList.remove("show");
        projectButton.classList.add("hide");

        // Arrow effect using an animation defined in the css file, from open to closed (bottom to right)
        iconInsideButton.style.cssText = "opacity: 0;";
        setTimeout(
            () =>
                (iconInsideButton.style.cssText =
                    "animation: projectsButtonChangingDirection 150ms normal forwards;"),
            150
        );

        hideTasksOfProject(projectButton);
    } else {
        projectButton.classList.remove("hide");
        projectButton.classList.add("show");

        // Arrow effect using an animation defined in the css file, from closed to open (right to bottom)
        iconInsideButton.style.cssText = "opacity: 0;";
        setTimeout(
            () =>
                (iconInsideButton.style.cssText =
                    "animation: projectsButtonChangingDirection 150ms reverse backwards;"),
            150
        );

        showTasksOfProject(projectButton);
    }

    // Function used to hide tasks of a project, by clicking in the project name (if open)
    function hideTasksOfProject(button) {
        const parentProject = button.parentElement;
        const tasksOfProject = parentProject.lastElementChild;
        tasksOfProject.style.cssText =
            "animation: delayAside 300ms reverse forwards;";
        setTimeout(
            () => (tasksOfProject.style.cssText = "display: none;"),
            300
        );
    }

    // Function used to show tasks of a project, by clicking in the project name (if closed)
    function showTasksOfProject(button) {
        const parentProject = button.parentElement;
        const tasksOfProject = parentProject.lastElementChild;
        tasksOfProject.style.cssText = "animation: delayAside 300ms forwards;";
        setTimeout(
            () => (tasksOfProject.style.cssText = "display: flex;"),
            300
        );
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




function editProjectHandler(projectId) {
    const projectWrapper = document.getElementById(`main_${projectId}`);
    const projectHeader = projectWrapper.querySelector(".project-header");
    const projectName = projectWrapper.querySelector(".project-name");
    const projectButtons = projectName.nextElementSibling;
    projectButtons.style.cssText = "opacity: 0"; // Hide the project buttons (edit and delete icons)

    const oldProjectName = projectName.textContent; // Used in case of user cancel the title edit
    projectName.setAttribute("contentEditable", "true");
    projectName.style.cssText = "border: 1px solid black;";
    projectName.focus();

    const confirmButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "confirm-project-name",
        "./assets/main-icons/selected-icon-28.svg"
    );
    confirmButton.addEventListener("click", () =>
        titleEditHandler(projectName, projectButtons, projectId)
    );
    const cancelButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "confirm-project-name",
        "./assets/main-icons/cancel-icon-28.svg"
    );
    cancelButton.addEventListener("click", () =>
        removeTitleEdit(projectName, projectButtons, oldProjectName)
    );
    const wrapperButtons = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "edit-project-buttons",
    });
    wrapperButtons.append(confirmButton, cancelButton);

    projectHeader.insertBefore(wrapperButtons, projectName.nextElementSibling);
}

function titleEditHandler(nameElement, projectButtons, projectId) {
    const newTitle = nameElement.textContent;
    const project = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectById)(projectId);
    const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project);
    projectObject.setTitle(newTitle);
    (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.updateExistentProject)(projectObject);
    updateProjectElement(newTitle, projectId);
    removeTitleEdit(nameElement, projectButtons);
}

function updateProjectElement(newTitle, projectId) {
    const projectAside = document.getElementById(`aside_${projectId}`);
    const titleAsideSection = projectAside.querySelector(".project");
    const projectTitleAside = titleAsideSection.querySelector("p");
    projectTitleAside.textContent = newTitle;

    const projectMain = document.getElementById(`main_${projectId}`);
    const titleMainSection = projectMain.querySelector(".project-name");
    titleMainSection.textContent = newTitle;
}

function removeTitleEdit(element, projectButtons, oldElementName) {
    if (oldElementName) element.textContent = oldElementName;

    element.removeAttribute("contentEditable");
    element.style.cssText = "border-color: transparent;";
    projectButtons.style.cssText = "opacity: 1";

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
function expandProjectTasks(buttonThatTriggered) {
    const selectedProjectDivParent =
        buttonThatTriggered.parentElement.parentElement;
    let parentProjectCleanId = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.cleanProjectId)(
        selectedProjectDivParent.getAttribute("id")
    );

    // Checks if the project exists
    const project = (0,_app_logic_storage_js__WEBPACK_IMPORTED_MODULE_1__.getProjectById)(parentProjectCleanId);

    if (project) {
        const projectObject = (0,_app_logic_project_js__WEBPACK_IMPORTED_MODULE_0__["default"])(project); // If projects exists, create a "new" object based on him, to be able to manipulate

        // Append the project expanded from aside and display it in the #main-content element
        const projectMainElement = createProjectMain(projectObject);
        (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.clearMainAndAppendNode)(projectMainElement);
    }
}

// Create a HTML project element to place in the #main-content
function createProjectMain(project) {
    const projectId = project.getProjectId();
    const projectName = project.getTitle();
    const projectTasks = project.getAllTasks();

    const projectNameH3 = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("h3", {
        elementClass: "project-name",
        elementText: `${projectName}`,
    });
    const editButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "edit-project",
        "./assets/main-icons/edit-icon-26.svg"
    );
    editButton.addEventListener("click", () => (0,_projectEdit_js__WEBPACK_IMPORTED_MODULE_3__.editProjectHandler)(projectId));
    const removeButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "remove-project",
        "./assets/main-icons/trash-icon-28.svg"
    );
    removeButton.addEventListener("click", () =>
        (0,_projectRemove_js__WEBPACK_IMPORTED_MODULE_4__.removeProjectHandler)(projectId)
    );
    const projectButtons = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "project-buttons",
    });
    projectButtons.append(editButton, removeButton);
    const projectHeader = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "project-header",
    });
    projectHeader.append(projectNameH3, projectButtons);

    const projectTasksWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "project-tasks-main",
    });

    // Generate an HTML element for each existent task
    Array.from(projectTasks).map((task) => {
        const taskElement = createTaskElementMain(task, projectId);
        projectTasksWrapper.appendChild(taskElement); // Append to the list that contains all tasks
    });

    // Button to add a new task to the project
    const newTaskButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "add-task",
        "./assets/main-icons/plus-icon-task-add.svg",
        "Add new task"
    );
    newTaskButton.addEventListener("click", () => {
        let taskForm = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createCommonTaskForm)();
        (0,_taskCreation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(taskForm, projectId);
    });

    // Append all elements to the project wrapper (hold all tasks and infos of a single project)
    const projectWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementId: `main_${projectId}`,
        elementClass: "project-wrapper",
    });
    projectWrapper.append(projectHeader, projectTasksWrapper, newTaskButton);

    return projectWrapper;
}

function createTaskElementMain(task, projectId) {
    const taskWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementId: `main_${task.getTaskId()}`,
        elementClass: "task-main",
    });

    // Left side of a task displayed in the #main-content
    const leftSideWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "task-left-side",
    });
    const priorityButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("button", {
        elementClass: `task-priority-main ${task.getPriority()}`,
    });
    const taskNameAndDueDate = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "task-name-and-date",
    });
    const taskName = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("p", {
        elementClass: "task-name",
        elementText: `${task.getName()}`,
    });
    const taskDueDate = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("p", {
        elementClass: "task-due-date",
        elementText: `${task.getDueDate()}`,
    });
    taskNameAndDueDate.append(taskName, taskDueDate);
    leftSideWrapper.append(priorityButton, taskNameAndDueDate);

    // Right side (buttons to change state of a task) of a task displayed in the #main-content
    const rightSideWrapper = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
        elementClass: "task-right-side",
    });
    const expandButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "expand-task",
        "./assets/main-icons/eye-icon.png"
    );
    expandButton.addEventListener("click", () => {
        let taskForm = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createCommonTaskForm)();
        (0,_taskExpand_js__WEBPACK_IMPORTED_MODULE_7__.expandTasksInfo)(task, projectId, taskForm);
    });
    const editButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "edit-task",
        "./assets/main-icons/edit-icon.svg"
    );
    editButton.addEventListener("click", () => {
        let taskForm = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.createCommonTaskForm)();
        (0,_taskEdit_js__WEBPACK_IMPORTED_MODULE_6__.editTaskForm)(task, projectId, taskForm);
    });
    const removeButton = (0,_commonFunctions_js__WEBPACK_IMPORTED_MODULE_2__.buttonWithImg)(
        "delete-task",
        "./assets/main-icons/remove-icon.svg"
    );
    removeButton.addEventListener("click", () =>
        (0,_taskRemove_js__WEBPACK_IMPORTED_MODULE_8__.deleteTaskFromProject)(task, projectId)
    );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDbkVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOcUY7QUFDckY7QUFDQSw2RUFBbUIsRyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvYXBwLWxvZ2ljL3Byb2plY3QuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9hcHAtbG9naWMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2FwcC1sb2dpYy90YXNrLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvY29tbW9uRnVuY3Rpb25zLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9hc2lkZVNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL21vZGFsLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9wcm9qZWN0QXNpZGUuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL3Byb2plY3RFZGl0LmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9wcm9qZWN0TWFpbi5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vcHJvamVjdFJlbW92ZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdGFza0NyZWF0aW9uLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi90YXNrRWRpdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdGFza0V4cGFuZC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdGFza1JlbW92ZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdG9kYXlBbmRXZWVrVGFza3MuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvYXBwLWxvZ2ljL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlTmV3UHJvamVjdElkIH0gZnJvbSBcIi4vc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgVGFzayBmcm9tIFwiLi90YXNrLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQcm9qZWN0KHBhcmFtZXRlcil7XHJcbiAgICBsZXQgX3Byb2plY3RJZDtcclxuICAgIGxldCBfdGl0bGU7XHJcbiAgICBsZXQgX2xpc3RPZlRhc2tzO1xyXG5cclxuICAgIC8vIFVzZWQgdG8gY3JlYXRlIGFuIG9iamVjdCBiYXNlZCBvbiBhbiBleGlzdGVudCAoSlNPTiBvYmplY3QgdGhhdCBjb21lcyBmcm9tIHN0b3JhZ2UgdG8gUHJvamVjdCBvYmplY3QpXHJcbiAgICBpZih0eXBlb2YgcGFyYW1ldGVyID09PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgX3Byb2plY3RJZCA9IGAke3BhcmFtZXRlci5fcHJvamVjdElkfWA7XHJcbiAgICAgICAgX3RpdGxlID0gcGFyYW1ldGVyLl90aXRsZTtcclxuICAgICAgICBfbGlzdE9mVGFza3MgPSBwYXJhbWV0ZXIuX2xpc3RPZlRhc2tzLm1hcChcclxuICAgICAgICAgICAgdGFzayA9PiBUYXNrKHRhc2submFtZSwgdGFzay5kdWVfZGF0ZSwgdGFzay5kZXNjcmlwdGlvbiwgdGFzay5wcmlvcml0eSwgdGFzay5pZClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgX3Byb2plY3RJZCA9IGdlbmVyYXRlTmV3UHJvamVjdElkKCk7IC8vIEdlbmVyYXRlIGFuIGlkZW50aWZpZXIgYmFzZWQgb24gdGhlIGxhc3QgZXhpc3RlbnQgcHJvamVjdFxyXG4gICAgICAgIF90aXRsZSA9IHBhcmFtZXRlcjtcclxuICAgICAgICBfbGlzdE9mVGFza3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXR0ZXIgZm9yIHByb2plY3RJZFxyXG4gICAgY29uc3QgZ2V0UHJvamVjdElkID0gKCkgPT4gX3Byb2plY3RJZDtcclxuXHJcbiAgICAvLyBHZXR0ZXIgYW5kIFNldHRlciBmb3IgdGl0bGVcclxuICAgIGNvbnN0IGdldFRpdGxlID0gKCkgPT4gX3RpdGxlO1xyXG4gICAgY29uc3Qgc2V0VGl0bGUgPSAobmV3VGl0bGUpID0+IF90aXRsZSA9IG5ld1RpdGxlO1xyXG5cclxuICAgIC8vIE1ldGhvZHMgdG8gbWFuaXB1bGF0ZSB0YXNrcyBpbnNpZGUgYSBQcm9qZWN0IFxyXG4gICAgY29uc3QgZ2V0QWxsVGFza3MgPSAoKSA9PiBfbGlzdE9mVGFza3M7XHJcbiAgICBjb25zdCBnZXRUYXNrQnlJZCA9ICh0YXNrSW5kZXgpID0+IF9saXN0T2ZUYXNrcy5maW5kKHRhc2sgPT4gdGFzay5nZXRUYXNrSWQoKSA9PT0gdGFza0luZGV4KTtcclxuICAgIGNvbnN0IGFkZFRhc2tUb1Byb2plY3QgPSAodGFzaykgPT4gX2xpc3RPZlRhc2tzLnB1c2godGFzayk7XHJcbiAgICBjb25zdCByZW1vdmVUYXNrRnJvbVByb2plY3QgPSAodGFza0lkKSA9PiB7XHJcbiAgICAgICAgX2xpc3RPZlRhc2tzID0gX2xpc3RPZlRhc2tzLmZpbHRlcih0YXNrID0+IHRhc2suZ2V0VGFza0lkKCkgIT09IHRhc2tJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRQcm9qZWN0SWQsXHJcbiAgICAgICAgZ2V0VGl0bGUsXHJcbiAgICAgICAgc2V0VGl0bGUsXHJcbiAgICAgICAgYWRkVGFza1RvUHJvamVjdCxcclxuICAgICAgICByZW1vdmVUYXNrRnJvbVByb2plY3QsXHJcbiAgICAgICAgZ2V0QWxsVGFza3MsXHJcbiAgICAgICAgZ2V0VGFza0J5SWRcclxuICAgIH1cclxufSIsIi8vIEFkZCBhIG5ldyBjcmVhdGVkIHByb2plY3QgdG8gdGhlIHByb2plY3QtbGlzdCBKU09OIG9iamVjdCBzdG9yZWRcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2F2ZVByb2plY3QocHJvamVjdCl7XHJcbiAgICBjb25zdCBhbGxvd1NhdmUgPSBjaGVja0lmUHJvamVjdEV4aXN0cyhwcm9qZWN0LmdldFRpdGxlKCkpO1xyXG5cclxuICAgIC8vIElmIHRoZSBhYm92ZSBmdW5jdGlvbiByZXR1cm5zIGZhbHNlLCB0aGUgcHJvamVjdCB3aWxsIG5vdCBiZSBzdG9yZWRcclxuICAgIGlmKGFsbG93U2F2ZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgIGNvbnN0IGpzb25Qcm9qZWN0ID0gcHJvamVjdFRvSnNvbihwcm9qZWN0KTtcclxuICAgIGNvbnN0IHByb2plY3RzU3RvcmFnZSA9IGdldFByb2plY3RMaXN0U3RvcmFnZSgpO1xyXG4gICAgcHJvamVjdHNTdG9yYWdlLnB1c2goanNvblByb2plY3QpO1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9qZWN0cy1saXN0JywgSlNPTi5zdHJpbmdpZnkocHJvamVjdHNTdG9yYWdlKSk7XHJcbn1cclxuXHJcbi8vIFJlbW92ZSBwcm9qZWN0IGFuZCBpdHMgdGFza3MgZnJvbSBzdG9yYWdlXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVQcm9qZWN0U3RvcmFnZShwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgcHJvamVjdHNTdG9yYWdlID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBjb25zdCBpbmRleFRvUmVtb3ZlID0gIEFycmF5LmZyb20ocHJvamVjdHNTdG9yYWdlKVxyXG4gICAgICAgIC5maW5kSW5kZXgocHJvamVjdCA9PiBwcm9qZWN0Ll9wcm9qZWN0SWQgPT09IHByb2plY3RJZCk7XHJcbiAgICBcclxuICAgIHByb2plY3RzU3RvcmFnZS5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSk7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvamVjdHMtbGlzdCcsIEpTT04uc3RyaW5naWZ5KHByb2plY3RzU3RvcmFnZSkpO1xyXG59XHJcblxyXG4vLyBDaGFuZ2Ugc29tZSBwYXJ0IG9mIGFuIGV4aXN0ZW50IHByb2plY3RcclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUV4aXN0ZW50UHJvamVjdChwcm9qZWN0KXtcclxuICAgIGNvbnN0IGpzb25Qcm9qZWN0ID0gcHJvamVjdFRvSnNvbihwcm9qZWN0KTtcclxuICAgIGNvbnN0IHByb2plY3RzU3RvcmFnZSA9IGdldFByb2plY3RMaXN0U3RvcmFnZSgpO1xyXG5cclxuICAgIGNvbnN0IGluZGV4T2ZQcm9qZWN0VG9BbHRlciA9IEFycmF5LmZyb20ocHJvamVjdHNTdG9yYWdlKVxyXG4gICAgICAgIC5maW5kSW5kZXgoc3RvcmVkUHJvamVjdCA9PiBzdG9yZWRQcm9qZWN0Ll9wcm9qZWN0SWQgPT09IHByb2plY3QuZ2V0UHJvamVjdElkKCkpO1xyXG5cclxuICAgIHByb2plY3RzU3RvcmFnZVtpbmRleE9mUHJvamVjdFRvQWx0ZXJdID0ganNvblByb2plY3Q7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzLWxpc3QnLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0c1N0b3JhZ2UpKTtcclxufVxyXG5cclxuLy8gR2VuZXJhdGUgYW4gaWRlbnRpZmllciBmb3IgYSBuZXcgdGFzayBjcmVhdGVkLCBiYXNlZCBvbiB0aGUgbGFzdCB0YXNrIGluc2lkZSBhIHByb2plY3QgcGFyZW50XHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU5ld1Rhc2tJZChwcm9qZWN0KXtcclxuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdFBhcmVudCA9IEFycmF5LmZyb20oc3RvcmVkUHJvamVjdHMpXHJcbiAgICAgICAgLmZpbmQoc3RvcmVkUHJvamVjdCA9PiBzdG9yZWRQcm9qZWN0Ll9wcm9qZWN0SWQgPT09IHByb2plY3QuZ2V0UHJvamVjdElkKCkpO1xyXG5cclxuICAgIGlmKHByb2plY3RQYXJlbnQuX2xpc3RPZlRhc2tzLmxlbmd0aCAhPT0gMCl7XHJcbiAgICAgICAgbGV0IGxhc3RJZE51bWJlciA9IHByb2plY3RQYXJlbnQuX2xpc3RPZlRhc2tzLmF0KC0xKS5pZC5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIHJldHVybiBgdGFza18keysrbGFzdElkTnVtYmVyfWA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYHRhc2tfJHswfWA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdlbmVyYXRlIGFuIGlkZW50aWZpZXIgZm9yIGEgbmV3IHByb2plY3QgY3JlYXRlZCwgYmFzZWQgb24gdGhlIGxhc3QgcHJvamVjdCBleGlzdGVudFxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVOZXdQcm9qZWN0SWQoKXtcclxuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcblxyXG4gICAgaWYoc3RvcmVkUHJvamVjdHMubGVuZ3RoICE9PSAwKXtcclxuICAgICAgICBsZXQgbGFzdElkTnVtYmVyID0gc3RvcmVkUHJvamVjdHMuYXQoLTEpLl9wcm9qZWN0SWQuc3BsaXQoJ18nKVsxXTtcclxuICAgICAgICByZXR1cm4gYHByb2plY3RfJHsrK2xhc3RJZE51bWJlcn1gO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICByZXR1cm4gYHByb2plY3RfJHswfWA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0QnlJZChpZCl7XHJcbiAgICBjb25zdCBzdG9yZWRQcm9qZWN0cyA9IGdldFByb2plY3RMaXN0U3RvcmFnZSgpO1xyXG4gICAgcmV0dXJuIHN0b3JlZFByb2plY3RzLmZpbmQocHJvamVjdCA9PiBwcm9qZWN0Ll9wcm9qZWN0SWQgPT09IGlkKTtcclxufVxyXG5cclxuLy8gQ2hlY2sgaWYgdGhlIHByb2plY3QgdG8gYmUgc3RvcmVkIGFscmVhZHkgZXhpc3RzIGluIHRoZSBzdG9yYWdlXHJcbmZ1bmN0aW9uIGNoZWNrSWZQcm9qZWN0RXhpc3RzKHByb2plY3RUaXRsZSl7XHJcbiAgICBjb25zdCBzdG9yZWRQcm9qZWN0cyA9IGdldFByb2plY3RMaXN0U3RvcmFnZSgpO1xyXG4gICAgY29uc3QgYWxsb3dTYXZlID0gc3RvcmVkUHJvamVjdHMuZXZlcnkocHJvamVjdCA9PiBwcm9qZWN0Ll90aXRsZSAhPT0gcHJvamVjdFRpdGxlKTtcclxuICAgIHJldHVybiBhbGxvd1NhdmU7XHJcbn1cclxuXHJcbi8vIFJldHJpZXZlIHVzZXIncyBwcm9qZWN0cyBzdG9yYWdlLiBJZiBpdCBpcyB1c2VyJ3MgZmlyc3QgdGltZSB1c2luZyB0aGUgdG9kb2RvbywgY3JlYXRlIGEgbmV3IGxpc3Qgb2YgcHJvamVjdHNcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3RMaXN0U3RvcmFnZSgpe1xyXG4gICAgaWYoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9qZWN0cy1saXN0Jykpe1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9qZWN0cy1saXN0JywgSlNPTi5zdHJpbmdpZnkoW10pKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvamVjdHMtbGlzdCcpKTtcclxufVxyXG5cclxuLy8gVHJhbnNmb3JtIHByb2plY3Qgb2JqZWN0ICh0aGF0IGNvbnRhaW5zIGFsbCBmdW5jdGlvbnMpIHRvIGEgSlNPTiBvYmplY3RcclxuZnVuY3Rpb24gcHJvamVjdFRvSnNvbihwcm9qZWN0KXtcclxuICAgIGNvbnN0IF9wcm9qZWN0SWQgPSBwcm9qZWN0LmdldFByb2plY3RJZCgpO1xyXG4gICAgY29uc3QgX3RpdGxlID0gcHJvamVjdC5nZXRUaXRsZSgpO1xyXG4gICAgY29uc3QgX2xpc3RPZlRhc2tzID0gW107XHJcbiAgIFxyXG4gICAgLy8gQ29udmVydCBhbGwgdGFza3MgdG8gSlNPTiBsaWtlIG9iamVjdHNcclxuICAgIEFycmF5LmZyb20ocHJvamVjdC5nZXRBbGxUYXNrcygpKVxyXG4gICAgICAgIC5mb3JFYWNoKFxyXG4gICAgICAgICAgICB0YXNrID0+IF9saXN0T2ZUYXNrcy5wdXNoKHRhc2tUb0pzb24odGFzaykpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIF9wcm9qZWN0SWQsXHJcbiAgICAgICAgX3RpdGxlLFxyXG4gICAgICAgIF9saXN0T2ZUYXNrc1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiBUcmFuc2Zvcm0gdGFzayBvYmplY3QgKHRoYXQgY29udGFpbnMgYWxsIGZ1bmN0aW9ucykgdG8gYSBKU09OIG9iamVjdCxcclxudG8gYmUgcHJvcGVybHkgc3RvcmVkIGluIHRoZSBsb2NhbFN0b3JhZ2UgdG9nZXRoZXIgd2l0aCBjb3JyZXNwb25kaW5nIHByb2plY3QgKi9cclxuZnVuY3Rpb24gdGFza1RvSnNvbih0YXNrKXtcclxuICAgIGNvbnN0IGlkID0gdGFzay5nZXRUYXNrSWQoKTtcclxuICAgIGNvbnN0IG5hbWUgPSB0YXNrLmdldE5hbWUoKTtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGFzay5nZXREZXNjcmlwdGlvbigpO1xyXG4gICAgY29uc3QgZHVlX2RhdGUgPSB0YXNrLmdldER1ZURhdGUoKTtcclxuICAgIGNvbnN0IHByaW9yaXR5ID0gdGFzay5nZXRQcmlvcml0eSgpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICBkdWVfZGF0ZSxcclxuICAgICAgICBwcmlvcml0eVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGFzayh0YXNrTmFtZSwgZHVlRGF0ZSA9ICdub25lJywgZGVzY3JpcHRpb24gPSAnbm9uZScsIHByaW9yaXR5ID0gJ25vbmUnLCB0YXNrSWQpe1xyXG4gICAgLy8gVXNlZCB0byBjcmVhdGUgYW4gb2JqZWN0IGJhc2VkIG9uIGFuIGV4aXN0ZW50IChKU09OIG9iamVjdCB0aGF0IGNvbWVzIGZyb20gc3RvcmFnZSB0byBUYXNrIG9iamVjdClcclxuICAgIGxldCBfdGFza0lkID0gdGFza0lkO1xyXG4gICAgbGV0IF9uYW1lID0gdGFza05hbWU7XHJcbiAgICBsZXQgX2R1ZURhdGUgPSBkdWVEYXRlO1xyXG4gICAgbGV0IF9kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgbGV0IF9wcmlvcml0eSA9IHByaW9yaXR5O1xyXG5cclxuICAgIC8vIEdldHRlciBmb3IgdGFza0lkXHJcbiAgICBjb25zdCBnZXRUYXNrSWQgPSAoKSA9PiBfdGFza0lkO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciB0aXRsZVxyXG4gICAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IF9uYW1lO1xyXG4gICAgY29uc3Qgc2V0TmFtZSA9IChuZXdUaXRsZSkgPT4gX25hbWUgPSBuZXdUaXRsZTtcclxuXHJcbiAgICAvLyBHZXR0ZXIgYW5kIFNldHRlciBmb3IgZHVlRGF0ZVxyXG4gICAgY29uc3QgZ2V0RHVlRGF0ZSA9ICgpID0+IF9kdWVEYXRlO1xyXG4gICAgY29uc3Qgc2V0RHVlRGF0ZSA9IChuZXdEdWVEYXRlKSA9PiBfZHVlRGF0ZSA9IG5ld0R1ZURhdGU7XHJcblxyXG4gICAgLy8gR2V0dGVyIGFuZCBTZXR0ZXIgZm9yIGRlc2NyaXB0aW9uXHJcbiAgICBjb25zdCBnZXREZXNjcmlwdGlvbiA9ICgpID0+IF9kZXNjcmlwdGlvbjtcclxuICAgIGNvbnN0IHNldERlc2NyaXB0aW9uID0gKG5ld0Rlc2NyaXB0aW9uKSA9PiBfZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcclxuXHJcbiAgICAvLyBHZXR0ZXIgYW5kIFNldHRlciBmb3IgcHJpb3JpdHlcclxuICAgIGNvbnN0IGdldFByaW9yaXR5ID0gKCkgPT4gX3ByaW9yaXR5O1xyXG4gICAgY29uc3Qgc2V0UHJpb3JpdHkgPSAobmV3UHJpb3JpdHkpID0+IF9wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0VGFza0lkLFxyXG4gICAgICAgIGdldE5hbWUsXHJcbiAgICAgICAgc2V0TmFtZSxcclxuICAgICAgICBnZXREdWVEYXRlLFxyXG4gICAgICAgIHNldER1ZURhdGUsXHJcbiAgICAgICAgZ2V0RGVzY3JpcHRpb24sXHJcbiAgICAgICAgc2V0RGVzY3JpcHRpb24sXHJcbiAgICAgICAgZ2V0UHJpb3JpdHksXHJcbiAgICAgICAgc2V0UHJpb3JpdHlcclxuICAgIH1cclxufSIsImltcG9ydCB7IHJlbW92ZUZyb21Nb2RhbCB9IGZyb20gXCIuL2RvbS1tYW5pcHVsYXRpb24vbW9kYWwuanNcIjtcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIHNlbGVjdCB0aGUgcGFyZW50IHByb2plY3Qgb2YgYSB0YXNrLCB0aGUgbGlzdCB3aGljaCB0aGUgdGFzayBpdCdzIGluc2lkZSBhbmQgdGhlIHRhc2sgaXRzZWxmXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUYXNrRWxlbWVudHModGFzaywgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IGFzaWRlUHJvamVjdEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgYXNpZGVfJHtwcm9qZWN0SWR9YCk7XHJcbiAgICBjb25zdCB0YXNrc1NlY3Rpb25Bc2lkZSA9IGFzaWRlUHJvamVjdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3QtdGFza3MtYXNpZGUnKTtcclxuICAgIGNvbnN0IGFzaWRlVGFza0VsZW1lbnQgPSB0YXNrc1NlY3Rpb25Bc2lkZS5xdWVyeVNlbGVjdG9yKGAjYXNpZGVfJHt0YXNrLmdldFRhc2tJZCgpfWApO1xyXG5cclxuICAgIGNvbnN0IG1haW5Qcm9qZWN0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBtYWluXyR7cHJvamVjdElkfWApO1xyXG4gICAgY29uc3QgdGFza3NTZWN0aW9uTWFpbiA9IG1haW5Qcm9qZWN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC10YXNrcy1tYWluJyk7XHJcbiAgICBjb25zdCBtYWluVGFza0VsZW1lbnQgPSB0YXNrc1NlY3Rpb25NYWluLnF1ZXJ5U2VsZWN0b3IoYCNtYWluXyR7dGFzay5nZXRUYXNrSWQoKX1gKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhc2tMaXN0QXNpZGU6IHRhc2tzU2VjdGlvbkFzaWRlLFxyXG4gICAgICAgIHRhc2tBc2lkZTogYXNpZGVUYXNrRWxlbWVudCxcclxuICAgICAgICB0YXNrTGlzdE1haW46IHRhc2tzU2VjdGlvbk1haW4sXHJcbiAgICAgICAgdGFza01haW46IG1haW5UYXNrRWxlbWVudFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBDbGVhciBtYWluLWNvbnRlbnQgYW5kIGFwcGVuZCB0aGUgJ2V4cGFuZGVkJyBwcm9qZWN0IGZyb20gYXNpZGVcclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUoZWxlbWVudCwgLi4ucmVzdCl7XHJcbiAgICBjb25zdCBtYWluQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRlbnQnKTtcclxuICAgIHdoaWxlKG1haW5Db250ZW50Lmxhc3RFbGVtZW50Q2hpbGQpe1xyXG4gICAgICAgIG1haW5Db250ZW50LnJlbW92ZUNoaWxkKG1haW5Db250ZW50Lmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHJlc3QubGVuZ3RoICE9PSAwKVxyXG4gICAgICAgIG1haW5Db250ZW50LmFwcGVuZENoaWxkKHJlc3RbMF0pO1xyXG5cclxuICAgIGlmKGVsZW1lbnQubGVuZ3RoID49IDEpe1xyXG4gICAgICAgIGVsZW1lbnQuZm9yRWFjaChlID0+IG1haW5Db250ZW50LmFwcGVuZENoaWxkKGUpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1haW5Db250ZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlIaW50KHRhc2tMaXN0KXtcclxuICAgIGNvbnN0IGVtcHR5SGludCA9IGNyZWF0ZUVsZW1lbnQoJ3AnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdC1lbXB0eS1oaW50JywgZWxlbWVudFRleHQ6ICdObyB0YXNrcyB5ZXQhJ30pO1xyXG4gICAgdGFza0xpc3QuYXBwZW5kQ2hpbGQoZW1wdHlIaW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUVtcHR5SGludCh0YXNrTGlzdCl7XHJcbiAgICB0YXNrTGlzdC5yZW1vdmVDaGlsZCh0YXNrTGlzdC5jaGlsZHJlblswXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21tb25UYXNrRm9ybSgpe1xyXG4gICAgY29uc3QgZm9ybSA9IGNyZWF0ZUVsZW1lbnQoJ2Zvcm0nLCB7ZWxlbWVudElkOiAnZm9ybS10YXNrJ30pO1xyXG4gICAgXHJcbiAgICBjb25zdCBmb3JtVGl0bGUgPSBjcmVhdGVFbGVtZW50KCdoMycsIHtlbGVtZW50Q2xhc3M6ICdmb3JtLWhlYWRlcid9KTtcclxuXHJcbiAgICBjb25zdCBkaXZUaXRsZSA9IGRpdkNyZWF0b3IoJ1RpdGxlIConLCAndGFzay1uYW1lLWlucHV0JywgJ3RleHQnLCAndGFza19uYW1lJyk7XHJcbiAgICBjb25zdCBkaXZEdWVEYXRlID0gZGl2Q3JlYXRvcignRHVlIGRhdGUnLCAnZHVlLWRhdGUtaW5wdXQnLCAnZGF0ZScsICdkdWVfZGF0ZScpO1xyXG4gICAgY29uc3QgZGl2RGVzY3JpcHRpb24gPSBkaXZDcmVhdG9yKCdEZXNjcmlwdGlvbicsICdkZXNjcmlwdGlvbi1pbnB1dCcsICd0ZXh0YXJlYScsICdkZXNjcmlwdGlvbicpO1xyXG4gICBcclxuICAgIC8vIEZpZWxkc2V0IHdpdGggcmFkaW8gYnV0dG9ucyBmb3IgcHJpb3JpdHkgc2VsZWN0aW9uXHJcbiAgICBjb25zdCBmaWVsZHNldFByaW9yaXRpZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmaWVsZHNldCcpO1xyXG4gICAgY29uc3QgZmllbGRzZXRQcmlvcml0aWVzTGVnZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGVnZW5kJyk7XHJcbiAgICBmaWVsZHNldFByaW9yaXRpZXNMZWdlbmQudGV4dENvbnRlbnQgPSAnUHJpb3JpdHknO1xyXG4gICAgXHJcbiAgICAvLyBEZWZhdWx0IHZhbHVlIGZvciBwcmlvcml0eVxyXG4gICAgY29uc3QgZGl2Tm9Qcmlvcml0eSA9IGRpdkNyZWF0b3IoJ05vIHByaW9yaXR5JywgJ25vLXByaW9yaXR5JywgJ3JhZGlvJywgJ3ByaW9yaXR5Jyk7XHJcbiAgICBkaXZOb1ByaW9yaXR5Lmxhc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJycpO1xyXG4gICAgY29uc3QgZGl2UHJpb3JpdHlMb3cgPSBkaXZDcmVhdG9yKCdMb3cnLCAnbG93JywgJ3JhZGlvJywgJ3ByaW9yaXR5Jyk7XHJcbiAgICBjb25zdCBkaXZQcmlvcml0eUhpZ2ggPSBkaXZDcmVhdG9yKCdIaWdoJywgJ2hpZ2gnLCAncmFkaW8nLCAncHJpb3JpdHknKTtcclxuXHJcbiAgICAvLyBGb3JtIGJ1dHRvbnMgKEFkZCB0YXNrIGFuZCBDYW5jZWwpXHJcbiAgICBjb25zdCBkaXZCdXR0b25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXZCdXR0b25zLnNldEF0dHJpYnV0ZSgnaWQnLCAnZm9ybS1idXR0b25zJyk7XHJcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBidXR0b25XaXRoVGV4dENyZWF0b3IoJ0FkZCBUYXNrJywgJ2FkZC10YXNrJywgJ2J1dHRvbicpO1xyXG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gYnV0dG9uV2l0aFRleHRDcmVhdG9yKCdDYW5jZWwnLCAnY2FuY2VsLXRhc2snLCAnYnV0dG9uJyk7XHJcbiAgICBjYW5jZWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByZW1vdmVGcm9tTW9kYWwoZm9ybSkpO1xyXG5cclxuICAgIGZpZWxkc2V0UHJpb3JpdGllcy5hcHBlbmQoXHJcbiAgICAgICAgZmllbGRzZXRQcmlvcml0aWVzTGVnZW5kLFxyXG4gICAgICAgIGRpdlByaW9yaXR5SGlnaCxcclxuICAgICAgICBkaXZQcmlvcml0eUxvdyxcclxuICAgICAgICBkaXZOb1ByaW9yaXR5XHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBkaXZCdXR0b25zLmFwcGVuZChcclxuICAgICAgICBzdWJtaXRCdXR0b24sXHJcbiAgICAgICAgY2FuY2VsQnV0dG9uXHJcbiAgICApO1xyXG5cclxuICAgIGZvcm0uYXBwZW5kKFxyXG4gICAgICAgIGZvcm1UaXRsZSxcclxuICAgICAgICBkaXZUaXRsZSwgXHJcbiAgICAgICAgZGl2RHVlRGF0ZSwgXHJcbiAgICAgICAgZGl2RGVzY3JpcHRpb24sXHJcbiAgICAgICAgZmllbGRzZXRQcmlvcml0aWVzLFxyXG4gICAgICAgIGRpdkJ1dHRvbnNcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGZvcm07XHJcbn1cclxuXHJcbi8vIEV4dHJhY3QgdGhlIGRhdGEgdGhhdCBjb21lcyBmcm9tIHRoZSB0YXNrIGZvcm0gKGVkaXQgYW5kIG5ldyB0YXNrKVxyXG5leHBvcnQgZnVuY3Rpb24gdGFza0Zvcm1EYXRhSGFuZGxlcihmb3JtKXtcclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuICAgIGlmKCFmb3JtRGF0YS5nZXQoJ3Rhc2tfbmFtZScpKXtcclxuICAgICAgICBlcnJvckZpZWxkQ3JlYXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1uYW1lLWlucHV0JykpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCB0YXNrUGFyYW1ldGVycyA9IFtdO1xyXG4gICAgICAgIGZvcm1EYXRhLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgaWYodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB0YXNrUGFyYW1ldGVycy5wdXNoKHtbYCR7a2V5fWBdOiAnbm9uZSd9KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGFza1BhcmFtZXRlcnMucHVzaCh7W2Ake2tleX1gXTogdmFsdWV9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhc2tQYXJhbWV0ZXJzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JGaWVsZENyZWF0b3IoZWxlbWVudFRvQXBwZW5kQmVsb3cpe1xyXG4gICAgLy8gRG9uJ3QgYWxsb3cgdG8gY3JlYXRlIGEgbG90IG9mIGVycm9yIGFkdmlzZXNcclxuICAgIGlmKGVsZW1lbnRUb0FwcGVuZEJlbG93Lm5leHRFbGVtZW50U2libGluZylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZXJyb3JGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGVycm9yRmllbGQudGV4dENvbnRlbnQgPSAnWW91IG5lZWQgdG8gZmlsbCB0aGlzIGZpZWxkISc7XHJcbiAgICBlcnJvckZpZWxkLnN0eWxlLmNzc1RleHQgPSBcclxuICAgICAgICBgd2lkdGg6IG1heC1jb250ZW50OyBcclxuICAgICAgICBmb250LXNpemU6IDExcHg7IFxyXG4gICAgICAgIG1hcmdpbi10b3A6IDJweDtcclxuICAgICAgICBtYXJnaW4tbGVmdDogNXB4YDtcclxuXHJcbiAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50VG9BcHBlbmRCZWxvdy5wYXJlbnRFbGVtZW50O1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGVycm9yRmllbGQpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiBwYXJlbnQucmVtb3ZlQ2hpbGQoZXJyb3JGaWVsZCksIDE1MDApO1xyXG59XHJcblxyXG4vLyBIYW5keSBmdW5jdGlvbiB0byBjcmVhdGUgYSBidXR0b24gd2l0aCBhbiBpbWFnZSBpbnNpZGUgKHJpZ2h0LXNpZGUgb2YgYSB0YXNrIGVsZW1lbnRzIGFuZCBhZGQgbmV3IHRhc2sgYnV0dG9uKVxyXG5leHBvcnQgZnVuY3Rpb24gYnV0dG9uV2l0aEltZyhlbGVtZW50Q2xhc3MsIGltZ1NyYywgb3B0aW9uYWxTcGFuVGV4dCl7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYCR7ZWxlbWVudENsYXNzfWApO1xyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcclxuXHJcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIGltZy5zcmMgPSBgJHtpbWdTcmN9YDtcclxuXHJcbiAgICBpZihvcHRpb25hbFNwYW5UZXh0KXtcclxuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBgJHtvcHRpb25hbFNwYW5UZXh0fWA7XHJcbiAgICAgICAgc3Bhbi5zdHlsZS5jc3NUZXh0ID0gJ29yZGVyOiAyJzsgLy8gY2hhbmdlIG9yZGVyIG9mIHNwYW4sIHB1dHRpbmcgaGltIGFmdGVyIHRoZSBpbWdcclxuICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICB9XHJcblxyXG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0aGF0IGNvbWVzIGluIGhhbmR5IHRvIGNyZWF0ZSBlbGVtZW50cyB0aGF0IGdvZXMgaW5zaWRlIGEgcHJvamVjdFxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lLCAuLi5yZXN0KXtcclxuICAgIGNvbnN0IHJlc3RQYXJhbWV0ZXJzID0gcmVzdFswXTsgLy8gTmVlZCB0aGlzIGJlY2F1c2UgaXQgY29tZXMgYXMgYW4gYXJyYXlcclxuICAgIGNvbnN0IHtlbGVtZW50Q2xhc3MsIGVsZW1lbnRJZCwgZWxlbWVudFNyYywgZWxlbWVudFRleHR9ID0gcmVzdFBhcmFtZXRlcnM7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgJHt0YWdOYW1lfWApO1xyXG5cclxuICAgIGlmKGVsZW1lbnRJZClcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtlbGVtZW50SWR9YCk7XHJcblxyXG4gICAgaWYoZWxlbWVudENsYXNzKVxyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGAke2VsZW1lbnRDbGFzc31gKTtcclxuXHJcbiAgICBpZihlbGVtZW50U3JjKVxyXG4gICAgICAgIGVsZW1lbnQuc3JjID0gZWxlbWVudFNyYztcclxuXHJcbiAgICBpZihlbGVtZW50VGV4dClcclxuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gZWxlbWVudFRleHQ7XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8vIFwiQ2xlYW5cIiB0aGUgcHJvamVjdCBpZGVudGlmaWVyIGZyb20gdGhlIG1haW4tY29udGVudCBvciBhc2lkZSwgdXNpbmcgb25seSB0aGUgcmVsZXZhbnQgcGFydCBvZiBoaW0gKGUuZyBtYWluX3Byb2plY3RfMCA9PiBwcm9qZWN0XzApXHJcbmV4cG9ydCBjb25zdCBjbGVhblByb2plY3RJZCA9IChyYXdJZCkgPT4gcmF3SWQuc2xpY2UocmF3SWQuaW5kZXhPZignXycpICsgMSk7XHJcblxyXG4vLyBGdW5jdGlvbiB0aGF0IGNvbWVzIGluIGhhbmR5IHRvIGNyZWF0ZSBlbGVtZW50cyB0aGF0IGdvZXMgaW5zaWRlIHRoZSBmb3JtIGZvciBhIG5ldyB0YXNrXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXZDcmVhdG9yKGxhYmVsVGV4dCwgaW5wdXRJZCwgaW5wdXRUeXBlLCBpbnB1dE5hbWUpe1xyXG4gICAgY29uc3QgZGl2V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYCR7aW5wdXRJZH1gKTtcclxuICAgIGxhYmVsLnRleHRDb250ZW50ID0gbGFiZWxUZXh0O1xyXG5cclxuICAgIGxldCBpbnB1dDtcclxuICAgIGlmKGlucHV0VHlwZSA9PT0gJ3RleHRhcmVhJyl7XHJcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgJzE0MCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsIGAke2lucHV0VHlwZX1gKTtcclxuXHJcbiAgICAgICAgaWYoaW5wdXRUeXBlID09PSAndGV4dCcpe1xyXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcsICcyNScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7aW5wdXRJZH1gKTtcclxuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsIGAke2lucHV0TmFtZX1gKTtcclxuXHJcbiAgICBpZihpbnB1dC50eXBlID09PSAncmFkaW8nKVxyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndmFsdWUnLCBgJHtpbnB1dElkfWApO1xyXG5cclxuICAgIGRpdldyYXBwZXIuYXBwZW5kKGxhYmVsLCBpbnB1dCk7XHJcbiAgICByZXR1cm4gZGl2V3JhcHBlcjtcclxufVxyXG5cclxuLy8gSGFuZHkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgYnV0dG9uIHdpdGggYSB0ZXh0XHJcbmV4cG9ydCBmdW5jdGlvbiBidXR0b25XaXRoVGV4dENyZWF0b3IoYnV0dG9uVGV4dCwgYnV0dG9uSWQsIGJ1dHRvblR5cGUpe1xyXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICBcclxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7YnV0dG9uSWR9YCk7XHJcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgYCR7YnV0dG9uVHlwZX1gKVxyXG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gYCR7YnV0dG9uVGV4dH1gO1xyXG5cclxuICAgIHJldHVybiBidXR0b247XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdExpc3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGRlZmF1bHQgYXMgY3JlYXRlTmV3UHJvamVjdEZvcm0sIGNyZWF0ZVByb2plY3RBc2lkZSB9IGZyb20gXCIuL3Byb2plY3RBc2lkZS5qc1wiO1xyXG5pbXBvcnQgeyBnZXRXZWVrVGFza3MsIGdldEZpbHRlcmVkVGFza3MgfSBmcm9tIFwiLi90b2RheUFuZFdlZWtUYXNrcy5qc1wiO1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gc3RhcnQgYWxsIGV2ZW50TGlzdGVuZXJzIHJlbGF0ZWQgdG8gdGhlIHVzZXItcHJvamVjdHMgc2VjdGlvbiBhbmQgaW5pdGlhbCBlbGVtZW50cyAoZm9yIHByb2plY3RzIHN0b3JlZCBwcmV2aW91c2x5KVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGFydFVJQW5kTGlzdGVuZXJzKCl7XHJcbiAgICBvcGVuQ2xvc2VBc2lkZSgpO1xyXG4gICAgXHJcbiAgICAvLyBTdGFydCB0aGUgdG9kYXkgc2VjdGlvbiwgYXMgdGhlIGZpcnN0IHNlbGVjdGVkXHJcbiAgICBjb25zdCB0b2RheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2RheS10b2RvLWJ1dHRvbicpO1xyXG4gICAgdG9kYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgndGFiLXNlbGVjdGVkJyk7XHJcbiAgICBnZXRGaWx0ZXJlZFRhc2tzKCd0b2RheScpO1xyXG4gICAgdG9kYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgc2VsZWN0VGFiKHRvZGF5QnV0dG9uKTtcclxuICAgICAgICBnZXRGaWx0ZXJlZFRhc2tzKCd0b2RheScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgd2Vla0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWVrLXRvZG8tYnV0dG9uJyk7XHJcbiAgICB3ZWVrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHNlbGVjdFRhYih3ZWVrQnV0dG9uKTtcclxuICAgICAgICBnZXRGaWx0ZXJlZFRhc2tzKCd3ZWVrJyk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIEJ1dHRvbiB0byBzaG93L2hpZGUgdXNlcidzIHByb2plY3RzXHJcbiAgICBjb25zdCB1c2VyUHJvamVjdHNCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1wcm9qZWN0cy1idXR0b24nKTtcclxuICAgIHVzZXJQcm9qZWN0c0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9wZW5DbG9zZU15UHJvamVjdHModXNlclByb2plY3RzQnV0dG9uKSk7XHJcblxyXG4gICAgLy8gQnV0dG9uIHRvIGNyZWF0ZSBuZXcgcHJvamVjdFxyXG4gICAgY29uc3QgYWRkTmV3UHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtbmV3LXByb2plY3QtYnV0dG9uJyk7XHJcbiAgICBhZGROZXdQcm9qZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiBjcmVhdGVOZXdQcm9qZWN0Rm9ybShldmVudC5jdXJyZW50VGFyZ2V0KSk7XHJcblxyXG4gICAgLy8gR2V0IGFsbCB1c2VyJ3MgcHJvamVjdHMgYW5kIGNyZWF0ZSBhIG5ldyBlbGVtZW50IG9uIHRoZSBhc2lkZVxyXG4gICAgY29uc3QgYWxsVXNlclByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBBcnJheS5mcm9tKGFsbFVzZXJQcm9qZWN0cykuZm9yRWFjaChwcm9qZWN0ID0+IHtcclxuICAgICAgICBjb25zdCBwcm9qZWN0T2JqZWN0ID0gUHJvamVjdChwcm9qZWN0KTtcclxuICAgICAgICBjcmVhdGVQcm9qZWN0QXNpZGUocHJvamVjdE9iamVjdCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RUYWIoZWxlbWVudENsaWNrZWQpe1xyXG4gICAgY29uc3QgY3VycmVudFRhYlNlbGVjdGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFiLXNlbGVjdGVkJylbMF07XHJcblxyXG4gICAgaWYoIShjdXJyZW50VGFiU2VsZWN0ZWQgPT09IHVuZGVmaW5lZCkpe1xyXG4gICAgICAgIGN1cnJlbnRUYWJTZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCd0YWItc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50Q2xpY2tlZC5jbGFzc0xpc3QuYWRkKCd0YWItc2VsZWN0ZWQnKTtcclxufVxyXG5cclxuLy8gSGFuZGxlIHNob3cvaGlkZSBhbGwgdXNlcidzIHByb2plY3RzIChkaXYgdGhhdCBjb250YWlucyBNeSBQcm9qZWN0cyB0ZXh0KVxyXG5mdW5jdGlvbiBvcGVuQ2xvc2VNeVByb2plY3RzKGJ1dHRvbil7XHJcbiAgICBjb25zdCBpY29uSW5zaWRlQnV0dG9uID0gYnV0dG9uLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKVswXTtcclxuXHJcbiAgICBpZihidXR0b24uZ2V0QXR0cmlidXRlKCdjbGFzcycpID09PSAnc2hvdycpe1xyXG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2hpZGUnKTtcclxuICAgICAgIFxyXG4gICAgICAgIC8vIEFycm93IGVmZmVjdCB1c2luZyBhbiBhbmltYXRpb24gZGVmaW5lZCBpbiB0aGUgY3NzIGZpbGUsIGZyb20gb3BlbiB0byBjbG9zZWQgKGJvdHRvbSB0byByaWdodClcclxuICAgICAgICBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSAnb3BhY2l0eTogMDsnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IGljb25JbnNpZGVCdXR0b24uc3R5bGUuY3NzVGV4dCA9ICdhbmltYXRpb246IHByb2plY3RzQnV0dG9uQ2hhbmdpbmdEaXJlY3Rpb24gMTUwbXMgbm9ybWFsIGZvcndhcmRzOydcclxuICAgICAgICAsIDE1MCk7XHJcblxyXG4gICAgICAgIGhpZGVQcm9qZWN0cygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2hvdycpOyAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEFycm93IGVmZmVjdCB1c2luZyBhbiBhbmltYXRpb24gZGVmaW5lZCBpbiB0aGUgY3NzIGZpbGUsIGZyb20gY2xvc2VkIHRvIG9wZW4gKHJpZ2h0IHRvIGJvdHRvbSlcclxuICAgICAgICBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSAnb3BhY2l0eTogMDsnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IGljb25JbnNpZGVCdXR0b24uc3R5bGUuY3NzVGV4dCA9ICdhbmltYXRpb246IHByb2plY3RzQnV0dG9uQ2hhbmdpbmdEaXJlY3Rpb24gMTUwbXMgcmV2ZXJzZSBiYWNrd2FyZHM7J1xyXG4gICAgICAgICwgMTUwKTtcclxuXHJcbiAgICAgICAgc2hvd1Byb2plY3RzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dQcm9qZWN0cygpe1xyXG4gICAgY29uc3QgbGlzdE9mUHJvamVjdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC1wcm9qZWN0cy11c2VyJyk7XHJcbiAgICBsaXN0T2ZQcm9qZWN0cy5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6IGZsZXg7JztcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZVByb2plY3RzKCl7XHJcbiAgICBjb25zdCBsaXN0T2ZQcm9qZWN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXByb2plY3RzLXVzZXInKTtcclxuICAgIGxpc3RPZlByb2plY3RzLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0byBvcGVuIGFuZCBoaWRlIHRoZSBhc2lkZSBtZW51IHdoZW4gY2xpY2tlZFxyXG5mdW5jdGlvbiBvcGVuQ2xvc2VBc2lkZSgpe1xyXG4gICAgY29uc3QgaGFtYnVyZ3Vlck1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGFtYnVyZ3Vlci1tZW51LWJ1dHRvbicpO1xyXG4gICAgaGFtYnVyZ3Vlck1lbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudENsYXNzID0gaGFtYnVyZ3Vlck1lbnUuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGN1cnJlbnRDbGFzcyA9PT0gJ3Nob3cnKXtcclxuICAgICAgICAgICAgaGFtYnVyZ3Vlck1lbnUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdoaWRlJyk7XHJcbiAgICAgICAgICAgIHRvZ2dsZUFzaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBoYW1idXJndWVyTWVudS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3Nob3cnKTtcclxuICAgICAgICAgICAgdG9nZ2xlQXNpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlQXNpZGUoKXtcclxuICAgIGNvbnN0IGFzaWRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FzaWRlLW5hdmlnYXRpb24nKTtcclxuXHJcbiAgICBpZihhc2lkZS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT09ICdhc2lkZS1zaG93Jyl7XHJcbiAgICAgICAgYXNpZGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhc2lkZS1oaWRlJyk7XHJcbiAgICAgICAgYXNpZGUuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lOyc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhc2lkZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2FzaWRlLXNob3cnKTsgLy8gQWRkIHRoaXMgY2xhc3MgdG8gcHV0IG1haW4tY29udGVudCBiYWNrIHRvIGl0cyBwbGFjZVxyXG4gICAgICAgIGFzaWRlLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleDsnO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZFRvTW9kYWwoaHRtbEVsZW1lbnQpe1xyXG4gICAgY29uc3QgbW9kYWxCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYm94Jyk7XHJcbiAgICBjbGVhck1vZGFsKG1vZGFsQm94KTtcclxuXHJcbiAgICBtb2RhbEJveC5hcHBlbmRDaGlsZChodG1sRWxlbWVudCk7XHJcbiAgICBjaGFuZ2VNb2RhbFN0YXRlKG1vZGFsQm94KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RhbChodG1sRWxlbWVudCl7XHJcbiAgICBjb25zdCBtb2RhbEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1ib3gnKTtcclxuICAgIG1vZGFsQm94LnJlbW92ZUNoaWxkKGh0bWxFbGVtZW50KTtcclxuICAgIGNoYW5nZU1vZGFsU3RhdGUobW9kYWxCb3gpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTW9kYWxTdGF0ZShtb2RhbCl7XHJcbiAgICBjb25zdCBjdXJyZW50Q2xhc3MgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcblxyXG4gICAgaWYoY3VycmVudENsYXNzID09PSAnc2hvdycpXHJcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICdoaWRlJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzaG93Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyTW9kYWwobW9kYWwpe1xyXG4gICAgd2hpbGUobW9kYWwuZmlyc3RFbGVtZW50Q2hpbGQpe1xyXG4gICAgICAgIG1vZGFsLnJlbW92ZUNoaWxkKG1vZGFsLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4uL2FwcC1sb2dpYy9wcm9qZWN0LmpzXCI7XHJcbmltcG9ydCBzYXZlUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHtcclxuICAgIGJ1dHRvbldpdGhJbWcsXHJcbiAgICBjcmVhdGVFbGVtZW50LFxyXG4gICAgY3JlYXRlRW1wdHlIaW50LFxyXG4gICAgZXJyb3JGaWVsZENyZWF0b3IsXHJcbn0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBzZWxlY3RUYWIgfSBmcm9tIFwiLi9hc2lkZVNlY3Rpb24uanNcIjtcclxuaW1wb3J0IHsgZXhwYW5kUHJvamVjdFRhc2tzIH0gZnJvbSBcIi4vcHJvamVjdE1haW4uanNcIjtcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgZm9ybSB0byBjcmVhdGUgYSBuZXcgcHJvamVjdFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVOZXdQcm9qZWN0Rm9ybShidXR0b25OZXdQcm9qZWN0KSB7XHJcbiAgICBidXR0b25OZXdQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSBcIm9wYWNpdHk6IDBcIjsgLy8gSGlkZSAncGx1cycgYnV0dG9uXHJcbiAgICBjb25zdCBmb3JtV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHtcclxuICAgICAgICBlbGVtZW50SWQ6IFwiZm9ybS1hZGQtcHJvamVjdFwiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSW5wdXQgdG8gcGxhY2UgdGhlIG5ldyBwcm9qZWN0J3MgbmFtZVxyXG4gICAgY29uc3QgcHJvamVjdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIE9iamVjdC5hc3NpZ24ocHJvamVjdE5hbWVJbnB1dCwge1xyXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgIGlkOiBcInByb2plY3QtbmFtZVwiLFxyXG4gICAgICAgIG5hbWU6IFwicHJvamVjdF9uYW1lXCIsXHJcbiAgICAgICAgcGxhY2Vob2xkZXI6IGBOZXcgcHJvamVjdCdzIG5hbWVgLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdE5hbWVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcHJvamVjdE5hbWVEaXYuYXBwZW5kQ2hpbGQocHJvamVjdE5hbWVJbnB1dCk7XHJcblxyXG4gICAgLy8gQnV0dG9uIHRvIGNvbmZpcm0gdGhlIGNyZWF0aW9uIG9mIGEgbmV3IHByb2plY3RcclxuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoXHJcbiAgICAgICAgXCJjcmVhdGUtcHJvamVjdC1idXR0b25cIixcclxuICAgICAgICBcIi4vYXNzZXRzL2FzaWRlLWljb25zL3NlbGVjdGVkLWljb24uc3ZnXCJcclxuICAgICk7XHJcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgICAgbmV3UHJvamVjdEhhbmRsZXIoZm9ybVdyYXBwZXIsIGJ1dHRvbk5ld1Byb2plY3QpXHJcbiAgICApO1xyXG5cclxuICAgIC8vIEJ1dHRvbiB0byBjYW5jZWwgdGhlIGNyZWF0aW9uIG9mIGEgbmV3IHByb2plY3RcclxuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoXHJcbiAgICAgICAgXCJjYW5jZWwtcHJvamVjdC1idXR0b25cIixcclxuICAgICAgICBcIi4vYXNzZXRzL2FzaWRlLWljb25zL2NhbmNlbC1pY29uLnN2Z1wiXHJcbiAgICApO1xyXG4gICAgY2FuY2VsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgIHJlbW92ZVByb2plY3RGb3JtKGZvcm1XcmFwcGVyLCBidXR0b25OZXdQcm9qZWN0KVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBXcmFwcGVyIGZvciBjYW5jZWwgYW5kIGNyZWF0ZSBwcm9qZWN0IGJ1dHRvbnNcclxuICAgIGNvbnN0IGJ1dHRvbnNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJ1dHRvbnNXcmFwcGVyLmFwcGVuZChhZGRCdXR0b24sIGNhbmNlbEJ1dHRvbik7XHJcbiAgICBmb3JtV3JhcHBlci5hcHBlbmQocHJvamVjdE5hbWVEaXYsIGJ1dHRvbnNXcmFwcGVyKTtcclxuXHJcbiAgICAvLyBUaGlzIGVsZW1lbnRzIGFyZSB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwcm9qZWN0IGZvcm0gY29ycmVjdGx5XHJcbiAgICBjb25zdCBwYXJlbnRPZk5ld1Byb2plY3RCdXR0b24gPSBidXR0b25OZXdQcm9qZWN0LnBhcmVudE5vZGU7IC8vICgjY3JlYXRlLWFuZC1saXN0LXVzZXItcHJvamVjdHMpXHJcbiAgICBjb25zdCBwYXJlbnRPZlBhcmVudCA9IHBhcmVudE9mTmV3UHJvamVjdEJ1dHRvbi5wYXJlbnROb2RlOyAvLyAoI3VzZXItcHJvamVjdHMpXHJcblxyXG4gICAgLy8gcGFyZW50T2ZQYXJlbnQubGFzdEVsZW1lbnRDaGlsZCBpcyB0aGUgZWxlbWVudCB1c2VkIGFzIGEgcmVmZXJlbmNlLCB0byB1c2UgaW5zZXJ0QmVmb3JlXHJcbiAgICBwYXJlbnRPZlBhcmVudC5pbnNlcnRCZWZvcmUoZm9ybVdyYXBwZXIsIHBhcmVudE9mUGFyZW50Lmxhc3RFbGVtZW50Q2hpbGQpO1xyXG59XHJcblxyXG4vLyBDaGVjayBpZiB0aGUgcHJvamVjdCB0aXRsZSBpbnB1dCBpcyBmaWxsZWQsIGFuZCBjcmVhdGUgYSBuZXcgcHJvamVjdCAoSFRNTCBhbmQgU3RvcmFnZSlcclxuZnVuY3Rpb24gbmV3UHJvamVjdEhhbmRsZXIoZm9ybSwgYnV0dG9uTmV3UHJvamVjdCkge1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgaWYgKCFmb3JtRGF0YS5nZXQoXCJwcm9qZWN0X25hbWVcIikpIHtcclxuICAgICAgICBlcnJvckZpZWxkQ3JlYXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2plY3QtbmFtZVwiKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBQcm9qZWN0KGZvcm1EYXRhLmdldChcInByb2plY3RfbmFtZVwiKSk7XHJcblxyXG4gICAgICAgIGlmIChzYXZlUHJvamVjdChwcm9qZWN0KSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY3JlYXRlUHJvamVjdEFzaWRlKHByb2plY3QpO1xyXG4gICAgICAgICAgICByZW1vdmVQcm9qZWN0Rm9ybShmb3JtLCBidXR0b25OZXdQcm9qZWN0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlByb2plY3QgYWxyZWFkeSBleGlzdHMhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBSZW1vdmUgbmV3IHByb2plY3QgZm9ybSBhbmQgc2hvd3MgdGhlICdwbHVzJyBidXR0b24gYWdhaW5cclxuZnVuY3Rpb24gcmVtb3ZlUHJvamVjdEZvcm0oZm9ybSwgYnV0dG9uTmV3UHJvamVjdCkge1xyXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IGZvcm0ucGFyZW50RWxlbWVudDtcclxuICAgIHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZm9ybSk7XHJcbiAgICBidXR0b25OZXdQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSBcIm9wYWNpdHk6IDFcIjtcclxufVxyXG5cclxuLy8gRnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgYW4gSFRNTCBlbGVtZW50IGZvciBhIG5ldyBjcmVhdGVkIHByb2plY3QgKClcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb2plY3RBc2lkZShwcm9qZWN0T2JqZWN0KSB7XHJcbiAgICBjb25zdCBwcm9qZWN0SWQgPSBwcm9qZWN0T2JqZWN0LmdldFByb2plY3RJZCgpO1xyXG4gICAgY29uc3QgcHJvamVjdFRpdGxlID0gcHJvamVjdE9iamVjdC5nZXRUaXRsZSgpO1xyXG4gICAgY29uc3QgcHJvamVjdFRhc2tzID0gcHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpO1xyXG5cclxuICAgIGNvbnN0IGFycm93RG93bkltYWdlID0gY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XHJcbiAgICAgICAgZWxlbWVudFNyYzogXCIuL2Fzc2V0cy9hc2lkZS1pY29ucy9hcnJvdy1kb3duLWljb24tMjIucG5nXCIsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGJ1dHRvblRleHQgPSBjcmVhdGVFbGVtZW50KFwicFwiLCB7IGVsZW1lbnRUZXh0OiBgJHtwcm9qZWN0VGl0bGV9YCB9KTtcclxuICAgIGNvbnN0IGV4cGFuZEltYWdlID0gY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XHJcbiAgICAgICAgZWxlbWVudFNyYzogXCIuL2Fzc2V0cy9hc2lkZS1pY29ucy9leHBhbmQtaWNvbi5wbmdcIixcclxuICAgICAgICBlbGVtZW50Q2xhc3M6IFwiZXhwYW5kLXByb2plY3QtdGFza3NcIixcclxuICAgIH0pO1xyXG4gICAgY29uc3QgYWxsVGFza3NFbGVtZW50cyA9IHByb2plY3RUYXNrcy5tYXAoKHRhc2spID0+XHJcbiAgICAgICAgY3JlYXRlVGFza0VsZW1lbnRBc2lkZSh0YXNrKVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBXcmFwIGJ1dHRvbnMgdG8gc2hvdy9oaWRlIGFuZCBleHBhbmQgcHJvamVjdCB0byBhIGRpdlxyXG4gICAgY29uc3QgZGl2QnV0dG9uc1Byb2plY3ROYW1lID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInByb2plY3Qgc2hvd1wiLFxyXG4gICAgfSk7XHJcbiAgICBkaXZCdXR0b25zUHJvamVjdE5hbWUuYXBwZW5kKGFycm93RG93bkltYWdlLCBidXR0b25UZXh0LCBleHBhbmRJbWFnZSk7XHJcblxyXG4gICAgLy8gZXZlbnRMaXN0ZW5lciB0byBzaG93L2hpZGUgYW5kIGV4cGFuZCBhIHByb2plY3RcclxuICAgIG5ld1Byb2plY3RCdXR0b25MaXN0ZW5lcihkaXZCdXR0b25zUHJvamVjdE5hbWUsIGV4cGFuZEltYWdlKTtcclxuXHJcbiAgICAvLyBCdXR0b25zIHRvIHNob3cvaGlkZSBhbmQgZXhwYW5kIHByb2plY3RcclxuICAgIGRpdkJ1dHRvbnNQcm9qZWN0TmFtZS5hcHBlbmQoYXJyb3dEb3duSW1hZ2UsIGJ1dHRvblRleHQsIGV4cGFuZEltYWdlKTtcclxuXHJcbiAgICAvLyBXcmFwcGVyIGZvciBhbGwgdGFza3Mgb2YgdGhlIGN1cnJlbnQgcHJvamVjdFxyXG4gICAgY29uc3QgYWxsVGFza3NXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInByb2plY3QtdGFza3MtYXNpZGVcIixcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChhbGxUYXNrc0VsZW1lbnRzLmxlbmd0aCA9PT0gMCkgY3JlYXRlRW1wdHlIaW50KGFsbFRhc2tzV3JhcHBlcik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgQXJyYXkuZnJvbShhbGxUYXNrc0VsZW1lbnRzKS5mb3JFYWNoKChlbGVtZW50KSA9PlxyXG4gICAgICAgICAgICBhbGxUYXNrc1dyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudClcclxuICAgICAgICApO1xyXG5cclxuICAgIC8vIEFwcGVuZCBhbGwgZWxlbWVudHMgdG8gYSBkaXYgdGhhdCB3cmFwcyBhbGwgdGhlIGNvbnRlbnQgb2YgYSBwcm9qZWN0XHJcbiAgICBjb25zdCBkaXZXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInByb2plY3QtbmFtZS1hbmQtdGFza3NcIixcclxuICAgICAgICBlbGVtZW50SWQ6IGBhc2lkZV8ke3Byb2plY3RJZH1gLFxyXG4gICAgfSk7XHJcbiAgICBkaXZXcmFwcGVyLmFwcGVuZChkaXZCdXR0b25zUHJvamVjdE5hbWUsIGFsbFRhc2tzV3JhcHBlcik7XHJcblxyXG4gICAgLy8gU2VjdGlvbiB0aGF0IGNvbnRhaW5zIGFsbCB1c2VyJ3MgcHJvamVjdHNcclxuICAgIGNvbnN0IHVzZXJQcm9qZWN0c1NlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpc3QtcHJvamVjdHMtdXNlclwiKTtcclxuXHJcbiAgICByZXR1cm4gdXNlclByb2plY3RzU2VjdGlvbi5hcHBlbmRDaGlsZChkaXZXcmFwcGVyKTtcclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgdGFzayBlbGVtZW50IHRvIHB1dCBpbnNpZGUgdGhlIHJlbGF0ZWQgcHJvamVjdCBpbiB0aGUgYXNpZGUgc2VjdGlvblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGFza0VsZW1lbnRBc2lkZSh0YXNrKSB7XHJcbiAgICBjb25zdCB0YXNrV3JhcHBlckFzaWRlID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInRhc2stYXNpZGVcIixcclxuICAgICAgICBlbGVtZW50SWQ6IGBhc2lkZV8ke3Rhc2suZ2V0VGFza0lkKCl9YCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNwYW5Qcmlvcml0eSA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtcclxuICAgICAgICBlbGVtZW50Q2xhc3M6IGB0YXNrLXByaW9yaXR5LWFzaWRlICR7dGFzay5nZXRQcmlvcml0eSgpfWAsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHRhc2tOYW1lID0gY3JlYXRlRWxlbWVudChcInBcIiwgeyBlbGVtZW50VGV4dDogYCR7dGFzay5nZXROYW1lKCl9YCB9KTtcclxuICAgIHRhc2tXcmFwcGVyQXNpZGUuYXBwZW5kKHNwYW5Qcmlvcml0eSwgdGFza05hbWUpO1xyXG5cclxuICAgIHJldHVybiB0YXNrV3JhcHBlckFzaWRlO1xyXG59XHJcblxyXG4vLyBTZXQgbmV3IHByb2plY3QgZXZlbnRMaXN0ZW5lcnMsIHRvIHNob3cvaGlkZSBhbmQgZXhwYW5kIGNvbnRlbnQgdG8gbWFpbi1jb250ZW50IGRpdiAobm90IHlldCBpbXBsZW1lbnRlZClcclxuZnVuY3Rpb24gbmV3UHJvamVjdEJ1dHRvbkxpc3RlbmVyKGJ1dHRvblNob3dIaWRlLCBidXR0b25FeHBhbmQpIHtcclxuICAgIGJ1dHRvblNob3dIaWRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgIG9wZW5DbG9zZVByb2plY3RUYXNrcyhidXR0b25TaG93SGlkZSlcclxuICAgICk7XHJcbiAgICBidXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgIHNlbGVjdFRhYihidXR0b25FeHBhbmQucGFyZW50RWxlbWVudCk7XHJcbiAgICAgICAgZXhwYW5kUHJvamVjdFRhc2tzKGJ1dHRvbkV4cGFuZCk7IC8vIEV4cGFuZCBtZWFucyB0aGF0IHRoZSBwcm9qZWN0IHdpbGwgYmUgZXhwYW5kZWQgdG8gdGhlIG1haW4tY29udGVudFxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIEhhbmRsZSBzaG93L2hpZGUgdGFza3Mgb2YgYSBwcm9qZWN0LCBieSBjbGlja2luZyBpbiB0aGUgcHJvamVjdCBkaXZcclxuZnVuY3Rpb24gb3BlbkNsb3NlUHJvamVjdFRhc2tzKHByb2plY3RCdXR0b24pIHtcclxuICAgIGNvbnN0IGljb25JbnNpZGVCdXR0b24gPSBwcm9qZWN0QnV0dG9uLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpWzBdO1xyXG5cclxuICAgIGlmIChwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcInNob3dcIikpIHtcclxuICAgICAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xyXG4gICAgICAgIHByb2plY3RCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XHJcblxyXG4gICAgICAgIC8vIEFycm93IGVmZmVjdCB1c2luZyBhbiBhbmltYXRpb24gZGVmaW5lZCBpbiB0aGUgY3NzIGZpbGUsIGZyb20gb3BlbiB0byBjbG9zZWQgKGJvdHRvbSB0byByaWdodClcclxuICAgICAgICBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSBcIm9wYWNpdHk6IDA7XCI7XHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT5cclxuICAgICAgICAgICAgICAgIChpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPVxyXG4gICAgICAgICAgICAgICAgICAgIFwiYW5pbWF0aW9uOiBwcm9qZWN0c0J1dHRvbkNoYW5naW5nRGlyZWN0aW9uIDE1MG1zIG5vcm1hbCBmb3J3YXJkcztcIiksXHJcbiAgICAgICAgICAgIDE1MFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGhpZGVUYXNrc09mUHJvamVjdChwcm9qZWN0QnV0dG9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJvamVjdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcclxuICAgICAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xyXG5cclxuICAgICAgICAvLyBBcnJvdyBlZmZlY3QgdXNpbmcgYW4gYW5pbWF0aW9uIGRlZmluZWQgaW4gdGhlIGNzcyBmaWxlLCBmcm9tIGNsb3NlZCB0byBvcGVuIChyaWdodCB0byBib3R0b20pXHJcbiAgICAgICAgaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gXCJvcGFjaXR5OiAwO1wiO1xyXG4gICAgICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+XHJcbiAgICAgICAgICAgICAgICAoaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID1cclxuICAgICAgICAgICAgICAgICAgICBcImFuaW1hdGlvbjogcHJvamVjdHNCdXR0b25DaGFuZ2luZ0RpcmVjdGlvbiAxNTBtcyByZXZlcnNlIGJhY2t3YXJkcztcIiksXHJcbiAgICAgICAgICAgIDE1MFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHNob3dUYXNrc09mUHJvamVjdChwcm9qZWN0QnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB1c2VkIHRvIGhpZGUgdGFza3Mgb2YgYSBwcm9qZWN0LCBieSBjbGlja2luZyBpbiB0aGUgcHJvamVjdCBuYW1lIChpZiBvcGVuKVxyXG4gICAgZnVuY3Rpb24gaGlkZVRhc2tzT2ZQcm9qZWN0KGJ1dHRvbikge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFByb2plY3QgPSBidXR0b24ucGFyZW50RWxlbWVudDtcclxuICAgICAgICBjb25zdCB0YXNrc09mUHJvamVjdCA9IHBhcmVudFByb2plY3QubGFzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICB0YXNrc09mUHJvamVjdC5zdHlsZS5jc3NUZXh0ID1cclxuICAgICAgICAgICAgXCJhbmltYXRpb246IGRlbGF5QXNpZGUgMzAwbXMgcmV2ZXJzZSBmb3J3YXJkcztcIjtcclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiAodGFza3NPZlByb2plY3Quc3R5bGUuY3NzVGV4dCA9IFwiZGlzcGxheTogbm9uZTtcIiksXHJcbiAgICAgICAgICAgIDMwMFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdXNlZCB0byBzaG93IHRhc2tzIG9mIGEgcHJvamVjdCwgYnkgY2xpY2tpbmcgaW4gdGhlIHByb2plY3QgbmFtZSAoaWYgY2xvc2VkKVxyXG4gICAgZnVuY3Rpb24gc2hvd1Rhc2tzT2ZQcm9qZWN0KGJ1dHRvbikge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFByb2plY3QgPSBidXR0b24ucGFyZW50RWxlbWVudDtcclxuICAgICAgICBjb25zdCB0YXNrc09mUHJvamVjdCA9IHBhcmVudFByb2plY3QubGFzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICB0YXNrc09mUHJvamVjdC5zdHlsZS5jc3NUZXh0ID0gXCJhbmltYXRpb246IGRlbGF5QXNpZGUgMzAwbXMgZm9yd2FyZHM7XCI7XHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gKHRhc2tzT2ZQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSBcImRpc3BsYXk6IGZsZXg7XCIpLFxyXG4gICAgICAgICAgICAzMDBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBQcm9qZWN0IGZyb20gXCIuLi9hcHAtbG9naWMvcHJvamVjdC5qc1wiO1xyXG5pbXBvcnQgeyBnZXRQcm9qZWN0QnlJZCwgdXBkYXRlRXhpc3RlbnRQcm9qZWN0IH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGJ1dHRvbldpdGhJbWcsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vY29tbW9uRnVuY3Rpb25zLmpzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZWRpdFByb2plY3RIYW5kbGVyKHByb2plY3RJZCkge1xyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbWFpbl8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHByb2plY3RIZWFkZXIgPSBwcm9qZWN0V3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLnByb2plY3QtaGVhZGVyXCIpO1xyXG4gICAgY29uc3QgcHJvamVjdE5hbWUgPSBwcm9qZWN0V3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLnByb2plY3QtbmFtZVwiKTtcclxuICAgIGNvbnN0IHByb2plY3RCdXR0b25zID0gcHJvamVjdE5hbWUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgcHJvamVjdEJ1dHRvbnMuc3R5bGUuY3NzVGV4dCA9IFwib3BhY2l0eTogMFwiOyAvLyBIaWRlIHRoZSBwcm9qZWN0IGJ1dHRvbnMgKGVkaXQgYW5kIGRlbGV0ZSBpY29ucylcclxuXHJcbiAgICBjb25zdCBvbGRQcm9qZWN0TmFtZSA9IHByb2plY3ROYW1lLnRleHRDb250ZW50OyAvLyBVc2VkIGluIGNhc2Ugb2YgdXNlciBjYW5jZWwgdGhlIHRpdGxlIGVkaXRcclxuICAgIHByb2plY3ROYW1lLnNldEF0dHJpYnV0ZShcImNvbnRlbnRFZGl0YWJsZVwiLCBcInRydWVcIik7XHJcbiAgICBwcm9qZWN0TmFtZS5zdHlsZS5jc3NUZXh0ID0gXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIjtcclxuICAgIHByb2plY3ROYW1lLmZvY3VzKCk7XHJcblxyXG4gICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoXHJcbiAgICAgICAgXCJjb25maXJtLXByb2plY3QtbmFtZVwiLFxyXG4gICAgICAgIFwiLi9hc3NldHMvbWFpbi1pY29ucy9zZWxlY3RlZC1pY29uLTI4LnN2Z1wiXHJcbiAgICApO1xyXG4gICAgY29uZmlybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICB0aXRsZUVkaXRIYW5kbGVyKHByb2plY3ROYW1lLCBwcm9qZWN0QnV0dG9ucywgcHJvamVjdElkKVxyXG4gICAgKTtcclxuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoXHJcbiAgICAgICAgXCJjb25maXJtLXByb2plY3QtbmFtZVwiLFxyXG4gICAgICAgIFwiLi9hc3NldHMvbWFpbi1pY29ucy9jYW5jZWwtaWNvbi0yOC5zdmdcIlxyXG4gICAgKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICByZW1vdmVUaXRsZUVkaXQocHJvamVjdE5hbWUsIHByb2plY3RCdXR0b25zLCBvbGRQcm9qZWN0TmFtZSlcclxuICAgICk7XHJcbiAgICBjb25zdCB3cmFwcGVyQnV0dG9ucyA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgIGVsZW1lbnRDbGFzczogXCJlZGl0LXByb2plY3QtYnV0dG9uc1wiLFxyXG4gICAgfSk7XHJcbiAgICB3cmFwcGVyQnV0dG9ucy5hcHBlbmQoY29uZmlybUJ1dHRvbiwgY2FuY2VsQnV0dG9uKTtcclxuXHJcbiAgICBwcm9qZWN0SGVhZGVyLmluc2VydEJlZm9yZSh3cmFwcGVyQnV0dG9ucywgcHJvamVjdE5hbWUubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGl0bGVFZGl0SGFuZGxlcihuYW1lRWxlbWVudCwgcHJvamVjdEJ1dHRvbnMsIHByb2plY3RJZCkge1xyXG4gICAgY29uc3QgbmV3VGl0bGUgPSBuYW1lRWxlbWVudC50ZXh0Q29udGVudDtcclxuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0QnlJZChwcm9qZWN0SWQpO1xyXG4gICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdCk7XHJcbiAgICBwcm9qZWN0T2JqZWN0LnNldFRpdGxlKG5ld1RpdGxlKTtcclxuICAgIHVwZGF0ZUV4aXN0ZW50UHJvamVjdChwcm9qZWN0T2JqZWN0KTtcclxuICAgIHVwZGF0ZVByb2plY3RFbGVtZW50KG5ld1RpdGxlLCBwcm9qZWN0SWQpO1xyXG4gICAgcmVtb3ZlVGl0bGVFZGl0KG5hbWVFbGVtZW50LCBwcm9qZWN0QnV0dG9ucyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVByb2plY3RFbGVtZW50KG5ld1RpdGxlLCBwcm9qZWN0SWQpIHtcclxuICAgIGNvbnN0IHByb2plY3RBc2lkZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRpdGxlQXNpZGVTZWN0aW9uID0gcHJvamVjdEFzaWRlLnF1ZXJ5U2VsZWN0b3IoXCIucHJvamVjdFwiKTtcclxuICAgIGNvbnN0IHByb2plY3RUaXRsZUFzaWRlID0gdGl0bGVBc2lkZVNlY3Rpb24ucXVlcnlTZWxlY3RvcihcInBcIik7XHJcbiAgICBwcm9qZWN0VGl0bGVBc2lkZS50ZXh0Q29udGVudCA9IG5ld1RpdGxlO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3RNYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYG1haW5fJHtwcm9qZWN0SWR9YCk7XHJcbiAgICBjb25zdCB0aXRsZU1haW5TZWN0aW9uID0gcHJvamVjdE1haW4ucXVlcnlTZWxlY3RvcihcIi5wcm9qZWN0LW5hbWVcIik7XHJcbiAgICB0aXRsZU1haW5TZWN0aW9uLnRleHRDb250ZW50ID0gbmV3VGl0bGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRpdGxlRWRpdChlbGVtZW50LCBwcm9qZWN0QnV0dG9ucywgb2xkRWxlbWVudE5hbWUpIHtcclxuICAgIGlmIChvbGRFbGVtZW50TmFtZSkgZWxlbWVudC50ZXh0Q29udGVudCA9IG9sZEVsZW1lbnROYW1lO1xyXG5cclxuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIpO1xyXG4gICAgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1wiO1xyXG4gICAgcHJvamVjdEJ1dHRvbnMuc3R5bGUuY3NzVGV4dCA9IFwib3BhY2l0eTogMVwiO1xyXG5cclxuICAgIGNvbnN0IGVsZW1lbnRQYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICBlbGVtZW50UGFyZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKTtcclxufVxyXG4iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdEJ5SWQgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHtcclxuICAgIGJ1dHRvbldpdGhJbWcsXHJcbiAgICBjbGVhblByb2plY3RJZCxcclxuICAgIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUsXHJcbiAgICBjcmVhdGVDb21tb25UYXNrRm9ybSxcclxuICAgIGNyZWF0ZUVsZW1lbnQsXHJcbn0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBlZGl0UHJvamVjdEhhbmRsZXIgfSBmcm9tIFwiLi9wcm9qZWN0RWRpdC5qc1wiO1xyXG5pbXBvcnQgeyByZW1vdmVQcm9qZWN0SGFuZGxlciB9IGZyb20gXCIuL3Byb2plY3RSZW1vdmUuanNcIjtcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBuZXdUYXNrRm9ybSB9IGZyb20gXCIuL3Rhc2tDcmVhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBlZGl0VGFza0Zvcm0gfSBmcm9tIFwiLi90YXNrRWRpdC5qc1wiO1xyXG5pbXBvcnQgeyBleHBhbmRUYXNrc0luZm8gfSBmcm9tIFwiLi90YXNrRXhwYW5kLmpzXCI7XHJcbmltcG9ydCB7IGRlbGV0ZVRhc2tGcm9tUHJvamVjdCB9IGZyb20gXCIuL3Rhc2tSZW1vdmUuanNcIjtcclxuXHJcbi8vIEV4cGFuZCBhIHByb2plY3QgaW4gdGhlIG1haW4tY29udGVudCBkaXYgKG5vdCB5ZXQgaW1wbGVtZW50ZWQpXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRQcm9qZWN0VGFza3MoYnV0dG9uVGhhdFRyaWdnZXJlZCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRQcm9qZWN0RGl2UGFyZW50ID1cclxuICAgICAgICBidXR0b25UaGF0VHJpZ2dlcmVkLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIGxldCBwYXJlbnRQcm9qZWN0Q2xlYW5JZCA9IGNsZWFuUHJvamVjdElkKFxyXG4gICAgICAgIHNlbGVjdGVkUHJvamVjdERpdlBhcmVudC5nZXRBdHRyaWJ1dGUoXCJpZFwiKVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBDaGVja3MgaWYgdGhlIHByb2plY3QgZXhpc3RzXHJcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEJ5SWQocGFyZW50UHJvamVjdENsZWFuSWQpO1xyXG5cclxuICAgIGlmIChwcm9qZWN0KSB7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdCk7IC8vIElmIHByb2plY3RzIGV4aXN0cywgY3JlYXRlIGEgXCJuZXdcIiBvYmplY3QgYmFzZWQgb24gaGltLCB0byBiZSBhYmxlIHRvIG1hbmlwdWxhdGVcclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBwcm9qZWN0IGV4cGFuZGVkIGZyb20gYXNpZGUgYW5kIGRpc3BsYXkgaXQgaW4gdGhlICNtYWluLWNvbnRlbnQgZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IHByb2plY3RNYWluRWxlbWVudCA9IGNyZWF0ZVByb2plY3RNYWluKHByb2plY3RPYmplY3QpO1xyXG4gICAgICAgIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUocHJvamVjdE1haW5FbGVtZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgSFRNTCBwcm9qZWN0IGVsZW1lbnQgdG8gcGxhY2UgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb2plY3RNYWluKHByb2plY3QpIHtcclxuICAgIGNvbnN0IHByb2plY3RJZCA9IHByb2plY3QuZ2V0UHJvamVjdElkKCk7XHJcbiAgICBjb25zdCBwcm9qZWN0TmFtZSA9IHByb2plY3QuZ2V0VGl0bGUoKTtcclxuICAgIGNvbnN0IHByb2plY3RUYXNrcyA9IHByb2plY3QuZ2V0QWxsVGFza3MoKTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0TmFtZUgzID0gY3JlYXRlRWxlbWVudChcImgzXCIsIHtcclxuICAgICAgICBlbGVtZW50Q2xhc3M6IFwicHJvamVjdC1uYW1lXCIsXHJcbiAgICAgICAgZWxlbWVudFRleHQ6IGAke3Byb2plY3ROYW1lfWAsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBidXR0b25XaXRoSW1nKFxyXG4gICAgICAgIFwiZWRpdC1wcm9qZWN0XCIsXHJcbiAgICAgICAgXCIuL2Fzc2V0cy9tYWluLWljb25zL2VkaXQtaWNvbi0yNi5zdmdcIlxyXG4gICAgKTtcclxuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGVkaXRQcm9qZWN0SGFuZGxlcihwcm9qZWN0SWQpKTtcclxuICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoXHJcbiAgICAgICAgXCJyZW1vdmUtcHJvamVjdFwiLFxyXG4gICAgICAgIFwiLi9hc3NldHMvbWFpbi1pY29ucy90cmFzaC1pY29uLTI4LnN2Z1wiXHJcbiAgICApO1xyXG4gICAgcmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgIHJlbW92ZVByb2plY3RIYW5kbGVyKHByb2plY3RJZClcclxuICAgICk7XHJcbiAgICBjb25zdCBwcm9qZWN0QnV0dG9ucyA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgIGVsZW1lbnRDbGFzczogXCJwcm9qZWN0LWJ1dHRvbnNcIixcclxuICAgIH0pO1xyXG4gICAgcHJvamVjdEJ1dHRvbnMuYXBwZW5kKGVkaXRCdXR0b24sIHJlbW92ZUJ1dHRvbik7XHJcbiAgICBjb25zdCBwcm9qZWN0SGVhZGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInByb2plY3QtaGVhZGVyXCIsXHJcbiAgICB9KTtcclxuICAgIHByb2plY3RIZWFkZXIuYXBwZW5kKHByb2plY3ROYW1lSDMsIHByb2plY3RCdXR0b25zKTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0VGFza3NXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInByb2plY3QtdGFza3MtbWFpblwiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgYW4gSFRNTCBlbGVtZW50IGZvciBlYWNoIGV4aXN0ZW50IHRhc2tcclxuICAgIEFycmF5LmZyb20ocHJvamVjdFRhc2tzKS5tYXAoKHRhc2spID0+IHtcclxuICAgICAgICBjb25zdCB0YXNrRWxlbWVudCA9IGNyZWF0ZVRhc2tFbGVtZW50TWFpbih0YXNrLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHByb2plY3RUYXNrc1dyYXBwZXIuYXBwZW5kQ2hpbGQodGFza0VsZW1lbnQpOyAvLyBBcHBlbmQgdG8gdGhlIGxpc3QgdGhhdCBjb250YWlucyBhbGwgdGFza3NcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEJ1dHRvbiB0byBhZGQgYSBuZXcgdGFzayB0byB0aGUgcHJvamVjdFxyXG4gICAgY29uc3QgbmV3VGFza0J1dHRvbiA9IGJ1dHRvbldpdGhJbWcoXHJcbiAgICAgICAgXCJhZGQtdGFza1wiLFxyXG4gICAgICAgIFwiLi9hc3NldHMvbWFpbi1pY29ucy9wbHVzLWljb24tdGFzay1hZGQuc3ZnXCIsXHJcbiAgICAgICAgXCJBZGQgbmV3IHRhc2tcIlxyXG4gICAgKTtcclxuICAgIG5ld1Rhc2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgdGFza0Zvcm0gPSBjcmVhdGVDb21tb25UYXNrRm9ybSgpO1xyXG4gICAgICAgIG5ld1Rhc2tGb3JtKHRhc2tGb3JtLCBwcm9qZWN0SWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXBwZW5kIGFsbCBlbGVtZW50cyB0byB0aGUgcHJvamVjdCB3cmFwcGVyIChob2xkIGFsbCB0YXNrcyBhbmQgaW5mb3Mgb2YgYSBzaW5nbGUgcHJvamVjdClcclxuICAgIGNvbnN0IHByb2plY3RXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudElkOiBgbWFpbl8ke3Byb2plY3RJZH1gLFxyXG4gICAgICAgIGVsZW1lbnRDbGFzczogXCJwcm9qZWN0LXdyYXBwZXJcIixcclxuICAgIH0pO1xyXG4gICAgcHJvamVjdFdyYXBwZXIuYXBwZW5kKHByb2plY3RIZWFkZXIsIHByb2plY3RUYXNrc1dyYXBwZXIsIG5ld1Rhc2tCdXR0b24pO1xyXG5cclxuICAgIHJldHVybiBwcm9qZWN0V3JhcHBlcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRhc2tFbGVtZW50TWFpbih0YXNrLCBwcm9qZWN0SWQpIHtcclxuICAgIGNvbnN0IHRhc2tXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudElkOiBgbWFpbl8ke3Rhc2suZ2V0VGFza0lkKCl9YCxcclxuICAgICAgICBlbGVtZW50Q2xhc3M6IFwidGFzay1tYWluXCIsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMZWZ0IHNpZGUgb2YgYSB0YXNrIGRpc3BsYXllZCBpbiB0aGUgI21haW4tY29udGVudFxyXG4gICAgY29uc3QgbGVmdFNpZGVXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInRhc2stbGVmdC1zaWRlXCIsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHByaW9yaXR5QnV0dG9uID0gY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBgdGFzay1wcmlvcml0eS1tYWluICR7dGFzay5nZXRQcmlvcml0eSgpfWAsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHRhc2tOYW1lQW5kRHVlRGF0ZSA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgIGVsZW1lbnRDbGFzczogXCJ0YXNrLW5hbWUtYW5kLWRhdGVcIixcclxuICAgIH0pO1xyXG4gICAgY29uc3QgdGFza05hbWUgPSBjcmVhdGVFbGVtZW50KFwicFwiLCB7XHJcbiAgICAgICAgZWxlbWVudENsYXNzOiBcInRhc2stbmFtZVwiLFxyXG4gICAgICAgIGVsZW1lbnRUZXh0OiBgJHt0YXNrLmdldE5hbWUoKX1gLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB0YXNrRHVlRGF0ZSA9IGNyZWF0ZUVsZW1lbnQoXCJwXCIsIHtcclxuICAgICAgICBlbGVtZW50Q2xhc3M6IFwidGFzay1kdWUtZGF0ZVwiLFxyXG4gICAgICAgIGVsZW1lbnRUZXh0OiBgJHt0YXNrLmdldER1ZURhdGUoKX1gLFxyXG4gICAgfSk7XHJcbiAgICB0YXNrTmFtZUFuZER1ZURhdGUuYXBwZW5kKHRhc2tOYW1lLCB0YXNrRHVlRGF0ZSk7XHJcbiAgICBsZWZ0U2lkZVdyYXBwZXIuYXBwZW5kKHByaW9yaXR5QnV0dG9uLCB0YXNrTmFtZUFuZER1ZURhdGUpO1xyXG5cclxuICAgIC8vIFJpZ2h0IHNpZGUgKGJ1dHRvbnMgdG8gY2hhbmdlIHN0YXRlIG9mIGEgdGFzaykgb2YgYSB0YXNrIGRpc3BsYXllZCBpbiB0aGUgI21haW4tY29udGVudFxyXG4gICAgY29uc3QgcmlnaHRTaWRlV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xyXG4gICAgICAgIGVsZW1lbnRDbGFzczogXCJ0YXNrLXJpZ2h0LXNpZGVcIixcclxuICAgIH0pO1xyXG4gICAgY29uc3QgZXhwYW5kQnV0dG9uID0gYnV0dG9uV2l0aEltZyhcclxuICAgICAgICBcImV4cGFuZC10YXNrXCIsXHJcbiAgICAgICAgXCIuL2Fzc2V0cy9tYWluLWljb25zL2V5ZS1pY29uLnBuZ1wiXHJcbiAgICApO1xyXG4gICAgZXhwYW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHRhc2tGb3JtID0gY3JlYXRlQ29tbW9uVGFza0Zvcm0oKTtcclxuICAgICAgICBleHBhbmRUYXNrc0luZm8odGFzaywgcHJvamVjdElkLCB0YXNrRm9ybSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBidXR0b25XaXRoSW1nKFxyXG4gICAgICAgIFwiZWRpdC10YXNrXCIsXHJcbiAgICAgICAgXCIuL2Fzc2V0cy9tYWluLWljb25zL2VkaXQtaWNvbi5zdmdcIlxyXG4gICAgKTtcclxuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgdGFza0Zvcm0gPSBjcmVhdGVDb21tb25UYXNrRm9ybSgpO1xyXG4gICAgICAgIGVkaXRUYXNrRm9ybSh0YXNrLCBwcm9qZWN0SWQsIHRhc2tGb3JtKTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYnV0dG9uV2l0aEltZyhcclxuICAgICAgICBcImRlbGV0ZS10YXNrXCIsXHJcbiAgICAgICAgXCIuL2Fzc2V0cy9tYWluLWljb25zL3JlbW92ZS1pY29uLnN2Z1wiXHJcbiAgICApO1xyXG4gICAgcmVtb3ZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgIGRlbGV0ZVRhc2tGcm9tUHJvamVjdCh0YXNrLCBwcm9qZWN0SWQpXHJcbiAgICApO1xyXG4gICAgcmlnaHRTaWRlV3JhcHBlci5hcHBlbmQoZXhwYW5kQnV0dG9uLCBlZGl0QnV0dG9uLCByZW1vdmVCdXR0b24pO1xyXG5cclxuICAgIC8vIEFwcGVuZCB0byB0aGUgdGFzayB3cmFwcGVyXHJcbiAgICB0YXNrV3JhcHBlci5hcHBlbmQobGVmdFNpZGVXcmFwcGVyLCByaWdodFNpZGVXcmFwcGVyKTtcclxuXHJcbiAgICByZXR1cm4gdGFza1dyYXBwZXI7XHJcbn1cclxuIiwiaW1wb3J0IHsgcmVtb3ZlUHJvamVjdFN0b3JhZ2UgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVQcm9qZWN0SGFuZGxlcihwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgbWFpbkNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jb250ZW50Jyk7XHJcbiAgICBjb25zdCBwcm9qZWN0TWFpblRvUmVtb3ZlID0gbWFpbkNvbnRlbnQucXVlcnlTZWxlY3RvcihgI21haW5fJHtwcm9qZWN0SWR9YCk7XHJcbiAgICBtYWluQ29udGVudC5yZW1vdmVDaGlsZChwcm9qZWN0TWFpblRvUmVtb3ZlKTtcclxuXHJcbiAgICBjb25zdCBhc2lkZVByb2plY3RzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXByb2plY3RzLXVzZXInKTtcclxuICAgIGNvbnN0IHByb2plY3RBc2lkZVRvUmVtb3ZlID0gYXNpZGVQcm9qZWN0c0xpc3QucXVlcnlTZWxlY3RvcihgI2FzaWRlXyR7cHJvamVjdElkfWApO1xyXG4gICAgYXNpZGVQcm9qZWN0c0xpc3QucmVtb3ZlQ2hpbGQocHJvamVjdEFzaWRlVG9SZW1vdmUpO1xyXG5cclxuICAgIHJlbW92ZVByb2plY3RTdG9yYWdlKHByb2plY3RJZCk7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IFRhc2sgZnJvbSBcIi4uL2FwcC1sb2dpYy90YXNrLmpzXCI7XHJcbmltcG9ydCB7IHVwZGF0ZUV4aXN0ZW50UHJvamVjdCwgZ2VuZXJhdGVOZXdUYXNrSWQsIGdldFByb2plY3RCeUlkIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGdldFRhc2tFbGVtZW50cywgcmVtb3ZlRW1wdHlIaW50LCB0YXNrRm9ybURhdGFIYW5kbGVyIH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBhcHBlbmRUb01vZGFsLCByZW1vdmVGcm9tTW9kYWwgfSBmcm9tIFwiLi9tb2RhbC5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVUYXNrRWxlbWVudEFzaWRlIH0gZnJvbSBcIi4vcHJvamVjdEFzaWRlLmpzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVRhc2tFbGVtZW50TWFpbiB9IGZyb20gXCIuL3Byb2plY3RNYWluLmpzXCI7XHJcblxyXG4vLyBGdW5jdGlvbiB0byBnZW5lcmF0ZSBhIGZvcm0gdG8gY3JlYXRlIGEgbmV3IHRhc2ssIGluc2lkZSBhbiBleGlzdGVudCBwcm9qZWN0XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5ld1Rhc2tGb3JtKGZvcm0sIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCBmb3JtVGl0bGUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWhlYWRlcicpO1xyXG4gICAgZm9ybVRpdGxlLnRleHRDb250ZW50ID0gJ0FkZCBhIG5ldyB0YXNrJztcclxuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignI2FkZC10YXNrJyk7XHJcbiAgICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBuZXdUYXNrSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpKTtcclxuICAgIGFwcGVuZFRvTW9kYWwoZm9ybSk7XHJcbn1cclxuXHJcbi8vIElmIHVzZXIgY2xpY2tzIG9uIHRoZSBhZGQgdGFzayBidXR0b24sIHRoZSBpbmZvIHRoYXQgY29tZXMgZnJvbSB0aGUgZm9ybSBpcyBoYW5kbGVkXHJcbmZ1bmN0aW9uIG5ld1Rhc2tIYW5kbGVyKGZvcm0sIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB0YXNrUGFyYW1ldGVycyA9IHRhc2tGb3JtRGF0YUhhbmRsZXIoZm9ybSwgcHJvamVjdElkKTtcclxuICAgIFxyXG4gICAgaWYodGFza1BhcmFtZXRlcnMpe1xyXG4gICAgICAgIGNvbnN0IG5ld1Rhc2sgPSBzYXZlVGFza1RvUHJvamVjdCh0YXNrUGFyYW1ldGVycywgcHJvamVjdElkKTtcclxuICAgICAgICBjcmVhdGVUYXNrRWxlbWVudChuZXdUYXNrLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RhbChmb3JtKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gR2V0IHByb2plY3QgZnJvbSBzdG9yYWdlIGFuZCB0cmFuc2Zvcm0gaGltIGluIGEgcHJvamVjdCBvYmplY3QgdG8gc3RvcmUgdGhlIG5ldyB0YXNrIGluc2lkZSBvZiBpdCB2aWEgdGhlIG1ldGhvZCBhZGRUYXNrVG9Qcm9qZWN0KClcclxuZnVuY3Rpb24gc2F2ZVRhc2tUb1Byb2plY3QodGFza1BhcmFtZXRlcnMsIHBhcmVudFByb2plY3RJZCl7XHJcbiAgICBsZXQgdGFza19uYW1lLCBkdWVfZGF0ZSwgZGVzY3JpcHRpb24sIHByaW9yaXR5O1xyXG4gICAgW3t0YXNrX25hbWV9LCB7ZHVlX2RhdGV9LCB7ZGVzY3JpcHRpb259LCB7cHJpb3JpdHl9XSA9IHRhc2tQYXJhbWV0ZXJzO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiB0aGUgcHJvamVjdCBleGlzdHNcclxuICAgIGNvbnN0IHByb2plY3RGcm9tU3RvcmFnZSA9IGdldFByb2plY3RCeUlkKHBhcmVudFByb2plY3RJZCk7XHJcblxyXG4gICAgaWYocHJvamVjdEZyb21TdG9yYWdlKXtcclxuICAgICAgICBjb25zdCBwcm9qZWN0T2JqZWN0ID0gUHJvamVjdChwcm9qZWN0RnJvbVN0b3JhZ2UpO1xyXG4gICAgICAgIGNvbnN0IG5ld1Rhc2sgPSBUYXNrKHRhc2tfbmFtZSwgZHVlX2RhdGUsIGRlc2NyaXB0aW9uLCBwcmlvcml0eSwgZ2VuZXJhdGVOZXdUYXNrSWQocHJvamVjdE9iamVjdCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByb2plY3RPYmplY3QuYWRkVGFza1RvUHJvamVjdChuZXdUYXNrKTtcclxuICAgICAgICB1cGRhdGVFeGlzdGVudFByb2plY3QocHJvamVjdE9iamVjdCk7IC8vIFVwZGF0ZSB0aGUgcHJvamVjdCBpbiB0aGUgc3RvcmFnZSB3aXRoIHRoZSBuZXcgdGFza1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3VGFzaztcclxuICAgIH1cclxufVxyXG5cclxuLy8gR2VuZXJhdGUgYSBuZXcgdGFzayBlbGVtZW50IGluIGJvdGggcGFyZW50IHByb2plY3Qgc2VjdGlvbnMgKGFzaWRlIGFuZCBtYWluLWNvbnRlbnQpXHJcbmZ1bmN0aW9uIGNyZWF0ZVRhc2tFbGVtZW50KHRhc2ssIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB7dGFza0xpc3RBc2lkZSwgdGFza0xpc3RNYWlufSA9IGdldFRhc2tFbGVtZW50cyh0YXNrLCBwcm9qZWN0SWQpO1xyXG5cclxuICAgIGlmKHRhc2tMaXN0QXNpZGUuY2hpbGRyZW5bMF0uZ2V0QXR0cmlidXRlKCdjbGFzcycpID09PSAncHJvamVjdC1lbXB0eS1oaW50JykgXHJcbiAgICAgICAgcmVtb3ZlRW1wdHlIaW50KHRhc2tMaXN0QXNpZGUpO1xyXG5cclxuICAgIC8vIFBsYWNlIHRoZSBuZXcgZWxlbWVudCB3aXRoaW4gdGhlIHByb2plY3QgaW4gdGhlIGFzaWRlXHJcbiAgICBjb25zdCB0YXNrRWxlbWVudEFzaWRlID0gY3JlYXRlVGFza0VsZW1lbnRBc2lkZSh0YXNrKTtcclxuICAgIHRhc2tMaXN0QXNpZGUuYXBwZW5kQ2hpbGQodGFza0VsZW1lbnRBc2lkZSk7XHJcblxyXG4gICAgLy8gUGxhY2UgdGhlIG5ldyBlbGVtZW50IHdpdGhpbiB0aGUgcHJvamVjdCBpbiB0aGUgbWFpbi1jb250ZW50XHJcbiAgICBjb25zdCB0YXNrRWxlbWVudE1haW4gPSBjcmVhdGVUYXNrRWxlbWVudE1haW4odGFzaywgcHJvamVjdElkKTtcclxuICAgIHRhc2tMaXN0TWFpbi5hcHBlbmRDaGlsZCh0YXNrRWxlbWVudE1haW4pO1xyXG59XHJcbiIsImltcG9ydCBQcm9qZWN0IGZyb20gXCIuLi9hcHAtbG9naWMvcHJvamVjdC5qc1wiO1xyXG5pbXBvcnQgeyB1cGRhdGVFeGlzdGVudFByb2plY3QsIGdldFByb2plY3RCeUlkLCBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgZ2V0VGFza0VsZW1lbnRzLCB0YXNrRm9ybURhdGFIYW5kbGVyIH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBhcHBlbmRUb01vZGFsLCByZW1vdmVGcm9tTW9kYWwgfSBmcm9tIFwiLi9tb2RhbC5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVUYXNrRWxlbWVudEFzaWRlIH0gZnJvbSBcIi4vcHJvamVjdEFzaWRlLmpzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVRhc2tFbGVtZW50TWFpbiB9IGZyb20gXCIuL3Byb2plY3RNYWluLmpzXCI7XHJcbmltcG9ydCB7IGdldEZpbHRlcmVkVGFza3MgfSBmcm9tIFwiLi90b2RheUFuZFdlZWtUYXNrcy5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRUYXNrRm9ybSh0YXNrLCBwcm9qZWN0SWQsIGZvcm0pe1xyXG4gICAgY29uc3QgZm9ybVRpdGxlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1oZWFkZXInKTtcclxuICAgIGZvcm1UaXRsZS50ZXh0Q29udGVudCA9ICdFZGl0IHRhc2snO1xyXG5cclxuICAgIGNvbnN0IHRhc2tJbnB1dE5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyN0YXNrLW5hbWUtaW5wdXQnKTtcclxuICAgIHRhc2tJbnB1dE5hbWUuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGAke3Rhc2suZ2V0TmFtZSgpfWApO1xyXG5cclxuICAgIGNvbnN0IHRhc2tJbnB1dER1ZURhdGU9IGZvcm0ucXVlcnlTZWxlY3RvcignI2R1ZS1kYXRlLWlucHV0Jyk7XHJcbiAgICBpZih0YXNrLmdldER1ZURhdGUoKSA9PT0gJ25vbmUnKXtcclxuICAgICAgICB0YXNrSW5wdXREdWVEYXRlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0YXNrSW5wdXREdWVEYXRlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBgJHt0YXNrLmdldER1ZURhdGUoKX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0YXNrSW5wdXREZXNjcmlwdGlvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignI2Rlc2NyaXB0aW9uLWlucHV0Jyk7XHJcbiAgICB0YXNrSW5wdXREZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IGAke3Rhc2suZ2V0RGVzY3JpcHRpb24oKX1gO1xyXG5cclxuICAgIGNvbnN0IHRhc2tQcmlvcml0eSA9IHRhc2suZ2V0UHJpb3JpdHkoKTtcclxuICAgIGNvbnN0IGZvcm1Qcmlvcml0aWVzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiW25hbWU9J3ByaW9yaXR5J11cIik7XHJcbiAgICBBcnJheS5mcm9tKGZvcm1Qcmlvcml0aWVzKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSB0YXNrUHJpb3JpdHkpXHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcjYWRkLXRhc2snKTtcclxuICAgIHN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICdFZGl0IHRhc2snO1xyXG4gICAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZWRpdFRhc2tIYW5kbGVyKGZvcm0sIHByb2plY3RJZCkpO1xyXG5cclxuICAgIGNvbnN0IHRhc2tJZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRhc2tJZCwge1xyXG4gICAgICAgIGlkOiAndGFzay1pZCcsXHJcbiAgICAgICAgdHlwZTogJ2hpZGRlbicsXHJcbiAgICAgICAgbmFtZTogJ3Rhc2tfaWQnLFxyXG4gICAgICAgIHZhbHVlOiBgJHt0YXNrLmdldFRhc2tJZCgpfWBcclxuICAgIH0pO1xyXG5cclxuICAgIGZvcm0uYXBwZW5kQ2hpbGQodGFza0lkKTtcclxuICAgIGFwcGVuZFRvTW9kYWwoZm9ybSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVkaXRUYXNrSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgdGFza1BhcmFtZXRlcnMgPSB0YXNrRm9ybURhdGFIYW5kbGVyKGZvcm0sIHByb2plY3RJZCk7XHJcbiAgICBcclxuICAgIGlmKHRhc2tQYXJhbWV0ZXJzKXtcclxuICAgICAgICBjb25zdCBjaGFuZ2VkVGFzayA9IHNhdmVNb2RUYXNrVG9Qcm9qZWN0KHRhc2tQYXJhbWV0ZXJzLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHVwZGF0ZVRhc2tFbGVtZW50KGNoYW5nZWRUYXNrLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RhbChmb3JtKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZU1vZFRhc2tUb1Byb2plY3QodGFza1BhcmFtZXRlcnMsIHBhcmVudFByb2plY3RJZCl7XHJcbiAgICBsZXQgdGFza19pZCwgdGFza19uYW1lLCBkdWVfZGF0ZSwgZGVzY3JpcHRpb24sIHByaW9yaXR5O1xyXG4gICAgW3t0YXNrX25hbWV9LCB7ZHVlX2RhdGV9LCB7ZGVzY3JpcHRpb259LCB7cHJpb3JpdHl9LCB7dGFza19pZH1dID0gdGFza1BhcmFtZXRlcnM7XHJcblxyXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBwcm9qZWN0IGV4aXN0c1xyXG4gICAgY29uc3QgcHJvamVjdEZyb21TdG9yYWdlID0gZ2V0UHJvamVjdEJ5SWQocGFyZW50UHJvamVjdElkKTtcclxuXHJcbiAgICBpZihwcm9qZWN0RnJvbVN0b3JhZ2Upe1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3RGcm9tU3RvcmFnZSk7XHJcbiAgICAgICAgY29uc3QgdGFza1RvQ2hhbmdlID0gcHJvamVjdE9iamVjdC5nZXRUYXNrQnlJZCh0YXNrX2lkKTtcclxuICAgICAgICBcclxuICAgICAgICB0YXNrVG9DaGFuZ2Uuc2V0TmFtZSh0YXNrX25hbWUpO1xyXG4gICAgICAgIHRhc2tUb0NoYW5nZS5zZXREdWVEYXRlKGR1ZV9kYXRlKTtcclxuICAgICAgICB0YXNrVG9DaGFuZ2Uuc2V0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIHRhc2tUb0NoYW5nZS5zZXRQcmlvcml0eShwcmlvcml0eSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUV4aXN0ZW50UHJvamVjdChwcm9qZWN0T2JqZWN0KTsgLy8gVXBkYXRlIHRoZSBwcm9qZWN0IGluIHRoZSBzdG9yYWdlIHdpdGggdGhlIG1vZGlmaWVkIHRhc2sgXHJcblxyXG4gICAgICAgIHJldHVybiB0YXNrVG9DaGFuZ2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrSWZUb2RheU9yV2Vlaygpe1xyXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRlbnQnKTtcclxuICAgIGNvbnN0IHRvZGF5SWRlbnRpZmllciA9IG1haW4ucXVlcnlTZWxlY3RvcignI3RvZGF5LWhlYWRlcicpO1xyXG4gICAgY29uc3Qgd2Vla0lkZW50aWZpZXIgPSBtYWluLnF1ZXJ5U2VsZWN0b3IoJyN3ZWVrLWhlYWRlcicpO1xyXG5cclxuICAgIGlmKG1haW4uZmlyc3RFbGVtZW50Q2hpbGQgPT09IHRvZGF5SWRlbnRpZmllcilcclxuICAgICAgICByZXR1cm4gJ3RvZGF5JztcclxuXHJcbiAgICBpZihtYWluLmZpcnN0RWxlbWVudENoaWxkID09PSB3ZWVrSWRlbnRpZmllcilcclxuICAgICAgICByZXR1cm4gJ3dlZWsnO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gVXBkYXRlIHRoZSBlbGVtZW50IGluIHRoZSBET00gd2l0aCB0aGUgbmV3IHZhbHVlcyAoYXNpZGUgYW5kIG1haW4gc2VjdGlvbnMpXHJcbmZ1bmN0aW9uIHVwZGF0ZVRhc2tFbGVtZW50KHRhc2ssIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB7dGFza0xpc3RBc2lkZSwgdGFza0FzaWRlLCB0YXNrTGlzdE1haW4sIHRhc2tNYWlufSA9IGdldFRhc2tFbGVtZW50cyh0YXNrLCBwcm9qZWN0SWQpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0YXNrIGVsZW1lbnQgd2l0aGluIHRoZSBwcm9qZWN0IGluIHRoZSBhc2lkZSAocmVtb3ZlIHRoZSBvbGQgdGFzayBhbmQgcGxhY2UgaXQgdGhlIG5ldylcclxuICAgIGNvbnN0IHVwZGF0ZWRBc2lkZVRhc2sgPSBjcmVhdGVUYXNrRWxlbWVudEFzaWRlKHRhc2spO1xyXG4gICAgdGFza0xpc3RBc2lkZS5pbnNlcnRCZWZvcmUodXBkYXRlZEFzaWRlVGFzaywgdGFza0FzaWRlKTtcclxuICAgIHRhc2tMaXN0QXNpZGUucmVtb3ZlQ2hpbGQodGFza0FzaWRlKTtcclxuXHJcbiAgICBjb25zdCBzZWN0aW9uVG9VcGRhdGUgPSBjaGVja0lmVG9kYXlPcldlZWsoKTtcclxuICAgIGlmKHNlY3Rpb25Ub1VwZGF0ZSl7XHJcbiAgICAgICAgZ2V0RmlsdGVyZWRUYXNrcyhgJHtzZWN0aW9uVG9VcGRhdGV9YCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBVcGRhdGUgdGFzayBlbGVtZW50IHdpdGhpbiB0aGUgcHJvamVjdCBpbiB0aGUgbWFpbi1jb250ZW50IChyZW1vdmUgdGhlIG9sZCB0YXNrIGFuZCBwbGFjZSBpdCB0aGUgbmV3KVxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRNYWluVGFzayA9IGNyZWF0ZVRhc2tFbGVtZW50TWFpbih0YXNrLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHRhc2tMaXN0TWFpbi5pbnNlcnRCZWZvcmUodXBkYXRlZE1haW5UYXNrLCB0YXNrTWFpbik7XHJcbiAgICAgICAgdGFza0xpc3RNYWluLnJlbW92ZUNoaWxkKHRhc2tNYWluKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vY29tbW9uRnVuY3Rpb25zLmpzXCI7XHJcbmltcG9ydCB7IGFwcGVuZFRvTW9kYWwgfSBmcm9tIFwiLi9tb2RhbC5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZFRhc2tzSW5mbyh0YXNrLCBwcm9qZWN0SWQsIHRhc2tGb3JtKXtcclxuICAgIGNvbnN0IHRhc2tUaXRsZSA9IHRhc2suZ2V0TmFtZSgpO1xyXG4gICAgY29uc3QgdGFza0R1ZURhdGUgPSB0YXNrLmdldER1ZURhdGUoKTtcclxuICAgIGNvbnN0IHRhc2tEZXNjcmlwdGlvbiA9IHRhc2suZ2V0RGVzY3JpcHRpb24oKTtcclxuICAgIGxldCB0YXNrUHJpb3JpdHkgPSB0YXNrLmdldFByaW9yaXR5KCk7XHJcbiAgICB0YXNrUHJpb3JpdHkgPSB0YXNrUHJpb3JpdHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0YXNrUHJpb3JpdHkuc2xpY2UoMSk7XHJcblxyXG4gICAgY29uc3QgZm9ybVRpdGxlID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignLmZvcm0taGVhZGVyJyk7XHJcbiAgICBmb3JtVGl0bGUudGV4dENvbnRlbnQgPSBgJHt0YXNrVGl0bGV9YDtcclxuICAgIHRhc2tGb3JtLnJlbW92ZUNoaWxkKGZvcm1UaXRsZS5uZXh0RWxlbWVudFNpYmxpbmcpOyAvLyBSZW1vdmUgdGhlIHRhc2sgbmFtZSBpbnB1dFxyXG5cclxuICAgIGNvbnN0IGZvcm1EdWVEYXRlID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignI2R1ZS1kYXRlLWlucHV0Jyk7XHJcbiAgICBmb3JtRHVlRGF0ZS52YWx1ZSA9IGAke3Rhc2tEdWVEYXRlfWA7XHJcbiAgICBmb3JtRHVlRGF0ZS5yZWFkT25seSA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgZm9ybURlc2NyaXB0aW9uID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignI2Rlc2NyaXB0aW9uLWlucHV0Jyk7XHJcbiAgICBmb3JtRGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBgJHt0YXNrRGVzY3JpcHRpb259YDtcclxuICAgIGZvcm1EZXNjcmlwdGlvbi5yZWFkT25seSA9IHRydWU7XHJcbiAgICBmb3JtRGVzY3JpcHRpb24uc3R5bGUuY3NzVGV4dCA9ICdyZXNpemU6IG5vbmUnO1xyXG5cclxuICAgIGNvbnN0IGZvcm1Qcmlvcml0eSA9IHRhc2tGb3JtLnF1ZXJ5U2VsZWN0b3IoJ2ZpZWxkc2V0Jyk7XHJcbiAgICB3aGlsZShmb3JtUHJpb3JpdHkuY2hpbGRyZW4ubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgZm9ybVByaW9yaXR5LnJlbW92ZUNoaWxkKGZvcm1Qcmlvcml0eS5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHByaW9yaXR5VGV4dCA9IGNyZWF0ZUVsZW1lbnQoJ3AnLCB7ZWxlbWVudFRleHQ6IGAke3Rhc2tQcmlvcml0eX1gfSk7XHJcbiAgICBmb3JtUHJpb3JpdHkuYXBwZW5kQ2hpbGQocHJpb3JpdHlUZXh0KTtcclxuXHJcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSB0YXNrRm9ybS5xdWVyeVNlbGVjdG9yKCcjY2FuY2VsLXRhc2snKTtcclxuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdHbyBiYWNrJztcclxuICAgIGNhbmNlbEJ1dHRvbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNhbmNlbEJ1dHRvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5wYXJlbnRFbGVtZW50LnN0eWxlLmNzc1RleHQgPSAnanVzdGlmeS1jb250ZW50OiBmbGV4LWVuZCc7XHJcblxyXG4gICAgYXBwZW5kVG9Nb2RhbCh0YXNrRm9ybSk7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgdXBkYXRlRXhpc3RlbnRQcm9qZWN0LCBnZXRQcm9qZWN0QnlJZCB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVFbXB0eUhpbnQsIGdldFRhc2tFbGVtZW50cyB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVUYXNrRnJvbVByb2plY3QodGFzaywgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IHt0YXNrTGlzdEFzaWRlLCB0YXNrQXNpZGUsIHRhc2tMaXN0TWFpbiwgdGFza01haW59ID0gZ2V0VGFza0VsZW1lbnRzKHRhc2ssIHByb2plY3RJZCk7XHJcblxyXG4gICAgdGFza0xpc3RBc2lkZS5yZW1vdmVDaGlsZCh0YXNrQXNpZGUpO1xyXG4gICAgdGFza0xpc3RNYWluLnJlbW92ZUNoaWxkKHRhc2tNYWluKTtcclxuXHJcbiAgICBpZih0YXNrTGlzdEFzaWRlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkgXHJcbiAgICAgICAgY3JlYXRlRW1wdHlIaW50KHRhc2tMaXN0QXNpZGUpO1xyXG5cclxuICAgIGlmKHRhc2tMaXN0TWFpbi5jaGlsZHJlbi5sZW5ndGggPT09IDApXHJcbiAgICAgICAgdXBkYXRlTWFpblRvZGF5KHByb2plY3RJZCk7XHJcblxyXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBwcm9qZWN0IGV4aXN0c1xyXG4gICAgY29uc3QgcHJvamVjdEZyb21TdG9yYWdlID0gZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkKTtcclxuXHJcbiAgICBpZihwcm9qZWN0RnJvbVN0b3JhZ2Upe1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3RGcm9tU3RvcmFnZSk7XHJcbiAgICAgICAgcHJvamVjdE9iamVjdC5yZW1vdmVUYXNrRnJvbVByb2plY3QodGFzay5nZXRUYXNrSWQoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdXBkYXRlRXhpc3RlbnRQcm9qZWN0KHByb2plY3RPYmplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBVcGRhdGUgbWFpbiBjb250ZW50IHdoZW4gdXNlciByZW1vdmUgYW55IHRhc2sgKG9mIGFueSBwcm9qZWN0KSBpbiB0aGUgdG9kYXkgc2VjdGlvblxyXG4vLyBFLmcgaWYgdGhlIHVzZXIgcmVtb3ZlcyBhIHRhc2sgb2YgYSBwcm9qZWN0IGFuZCB0aGlzIHByb2plY3QgZG9lc24ndCBoYXZlIG5vIG1vcmUgdGFza3MsIHJlbW92ZSBpdCBmcm9tIHRoZSBtYWluIGNvbnRlbnRcclxuZnVuY3Rpb24gdXBkYXRlTWFpblRvZGF5KHByb2plY3RJZCl7XHJcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpO1xyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBtYWluLnF1ZXJ5U2VsZWN0b3IoYCNtYWluXyR7cHJvamVjdElkfWApO1xyXG4gICAgbWFpbi5yZW1vdmVDaGlsZChwcm9qZWN0V3JhcHBlcik7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdExpc3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vY29tbW9uRnVuY3Rpb25zLmpzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVByb2plY3RNYWluIH0gZnJvbSBcIi4vcHJvamVjdE1haW4uanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJlZFRhc2tzKGFjdGlvbil7XHJcbiAgICBjb25zdCB1c2VyUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuICAgIGxldCB0YXNrc0ZpbHRlcmVkLCBwcm9qZWN0QW5kVGFza3NFbGVtZW50cywgaGVhZGVyU2VjdGlvbjtcclxuXHJcbiAgICBpZihhY3Rpb24gPT09ICd0b2RheScpe1xyXG4gICAgICAgIHRhc2tzRmlsdGVyZWQgPSBBcnJheS5mcm9tKHVzZXJQcm9qZWN0cylcclxuICAgICAgICAgICAgLm1hcChwcm9qZWN0ID0+IGdldFRvZGF5VGFza3MocHJvamVjdCkpXHJcbiAgICAgICAgICAgIC5maWx0ZXIocHJvamVjdCA9PiBwcm9qZWN0ICE9PSB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICBoZWFkZXJTZWN0aW9uID0gY3JlYXRlRWxlbWVudCgnaDMnLCB7ZWxlbWVudElkOiAndG9kYXktaGVhZGVyJywgZWxlbWVudFRleHQ6IGBUb2RheSdzIHRhc2tzYH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGFza3NGaWx0ZXJlZCA9IEFycmF5LmZyb20odXNlclByb2plY3RzKVxyXG4gICAgICAgICAgICAubWFwKHByb2plY3QgPT4gZ2V0V2Vla1Rhc2tzKHByb2plY3QpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHByb2plY3QgPT4gcHJvamVjdCAhPT0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgaGVhZGVyU2VjdGlvbiA9IGNyZWF0ZUVsZW1lbnQoJ2gzJywge2VsZW1lbnRJZDogJ3dlZWstaGVhZGVyJywgZWxlbWVudFRleHQ6IGBXZWVrIHRhc2tzYH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm9qZWN0QW5kVGFza3NFbGVtZW50cyA9IHRhc2tzRmlsdGVyZWQubWFwKHByb2plY3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RFbGVtZW50ID0gY3JlYXRlUHJvamVjdE1haW4ocHJvamVjdCk7XHJcbiAgICAgICAgcHJvamVjdEVsZW1lbnQucmVtb3ZlQ2hpbGQocHJvamVjdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10YXNrJykpO1xyXG4gICAgICAgIHJldHVybiBwcm9qZWN0RWxlbWVudDtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKHByb2plY3RBbmRUYXNrc0VsZW1lbnRzLmxlbmd0aCAhPT0gMClcclxuICAgICAgICBjbGVhck1haW5BbmRBcHBlbmROb2RlKHByb2plY3RBbmRUYXNrc0VsZW1lbnRzLCBoZWFkZXJTZWN0aW9uKTtcclxuICAgIGVsc2VcclxuICAgICAgICBjbGVhck1haW5BbmRBcHBlbmROb2RlKGhlYWRlclNlY3Rpb24pO1xyXG59XHJcblxyXG4vLyBHZXQgdG9kYXkncyB0YXNrcyBvZiBhIHByb2plY3QgYW5kIHJldHVybiB0aGVtIGluIGEgXCJuZXdcIiBwcm9qZWN0IG9iamVjdFxyXG5mdW5jdGlvbiBnZXRUb2RheVRhc2tzKHByb2plY3Qpe1xyXG4gICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdCk7XHJcbiAgICBwcm9qZWN0T2JqZWN0LmdldEFsbFRhc2tzKCkubWFwKHRhc2sgPT4ge1xyXG4gICAgICAgIGlmKCEodGFzay5nZXREdWVEYXRlKCkgPT09IG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1DQScpKSl7XHJcbiAgICAgICAgICAgIHByb2plY3RPYmplY3QucmVtb3ZlVGFza0Zyb21Qcm9qZWN0KHRhc2suZ2V0VGFza0lkKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmKCEocHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpLmxlbmd0aCA9PT0gMCkpXHJcbiAgICAgICAgcmV0dXJuIHByb2plY3RPYmplY3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdlZWtUYXNrcyhwcm9qZWN0KXtcclxuICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpO1xyXG4gICAgcHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpLm1hcCh0YXNrID0+IHtcclxuICAgICAgICBpZighKGlzQmV0d2VlblRoaXNXZWVrKHRhc2suZ2V0RHVlRGF0ZSgpKSkpe1xyXG4gICAgICAgICAgICBwcm9qZWN0T2JqZWN0LnJlbW92ZVRhc2tGcm9tUHJvamVjdCh0YXNrLmdldFRhc2tJZCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZighKHByb2plY3RPYmplY3QuZ2V0QWxsVGFza3MoKS5sZW5ndGggPT09IDApKVxyXG4gICAgICAgIHJldHVybiBwcm9qZWN0T2JqZWN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0JldHdlZW5UaGlzV2VlayhkYXRlKXtcclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGRheVN0YXJ0V2VlayA9IG5ldyBEYXRlKHRvZGF5LnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpIC0gdG9kYXkuZ2V0RGF5KCkpKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUNBJyk7XHJcbiAgICBjb25zdCBkYXlFbmRXZWVrID0gbmV3IERhdGUodG9kYXkuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgLSB0b2RheS5nZXREYXkoKSArIDYpKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUNBJyk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGUgPj0gZGF5U3RhcnRXZWVrICYmIGRhdGUgPD0gZGF5RW5kV2VlayA/IHRydWUgOiBmYWxzZTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZGVmYXVsdCBhcyBzdGFydFVJQW5kTGlzdGVuZXJzIH0gZnJvbSAnLi4vZG9tLW1hbmlwdWxhdGlvbi9hc2lkZVNlY3Rpb24uanMnO1xyXG5cclxuc3RhcnRVSUFuZExpc3RlbmVycygpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==