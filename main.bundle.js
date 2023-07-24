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
/* harmony import */ var _todayTasks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./todayTasks.js */ "./src/dom-manipulation/todayTasks.js");





// Function to start all eventListeners related to the user-projects section and initial elements (for projects stored previously)
function startUIAndListeners(){
    openCloseAside();
    
    // Start the today section
    const todayButton = document.getElementById('today-todo-button');
    todayButton.classList.add('tab-selected');
    (0,_todayTasks_js__WEBPACK_IMPORTED_MODULE_3__.getFilteredTasks)('today');
    
    todayButton.addEventListener('click', () => {
        selectTab(todayButton);
        (0,_todayTasks_js__WEBPACK_IMPORTED_MODULE_3__.getFilteredTasks)('today');
    });

    const weekButton = document.getElementById('week-todo-button');
    weekButton.addEventListener('click', () => {
        selectTab(weekButton);
        (0,_todayTasks_js__WEBPACK_IMPORTED_MODULE_3__.getFilteredTasks)('week');
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

    currentTabSelected.classList.remove('tab-selected');
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
            hideAside();
        }
        else {
            hamburguerMenu.setAttribute('class', 'show');
            showAside();
        }
    });
}

function showAside(){
    const aside = document.getElementById('aside-navigation');
    aside.setAttribute('class', 'aside-show'); // Add this class to put main-content back to its place
    aside.style.cssText = 'display: flex;';
}

function hideAside(){
    const aside = document.getElementById('aside-navigation');
    aside.setAttribute('class', 'aside-hide'); // Add this class to allow the main-content to grow
    aside.style.cssText = 'display: none;';
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
        // projectButton.setAttribute('class', `${permanentClass} hide`);
       
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
/* harmony import */ var _todayTasks_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./todayTasks.js */ "./src/dom-manipulation/todayTasks.js");








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
        (0,_todayTasks_js__WEBPACK_IMPORTED_MODULE_6__.getFilteredTasks)(`${sectionToUpdate}`);
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

/***/ "./src/dom-manipulation/todayTasks.js":
/*!********************************************!*\
  !*** ./src/dom-manipulation/todayTasks.js ***!
  \********************************************/
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakM4QztBQUNrQjtBQUNjO0FBQ3pCO0FBQ3JEO0FBQ087QUFDUCx5QkFBeUIsNEVBQXFCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtFQUFhLFFBQVEsd0RBQXdEO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrRUFBYSxRQUFRLG9EQUFvRDtBQUNqRztBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isa0VBQWlCO0FBQ2hEO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFFBQVEsMkVBQXNCO0FBQzlCO0FBQ0EsUUFBUSwyRUFBc0I7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsaUVBQU87QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGlFQUFPO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDbkVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOcUY7QUFDckY7QUFDQSw2RUFBbUIsRyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvYXBwLWxvZ2ljL3Byb2plY3QuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9hcHAtbG9naWMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2FwcC1sb2dpYy90YXNrLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvY29tbW9uRnVuY3Rpb25zLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9hc2lkZVNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL21vZGFsLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9wcm9qZWN0QXNpZGUuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9kb20tbWFuaXB1bGF0aW9uL3Byb2plY3RFZGl0LmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi9wcm9qZWN0TWFpbi5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vcHJvamVjdFJlbW92ZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdGFza0NyZWF0aW9uLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvZG9tLW1hbmlwdWxhdGlvbi90YXNrRWRpdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdGFza0V4cGFuZC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdGFza1JlbW92ZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2RvbS1tYW5pcHVsYXRpb24vdG9kYXlUYXNrcy5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9hcHAtbG9naWMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuZXJhdGVOZXdQcm9qZWN0SWQgfSBmcm9tIFwiLi9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCBUYXNrIGZyb20gXCIuL3Rhc2suanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb2plY3QocGFyYW1ldGVyKXtcclxuICAgIGxldCBfcHJvamVjdElkO1xyXG4gICAgbGV0IF90aXRsZTtcclxuICAgIGxldCBfbGlzdE9mVGFza3M7XHJcblxyXG4gICAgLy8gVXNlZCB0byBjcmVhdGUgYW4gb2JqZWN0IGJhc2VkIG9uIGFuIGV4aXN0ZW50IChKU09OIG9iamVjdCB0aGF0IGNvbWVzIGZyb20gc3RvcmFnZSB0byBQcm9qZWN0IG9iamVjdClcclxuICAgIGlmKHR5cGVvZiBwYXJhbWV0ZXIgPT09ICdvYmplY3QnKXtcclxuICAgICAgICBfcHJvamVjdElkID0gYCR7cGFyYW1ldGVyLl9wcm9qZWN0SWR9YDtcclxuICAgICAgICBfdGl0bGUgPSBwYXJhbWV0ZXIuX3RpdGxlO1xyXG4gICAgICAgIF9saXN0T2ZUYXNrcyA9IHBhcmFtZXRlci5fbGlzdE9mVGFza3MubWFwKFxyXG4gICAgICAgICAgICB0YXNrID0+IFRhc2sodGFzay5uYW1lLCB0YXNrLmR1ZV9kYXRlLCB0YXNrLmRlc2NyaXB0aW9uLCB0YXNrLnByaW9yaXR5LCB0YXNrLmlkKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfcHJvamVjdElkID0gZ2VuZXJhdGVOZXdQcm9qZWN0SWQoKTsgLy8gR2VuZXJhdGUgYW4gaWRlbnRpZmllciBiYXNlZCBvbiB0aGUgbGFzdCBleGlzdGVudCBwcm9qZWN0XHJcbiAgICAgICAgX3RpdGxlID0gcGFyYW1ldGVyO1xyXG4gICAgICAgIF9saXN0T2ZUYXNrcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldHRlciBmb3IgcHJvamVjdElkXHJcbiAgICBjb25zdCBnZXRQcm9qZWN0SWQgPSAoKSA9PiBfcHJvamVjdElkO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciB0aXRsZVxyXG4gICAgY29uc3QgZ2V0VGl0bGUgPSAoKSA9PiBfdGl0bGU7XHJcbiAgICBjb25zdCBzZXRUaXRsZSA9IChuZXdUaXRsZSkgPT4gX3RpdGxlID0gbmV3VGl0bGU7XHJcblxyXG4gICAgLy8gTWV0aG9kcyB0byBtYW5pcHVsYXRlIHRhc2tzIGluc2lkZSBhIFByb2plY3QgXHJcbiAgICBjb25zdCBnZXRBbGxUYXNrcyA9ICgpID0+IF9saXN0T2ZUYXNrcztcclxuICAgIGNvbnN0IGdldFRhc2tCeUlkID0gKHRhc2tJbmRleCkgPT4gX2xpc3RPZlRhc2tzLmZpbmQodGFzayA9PiB0YXNrLmdldFRhc2tJZCgpID09PSB0YXNrSW5kZXgpO1xyXG4gICAgY29uc3QgYWRkVGFza1RvUHJvamVjdCA9ICh0YXNrKSA9PiBfbGlzdE9mVGFza3MucHVzaCh0YXNrKTtcclxuICAgIGNvbnN0IHJlbW92ZVRhc2tGcm9tUHJvamVjdCA9ICh0YXNrSWQpID0+IHtcclxuICAgICAgICBfbGlzdE9mVGFza3MgPSBfbGlzdE9mVGFza3MuZmlsdGVyKHRhc2sgPT4gdGFzay5nZXRUYXNrSWQoKSAhPT0gdGFza0lkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFByb2plY3RJZCxcclxuICAgICAgICBnZXRUaXRsZSxcclxuICAgICAgICBzZXRUaXRsZSxcclxuICAgICAgICBhZGRUYXNrVG9Qcm9qZWN0LFxyXG4gICAgICAgIHJlbW92ZVRhc2tGcm9tUHJvamVjdCxcclxuICAgICAgICBnZXRBbGxUYXNrcyxcclxuICAgICAgICBnZXRUYXNrQnlJZFxyXG4gICAgfVxyXG59IiwiLy8gQWRkIGEgbmV3IGNyZWF0ZWQgcHJvamVjdCB0byB0aGUgcHJvamVjdC1saXN0IEpTT04gb2JqZWN0IHN0b3JlZFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYXZlUHJvamVjdChwcm9qZWN0KXtcclxuICAgIGNvbnN0IGFsbG93U2F2ZSA9IGNoZWNrSWZQcm9qZWN0RXhpc3RzKHByb2plY3QuZ2V0VGl0bGUoKSk7XHJcblxyXG4gICAgLy8gSWYgdGhlIGFib3ZlIGZ1bmN0aW9uIHJldHVybnMgZmFsc2UsIHRoZSBwcm9qZWN0IHdpbGwgbm90IGJlIHN0b3JlZFxyXG4gICAgaWYoYWxsb3dTYXZlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgY29uc3QganNvblByb2plY3QgPSBwcm9qZWN0VG9Kc29uKHByb2plY3QpO1xyXG4gICAgY29uc3QgcHJvamVjdHNTdG9yYWdlID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBwcm9qZWN0c1N0b3JhZ2UucHVzaChqc29uUHJvamVjdCk7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzLWxpc3QnLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0c1N0b3JhZ2UpKTtcclxufVxyXG5cclxuLy8gUmVtb3ZlIHByb2plY3QgYW5kIGl0cyB0YXNrcyBmcm9tIHN0b3JhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVByb2plY3RTdG9yYWdlKHByb2plY3RJZCl7XHJcbiAgICBjb25zdCBwcm9qZWN0c1N0b3JhZ2UgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuICAgIGNvbnN0IGluZGV4VG9SZW1vdmUgPSAgQXJyYXkuZnJvbShwcm9qZWN0c1N0b3JhZ2UpXHJcbiAgICAgICAgLmZpbmRJbmRleChwcm9qZWN0ID0+IHByb2plY3QuX3Byb2plY3RJZCA9PT0gcHJvamVjdElkKTtcclxuICAgIFxyXG4gICAgcHJvamVjdHNTdG9yYWdlLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9qZWN0cy1saXN0JywgSlNPTi5zdHJpbmdpZnkocHJvamVjdHNTdG9yYWdlKSk7XHJcbn1cclxuXHJcbi8vIENoYW5nZSBzb21lIHBhcnQgb2YgYW4gZXhpc3RlbnQgcHJvamVjdFxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRXhpc3RlbnRQcm9qZWN0KHByb2plY3Qpe1xyXG4gICAgY29uc3QganNvblByb2plY3QgPSBwcm9qZWN0VG9Kc29uKHByb2plY3QpO1xyXG4gICAgY29uc3QgcHJvamVjdHNTdG9yYWdlID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcblxyXG4gICAgY29uc3QgaW5kZXhPZlByb2plY3RUb0FsdGVyID0gQXJyYXkuZnJvbShwcm9qZWN0c1N0b3JhZ2UpXHJcbiAgICAgICAgLmZpbmRJbmRleChzdG9yZWRQcm9qZWN0ID0+IHN0b3JlZFByb2plY3QuX3Byb2plY3RJZCA9PT0gcHJvamVjdC5nZXRQcm9qZWN0SWQoKSk7XHJcblxyXG4gICAgcHJvamVjdHNTdG9yYWdlW2luZGV4T2ZQcm9qZWN0VG9BbHRlcl0gPSBqc29uUHJvamVjdDtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJvamVjdHMtbGlzdCcsIEpTT04uc3RyaW5naWZ5KHByb2plY3RzU3RvcmFnZSkpO1xyXG59XHJcblxyXG4vLyBHZW5lcmF0ZSBhbiBpZGVudGlmaWVyIGZvciBhIG5ldyB0YXNrIGNyZWF0ZWQsIGJhc2VkIG9uIHRoZSBsYXN0IHRhc2sgaW5zaWRlIGEgcHJvamVjdCBwYXJlbnRcclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTmV3VGFza0lkKHByb2plY3Qpe1xyXG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0UGFyZW50ID0gQXJyYXkuZnJvbShzdG9yZWRQcm9qZWN0cylcclxuICAgICAgICAuZmluZChzdG9yZWRQcm9qZWN0ID0+IHN0b3JlZFByb2plY3QuX3Byb2plY3RJZCA9PT0gcHJvamVjdC5nZXRQcm9qZWN0SWQoKSk7XHJcblxyXG4gICAgaWYocHJvamVjdFBhcmVudC5fbGlzdE9mVGFza3MubGVuZ3RoICE9PSAwKXtcclxuICAgICAgICBsZXQgbGFzdElkTnVtYmVyID0gcHJvamVjdFBhcmVudC5fbGlzdE9mVGFza3MuYXQoLTEpLmlkLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgcmV0dXJuIGB0YXNrXyR7KytsYXN0SWROdW1iZXJ9YDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBgdGFza18kezB9YDtcclxuICAgIH1cclxufVxyXG5cclxuLy8gR2VuZXJhdGUgYW4gaWRlbnRpZmllciBmb3IgYSBuZXcgcHJvamVjdCBjcmVhdGVkLCBiYXNlZCBvbiB0aGUgbGFzdCBwcm9qZWN0IGV4aXN0ZW50XHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU5ld1Byb2plY3RJZCgpe1xyXG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuXHJcbiAgICBpZihzdG9yZWRQcm9qZWN0cy5sZW5ndGggIT09IDApe1xyXG4gICAgICAgIGxldCBsYXN0SWROdW1iZXIgPSBzdG9yZWRQcm9qZWN0cy5hdCgtMSkuX3Byb2plY3RJZC5zcGxpdCgnXycpWzFdO1xyXG4gICAgICAgIHJldHVybiBgcHJvamVjdF8keysrbGFzdElkTnVtYmVyfWA7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIHJldHVybiBgcHJvamVjdF8kezB9YDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3RCeUlkKGlkKXtcclxuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICByZXR1cm4gc3RvcmVkUHJvamVjdHMuZmluZChwcm9qZWN0ID0+IHByb2plY3QuX3Byb2plY3RJZCA9PT0gaWQpO1xyXG59XHJcblxyXG4vLyBDaGVjayBpZiB0aGUgcHJvamVjdCB0byBiZSBzdG9yZWQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN0b3JhZ2VcclxuZnVuY3Rpb24gY2hlY2tJZlByb2plY3RFeGlzdHMocHJvamVjdFRpdGxlKXtcclxuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCk7XHJcbiAgICBjb25zdCBhbGxvd1NhdmUgPSBzdG9yZWRQcm9qZWN0cy5ldmVyeShwcm9qZWN0ID0+IHByb2plY3QuX3RpdGxlICE9PSBwcm9qZWN0VGl0bGUpO1xyXG4gICAgcmV0dXJuIGFsbG93U2F2ZTtcclxufVxyXG5cclxuLy8gUmV0cmlldmUgdXNlcidzIHByb2plY3RzIHN0b3JhZ2UuIElmIGl0IGlzIHVzZXIncyBmaXJzdCB0aW1lIHVzaW5nIHRoZSB0b2RvZG9vLCBjcmVhdGUgYSBuZXcgbGlzdCBvZiBwcm9qZWN0c1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvamVjdExpc3RTdG9yYWdlKCl7XHJcbiAgICBpZighbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2plY3RzLWxpc3QnKSl7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzLWxpc3QnLCBKU09OLnN0cmluZ2lmeShbXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcm9qZWN0cy1saXN0JykpO1xyXG59XHJcblxyXG4vLyBUcmFuc2Zvcm0gcHJvamVjdCBvYmplY3QgKHRoYXQgY29udGFpbnMgYWxsIGZ1bmN0aW9ucykgdG8gYSBKU09OIG9iamVjdFxyXG5mdW5jdGlvbiBwcm9qZWN0VG9Kc29uKHByb2plY3Qpe1xyXG4gICAgY29uc3QgX3Byb2plY3RJZCA9IHByb2plY3QuZ2V0UHJvamVjdElkKCk7XHJcbiAgICBjb25zdCBfdGl0bGUgPSBwcm9qZWN0LmdldFRpdGxlKCk7XHJcbiAgICBjb25zdCBfbGlzdE9mVGFza3MgPSBbXTtcclxuICAgXHJcbiAgICAvLyBDb252ZXJ0IGFsbCB0YXNrcyB0byBKU09OIGxpa2Ugb2JqZWN0c1xyXG4gICAgQXJyYXkuZnJvbShwcm9qZWN0LmdldEFsbFRhc2tzKCkpXHJcbiAgICAgICAgLmZvckVhY2goXHJcbiAgICAgICAgICAgIHRhc2sgPT4gX2xpc3RPZlRhc2tzLnB1c2godGFza1RvSnNvbih0YXNrKSlcclxuICAgICAgICApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgX3Byb2plY3RJZCxcclxuICAgICAgICBfdGl0bGUsXHJcbiAgICAgICAgX2xpc3RPZlRhc2tzXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIFRyYW5zZm9ybSB0YXNrIG9iamVjdCAodGhhdCBjb250YWlucyBhbGwgZnVuY3Rpb25zKSB0byBhIEpTT04gb2JqZWN0LFxyXG50byBiZSBwcm9wZXJseSBzdG9yZWQgaW4gdGhlIGxvY2FsU3RvcmFnZSB0b2dldGhlciB3aXRoIGNvcnJlc3BvbmRpbmcgcHJvamVjdCAqL1xyXG5mdW5jdGlvbiB0YXNrVG9Kc29uKHRhc2spe1xyXG4gICAgY29uc3QgaWQgPSB0YXNrLmdldFRhc2tJZCgpO1xyXG4gICAgY29uc3QgbmFtZSA9IHRhc2suZ2V0TmFtZSgpO1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0YXNrLmdldERlc2NyaXB0aW9uKCk7XHJcbiAgICBjb25zdCBkdWVfZGF0ZSA9IHRhc2suZ2V0RHVlRGF0ZSgpO1xyXG4gICAgY29uc3QgcHJpb3JpdHkgPSB0YXNrLmdldFByaW9yaXR5KCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgIGR1ZV9kYXRlLFxyXG4gICAgICAgIHByaW9yaXR5XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUYXNrKHRhc2tOYW1lLCBkdWVEYXRlID0gJ25vbmUnLCBkZXNjcmlwdGlvbiA9ICdub25lJywgcHJpb3JpdHkgPSAnbm9uZScsIHRhc2tJZCl7XHJcbiAgICAvLyBVc2VkIHRvIGNyZWF0ZSBhbiBvYmplY3QgYmFzZWQgb24gYW4gZXhpc3RlbnQgKEpTT04gb2JqZWN0IHRoYXQgY29tZXMgZnJvbSBzdG9yYWdlIHRvIFRhc2sgb2JqZWN0KVxyXG4gICAgbGV0IF90YXNrSWQgPSB0YXNrSWQ7XHJcbiAgICBsZXQgX25hbWUgPSB0YXNrTmFtZTtcclxuICAgIGxldCBfZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgICBsZXQgX2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICBsZXQgX3ByaW9yaXR5ID0gcHJpb3JpdHk7XHJcblxyXG4gICAgLy8gR2V0dGVyIGZvciB0YXNrSWRcclxuICAgIGNvbnN0IGdldFRhc2tJZCA9ICgpID0+IF90YXNrSWQ7XHJcblxyXG4gICAgLy8gR2V0dGVyIGFuZCBTZXR0ZXIgZm9yIHRpdGxlXHJcbiAgICBjb25zdCBnZXROYW1lID0gKCkgPT4gX25hbWU7XHJcbiAgICBjb25zdCBzZXROYW1lID0gKG5ld1RpdGxlKSA9PiBfbmFtZSA9IG5ld1RpdGxlO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciBkdWVEYXRlXHJcbiAgICBjb25zdCBnZXREdWVEYXRlID0gKCkgPT4gX2R1ZURhdGU7XHJcbiAgICBjb25zdCBzZXREdWVEYXRlID0gKG5ld0R1ZURhdGUpID0+IF9kdWVEYXRlID0gbmV3RHVlRGF0ZTtcclxuXHJcbiAgICAvLyBHZXR0ZXIgYW5kIFNldHRlciBmb3IgZGVzY3JpcHRpb25cclxuICAgIGNvbnN0IGdldERlc2NyaXB0aW9uID0gKCkgPT4gX2Rlc2NyaXB0aW9uO1xyXG4gICAgY29uc3Qgc2V0RGVzY3JpcHRpb24gPSAobmV3RGVzY3JpcHRpb24pID0+IF9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xyXG5cclxuICAgIC8vIEdldHRlciBhbmQgU2V0dGVyIGZvciBwcmlvcml0eVxyXG4gICAgY29uc3QgZ2V0UHJpb3JpdHkgPSAoKSA9PiBfcHJpb3JpdHk7XHJcbiAgICBjb25zdCBzZXRQcmlvcml0eSA9IChuZXdQcmlvcml0eSkgPT4gX3ByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRUYXNrSWQsXHJcbiAgICAgICAgZ2V0TmFtZSxcclxuICAgICAgICBzZXROYW1lLFxyXG4gICAgICAgIGdldER1ZURhdGUsXHJcbiAgICAgICAgc2V0RHVlRGF0ZSxcclxuICAgICAgICBnZXREZXNjcmlwdGlvbixcclxuICAgICAgICBzZXREZXNjcmlwdGlvbixcclxuICAgICAgICBnZXRQcmlvcml0eSxcclxuICAgICAgICBzZXRQcmlvcml0eVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgcmVtb3ZlRnJvbU1vZGFsIH0gZnJvbSBcIi4vZG9tLW1hbmlwdWxhdGlvbi9tb2RhbC5qc1wiO1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gc2VsZWN0IHRoZSBwYXJlbnQgcHJvamVjdCBvZiBhIHRhc2ssIHRoZSBsaXN0IHdoaWNoIHRoZSB0YXNrIGl0J3MgaW5zaWRlIGFuZCB0aGUgdGFzayBpdHNlbGZcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhc2tFbGVtZW50cyh0YXNrLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgYXNpZGVQcm9qZWN0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRhc2tzU2VjdGlvbkFzaWRlID0gYXNpZGVQcm9qZWN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC10YXNrcy1hc2lkZScpO1xyXG4gICAgY29uc3QgYXNpZGVUYXNrRWxlbWVudCA9IHRhc2tzU2VjdGlvbkFzaWRlLnF1ZXJ5U2VsZWN0b3IoYCNhc2lkZV8ke3Rhc2suZ2V0VGFza0lkKCl9YCk7XHJcblxyXG4gICAgY29uc3QgbWFpblByb2plY3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYG1haW5fJHtwcm9qZWN0SWR9YCk7XHJcbiAgICBjb25zdCB0YXNrc1NlY3Rpb25NYWluID0gbWFpblByb2plY3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0LXRhc2tzLW1haW4nKTtcclxuICAgIGNvbnN0IG1haW5UYXNrRWxlbWVudCA9IHRhc2tzU2VjdGlvbk1haW4ucXVlcnlTZWxlY3RvcihgI21haW5fJHt0YXNrLmdldFRhc2tJZCgpfWApO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFza0xpc3RBc2lkZTogdGFza3NTZWN0aW9uQXNpZGUsXHJcbiAgICAgICAgdGFza0FzaWRlOiBhc2lkZVRhc2tFbGVtZW50LFxyXG4gICAgICAgIHRhc2tMaXN0TWFpbjogdGFza3NTZWN0aW9uTWFpbixcclxuICAgICAgICB0YXNrTWFpbjogbWFpblRhc2tFbGVtZW50XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENsZWFyIG1haW4tY29udGVudCBhbmQgYXBwZW5kIHRoZSAnZXhwYW5kZWQnIHByb2plY3QgZnJvbSBhc2lkZVxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNYWluQW5kQXBwZW5kTm9kZShlbGVtZW50LCAuLi5yZXN0KXtcclxuICAgIGNvbnN0IG1haW5Db250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpO1xyXG4gICAgd2hpbGUobWFpbkNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZCl7XHJcbiAgICAgICAgbWFpbkNvbnRlbnQucmVtb3ZlQ2hpbGQobWFpbkNvbnRlbnQubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYocmVzdC5sZW5ndGggIT09IDApXHJcbiAgICAgICAgbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQocmVzdFswXSk7XHJcblxyXG4gICAgaWYoZWxlbWVudC5sZW5ndGggPj0gMSl7XHJcbiAgICAgICAgZWxlbWVudC5mb3JFYWNoKGUgPT4gbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQoZSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eUhpbnQodGFza0xpc3Qpe1xyXG4gICAgY29uc3QgZW1wdHlIaW50ID0gY3JlYXRlRWxlbWVudCgncCcsIHtlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LWVtcHR5LWhpbnQnLCBlbGVtZW50VGV4dDogJ05vIHRhc2tzIHlldCEnfSk7XHJcbiAgICB0YXNrTGlzdC5hcHBlbmRDaGlsZChlbXB0eUhpbnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRW1wdHlIaW50KHRhc2tMaXN0KXtcclxuICAgIHRhc2tMaXN0LnJlbW92ZUNoaWxkKHRhc2tMaXN0LmNoaWxkcmVuWzBdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbW1vblRhc2tGb3JtKCl7XHJcbiAgICBjb25zdCBmb3JtID0gY3JlYXRlRWxlbWVudCgnZm9ybScsIHtlbGVtZW50SWQ6ICdmb3JtLXRhc2snfSk7XHJcbiAgICBcclxuICAgIGNvbnN0IGZvcm1UaXRsZSA9IGNyZWF0ZUVsZW1lbnQoJ2gzJywge2VsZW1lbnRDbGFzczogJ2Zvcm0taGVhZGVyJ30pO1xyXG5cclxuICAgIGNvbnN0IGRpdlRpdGxlID0gZGl2Q3JlYXRvcignVGl0bGUgKicsICd0YXNrLW5hbWUtaW5wdXQnLCAndGV4dCcsICd0YXNrX25hbWUnKTtcclxuICAgIGNvbnN0IGRpdkR1ZURhdGUgPSBkaXZDcmVhdG9yKCdEdWUgZGF0ZScsICdkdWUtZGF0ZS1pbnB1dCcsICdkYXRlJywgJ2R1ZV9kYXRlJyk7XHJcbiAgICBjb25zdCBkaXZEZXNjcmlwdGlvbiA9IGRpdkNyZWF0b3IoJ0Rlc2NyaXB0aW9uJywgJ2Rlc2NyaXB0aW9uLWlucHV0JywgJ3RleHRhcmVhJywgJ2Rlc2NyaXB0aW9uJyk7XHJcbiAgIFxyXG4gICAgLy8gRmllbGRzZXQgd2l0aCByYWRpbyBidXR0b25zIGZvciBwcmlvcml0eSBzZWxlY3Rpb25cclxuICAgIGNvbnN0IGZpZWxkc2V0UHJpb3JpdGllcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ZpZWxkc2V0Jyk7XHJcbiAgICBjb25zdCBmaWVsZHNldFByaW9yaXRpZXNMZWdlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsZWdlbmQnKTtcclxuICAgIGZpZWxkc2V0UHJpb3JpdGllc0xlZ2VuZC50ZXh0Q29udGVudCA9ICdQcmlvcml0eSc7XHJcbiAgICBcclxuICAgIC8vIERlZmF1bHQgdmFsdWUgZm9yIHByaW9yaXR5XHJcbiAgICBjb25zdCBkaXZOb1ByaW9yaXR5ID0gZGl2Q3JlYXRvcignTm8gcHJpb3JpdHknLCAnbm8tcHJpb3JpdHknLCAncmFkaW8nLCAncHJpb3JpdHknKTtcclxuICAgIGRpdk5vUHJpb3JpdHkubGFzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnJyk7XHJcbiAgICBjb25zdCBkaXZQcmlvcml0eUxvdyA9IGRpdkNyZWF0b3IoJ0xvdycsICdsb3cnLCAncmFkaW8nLCAncHJpb3JpdHknKTtcclxuICAgIGNvbnN0IGRpdlByaW9yaXR5SGlnaCA9IGRpdkNyZWF0b3IoJ0hpZ2gnLCAnaGlnaCcsICdyYWRpbycsICdwcmlvcml0eScpO1xyXG5cclxuICAgIC8vIEZvcm0gYnV0dG9ucyAoQWRkIHRhc2sgYW5kIENhbmNlbClcclxuICAgIGNvbnN0IGRpdkJ1dHRvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdkJ1dHRvbnMuc2V0QXR0cmlidXRlKCdpZCcsICdmb3JtLWJ1dHRvbnMnKTtcclxuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGJ1dHRvbldpdGhUZXh0Q3JlYXRvcignQWRkIFRhc2snLCAnYWRkLXRhc2snLCAnYnV0dG9uJyk7XHJcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBidXR0b25XaXRoVGV4dENyZWF0b3IoJ0NhbmNlbCcsICdjYW5jZWwtdGFzaycsICdidXR0b24nKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZUZyb21Nb2RhbChmb3JtKSk7XHJcblxyXG4gICAgZmllbGRzZXRQcmlvcml0aWVzLmFwcGVuZChcclxuICAgICAgICBmaWVsZHNldFByaW9yaXRpZXNMZWdlbmQsXHJcbiAgICAgICAgZGl2UHJpb3JpdHlIaWdoLFxyXG4gICAgICAgIGRpdlByaW9yaXR5TG93LFxyXG4gICAgICAgIGRpdk5vUHJpb3JpdHlcclxuICAgICk7XHJcbiAgICBcclxuICAgIGRpdkJ1dHRvbnMuYXBwZW5kKFxyXG4gICAgICAgIHN1Ym1pdEJ1dHRvbixcclxuICAgICAgICBjYW5jZWxCdXR0b25cclxuICAgICk7XHJcblxyXG4gICAgZm9ybS5hcHBlbmQoXHJcbiAgICAgICAgZm9ybVRpdGxlLFxyXG4gICAgICAgIGRpdlRpdGxlLCBcclxuICAgICAgICBkaXZEdWVEYXRlLCBcclxuICAgICAgICBkaXZEZXNjcmlwdGlvbixcclxuICAgICAgICBmaWVsZHNldFByaW9yaXRpZXMsXHJcbiAgICAgICAgZGl2QnV0dG9uc1xyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZm9ybTtcclxufVxyXG5cclxuLy8gRXh0cmFjdCB0aGUgZGF0YSB0aGF0IGNvbWVzIGZyb20gdGhlIHRhc2sgZm9ybSAoZWRpdCBhbmQgbmV3IHRhc2spXHJcbmV4cG9ydCBmdW5jdGlvbiB0YXNrRm9ybURhdGFIYW5kbGVyKGZvcm0pe1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgaWYoIWZvcm1EYXRhLmdldCgndGFza19uYW1lJykpe1xyXG4gICAgICAgIGVycm9yRmllbGRDcmVhdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLW5hbWUtaW5wdXQnKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHRhc2tQYXJhbWV0ZXJzID0gW107XHJcbiAgICAgICAgZm9ybURhdGEuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBpZih2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHRhc2tQYXJhbWV0ZXJzLnB1c2goe1tgJHtrZXl9YF06ICdub25lJ30pO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0YXNrUGFyYW1ldGVycy5wdXNoKHtbYCR7a2V5fWBdOiB2YWx1ZX0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFza1BhcmFtZXRlcnM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlcnJvckZpZWxkQ3JlYXRvcihlbGVtZW50VG9BcHBlbmRCZWxvdyl7XHJcbiAgICAvLyBEb24ndCBhbGxvdyB0byBjcmVhdGUgYSBsb3Qgb2YgZXJyb3IgYWR2aXNlc1xyXG4gICAgaWYoZWxlbWVudFRvQXBwZW5kQmVsb3cubmV4dEVsZW1lbnRTaWJsaW5nKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBlcnJvckZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgZXJyb3JGaWVsZC50ZXh0Q29udGVudCA9ICdZb3UgbmVlZCB0byBmaWxsIHRoaXMgZmllbGQhJztcclxuICAgIGVycm9yRmllbGQuc3R5bGUuY3NzVGV4dCA9IFxyXG4gICAgICAgIGB3aWR0aDogbWF4LWNvbnRlbnQ7IFxyXG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDsgXHJcbiAgICAgICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiA1cHhgO1xyXG5cclxuICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnRUb0FwcGVuZEJlbG93LnBhcmVudEVsZW1lbnQ7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZXJyb3JGaWVsZCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHBhcmVudC5yZW1vdmVDaGlsZChlcnJvckZpZWxkKSwgMTUwMCk7XHJcbn1cclxuXHJcbi8vIEhhbmR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGJ1dHRvbiB3aXRoIGFuIGltYWdlIGluc2lkZSAocmlnaHQtc2lkZSBvZiBhIHRhc2sgZWxlbWVudHMgYW5kIGFkZCBuZXcgdGFzayBidXR0b24pXHJcbmV4cG9ydCBmdW5jdGlvbiBidXR0b25XaXRoSW1nKGVsZW1lbnRDbGFzcywgaW1nU3JjLCBvcHRpb25hbFNwYW5UZXh0KXtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgJHtlbGVtZW50Q2xhc3N9YCk7XHJcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xyXG5cclxuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgaW1nLnNyYyA9IGAke2ltZ1NyY31gO1xyXG5cclxuICAgIGlmKG9wdGlvbmFsU3BhblRleHQpe1xyXG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGAke29wdGlvbmFsU3BhblRleHR9YDtcclxuICAgICAgICBzcGFuLnN0eWxlLmNzc1RleHQgPSAnb3JkZXI6IDInOyAvLyBjaGFuZ2Ugb3JkZXIgb2Ygc3BhbiwgcHV0dGluZyBoaW0gYWZ0ZXIgdGhlIGltZ1xyXG4gICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgIH1cclxuXHJcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRoYXQgY29tZXMgaW4gaGFuZHkgdG8gY3JlYXRlIGVsZW1lbnRzIHRoYXQgZ29lcyBpbnNpZGUgYSBwcm9qZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZ05hbWUsIC4uLnJlc3Qpe1xyXG4gICAgY29uc3QgcmVzdFBhcmFtZXRlcnMgPSByZXN0WzBdOyAvLyBOZWVkIHRoaXMgYmVjYXVzZSBpdCBjb21lcyBhcyBhbiBhcnJheVxyXG4gICAgY29uc3Qge2VsZW1lbnRDbGFzcywgZWxlbWVudElkLCBlbGVtZW50U3JjLCBlbGVtZW50VGV4dH0gPSByZXN0UGFyYW1ldGVycztcclxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGAke3RhZ05hbWV9YCk7XHJcblxyXG4gICAgaWYoZWxlbWVudElkKVxyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGAke2VsZW1lbnRJZH1gKTtcclxuXHJcbiAgICBpZihlbGVtZW50Q2xhc3MpXHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYCR7ZWxlbWVudENsYXNzfWApO1xyXG5cclxuICAgIGlmKGVsZW1lbnRTcmMpXHJcbiAgICAgICAgZWxlbWVudC5zcmMgPSBlbGVtZW50U3JjO1xyXG5cclxuICAgIGlmKGVsZW1lbnRUZXh0KVxyXG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBlbGVtZW50VGV4dDtcclxuXHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxufVxyXG5cclxuLy8gXCJDbGVhblwiIHRoZSBwcm9qZWN0IGlkZW50aWZpZXIgZnJvbSB0aGUgbWFpbi1jb250ZW50IG9yIGFzaWRlLCB1c2luZyBvbmx5IHRoZSByZWxldmFudCBwYXJ0IG9mIGhpbSAoZS5nIG1haW5fcHJvamVjdF8wID0+IHByb2plY3RfMClcclxuZXhwb3J0IGNvbnN0IGNsZWFuUHJvamVjdElkID0gKHJhd0lkKSA9PiByYXdJZC5zbGljZShyYXdJZC5pbmRleE9mKCdfJykgKyAxKTtcclxuXHJcbi8vIEZ1bmN0aW9uIHRoYXQgY29tZXMgaW4gaGFuZHkgdG8gY3JlYXRlIGVsZW1lbnRzIHRoYXQgZ29lcyBpbnNpZGUgdGhlIGZvcm0gZm9yIGEgbmV3IHRhc2tcclxuZXhwb3J0IGZ1bmN0aW9uIGRpdkNyZWF0b3IobGFiZWxUZXh0LCBpbnB1dElkLCBpbnB1dFR5cGUsIGlucHV0TmFtZSl7XHJcbiAgICBjb25zdCBkaXZXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBgJHtpbnB1dElkfWApO1xyXG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbFRleHQ7XHJcblxyXG4gICAgbGV0IGlucHV0O1xyXG4gICAgaWYoaW5wdXRUeXBlID09PSAndGV4dGFyZWEnKXtcclxuICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdtYXhsZW5ndGgnLCAnMTQwJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgYCR7aW5wdXRUeXBlfWApO1xyXG5cclxuICAgICAgICBpZihpbnB1dFR5cGUgPT09ICd0ZXh0Jyl7XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbWF4bGVuZ3RoJywgJzI1Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtpbnB1dElkfWApO1xyXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgYCR7aW5wdXROYW1lfWApO1xyXG5cclxuICAgIGlmKGlucHV0LnR5cGUgPT09ICdyYWRpbycpXHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGAke2lucHV0SWR9YCk7XHJcblxyXG4gICAgZGl2V3JhcHBlci5hcHBlbmQobGFiZWwsIGlucHV0KTtcclxuICAgIHJldHVybiBkaXZXcmFwcGVyO1xyXG59XHJcblxyXG4vLyBIYW5keSBmdW5jdGlvbiB0byBjcmVhdGUgYSBidXR0b24gd2l0aCBhIHRleHRcclxuZXhwb3J0IGZ1bmN0aW9uIGJ1dHRvbldpdGhUZXh0Q3JlYXRvcihidXR0b25UZXh0LCBidXR0b25JZCwgYnV0dG9uVHlwZSl7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIFxyXG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtidXR0b25JZH1gKTtcclxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCBgJHtidXR0b25UeXBlfWApXHJcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBgJHtidXR0b25UZXh0fWA7XHJcblxyXG4gICAgcmV0dXJuIGJ1dHRvbjtcclxufSIsImltcG9ydCBQcm9qZWN0IGZyb20gXCIuLi9hcHAtbG9naWMvcHJvamVjdC5qc1wiO1xyXG5pbXBvcnQgeyBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBjcmVhdGVOZXdQcm9qZWN0Rm9ybSwgY3JlYXRlUHJvamVjdEFzaWRlIH0gZnJvbSBcIi4vcHJvamVjdEFzaWRlLmpzXCI7XHJcbmltcG9ydCB7IGdldFdlZWtUYXNrcywgZ2V0RmlsdGVyZWRUYXNrcyB9IGZyb20gXCIuL3RvZGF5VGFza3MuanNcIjtcclxuXHJcbi8vIEZ1bmN0aW9uIHRvIHN0YXJ0IGFsbCBldmVudExpc3RlbmVycyByZWxhdGVkIHRvIHRoZSB1c2VyLXByb2plY3RzIHNlY3Rpb24gYW5kIGluaXRpYWwgZWxlbWVudHMgKGZvciBwcm9qZWN0cyBzdG9yZWQgcHJldmlvdXNseSlcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnRVSUFuZExpc3RlbmVycygpe1xyXG4gICAgb3BlbkNsb3NlQXNpZGUoKTtcclxuICAgIFxyXG4gICAgLy8gU3RhcnQgdGhlIHRvZGF5IHNlY3Rpb25cclxuICAgIGNvbnN0IHRvZGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZGF5LXRvZG8tYnV0dG9uJyk7XHJcbiAgICB0b2RheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd0YWItc2VsZWN0ZWQnKTtcclxuICAgIGdldEZpbHRlcmVkVGFza3MoJ3RvZGF5Jyk7XHJcbiAgICBcclxuICAgIHRvZGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHNlbGVjdFRhYih0b2RheUJ1dHRvbik7XHJcbiAgICAgICAgZ2V0RmlsdGVyZWRUYXNrcygndG9kYXknKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHdlZWtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2Vlay10b2RvLWJ1dHRvbicpO1xyXG4gICAgd2Vla0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBzZWxlY3RUYWIod2Vla0J1dHRvbik7XHJcbiAgICAgICAgZ2V0RmlsdGVyZWRUYXNrcygnd2VlaycpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBCdXR0b24gdG8gc2hvdy9oaWRlIHVzZXIncyBwcm9qZWN0c1xyXG4gICAgY29uc3QgdXNlclByb2plY3RzQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItcHJvamVjdHMtYnV0dG9uJyk7XHJcbiAgICB1c2VyUHJvamVjdHNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvcGVuQ2xvc2VNeVByb2plY3RzKHVzZXJQcm9qZWN0c0J1dHRvbikpO1xyXG5cclxuICAgIC8vIEJ1dHRvbiB0byBjcmVhdGUgbmV3IHByb2plY3RcclxuICAgIGNvbnN0IGFkZE5ld1Byb2plY3RCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLW5ldy1wcm9qZWN0LWJ1dHRvbicpO1xyXG4gICAgYWRkTmV3UHJvamVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4gY3JlYXRlTmV3UHJvamVjdEZvcm0oZXZlbnQuY3VycmVudFRhcmdldCkpO1xyXG5cclxuICAgIC8vIEdldCBhbGwgdXNlcidzIHByb2plY3RzIGFuZCBjcmVhdGUgYSBuZXcgZWxlbWVudCBvbiB0aGUgYXNpZGVcclxuICAgIGNvbnN0IGFsbFVzZXJQcm9qZWN0cyA9IGdldFByb2plY3RMaXN0U3RvcmFnZSgpO1xyXG4gICAgQXJyYXkuZnJvbShhbGxVc2VyUHJvamVjdHMpLmZvckVhY2gocHJvamVjdCA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdCk7XHJcbiAgICAgICAgY3JlYXRlUHJvamVjdEFzaWRlKHByb2plY3RPYmplY3QpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VGFiKGVsZW1lbnRDbGlja2VkKXtcclxuICAgIGNvbnN0IGN1cnJlbnRUYWJTZWxlY3RlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYi1zZWxlY3RlZCcpWzBdO1xyXG5cclxuICAgIGN1cnJlbnRUYWJTZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCd0YWItc2VsZWN0ZWQnKTtcclxuICAgIGVsZW1lbnRDbGlja2VkLmNsYXNzTGlzdC5hZGQoJ3RhYi1zZWxlY3RlZCcpO1xyXG59XHJcblxyXG4vLyBIYW5kbGUgc2hvdy9oaWRlIGFsbCB1c2VyJ3MgcHJvamVjdHMgKGRpdiB0aGF0IGNvbnRhaW5zIE15IFByb2plY3RzIHRleHQpXHJcbmZ1bmN0aW9uIG9wZW5DbG9zZU15UHJvamVjdHMoYnV0dG9uKXtcclxuICAgIGNvbnN0IGljb25JbnNpZGVCdXR0b24gPSBidXR0b24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdO1xyXG5cclxuICAgIGlmKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT09ICdzaG93Jyl7XHJcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaGlkZScpO1xyXG4gICAgICAgXHJcbiAgICAgICAgLy8gQXJyb3cgZWZmZWN0IHVzaW5nIGFuIGFuaW1hdGlvbiBkZWZpbmVkIGluIHRoZSBjc3MgZmlsZSwgZnJvbSBvcGVuIHRvIGNsb3NlZCAoYm90dG9tIHRvIHJpZ2h0KVxyXG4gICAgICAgIGljb25JbnNpZGVCdXR0b24uc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwOyc7XHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ2FuaW1hdGlvbjogcHJvamVjdHNCdXR0b25DaGFuZ2luZ0RpcmVjdGlvbiAxNTBtcyBub3JtYWwgZm9yd2FyZHM7J1xyXG4gICAgICAgICwgMTUwKTtcclxuXHJcbiAgICAgICAgaGlkZVByb2plY3RzKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzaG93Jyk7ICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQXJyb3cgZWZmZWN0IHVzaW5nIGFuIGFuaW1hdGlvbiBkZWZpbmVkIGluIHRoZSBjc3MgZmlsZSwgZnJvbSBjbG9zZWQgdG8gb3BlbiAocmlnaHQgdG8gYm90dG9tKVxyXG4gICAgICAgIGljb25JbnNpZGVCdXR0b24uc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwOyc7XHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ2FuaW1hdGlvbjogcHJvamVjdHNCdXR0b25DaGFuZ2luZ0RpcmVjdGlvbiAxNTBtcyByZXZlcnNlIGJhY2t3YXJkczsnXHJcbiAgICAgICAgLCAxNTApO1xyXG5cclxuICAgICAgICBzaG93UHJvamVjdHMoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1Byb2plY3RzKCl7XHJcbiAgICBjb25zdCBsaXN0T2ZQcm9qZWN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXByb2plY3RzLXVzZXInKTtcclxuICAgIGxpc3RPZlByb2plY3RzLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleDsnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlUHJvamVjdHMoKXtcclxuICAgIGNvbnN0IGxpc3RPZlByb2plY3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtcHJvamVjdHMtdXNlcicpO1xyXG4gICAgbGlzdE9mUHJvamVjdHMuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBub25lOyc7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRvIG9wZW4gYW5kIGhpZGUgdGhlIGFzaWRlIG1lbnUgd2hlbiBjbGlja2VkXHJcbmZ1bmN0aW9uIG9wZW5DbG9zZUFzaWRlKCl7XHJcbiAgICBjb25zdCBoYW1idXJndWVyTWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoYW1idXJndWVyLW1lbnUtYnV0dG9uJyk7XHJcbiAgICBoYW1idXJndWVyTWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3MgPSBoYW1idXJndWVyTWVudS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoY3VycmVudENsYXNzID09PSAnc2hvdycpe1xyXG4gICAgICAgICAgICBoYW1idXJndWVyTWVudS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2hpZGUnKTtcclxuICAgICAgICAgICAgaGlkZUFzaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBoYW1idXJndWVyTWVudS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3Nob3cnKTtcclxuICAgICAgICAgICAgc2hvd0FzaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dBc2lkZSgpe1xyXG4gICAgY29uc3QgYXNpZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXNpZGUtbmF2aWdhdGlvbicpO1xyXG4gICAgYXNpZGUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhc2lkZS1zaG93Jyk7IC8vIEFkZCB0aGlzIGNsYXNzIHRvIHB1dCBtYWluLWNvbnRlbnQgYmFjayB0byBpdHMgcGxhY2VcclxuICAgIGFzaWRlLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogZmxleDsnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlQXNpZGUoKXtcclxuICAgIGNvbnN0IGFzaWRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FzaWRlLW5hdmlnYXRpb24nKTtcclxuICAgIGFzaWRlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnYXNpZGUtaGlkZScpOyAvLyBBZGQgdGhpcyBjbGFzcyB0byBhbGxvdyB0aGUgbWFpbi1jb250ZW50IHRvIGdyb3dcclxuICAgIGFzaWRlLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnO1xyXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZFRvTW9kYWwoaHRtbEVsZW1lbnQpe1xyXG4gICAgY29uc3QgbW9kYWxCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYm94Jyk7XHJcbiAgICBjbGVhck1vZGFsKG1vZGFsQm94KTtcclxuXHJcbiAgICBtb2RhbEJveC5hcHBlbmRDaGlsZChodG1sRWxlbWVudCk7XHJcbiAgICBjaGFuZ2VNb2RhbFN0YXRlKG1vZGFsQm94KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RhbChodG1sRWxlbWVudCl7XHJcbiAgICBjb25zdCBtb2RhbEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1ib3gnKTtcclxuICAgIG1vZGFsQm94LnJlbW92ZUNoaWxkKGh0bWxFbGVtZW50KTtcclxuICAgIGNoYW5nZU1vZGFsU3RhdGUobW9kYWxCb3gpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTW9kYWxTdGF0ZShtb2RhbCl7XHJcbiAgICBjb25zdCBjdXJyZW50Q2xhc3MgPSBtb2RhbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcblxyXG4gICAgaWYoY3VycmVudENsYXNzID09PSAnc2hvdycpXHJcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICdoaWRlJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgbW9kYWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzaG93Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyTW9kYWwobW9kYWwpe1xyXG4gICAgd2hpbGUobW9kYWwuZmlyc3RFbGVtZW50Q2hpbGQpe1xyXG4gICAgICAgIG1vZGFsLnJlbW92ZUNoaWxkKG1vZGFsLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4uL2FwcC1sb2dpYy9wcm9qZWN0LmpzXCI7XHJcbmltcG9ydCBzYXZlUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgYnV0dG9uV2l0aEltZywgY3JlYXRlRWxlbWVudCwgY3JlYXRlRW1wdHlIaW50LCBlcnJvckZpZWxkQ3JlYXRvciB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuaW1wb3J0IHsgc2VsZWN0VGFiIH0gZnJvbSBcIi4vYXNpZGVTZWN0aW9uLmpzXCI7XHJcbmltcG9ydCB7IGV4cGFuZFByb2plY3RUYXNrcyB9IGZyb20gXCIuL3Byb2plY3RNYWluLmpzXCI7XHJcblxyXG4vLyBGdW5jdGlvbiB0byBnZW5lcmF0ZSBhIGZvcm0gdG8gY3JlYXRlIGEgbmV3IHByb2plY3RcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlTmV3UHJvamVjdEZvcm0oYnV0dG9uTmV3UHJvamVjdCl7XHJcbiAgICBidXR0b25OZXdQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSAnb3BhY2l0eTogMCc7IC8vIEhpZGUgJ3BsdXMnIGJ1dHRvblxyXG4gICAgY29uc3QgZm9ybVdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdmb3JtJywge2VsZW1lbnRJZDogJ2Zvcm0tYWRkLXByb2plY3QnfSk7XHJcblxyXG4gICAgLy8gSW5wdXQgdG8gcGxhY2UgdGhlIG5ldyBwcm9qZWN0J3MgbmFtZVxyXG4gICAgY29uc3QgcHJvamVjdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHByb2plY3ROYW1lSW5wdXQsIHtcclxuICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgaWQ6ICdwcm9qZWN0LW5hbWUnLFxyXG4gICAgICAgIG5hbWU6ICdwcm9qZWN0X25hbWUnLFxyXG4gICAgICAgIHBsYWNlaG9sZGVyOiBgTmV3IHByb2plY3QncyBuYW1lYFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdE5hbWVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHByb2plY3ROYW1lRGl2LmFwcGVuZENoaWxkKHByb2plY3ROYW1lSW5wdXQpO1xyXG5cclxuICAgIC8vIEJ1dHRvbiB0byBjb25maXJtIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBwcm9qZWN0XHJcbiAgICBjb25zdCBhZGRCdXR0b24gPSBidXR0b25XaXRoSW1nKCdjcmVhdGUtcHJvamVjdC1idXR0b24nLCAnL2Rpc3QvYXNzZXRzL2FzaWRlLWljb25zL3NlbGVjdGVkLWljb24uc3ZnJyk7XHJcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBuZXdQcm9qZWN0SGFuZGxlcihmb3JtV3JhcHBlciwgYnV0dG9uTmV3UHJvamVjdCkpO1xyXG5cclxuICAgIC8vIEJ1dHRvbiB0byBjYW5jZWwgdGhlIGNyZWF0aW9uIG9mIGEgbmV3IHByb2plY3RcclxuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoJ2NhbmNlbC1wcm9qZWN0LWJ1dHRvbicsICcvZGlzdC9hc3NldHMvYXNpZGUtaWNvbnMvY2FuY2VsLWljb24uc3ZnJyk7XHJcbiAgICBjYW5jZWxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByZW1vdmVQcm9qZWN0Rm9ybShmb3JtV3JhcHBlciwgYnV0dG9uTmV3UHJvamVjdCkpO1xyXG5cclxuICAgIC8vIFdyYXBwZXIgZm9yIGNhbmNlbCBhbmQgY3JlYXRlIHByb2plY3QgYnV0dG9uc1xyXG4gICAgY29uc3QgYnV0dG9uc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGJ1dHRvbnNXcmFwcGVyLmFwcGVuZChhZGRCdXR0b24sIGNhbmNlbEJ1dHRvbik7XHJcbiAgICBmb3JtV3JhcHBlci5hcHBlbmQocHJvamVjdE5hbWVEaXYsIGJ1dHRvbnNXcmFwcGVyKTtcclxuXHJcbiAgICAvLyBUaGlzIGVsZW1lbnRzIGFyZSB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwcm9qZWN0IGZvcm0gY29ycmVjdGx5XHJcbiAgICBjb25zdCBwYXJlbnRPZk5ld1Byb2plY3RCdXR0b24gPSBidXR0b25OZXdQcm9qZWN0LnBhcmVudE5vZGU7IC8vICgjY3JlYXRlLWFuZC1saXN0LXVzZXItcHJvamVjdHMpXHJcbiAgICBjb25zdCBwYXJlbnRPZlBhcmVudCA9IHBhcmVudE9mTmV3UHJvamVjdEJ1dHRvbi5wYXJlbnROb2RlOyAvLyAoI3VzZXItcHJvamVjdHMpXHJcbiAgICBcclxuICAgIC8vIHBhcmVudE9mUGFyZW50Lmxhc3RFbGVtZW50Q2hpbGQgaXMgdGhlIGVsZW1lbnQgdXNlZCBhcyBhIHJlZmVyZW5jZSwgdG8gdXNlIGluc2VydEJlZm9yZVxyXG4gICAgcGFyZW50T2ZQYXJlbnQuaW5zZXJ0QmVmb3JlKGZvcm1XcmFwcGVyLCBwYXJlbnRPZlBhcmVudC5sYXN0RWxlbWVudENoaWxkKTtcclxufVxyXG5cclxuLy8gQ2hlY2sgaWYgdGhlIHByb2plY3QgdGl0bGUgaW5wdXQgaXMgZmlsbGVkLCBhbmQgY3JlYXRlIGEgbmV3IHByb2plY3QgKEhUTUwgYW5kIFN0b3JhZ2UpXHJcbmZ1bmN0aW9uIG5ld1Byb2plY3RIYW5kbGVyKGZvcm0sIGJ1dHRvbk5ld1Byb2plY3Qpe1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgaWYoIWZvcm1EYXRhLmdldCgncHJvamVjdF9uYW1lJykpe1xyXG4gICAgICAgIGVycm9yRmllbGRDcmVhdG9yKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0LW5hbWUnKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBwcm9qZWN0ID0gUHJvamVjdChmb3JtRGF0YS5nZXQoJ3Byb2plY3RfbmFtZScpKTtcclxuXHJcbiAgICAgICAgaWYoc2F2ZVByb2plY3QocHJvamVjdCkgIT09IGZhbHNlKXtcclxuICAgICAgICAgICAgY3JlYXRlUHJvamVjdEFzaWRlKHByb2plY3QpO1xyXG4gICAgICAgICAgICByZW1vdmVQcm9qZWN0Rm9ybShmb3JtLCBidXR0b25OZXdQcm9qZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUHJvamVjdCBhbHJlYWR5IGV4aXN0cyFcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFJlbW92ZSBuZXcgcHJvamVjdCBmb3JtIGFuZCBzaG93cyB0aGUgJ3BsdXMnIGJ1dHRvbiBhZ2FpblxyXG5mdW5jdGlvbiByZW1vdmVQcm9qZWN0Rm9ybShmb3JtLCBidXR0b25OZXdQcm9qZWN0KXtcclxuICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSBmb3JtLnBhcmVudEVsZW1lbnQ7XHJcbiAgICBwYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGZvcm0pO1xyXG4gICAgYnV0dG9uTmV3UHJvamVjdC5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDEnO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhbiBIVE1MIGVsZW1lbnQgZm9yIGEgbmV3IGNyZWF0ZWQgcHJvamVjdCAoKVxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvamVjdEFzaWRlKHByb2plY3RPYmplY3Qpe1xyXG4gICAgY29uc3QgcHJvamVjdElkID0gcHJvamVjdE9iamVjdC5nZXRQcm9qZWN0SWQoKTtcclxuICAgIGNvbnN0IHByb2plY3RUaXRsZSA9IHByb2plY3RPYmplY3QuZ2V0VGl0bGUoKTtcclxuICAgIGNvbnN0IHByb2plY3RUYXNrcyA9IHByb2plY3RPYmplY3QuZ2V0QWxsVGFza3MoKTtcclxuICAgIFxyXG4gICAgY29uc3QgYXJyb3dEb3duSW1hZ2UgPSBjcmVhdGVFbGVtZW50KCdpbWcnLCB7ZWxlbWVudFNyYzogJy9kaXN0L2Fzc2V0cy9hc2lkZS1pY29ucy9hcnJvdy1kb3duLWljb24tMjIucG5nJ30pO1xyXG4gICAgY29uc3QgYnV0dG9uVGV4dCA9IGNyZWF0ZUVsZW1lbnQoJ3AnLCB7ZWxlbWVudFRleHQ6IGAke3Byb2plY3RUaXRsZX1gfSk7XHJcbiAgICBjb25zdCBleHBhbmRJbWFnZSA9IGNyZWF0ZUVsZW1lbnQoJ2ltZycsIHtlbGVtZW50U3JjOiAnL2Rpc3QvYXNzZXRzL2FzaWRlLWljb25zL2V4cGFuZC1pY29uLnBuZycsIGVsZW1lbnRDbGFzczogJ2V4cGFuZC1wcm9qZWN0LXRhc2tzJ30pO1xyXG4gICAgY29uc3QgYWxsVGFza3NFbGVtZW50cyA9IHByb2plY3RUYXNrcy5tYXAodGFzayA9PiBjcmVhdGVUYXNrRWxlbWVudEFzaWRlKHRhc2spKTtcclxuXHJcbiAgICAvLyBXcmFwIGJ1dHRvbnMgdG8gc2hvdy9oaWRlIGFuZCBleHBhbmQgcHJvamVjdCB0byBhIGRpdlxyXG4gICAgY29uc3QgZGl2QnV0dG9uc1Byb2plY3ROYW1lID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge2VsZW1lbnRDbGFzczogJ3Byb2plY3Qgc2hvdyd9KTtcclxuICAgIGRpdkJ1dHRvbnNQcm9qZWN0TmFtZS5hcHBlbmQoYXJyb3dEb3duSW1hZ2UsIGJ1dHRvblRleHQsIGV4cGFuZEltYWdlKTtcclxuICAgIFxyXG4gICAgLy8gZXZlbnRMaXN0ZW5lciB0byBzaG93L2hpZGUgYW5kIGV4cGFuZCBhIHByb2plY3RcclxuICAgIG5ld1Byb2plY3RCdXR0b25MaXN0ZW5lcihkaXZCdXR0b25zUHJvamVjdE5hbWUsIGV4cGFuZEltYWdlKTtcclxuXHJcbiAgICAvLyBCdXR0b25zIHRvIHNob3cvaGlkZSBhbmQgZXhwYW5kIHByb2plY3RcclxuICAgIGRpdkJ1dHRvbnNQcm9qZWN0TmFtZS5hcHBlbmQoYXJyb3dEb3duSW1hZ2UsIGJ1dHRvblRleHQsIGV4cGFuZEltYWdlKTtcclxuICAgIFxyXG4gICAgLy8gV3JhcHBlciBmb3IgYWxsIHRhc2tzIG9mIHRoZSBjdXJyZW50IHByb2plY3RcclxuICAgIGNvbnN0IGFsbFRhc2tzV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LXRhc2tzLWFzaWRlJ30pO1xyXG5cclxuICAgIGlmKGFsbFRhc2tzRWxlbWVudHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIGNyZWF0ZUVtcHR5SGludChhbGxUYXNrc1dyYXBwZXIpO1xyXG4gICAgZWxzZSBcclxuICAgICAgICBBcnJheS5mcm9tKGFsbFRhc2tzRWxlbWVudHMpLmZvckVhY2goZWxlbWVudCA9PiBhbGxUYXNrc1dyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCkpO1xyXG5cclxuICAgIC8vIEFwcGVuZCBhbGwgZWxlbWVudHMgdG8gYSBkaXYgdGhhdCB3cmFwcyBhbGwgdGhlIGNvbnRlbnQgb2YgYSBwcm9qZWN0XHJcbiAgICBjb25zdCBkaXZXcmFwcGVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge2VsZW1lbnRDbGFzczogJ3Byb2plY3QtbmFtZS1hbmQtdGFza3MnLCBlbGVtZW50SWQ6IGBhc2lkZV8ke3Byb2plY3RJZH1gfSk7XHJcbiAgICBkaXZXcmFwcGVyLmFwcGVuZChkaXZCdXR0b25zUHJvamVjdE5hbWUsIGFsbFRhc2tzV3JhcHBlcik7XHJcblxyXG4gICAgLy8gU2VjdGlvbiB0aGF0IGNvbnRhaW5zIGFsbCB1c2VyJ3MgcHJvamVjdHNcclxuICAgIGNvbnN0IHVzZXJQcm9qZWN0c1NlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC1wcm9qZWN0cy11c2VyJyk7XHJcblxyXG4gICAgcmV0dXJuIHVzZXJQcm9qZWN0c1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGl2V3JhcHBlcik7XHJcbn1cclxuXHJcbi8vIENyZWF0ZSBhIHRhc2sgZWxlbWVudCB0byBwdXQgaW5zaWRlIHRoZSByZWxhdGVkIHByb2plY3QgaW4gdGhlIGFzaWRlIHNlY3Rpb25cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRhc2tFbGVtZW50QXNpZGUodGFzayl7XHJcbiAgICBjb25zdCB0YXNrV3JhcHBlckFzaWRlID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIGVsZW1lbnRDbGFzczogJ3Rhc2stYXNpZGUnLCBcclxuICAgICAgICBlbGVtZW50SWQ6IGBhc2lkZV8ke3Rhc2suZ2V0VGFza0lkKCl9YCxcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3Qgc3BhblByaW9yaXR5ID0gY3JlYXRlRWxlbWVudCgnc3BhbicsIHtlbGVtZW50Q2xhc3M6IGB0YXNrLXByaW9yaXR5LWFzaWRlICR7dGFzay5nZXRQcmlvcml0eSgpfWB9KTtcclxuICAgIGNvbnN0IHRhc2tOYW1lID0gY3JlYXRlRWxlbWVudCgncCcsIHtlbGVtZW50VGV4dDogYCR7dGFzay5nZXROYW1lKCl9YH0pO1xyXG4gICAgdGFza1dyYXBwZXJBc2lkZS5hcHBlbmQoc3BhblByaW9yaXR5LCB0YXNrTmFtZSk7XHJcbiAgICBcclxuICAgIHJldHVybiB0YXNrV3JhcHBlckFzaWRlO1xyXG59XHJcblxyXG4vLyBTZXQgbmV3IHByb2plY3QgZXZlbnRMaXN0ZW5lcnMsIHRvIHNob3cvaGlkZSBhbmQgZXhwYW5kIGNvbnRlbnQgdG8gbWFpbi1jb250ZW50IGRpdiAobm90IHlldCBpbXBsZW1lbnRlZClcclxuZnVuY3Rpb24gbmV3UHJvamVjdEJ1dHRvbkxpc3RlbmVyKGJ1dHRvblNob3dIaWRlLCBidXR0b25FeHBhbmQpe1xyXG4gICAgYnV0dG9uU2hvd0hpZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvcGVuQ2xvc2VQcm9qZWN0VGFza3MoYnV0dG9uU2hvd0hpZGUpKTtcclxuICAgIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xyXG4gICAgICAgIHNlbGVjdFRhYihidXR0b25FeHBhbmQucGFyZW50RWxlbWVudCk7XHJcbiAgICAgICAgZXhwYW5kUHJvamVjdFRhc2tzKGJ1dHRvbkV4cGFuZCk7IC8vIEV4cGFuZCBtZWFucyB0aGF0IHRoZSBwcm9qZWN0IHdpbGwgYmUgZXhwYW5kZWQgdG8gdGhlIG1haW4tY29udGVudFxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIEhhbmRsZSBzaG93L2hpZGUgdGFza3Mgb2YgYSBwcm9qZWN0LCBieSBjbGlja2luZyBpbiB0aGUgcHJvamVjdCBkaXZcclxuZnVuY3Rpb24gb3BlbkNsb3NlUHJvamVjdFRhc2tzKHByb2plY3RCdXR0b24pe1xyXG4gICAgY29uc3QgaWNvbkluc2lkZUJ1dHRvbiA9IHByb2plY3RCdXR0b24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpWzBdO1xyXG5cclxuICAgIGlmKHByb2plY3RCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93Jykpe1xyXG4gICAgICAgIHByb2plY3RCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgIHByb2plY3RCdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xyXG4gICAgICAgIC8vIHByb2plY3RCdXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsIGAke3Blcm1hbmVudENsYXNzfSBoaWRlYCk7XHJcbiAgICAgICBcclxuICAgICAgICAvLyBBcnJvdyBlZmZlY3QgdXNpbmcgYW4gYW5pbWF0aW9uIGRlZmluZWQgaW4gdGhlIGNzcyBmaWxlLCBmcm9tIG9wZW4gdG8gY2xvc2VkIChib3R0b20gdG8gcmlnaHQpXHJcbiAgICAgICAgaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDA7JztcclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSAnYW5pbWF0aW9uOiBwcm9qZWN0c0J1dHRvbkNoYW5naW5nRGlyZWN0aW9uIDE1MG1zIG5vcm1hbCBmb3J3YXJkczsnXHJcbiAgICAgICAgLCAxNTApO1xyXG5cclxuICAgICAgICBoaWRlVGFza3NPZlByb2plY3QocHJvamVjdEJ1dHRvbik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgICAgICBwcm9qZWN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBBcnJvdyBlZmZlY3QgdXNpbmcgYW4gYW5pbWF0aW9uIGRlZmluZWQgaW4gdGhlIGNzcyBmaWxlLCBmcm9tIGNsb3NlZCB0byBvcGVuIChyaWdodCB0byBib3R0b20pXHJcbiAgICAgICAgaWNvbkluc2lkZUJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDA7JztcclxuICAgICAgICBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiBpY29uSW5zaWRlQnV0dG9uLnN0eWxlLmNzc1RleHQgPSAnYW5pbWF0aW9uOiBwcm9qZWN0c0J1dHRvbkNoYW5naW5nRGlyZWN0aW9uIDE1MG1zIHJldmVyc2UgYmFja3dhcmRzOydcclxuICAgICAgICAsIDE1MCk7XHJcblxyXG4gICAgICAgIHNob3dUYXNrc09mUHJvamVjdChwcm9qZWN0QnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB1c2VkIHRvIGhpZGUgdGFza3Mgb2YgYSBwcm9qZWN0LCBieSBjbGlja2luZyBpbiB0aGUgcHJvamVjdCBuYW1lIChpZiBvcGVuKVxyXG4gICAgZnVuY3Rpb24gaGlkZVRhc2tzT2ZQcm9qZWN0KGJ1dHRvbil7XHJcbiAgICAgICAgY29uc3QgcGFyZW50UHJvamVjdCA9IGJ1dHRvbi5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHRhc2tzT2ZQcm9qZWN0ID0gcGFyZW50UHJvamVjdC5sYXN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIHRhc2tzT2ZQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSAnYW5pbWF0aW9uOiBkZWxheUFzaWRlIDMwMG1zIHJldmVyc2UgZm9yd2FyZHM7JztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRhc2tzT2ZQcm9qZWN0LnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTogbm9uZTsnLCAzMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHVzZWQgdG8gc2hvdyB0YXNrcyBvZiBhIHByb2plY3QsIGJ5IGNsaWNraW5nIGluIHRoZSBwcm9qZWN0IG5hbWUgKGlmIGNsb3NlZClcclxuICAgIGZ1bmN0aW9uIHNob3dUYXNrc09mUHJvamVjdChidXR0b24pe1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFByb2plY3QgPSBidXR0b24ucGFyZW50RWxlbWVudDtcclxuICAgICAgICBjb25zdCB0YXNrc09mUHJvamVjdCA9IHBhcmVudFByb2plY3QubGFzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICB0YXNrc09mUHJvamVjdC5zdHlsZS5jc3NUZXh0ID0gJ2FuaW1hdGlvbjogZGVsYXlBc2lkZSAzMDBtcyBmb3J3YXJkczsnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGFza3NPZlByb2plY3Quc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OiBmbGV4OycsIDMwMCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdEJ5SWQsIHVwZGF0ZUV4aXN0ZW50UHJvamVjdCB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBidXR0b25XaXRoSW1nLCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRQcm9qZWN0SGFuZGxlcihwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbWFpbl8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHByb2plY3RIZWFkZXIgPSBwcm9qZWN0V3JhcHBlci5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC1oZWFkZXInKTtcclxuICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdFdyYXBwZXIucXVlcnlTZWxlY3RvcignLnByb2plY3QtbmFtZScpO1xyXG4gICAgY29uc3QgcHJvamVjdEJ1dHRvbnMgPSBwcm9qZWN0TmFtZS5uZXh0RWxlbWVudFNpYmxpbmc7IFxyXG4gICAgcHJvamVjdEJ1dHRvbnMuc3R5bGUuY3NzVGV4dCA9ICdvcGFjaXR5OiAwJzsgLy8gSGlkZSB0aGUgcHJvamVjdCBidXR0b25zIChlZGl0IGFuZCBkZWxldGUgaWNvbnMpXHJcbiAgICBcclxuICAgIGNvbnN0IG9sZFByb2plY3ROYW1lID0gcHJvamVjdE5hbWUudGV4dENvbnRlbnQ7IC8vIFVzZWQgaW4gY2FzZSBvZiB1c2VyIGNhbmNlbCB0aGUgdGl0bGUgZWRpdFxyXG4gICAgcHJvamVjdE5hbWUuc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCAndHJ1ZScpO1xyXG4gICAgcHJvamVjdE5hbWUuc3R5bGUuY3NzVGV4dCA9ICdib3JkZXI6IDFweCBzb2xpZCBibGFjazsnO1xyXG4gICAgcHJvamVjdE5hbWUuZm9jdXMoKTtcclxuXHJcbiAgICBjb25zdCBjb25maXJtQnV0dG9uID0gYnV0dG9uV2l0aEltZygnY29uZmlybS1wcm9qZWN0LW5hbWUnLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvc2VsZWN0ZWQtaWNvbi0yOC5zdmcnKTtcclxuICAgIGNvbmZpcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aXRsZUVkaXRIYW5kbGVyKHByb2plY3ROYW1lLCBwcm9qZWN0QnV0dG9ucywgcHJvamVjdElkKSk7XHJcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBidXR0b25XaXRoSW1nKCdjb25maXJtLXByb2plY3QtbmFtZScsICcvZGlzdC9hc3NldHMvbWFpbi1pY29ucy9jYW5jZWwtaWNvbi0yOC5zdmcnKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZVRpdGxlRWRpdChwcm9qZWN0TmFtZSwgcHJvamVjdEJ1dHRvbnMsIG9sZFByb2plY3ROYW1lKSk7XHJcbiAgICBjb25zdCB3cmFwcGVyQnV0dG9ucyA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50Q2xhc3M6ICdlZGl0LXByb2plY3QtYnV0dG9ucyd9KTtcclxuICAgIHdyYXBwZXJCdXR0b25zLmFwcGVuZChjb25maXJtQnV0dG9uLCBjYW5jZWxCdXR0b24pO1xyXG5cclxuICAgIHByb2plY3RIZWFkZXIuaW5zZXJ0QmVmb3JlKHdyYXBwZXJCdXR0b25zLCBwcm9qZWN0TmFtZS5uZXh0RWxlbWVudFNpYmxpbmcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aXRsZUVkaXRIYW5kbGVyKG5hbWVFbGVtZW50LCBwcm9qZWN0QnV0dG9ucywgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IG5ld1RpdGxlID0gbmFtZUVsZW1lbnQudGV4dENvbnRlbnQ7XHJcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkKTtcclxuICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpO1xyXG4gICAgcHJvamVjdE9iamVjdC5zZXRUaXRsZShuZXdUaXRsZSk7XHJcbiAgICB1cGRhdGVFeGlzdGVudFByb2plY3QocHJvamVjdE9iamVjdCk7XHJcbiAgICB1cGRhdGVQcm9qZWN0RWxlbWVudChuZXdUaXRsZSwgcHJvamVjdElkKTtcclxuICAgIHJlbW92ZVRpdGxlRWRpdChuYW1lRWxlbWVudCwgcHJvamVjdEJ1dHRvbnMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVQcm9qZWN0RWxlbWVudChuZXdUaXRsZSwgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IHByb2plY3RBc2lkZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRpdGxlQXNpZGVTZWN0aW9uID0gcHJvamVjdEFzaWRlLnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0Jyk7XHJcbiAgICBjb25zdCBwcm9qZWN0VGl0bGVBc2lkZSA9IHRpdGxlQXNpZGVTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3AnKTtcclxuICAgIHByb2plY3RUaXRsZUFzaWRlLnRleHRDb250ZW50ID0gbmV3VGl0bGU7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdE1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgbWFpbl8ke3Byb2plY3RJZH1gKTtcclxuICAgIGNvbnN0IHRpdGxlTWFpblNlY3Rpb24gPSBwcm9qZWN0TWFpbi5xdWVyeVNlbGVjdG9yKCcucHJvamVjdC1uYW1lJyk7XHJcbiAgICB0aXRsZU1haW5TZWN0aW9uLnRleHRDb250ZW50ID0gbmV3VGl0bGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVRpdGxlRWRpdChlbGVtZW50LCBwcm9qZWN0QnV0dG9ucywgb2xkRWxlbWVudE5hbWUpe1xyXG4gICAgaWYob2xkRWxlbWVudE5hbWUpXHJcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IG9sZEVsZW1lbnROYW1lO1xyXG5cclxuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnKTtcclxuICAgIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdib3JkZXItY29sb3I6IHRyYW5zcGFyZW50Oyc7XHJcbiAgICBwcm9qZWN0QnV0dG9ucy5zdHlsZS5jc3NUZXh0ID0gJ29wYWNpdHk6IDEnO1xyXG4gICAgXHJcbiAgICBjb25zdCBlbGVtZW50UGFyZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgZWxlbWVudFBhcmVudC5yZW1vdmVDaGlsZChlbGVtZW50Lm5leHRFbGVtZW50U2libGluZyk7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdEJ5SWQgfSBmcm9tIFwiLi4vYXBwLWxvZ2ljL3N0b3JhZ2UuanNcIjtcclxuaW1wb3J0IHsgYnV0dG9uV2l0aEltZywgY2xlYW5Qcm9qZWN0SWQsIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUsIGNyZWF0ZUNvbW1vblRhc2tGb3JtLCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2NvbW1vbkZ1bmN0aW9ucy5qc1wiO1xyXG5pbXBvcnQgeyBlZGl0UHJvamVjdEhhbmRsZXIgfSBmcm9tIFwiLi9wcm9qZWN0RWRpdC5qc1wiO1xyXG5pbXBvcnQgeyByZW1vdmVQcm9qZWN0SGFuZGxlciB9IGZyb20gXCIuL3Byb2plY3RSZW1vdmUuanNcIjtcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyBuZXdUYXNrRm9ybSB9IGZyb20gXCIuL3Rhc2tDcmVhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBlZGl0VGFza0Zvcm0gfSBmcm9tIFwiLi90YXNrRWRpdC5qc1wiO1xyXG5pbXBvcnQgeyBleHBhbmRUYXNrc0luZm8gfSBmcm9tIFwiLi90YXNrRXhwYW5kLmpzXCI7XHJcbmltcG9ydCB7IGRlbGV0ZVRhc2tGcm9tUHJvamVjdCB9IGZyb20gXCIuL3Rhc2tSZW1vdmUuanNcIjtcclxuXHJcbi8vIEV4cGFuZCBhIHByb2plY3QgaW4gdGhlIG1haW4tY29udGVudCBkaXYgKG5vdCB5ZXQgaW1wbGVtZW50ZWQpXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRQcm9qZWN0VGFza3MoYnV0dG9uVGhhdFRyaWdnZXJlZCl7XHJcbiAgICBjb25zdCBzZWxlY3RlZFByb2plY3REaXZQYXJlbnQgPSBidXR0b25UaGF0VHJpZ2dlcmVkLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIGxldCBwYXJlbnRQcm9qZWN0Q2xlYW5JZCA9IGNsZWFuUHJvamVjdElkKHNlbGVjdGVkUHJvamVjdERpdlBhcmVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiB0aGUgcHJvamVjdCBleGlzdHNcclxuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0QnlJZChwYXJlbnRQcm9qZWN0Q2xlYW5JZCk7XHJcbiAgICBcclxuICAgIGlmKHByb2plY3Qpe1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpOyAvLyBJZiBwcm9qZWN0cyBleGlzdHMsIGNyZWF0ZSBhIFwibmV3XCIgb2JqZWN0IGJhc2VkIG9uIGhpbSwgdG8gYmUgYWJsZSB0byBtYW5pcHVsYXRlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBwcm9qZWN0IGV4cGFuZGVkIGZyb20gYXNpZGUgYW5kIGRpc3BsYXkgaXQgaW4gdGhlICNtYWluLWNvbnRlbnQgZWxlbWVudFxyXG4gICAgICAgIGNvbnN0IHByb2plY3RNYWluRWxlbWVudCA9IGNyZWF0ZVByb2plY3RNYWluKHByb2plY3RPYmplY3QpO1xyXG4gICAgICAgIGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUocHJvamVjdE1haW5FbGVtZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQ3JlYXRlIGEgSFRNTCBwcm9qZWN0IGVsZW1lbnQgdG8gcGxhY2UgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb2plY3RNYWluKHByb2plY3Qpe1xyXG4gICAgY29uc3QgcHJvamVjdElkID0gcHJvamVjdC5nZXRQcm9qZWN0SWQoKTtcclxuICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdC5nZXRUaXRsZSgpO1xyXG4gICAgY29uc3QgcHJvamVjdFRhc2tzID0gcHJvamVjdC5nZXRBbGxUYXNrcygpO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3ROYW1lSDMgPSBjcmVhdGVFbGVtZW50KCdoMycsIHtlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LW5hbWUnLCBlbGVtZW50VGV4dDogYCR7cHJvamVjdE5hbWV9YH0pO1xyXG4gICAgY29uc3QgZWRpdEJ1dHRvbiA9IGJ1dHRvbldpdGhJbWcoJ2VkaXQtcHJvamVjdCcsICcvZGlzdC9hc3NldHMvbWFpbi1pY29ucy9lZGl0LWljb24tMjYuc3ZnJyk7XHJcbiAgICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZWRpdFByb2plY3RIYW5kbGVyKHByb2plY3RJZCkpO1xyXG4gICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYnV0dG9uV2l0aEltZygncmVtb3ZlLXByb2plY3QnLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvdHJhc2gtaWNvbi0yOC5zdmcnKTtcclxuICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJlbW92ZVByb2plY3RIYW5kbGVyKHByb2plY3RJZCkpO1xyXG4gICAgY29uc3QgcHJvamVjdEJ1dHRvbnMgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdC1idXR0b25zJ30pO1xyXG4gICAgcHJvamVjdEJ1dHRvbnMuYXBwZW5kKGVkaXRCdXR0b24sIHJlbW92ZUJ1dHRvbik7XHJcbiAgICBjb25zdCBwcm9qZWN0SGVhZGVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge2VsZW1lbnRDbGFzczogJ3Byb2plY3QtaGVhZGVyJ30pO1xyXG4gICAgcHJvamVjdEhlYWRlci5hcHBlbmQocHJvamVjdE5hbWVIMywgcHJvamVjdEJ1dHRvbnMpO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3RUYXNrc1dyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAncHJvamVjdC10YXNrcy1tYWluJ30pO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIGFuIEhUTUwgZWxlbWVudCBmb3IgZWFjaCBleGlzdGVudCB0YXNrXHJcbiAgICBBcnJheS5mcm9tKHByb2plY3RUYXNrcykubWFwKHRhc2sgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhc2tFbGVtZW50ID0gY3JlYXRlVGFza0VsZW1lbnRNYWluKHRhc2ssIHByb2plY3RJZCk7XHJcbiAgICAgICAgcHJvamVjdFRhc2tzV3JhcHBlci5hcHBlbmRDaGlsZCh0YXNrRWxlbWVudCk7IC8vIEFwcGVuZCB0byB0aGUgbGlzdCB0aGF0IGNvbnRhaW5zIGFsbCB0YXNrc1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vIEJ1dHRvbiB0byBhZGQgYSBuZXcgdGFzayB0byB0aGUgcHJvamVjdFxyXG4gICAgY29uc3QgbmV3VGFza0J1dHRvbiA9IGJ1dHRvbldpdGhJbWcoJ2FkZC10YXNrJywgJy9kaXN0L2Fzc2V0cy9tYWluLWljb25zL3BsdXMtaWNvbi10YXNrLWFkZC5zdmcnLCAnQWRkIG5ldyB0YXNrJyk7XHJcbiAgICBuZXdUYXNrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGxldCB0YXNrRm9ybSA9IGNyZWF0ZUNvbW1vblRhc2tGb3JtKCk7XHJcbiAgICAgICAgbmV3VGFza0Zvcm0odGFza0Zvcm0sIHByb2plY3RJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBcHBlbmQgYWxsIGVsZW1lbnRzIHRvIHRoZSBwcm9qZWN0IHdyYXBwZXIgKGhvbGQgYWxsIHRhc2tzIGFuZCBpbmZvcyBvZiBhIHNpbmdsZSBwcm9qZWN0KVxyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudElkOiBgbWFpbl8ke3Byb2plY3RJZH1gLCBlbGVtZW50Q2xhc3M6ICdwcm9qZWN0LXdyYXBwZXInfSk7XHJcbiAgICBwcm9qZWN0V3JhcHBlci5hcHBlbmQocHJvamVjdEhlYWRlciwgcHJvamVjdFRhc2tzV3JhcHBlciwgbmV3VGFza0J1dHRvbik7XHJcblxyXG4gICAgcmV0dXJuIHByb2plY3RXcmFwcGVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGFza0VsZW1lbnRNYWluKHRhc2ssIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB0YXNrV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50SWQ6IGBtYWluXyR7dGFzay5nZXRUYXNrSWQoKX1gLCBlbGVtZW50Q2xhc3M6ICd0YXNrLW1haW4nfSk7XHJcblxyXG4gICAgLy8gTGVmdCBzaWRlIG9mIGEgdGFzayBkaXNwbGF5ZWQgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuICAgIGNvbnN0IGxlZnRTaWRlV3JhcHBlciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtlbGVtZW50Q2xhc3M6ICd0YXNrLWxlZnQtc2lkZSd9KTtcclxuICAgIGNvbnN0IHByaW9yaXR5QnV0dG9uID0gY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge2VsZW1lbnRDbGFzczogYHRhc2stcHJpb3JpdHktbWFpbiAke3Rhc2suZ2V0UHJpb3JpdHkoKX1gfSk7XHJcbiAgICBjb25zdCB0YXNrTmFtZUFuZER1ZURhdGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAndGFzay1uYW1lLWFuZC1kYXRlJ30pO1xyXG4gICAgY29uc3QgdGFza05hbWUgPSBjcmVhdGVFbGVtZW50KCdwJywge2VsZW1lbnRDbGFzczogJ3Rhc2stbmFtZScsIGVsZW1lbnRUZXh0OiBgJHt0YXNrLmdldE5hbWUoKX1gfSk7XHJcbiAgICBjb25zdCB0YXNrRHVlRGF0ZSA9IGNyZWF0ZUVsZW1lbnQoJ3AnLCB7ZWxlbWVudENsYXNzOiAndGFzay1kdWUtZGF0ZScsIGVsZW1lbnRUZXh0OiBgJHt0YXNrLmdldER1ZURhdGUoKX1gfSk7XHJcbiAgICB0YXNrTmFtZUFuZER1ZURhdGUuYXBwZW5kKHRhc2tOYW1lLCB0YXNrRHVlRGF0ZSk7XHJcbiAgICBsZWZ0U2lkZVdyYXBwZXIuYXBwZW5kKHByaW9yaXR5QnV0dG9uLCB0YXNrTmFtZUFuZER1ZURhdGUpO1xyXG4gICAgXHJcbiAgICAvLyBSaWdodCBzaWRlIChidXR0b25zIHRvIGNoYW5nZSBzdGF0ZSBvZiBhIHRhc2spIG9mIGEgdGFzayBkaXNwbGF5ZWQgaW4gdGhlICNtYWluLWNvbnRlbnRcclxuICAgIGNvbnN0IHJpZ2h0U2lkZVdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7ZWxlbWVudENsYXNzOiAndGFzay1yaWdodC1zaWRlJ30pO1xyXG4gICAgY29uc3QgZXhwYW5kQnV0dG9uID0gYnV0dG9uV2l0aEltZygnZXhwYW5kLXRhc2snLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvZXllLWljb24ucG5nJyk7XHJcbiAgICBleHBhbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHRhc2tGb3JtID0gY3JlYXRlQ29tbW9uVGFza0Zvcm0oKTtcclxuICAgICAgICBleHBhbmRUYXNrc0luZm8odGFzaywgcHJvamVjdElkLCB0YXNrRm9ybSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBidXR0b25XaXRoSW1nKCdlZGl0LXRhc2snLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvZWRpdC1pY29uLnN2ZycpO1xyXG4gICAgZWRpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBsZXQgdGFza0Zvcm0gPSBjcmVhdGVDb21tb25UYXNrRm9ybSgpO1xyXG4gICAgICAgIGVkaXRUYXNrRm9ybSh0YXNrLCBwcm9qZWN0SWQsIHRhc2tGb3JtKTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gYnV0dG9uV2l0aEltZygnZGVsZXRlLXRhc2snLCAnL2Rpc3QvYXNzZXRzL21haW4taWNvbnMvcmVtb3ZlLWljb24uc3ZnJyk7XHJcbiAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBkZWxldGVUYXNrRnJvbVByb2plY3QodGFzaywgcHJvamVjdElkKSk7XHJcbiAgICByaWdodFNpZGVXcmFwcGVyLmFwcGVuZChleHBhbmRCdXR0b24sIGVkaXRCdXR0b24sIHJlbW92ZUJ1dHRvbik7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRvIHRoZSB0YXNrIHdyYXBwZXJcclxuICAgIHRhc2tXcmFwcGVyLmFwcGVuZChsZWZ0U2lkZVdyYXBwZXIsIHJpZ2h0U2lkZVdyYXBwZXIpO1xyXG5cclxuICAgIHJldHVybiB0YXNrV3JhcHBlcjtcclxufSIsImltcG9ydCB7IHJlbW92ZVByb2plY3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUHJvamVjdEhhbmRsZXIocHJvamVjdElkKXtcclxuICAgIGNvbnN0IG1haW5Db250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpO1xyXG4gICAgY29uc3QgcHJvamVjdE1haW5Ub1JlbW92ZSA9IG1haW5Db250ZW50LnF1ZXJ5U2VsZWN0b3IoYCNtYWluXyR7cHJvamVjdElkfWApO1xyXG4gICAgbWFpbkNvbnRlbnQucmVtb3ZlQ2hpbGQocHJvamVjdE1haW5Ub1JlbW92ZSk7XHJcblxyXG4gICAgY29uc3QgYXNpZGVQcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC1wcm9qZWN0cy11c2VyJyk7XHJcbiAgICBjb25zdCBwcm9qZWN0QXNpZGVUb1JlbW92ZSA9IGFzaWRlUHJvamVjdHNMaXN0LnF1ZXJ5U2VsZWN0b3IoYCNhc2lkZV8ke3Byb2plY3RJZH1gKTtcclxuICAgIGFzaWRlUHJvamVjdHNMaXN0LnJlbW92ZUNoaWxkKHByb2plY3RBc2lkZVRvUmVtb3ZlKTtcclxuXHJcbiAgICByZW1vdmVQcm9qZWN0U3RvcmFnZShwcm9qZWN0SWQpO1xyXG59IiwiaW1wb3J0IFByb2plY3QgZnJvbSBcIi4uL2FwcC1sb2dpYy9wcm9qZWN0LmpzXCI7XHJcbmltcG9ydCBUYXNrIGZyb20gXCIuLi9hcHAtbG9naWMvdGFzay5qc1wiO1xyXG5pbXBvcnQgeyB1cGRhdGVFeGlzdGVudFByb2plY3QsIGdlbmVyYXRlTmV3VGFza0lkLCBnZXRQcm9qZWN0QnlJZCB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBnZXRUYXNrRWxlbWVudHMsIHJlbW92ZUVtcHR5SGludCwgdGFza0Zvcm1EYXRhSGFuZGxlciB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuaW1wb3J0IHsgYXBwZW5kVG9Nb2RhbCwgcmVtb3ZlRnJvbU1vZGFsIH0gZnJvbSBcIi4vbW9kYWwuanNcIjtcclxuaW1wb3J0IHsgY3JlYXRlVGFza0VsZW1lbnRBc2lkZSB9IGZyb20gXCIuL3Byb2plY3RBc2lkZS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVUYXNrRWxlbWVudE1haW4gfSBmcm9tIFwiLi9wcm9qZWN0TWFpbi5qc1wiO1xyXG5cclxuLy8gRnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSBmb3JtIHRvIGNyZWF0ZSBhIG5ldyB0YXNrLCBpbnNpZGUgYW4gZXhpc3RlbnQgcHJvamVjdFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBuZXdUYXNrRm9ybShmb3JtLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgZm9ybVRpdGxlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1oZWFkZXInKTtcclxuICAgIGZvcm1UaXRsZS50ZXh0Q29udGVudCA9ICdBZGQgYSBuZXcgdGFzayc7XHJcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdGFzaycpO1xyXG4gICAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gbmV3VGFza0hhbmRsZXIoZm9ybSwgcHJvamVjdElkKSk7XHJcbiAgICBhcHBlbmRUb01vZGFsKGZvcm0pO1xyXG59XHJcblxyXG4vLyBJZiB1c2VyIGNsaWNrcyBvbiB0aGUgYWRkIHRhc2sgYnV0dG9uLCB0aGUgaW5mbyB0aGF0IGNvbWVzIGZyb20gdGhlIGZvcm0gaXMgaGFuZGxlZFxyXG5mdW5jdGlvbiBuZXdUYXNrSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgdGFza1BhcmFtZXRlcnMgPSB0YXNrRm9ybURhdGFIYW5kbGVyKGZvcm0sIHByb2plY3RJZCk7XHJcbiAgICBcclxuICAgIGlmKHRhc2tQYXJhbWV0ZXJzKXtcclxuICAgICAgICBjb25zdCBuZXdUYXNrID0gc2F2ZVRhc2tUb1Byb2plY3QodGFza1BhcmFtZXRlcnMsIHByb2plY3RJZCk7XHJcbiAgICAgICAgY3JlYXRlVGFza0VsZW1lbnQobmV3VGFzaywgcHJvamVjdElkKTtcclxuICAgICAgICByZW1vdmVGcm9tTW9kYWwoZm9ybSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdldCBwcm9qZWN0IGZyb20gc3RvcmFnZSBhbmQgdHJhbnNmb3JtIGhpbSBpbiBhIHByb2plY3Qgb2JqZWN0IHRvIHN0b3JlIHRoZSBuZXcgdGFzayBpbnNpZGUgb2YgaXQgdmlhIHRoZSBtZXRob2QgYWRkVGFza1RvUHJvamVjdCgpXHJcbmZ1bmN0aW9uIHNhdmVUYXNrVG9Qcm9qZWN0KHRhc2tQYXJhbWV0ZXJzLCBwYXJlbnRQcm9qZWN0SWQpe1xyXG4gICAgbGV0IHRhc2tfbmFtZSwgZHVlX2RhdGUsIGRlc2NyaXB0aW9uLCBwcmlvcml0eTtcclxuICAgIFt7dGFza19uYW1lfSwge2R1ZV9kYXRlfSwge2Rlc2NyaXB0aW9ufSwge3ByaW9yaXR5fV0gPSB0YXNrUGFyYW1ldGVycztcclxuXHJcbiAgICAvLyBDaGVja3MgaWYgdGhlIHByb2plY3QgZXhpc3RzXHJcbiAgICBjb25zdCBwcm9qZWN0RnJvbVN0b3JhZ2UgPSBnZXRQcm9qZWN0QnlJZChwYXJlbnRQcm9qZWN0SWQpO1xyXG5cclxuICAgIGlmKHByb2plY3RGcm9tU3RvcmFnZSl7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdEZyb21TdG9yYWdlKTtcclxuICAgICAgICBjb25zdCBuZXdUYXNrID0gVGFzayh0YXNrX25hbWUsIGR1ZV9kYXRlLCBkZXNjcmlwdGlvbiwgcHJpb3JpdHksIGdlbmVyYXRlTmV3VGFza0lkKHByb2plY3RPYmplY3QpKTtcclxuICAgICAgICBcclxuICAgICAgICBwcm9qZWN0T2JqZWN0LmFkZFRhc2tUb1Byb2plY3QobmV3VGFzayk7XHJcbiAgICAgICAgdXBkYXRlRXhpc3RlbnRQcm9qZWN0KHByb2plY3RPYmplY3QpOyAvLyBVcGRhdGUgdGhlIHByb2plY3QgaW4gdGhlIHN0b3JhZ2Ugd2l0aCB0aGUgbmV3IHRhc2tcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1Rhc2s7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdlbmVyYXRlIGEgbmV3IHRhc2sgZWxlbWVudCBpbiBib3RoIHBhcmVudCBwcm9qZWN0IHNlY3Rpb25zIChhc2lkZSBhbmQgbWFpbi1jb250ZW50KVxyXG5mdW5jdGlvbiBjcmVhdGVUYXNrRWxlbWVudCh0YXNrLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3Qge3Rhc2tMaXN0QXNpZGUsIHRhc2tMaXN0TWFpbn0gPSBnZXRUYXNrRWxlbWVudHModGFzaywgcHJvamVjdElkKTtcclxuXHJcbiAgICBpZih0YXNrTGlzdEFzaWRlLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA9PT0gJ3Byb2plY3QtZW1wdHktaGludCcpIFxyXG4gICAgICAgIHJlbW92ZUVtcHR5SGludCh0YXNrTGlzdEFzaWRlKTtcclxuXHJcbiAgICAvLyBQbGFjZSB0aGUgbmV3IGVsZW1lbnQgd2l0aGluIHRoZSBwcm9qZWN0IGluIHRoZSBhc2lkZVxyXG4gICAgY29uc3QgdGFza0VsZW1lbnRBc2lkZSA9IGNyZWF0ZVRhc2tFbGVtZW50QXNpZGUodGFzayk7XHJcbiAgICB0YXNrTGlzdEFzaWRlLmFwcGVuZENoaWxkKHRhc2tFbGVtZW50QXNpZGUpO1xyXG5cclxuICAgIC8vIFBsYWNlIHRoZSBuZXcgZWxlbWVudCB3aXRoaW4gdGhlIHByb2plY3QgaW4gdGhlIG1haW4tY29udGVudFxyXG4gICAgY29uc3QgdGFza0VsZW1lbnRNYWluID0gY3JlYXRlVGFza0VsZW1lbnRNYWluKHRhc2ssIHByb2plY3RJZCk7XHJcbiAgICB0YXNrTGlzdE1haW4uYXBwZW5kQ2hpbGQodGFza0VsZW1lbnRNYWluKTtcclxufVxyXG4iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgdXBkYXRlRXhpc3RlbnRQcm9qZWN0LCBnZXRQcm9qZWN0QnlJZCwgZ2V0UHJvamVjdExpc3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGdldFRhc2tFbGVtZW50cywgdGFza0Zvcm1EYXRhSGFuZGxlciB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuaW1wb3J0IHsgYXBwZW5kVG9Nb2RhbCwgcmVtb3ZlRnJvbU1vZGFsIH0gZnJvbSBcIi4vbW9kYWwuanNcIjtcclxuaW1wb3J0IHsgY3JlYXRlVGFza0VsZW1lbnRBc2lkZSB9IGZyb20gXCIuL3Byb2plY3RBc2lkZS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVUYXNrRWxlbWVudE1haW4gfSBmcm9tIFwiLi9wcm9qZWN0TWFpbi5qc1wiO1xyXG5pbXBvcnQgeyBnZXRGaWx0ZXJlZFRhc2tzIH0gZnJvbSBcIi4vdG9kYXlUYXNrcy5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRUYXNrRm9ybSh0YXNrLCBwcm9qZWN0SWQsIGZvcm0pe1xyXG4gICAgY29uc3QgZm9ybVRpdGxlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1oZWFkZXInKTtcclxuICAgIGZvcm1UaXRsZS50ZXh0Q29udGVudCA9ICdFZGl0IHRhc2snO1xyXG5cclxuICAgIGNvbnN0IHRhc2tJbnB1dE5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyN0YXNrLW5hbWUtaW5wdXQnKTtcclxuICAgIHRhc2tJbnB1dE5hbWUuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGAke3Rhc2suZ2V0TmFtZSgpfWApO1xyXG5cclxuICAgIGNvbnN0IHRhc2tJbnB1dER1ZURhdGU9IGZvcm0ucXVlcnlTZWxlY3RvcignI2R1ZS1kYXRlLWlucHV0Jyk7XHJcbiAgICBpZih0YXNrLmdldER1ZURhdGUoKSA9PT0gJ25vbmUnKXtcclxuICAgICAgICB0YXNrSW5wdXREdWVEYXRlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0YXNrSW5wdXREdWVEYXRlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBgJHt0YXNrLmdldER1ZURhdGUoKX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0YXNrSW5wdXREZXNjcmlwdGlvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignI2Rlc2NyaXB0aW9uLWlucHV0Jyk7XHJcbiAgICB0YXNrSW5wdXREZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IGAke3Rhc2suZ2V0RGVzY3JpcHRpb24oKX1gO1xyXG5cclxuICAgIGNvbnN0IHRhc2tQcmlvcml0eSA9IHRhc2suZ2V0UHJpb3JpdHkoKTtcclxuICAgIGNvbnN0IGZvcm1Qcmlvcml0aWVzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiW25hbWU9J3ByaW9yaXR5J11cIik7XHJcbiAgICBBcnJheS5mcm9tKGZvcm1Qcmlvcml0aWVzKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSB0YXNrUHJpb3JpdHkpXHJcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcjYWRkLXRhc2snKTtcclxuICAgIHN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICdFZGl0IHRhc2snO1xyXG4gICAgc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZWRpdFRhc2tIYW5kbGVyKGZvcm0sIHByb2plY3RJZCkpO1xyXG5cclxuICAgIGNvbnN0IHRhc2tJZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRhc2tJZCwge1xyXG4gICAgICAgIGlkOiAndGFzay1pZCcsXHJcbiAgICAgICAgdHlwZTogJ2hpZGRlbicsXHJcbiAgICAgICAgbmFtZTogJ3Rhc2tfaWQnLFxyXG4gICAgICAgIHZhbHVlOiBgJHt0YXNrLmdldFRhc2tJZCgpfWBcclxuICAgIH0pO1xyXG5cclxuICAgIGZvcm0uYXBwZW5kQ2hpbGQodGFza0lkKTtcclxuICAgIGFwcGVuZFRvTW9kYWwoZm9ybSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVkaXRUYXNrSGFuZGxlcihmb3JtLCBwcm9qZWN0SWQpe1xyXG4gICAgY29uc3QgdGFza1BhcmFtZXRlcnMgPSB0YXNrRm9ybURhdGFIYW5kbGVyKGZvcm0sIHByb2plY3RJZCk7XHJcbiAgICBcclxuICAgIGlmKHRhc2tQYXJhbWV0ZXJzKXtcclxuICAgICAgICBjb25zdCBjaGFuZ2VkVGFzayA9IHNhdmVNb2RUYXNrVG9Qcm9qZWN0KHRhc2tQYXJhbWV0ZXJzLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHVwZGF0ZVRhc2tFbGVtZW50KGNoYW5nZWRUYXNrLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RhbChmb3JtKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZU1vZFRhc2tUb1Byb2plY3QodGFza1BhcmFtZXRlcnMsIHBhcmVudFByb2plY3RJZCl7XHJcbiAgICBsZXQgdGFza19pZCwgdGFza19uYW1lLCBkdWVfZGF0ZSwgZGVzY3JpcHRpb24sIHByaW9yaXR5O1xyXG4gICAgW3t0YXNrX25hbWV9LCB7ZHVlX2RhdGV9LCB7ZGVzY3JpcHRpb259LCB7cHJpb3JpdHl9LCB7dGFza19pZH1dID0gdGFza1BhcmFtZXRlcnM7XHJcblxyXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBwcm9qZWN0IGV4aXN0c1xyXG4gICAgY29uc3QgcHJvamVjdEZyb21TdG9yYWdlID0gZ2V0UHJvamVjdEJ5SWQocGFyZW50UHJvamVjdElkKTtcclxuXHJcbiAgICBpZihwcm9qZWN0RnJvbVN0b3JhZ2Upe1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3RGcm9tU3RvcmFnZSk7XHJcbiAgICAgICAgY29uc3QgdGFza1RvQ2hhbmdlID0gcHJvamVjdE9iamVjdC5nZXRUYXNrQnlJZCh0YXNrX2lkKTtcclxuICAgICAgICBcclxuICAgICAgICB0YXNrVG9DaGFuZ2Uuc2V0TmFtZSh0YXNrX25hbWUpO1xyXG4gICAgICAgIHRhc2tUb0NoYW5nZS5zZXREdWVEYXRlKGR1ZV9kYXRlKTtcclxuICAgICAgICB0YXNrVG9DaGFuZ2Uuc2V0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIHRhc2tUb0NoYW5nZS5zZXRQcmlvcml0eShwcmlvcml0eSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUV4aXN0ZW50UHJvamVjdChwcm9qZWN0T2JqZWN0KTsgLy8gVXBkYXRlIHRoZSBwcm9qZWN0IGluIHRoZSBzdG9yYWdlIHdpdGggdGhlIG1vZGlmaWVkIHRhc2sgXHJcblxyXG4gICAgICAgIHJldHVybiB0YXNrVG9DaGFuZ2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrSWZUb2RheU9yV2Vlaygpe1xyXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRlbnQnKTtcclxuICAgIGNvbnN0IHRvZGF5SWRlbnRpZmllciA9IG1haW4ucXVlcnlTZWxlY3RvcignI3RvZGF5LWhlYWRlcicpO1xyXG4gICAgY29uc3Qgd2Vla0lkZW50aWZpZXIgPSBtYWluLnF1ZXJ5U2VsZWN0b3IoJyN3ZWVrLWhlYWRlcicpO1xyXG5cclxuICAgIGlmKG1haW4uZmlyc3RFbGVtZW50Q2hpbGQgPT09IHRvZGF5SWRlbnRpZmllcilcclxuICAgICAgICByZXR1cm4gJ3RvZGF5JztcclxuXHJcbiAgICBpZihtYWluLmZpcnN0RWxlbWVudENoaWxkID09PSB3ZWVrSWRlbnRpZmllcilcclxuICAgICAgICByZXR1cm4gJ3dlZWsnO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gVXBkYXRlIHRoZSBlbGVtZW50IGluIHRoZSBET00gd2l0aCB0aGUgbmV3IHZhbHVlcyAoYXNpZGUgYW5kIG1haW4gc2VjdGlvbnMpXHJcbmZ1bmN0aW9uIHVwZGF0ZVRhc2tFbGVtZW50KHRhc2ssIHByb2plY3RJZCl7XHJcbiAgICBjb25zdCB7dGFza0xpc3RBc2lkZSwgdGFza0FzaWRlLCB0YXNrTGlzdE1haW4sIHRhc2tNYWlufSA9IGdldFRhc2tFbGVtZW50cyh0YXNrLCBwcm9qZWN0SWQpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0YXNrIGVsZW1lbnQgd2l0aGluIHRoZSBwcm9qZWN0IGluIHRoZSBhc2lkZSAocmVtb3ZlIHRoZSBvbGQgdGFzayBhbmQgcGxhY2UgaXQgdGhlIG5ldylcclxuICAgIGNvbnN0IHVwZGF0ZWRBc2lkZVRhc2sgPSBjcmVhdGVUYXNrRWxlbWVudEFzaWRlKHRhc2spO1xyXG4gICAgdGFza0xpc3RBc2lkZS5pbnNlcnRCZWZvcmUodXBkYXRlZEFzaWRlVGFzaywgdGFza0FzaWRlKTtcclxuICAgIHRhc2tMaXN0QXNpZGUucmVtb3ZlQ2hpbGQodGFza0FzaWRlKTtcclxuXHJcbiAgICBjb25zdCBzZWN0aW9uVG9VcGRhdGUgPSBjaGVja0lmVG9kYXlPcldlZWsoKTtcclxuICAgIGlmKHNlY3Rpb25Ub1VwZGF0ZSl7XHJcbiAgICAgICAgZ2V0RmlsdGVyZWRUYXNrcyhgJHtzZWN0aW9uVG9VcGRhdGV9YCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBVcGRhdGUgdGFzayBlbGVtZW50IHdpdGhpbiB0aGUgcHJvamVjdCBpbiB0aGUgbWFpbi1jb250ZW50IChyZW1vdmUgdGhlIG9sZCB0YXNrIGFuZCBwbGFjZSBpdCB0aGUgbmV3KVxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRNYWluVGFzayA9IGNyZWF0ZVRhc2tFbGVtZW50TWFpbih0YXNrLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIHRhc2tMaXN0TWFpbi5pbnNlcnRCZWZvcmUodXBkYXRlZE1haW5UYXNrLCB0YXNrTWFpbik7XHJcbiAgICAgICAgdGFza0xpc3RNYWluLnJlbW92ZUNoaWxkKHRhc2tNYWluKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vY29tbW9uRnVuY3Rpb25zLmpzXCI7XHJcbmltcG9ydCB7IGFwcGVuZFRvTW9kYWwgfSBmcm9tIFwiLi9tb2RhbC5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZFRhc2tzSW5mbyh0YXNrLCBwcm9qZWN0SWQsIHRhc2tGb3JtKXtcclxuICAgIGNvbnN0IHRhc2tUaXRsZSA9IHRhc2suZ2V0TmFtZSgpO1xyXG4gICAgY29uc3QgdGFza0R1ZURhdGUgPSB0YXNrLmdldER1ZURhdGUoKTtcclxuICAgIGNvbnN0IHRhc2tEZXNjcmlwdGlvbiA9IHRhc2suZ2V0RGVzY3JpcHRpb24oKTtcclxuICAgIGxldCB0YXNrUHJpb3JpdHkgPSB0YXNrLmdldFByaW9yaXR5KCk7XHJcbiAgICB0YXNrUHJpb3JpdHkgPSB0YXNrUHJpb3JpdHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0YXNrUHJpb3JpdHkuc2xpY2UoMSk7XHJcblxyXG4gICAgY29uc3QgZm9ybVRpdGxlID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignLmZvcm0taGVhZGVyJyk7XHJcbiAgICBmb3JtVGl0bGUudGV4dENvbnRlbnQgPSBgJHt0YXNrVGl0bGV9YDtcclxuICAgIHRhc2tGb3JtLnJlbW92ZUNoaWxkKGZvcm1UaXRsZS5uZXh0RWxlbWVudFNpYmxpbmcpOyAvLyBSZW1vdmUgdGhlIHRhc2sgbmFtZSBpbnB1dFxyXG5cclxuICAgIGNvbnN0IGZvcm1EdWVEYXRlID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignI2R1ZS1kYXRlLWlucHV0Jyk7XHJcbiAgICBmb3JtRHVlRGF0ZS52YWx1ZSA9IGAke3Rhc2tEdWVEYXRlfWA7XHJcbiAgICBmb3JtRHVlRGF0ZS5yZWFkT25seSA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgZm9ybURlc2NyaXB0aW9uID0gdGFza0Zvcm0ucXVlcnlTZWxlY3RvcignI2Rlc2NyaXB0aW9uLWlucHV0Jyk7XHJcbiAgICBmb3JtRGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBgJHt0YXNrRGVzY3JpcHRpb259YDtcclxuICAgIGZvcm1EZXNjcmlwdGlvbi5yZWFkT25seSA9IHRydWU7XHJcbiAgICBmb3JtRGVzY3JpcHRpb24uc3R5bGUuY3NzVGV4dCA9ICdyZXNpemU6IG5vbmUnO1xyXG5cclxuICAgIGNvbnN0IGZvcm1Qcmlvcml0eSA9IHRhc2tGb3JtLnF1ZXJ5U2VsZWN0b3IoJ2ZpZWxkc2V0Jyk7XHJcbiAgICB3aGlsZShmb3JtUHJpb3JpdHkuY2hpbGRyZW4ubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgZm9ybVByaW9yaXR5LnJlbW92ZUNoaWxkKGZvcm1Qcmlvcml0eS5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHByaW9yaXR5VGV4dCA9IGNyZWF0ZUVsZW1lbnQoJ3AnLCB7ZWxlbWVudFRleHQ6IGAke3Rhc2tQcmlvcml0eX1gfSk7XHJcbiAgICBmb3JtUHJpb3JpdHkuYXBwZW5kQ2hpbGQocHJpb3JpdHlUZXh0KTtcclxuXHJcbiAgICBjb25zdCBjYW5jZWxCdXR0b24gPSB0YXNrRm9ybS5xdWVyeVNlbGVjdG9yKCcjY2FuY2VsLXRhc2snKTtcclxuICAgIGNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdHbyBiYWNrJztcclxuICAgIGNhbmNlbEJ1dHRvbi5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNhbmNlbEJ1dHRvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcclxuICAgIGNhbmNlbEJ1dHRvbi5wYXJlbnRFbGVtZW50LnN0eWxlLmNzc1RleHQgPSAnanVzdGlmeS1jb250ZW50OiBmbGV4LWVuZCc7XHJcblxyXG4gICAgYXBwZW5kVG9Nb2RhbCh0YXNrRm9ybSk7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgdXBkYXRlRXhpc3RlbnRQcm9qZWN0LCBnZXRQcm9qZWN0QnlJZCB9IGZyb20gXCIuLi9hcHAtbG9naWMvc3RvcmFnZS5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVFbXB0eUhpbnQsIGdldFRhc2tFbGVtZW50cyB9IGZyb20gXCIuLi9jb21tb25GdW5jdGlvbnMuanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVUYXNrRnJvbVByb2plY3QodGFzaywgcHJvamVjdElkKXtcclxuICAgIGNvbnN0IHt0YXNrTGlzdEFzaWRlLCB0YXNrQXNpZGUsIHRhc2tMaXN0TWFpbiwgdGFza01haW59ID0gZ2V0VGFza0VsZW1lbnRzKHRhc2ssIHByb2plY3RJZCk7XHJcblxyXG4gICAgdGFza0xpc3RBc2lkZS5yZW1vdmVDaGlsZCh0YXNrQXNpZGUpO1xyXG4gICAgdGFza0xpc3RNYWluLnJlbW92ZUNoaWxkKHRhc2tNYWluKTtcclxuXHJcbiAgICBpZih0YXNrTGlzdEFzaWRlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkgXHJcbiAgICAgICAgY3JlYXRlRW1wdHlIaW50KHRhc2tMaXN0QXNpZGUpO1xyXG5cclxuICAgIGlmKHRhc2tMaXN0TWFpbi5jaGlsZHJlbi5sZW5ndGggPT09IDApXHJcbiAgICAgICAgdXBkYXRlTWFpblRvZGF5KHByb2plY3RJZCk7XHJcblxyXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBwcm9qZWN0IGV4aXN0c1xyXG4gICAgY29uc3QgcHJvamVjdEZyb21TdG9yYWdlID0gZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkKTtcclxuXHJcbiAgICBpZihwcm9qZWN0RnJvbVN0b3JhZ2Upe1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3RGcm9tU3RvcmFnZSk7XHJcbiAgICAgICAgcHJvamVjdE9iamVjdC5yZW1vdmVUYXNrRnJvbVByb2plY3QodGFzay5nZXRUYXNrSWQoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdXBkYXRlRXhpc3RlbnRQcm9qZWN0KHByb2plY3RPYmplY3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBVcGRhdGUgbWFpbiBjb250ZW50IHdoZW4gdXNlciByZW1vdmUgYW55IHRhc2sgKG9mIGFueSBwcm9qZWN0KSBpbiB0aGUgdG9kYXkgc2VjdGlvblxyXG4vLyBFLmcgaWYgdGhlIHVzZXIgcmVtb3ZlcyBhIHRhc2sgb2YgYSBwcm9qZWN0IGFuZCB0aGlzIHByb2plY3QgZG9lc24ndCBoYXZlIG5vIG1vcmUgdGFza3MsIHJlbW92ZSBpdCBmcm9tIHRoZSBtYWluIGNvbnRlbnRcclxuZnVuY3Rpb24gdXBkYXRlTWFpblRvZGF5KHByb2plY3RJZCl7XHJcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tY29udGVudCcpO1xyXG4gICAgY29uc3QgcHJvamVjdFdyYXBwZXIgPSBtYWluLnF1ZXJ5U2VsZWN0b3IoYCNtYWluXyR7cHJvamVjdElkfWApO1xyXG4gICAgbWFpbi5yZW1vdmVDaGlsZChwcm9qZWN0V3JhcHBlcik7XHJcbn0iLCJpbXBvcnQgUHJvamVjdCBmcm9tIFwiLi4vYXBwLWxvZ2ljL3Byb2plY3QuanNcIjtcclxuaW1wb3J0IHsgZ2V0UHJvamVjdExpc3RTdG9yYWdlIH0gZnJvbSBcIi4uL2FwcC1sb2dpYy9zdG9yYWdlLmpzXCI7XHJcbmltcG9ydCB7IGNsZWFyTWFpbkFuZEFwcGVuZE5vZGUsIGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vY29tbW9uRnVuY3Rpb25zLmpzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVByb2plY3RNYWluIH0gZnJvbSBcIi4vcHJvamVjdE1haW4uanNcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJlZFRhc2tzKGFjdGlvbil7XHJcbiAgICBjb25zdCB1c2VyUHJvamVjdHMgPSBnZXRQcm9qZWN0TGlzdFN0b3JhZ2UoKTtcclxuICAgIGxldCB0YXNrc0ZpbHRlcmVkLCBwcm9qZWN0QW5kVGFza3NFbGVtZW50cywgaGVhZGVyU2VjdGlvbjtcclxuXHJcbiAgICBpZihhY3Rpb24gPT09ICd0b2RheScpe1xyXG4gICAgICAgIHRhc2tzRmlsdGVyZWQgPSBBcnJheS5mcm9tKHVzZXJQcm9qZWN0cylcclxuICAgICAgICAgICAgLm1hcChwcm9qZWN0ID0+IGdldFRvZGF5VGFza3MocHJvamVjdCkpXHJcbiAgICAgICAgICAgIC5maWx0ZXIocHJvamVjdCA9PiBwcm9qZWN0ICE9PSB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICBoZWFkZXJTZWN0aW9uID0gY3JlYXRlRWxlbWVudCgnaDMnLCB7ZWxlbWVudElkOiAndG9kYXktaGVhZGVyJywgZWxlbWVudFRleHQ6IGBUb2RheSdzIHRhc2tzYH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGFza3NGaWx0ZXJlZCA9IEFycmF5LmZyb20odXNlclByb2plY3RzKVxyXG4gICAgICAgICAgICAubWFwKHByb2plY3QgPT4gZ2V0V2Vla1Rhc2tzKHByb2plY3QpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHByb2plY3QgPT4gcHJvamVjdCAhPT0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgaGVhZGVyU2VjdGlvbiA9IGNyZWF0ZUVsZW1lbnQoJ2gzJywge2VsZW1lbnRJZDogJ3dlZWstaGVhZGVyJywgZWxlbWVudFRleHQ6IGBXZWVrIHRhc2tzYH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm9qZWN0QW5kVGFza3NFbGVtZW50cyA9IHRhc2tzRmlsdGVyZWQubWFwKHByb2plY3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2plY3RFbGVtZW50ID0gY3JlYXRlUHJvamVjdE1haW4ocHJvamVjdCk7XHJcbiAgICAgICAgcHJvamVjdEVsZW1lbnQucmVtb3ZlQ2hpbGQocHJvamVjdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10YXNrJykpO1xyXG4gICAgICAgIHJldHVybiBwcm9qZWN0RWxlbWVudDtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKHByb2plY3RBbmRUYXNrc0VsZW1lbnRzLmxlbmd0aCAhPT0gMClcclxuICAgICAgICBjbGVhck1haW5BbmRBcHBlbmROb2RlKHByb2plY3RBbmRUYXNrc0VsZW1lbnRzLCBoZWFkZXJTZWN0aW9uKTtcclxuICAgIGVsc2VcclxuICAgICAgICBjbGVhck1haW5BbmRBcHBlbmROb2RlKGhlYWRlclNlY3Rpb24pO1xyXG59XHJcblxyXG4vLyBHZXQgdG9kYXkncyB0YXNrcyBvZiBhIHByb2plY3QgYW5kIHJldHVybiB0aGVtIGluIGEgXCJuZXdcIiBwcm9qZWN0IG9iamVjdFxyXG5mdW5jdGlvbiBnZXRUb2RheVRhc2tzKHByb2plY3Qpe1xyXG4gICAgY29uc3QgcHJvamVjdE9iamVjdCA9IFByb2plY3QocHJvamVjdCk7XHJcbiAgICBwcm9qZWN0T2JqZWN0LmdldEFsbFRhc2tzKCkubWFwKHRhc2sgPT4ge1xyXG4gICAgICAgIGlmKCEodGFzay5nZXREdWVEYXRlKCkgPT09IG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlbi1DQScpKSl7XHJcbiAgICAgICAgICAgIHByb2plY3RPYmplY3QucmVtb3ZlVGFza0Zyb21Qcm9qZWN0KHRhc2suZ2V0VGFza0lkKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmKCEocHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpLmxlbmd0aCA9PT0gMCkpXHJcbiAgICAgICAgcmV0dXJuIHByb2plY3RPYmplY3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdlZWtUYXNrcyhwcm9qZWN0KXtcclxuICAgIGNvbnN0IHByb2plY3RPYmplY3QgPSBQcm9qZWN0KHByb2plY3QpO1xyXG4gICAgcHJvamVjdE9iamVjdC5nZXRBbGxUYXNrcygpLm1hcCh0YXNrID0+IHtcclxuICAgICAgICBpZighKGlzQmV0d2VlblRoaXNXZWVrKHRhc2suZ2V0RHVlRGF0ZSgpKSkpe1xyXG4gICAgICAgICAgICBwcm9qZWN0T2JqZWN0LnJlbW92ZVRhc2tGcm9tUHJvamVjdCh0YXNrLmdldFRhc2tJZCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZighKHByb2plY3RPYmplY3QuZ2V0QWxsVGFza3MoKS5sZW5ndGggPT09IDApKVxyXG4gICAgICAgIHJldHVybiBwcm9qZWN0T2JqZWN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0JldHdlZW5UaGlzV2VlayhkYXRlKXtcclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGRheVN0YXJ0V2VlayA9IG5ldyBEYXRlKHRvZGF5LnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpIC0gdG9kYXkuZ2V0RGF5KCkpKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUNBJyk7XHJcbiAgICBjb25zdCBkYXlFbmRXZWVrID0gbmV3IERhdGUodG9kYXkuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgLSB0b2RheS5nZXREYXkoKSArIDYpKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUNBJyk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGUgPj0gZGF5U3RhcnRXZWVrICYmIGRhdGUgPD0gZGF5RW5kV2VlayA/IHRydWUgOiBmYWxzZTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZGVmYXVsdCBhcyBzdGFydFVJQW5kTGlzdGVuZXJzIH0gZnJvbSAnLi4vZG9tLW1hbmlwdWxhdGlvbi9hc2lkZVNlY3Rpb24uanMnO1xyXG5cclxuc3RhcnRVSUFuZExpc3RlbmVycygpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==