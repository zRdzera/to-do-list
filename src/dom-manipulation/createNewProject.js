import Project from "../app-logic/project.js";
import { buttonCreator, errorFieldCreator } from "../commonFunctions.js";

// Function to generate a form to create a new project
export default function createNewProjectForm(buttonNewProject){
    buttonNewProject.style.cssText = 'opacity: 0'; // Hide 'plus' button
    const formWrapper = createElement('form', {elementId: 'form-add-project'});

    // Input to place the new project's name
    const projectNameInput = document.createElement('input');
    Object.assign(projectNameInput, {
        type: 'text',
        id: 'project-name',
        name: 'project_name',
        placeholder: `New project's name`
    });

    const projectNameDiv = document.createElement('div');
    projectNameDiv.appendChild(projectNameInput)

    // Icons that goes inside both buttons (It's gonna change with webpack)
    const selectIcon = createElement('img', {elementSrc: '/dist/assets/aside-icons/selected-icon.svg'});
    const cancelIcon = createElement('img', {elementSrc: '/dist/assets/aside-icons/cancel-icon.svg'});

    // Button to confirm the creation of a new project
    const addButton = buttonCreator('', 'create-project-button', 'button');
    addButton.appendChild(selectIcon);
    addButton.addEventListener('click', () => createProjectHandler(formWrapper, buttonNewProject));

    // Button to cancel the creation of a new project
    const cancelButton = buttonCreator('', 'cancel-project-button', 'button');
    cancelButton.appendChild(cancelIcon);
    cancelButton.addEventListener('click', () => cancelProjectHandler(formWrapper, buttonNewProject));

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

// Function used to create an HTML element for a new created project ()
export function createProjectElement(projectObject){
    // Section that contains all user's projects
    const userProjectsSection = document.getElementById('list-projects-user');

    const projectId = projectObject.getProjectId();
    const projectTitle = projectObject.getTitle();
    const projectTasks = projectObject.getAllTasks();

    const divWrapper = createElement('div', {elementClass: 'project-name-and-tasks', elementId: `${projectId}`});
    
    const divButtonsProjectName = createElement('div', {elementClass: 'project show'});
    const arrowDownImage = createElement('img', {elementSrc: '/dist/assets/aside-icons/arrow-down-icon-22.png'});
    const buttonText = createElement('p', {elementText: `${projectTitle}`});
    const expandImage = createElement('img', {elementSrc: '/dist/assets/aside-icons/expand-icon.png', elementClass: 'expand-project-tasks'});
    
    const allTasksWrapper = createElement('div', {elementClass: 'project-tasks'});

    const allTasksElements = projectTasks.map(element => {
        const singleTaskWrapper = createElement('div', {
            elementClass: 'task-aside', 
            elementId: `${element.getTaskId()}`,
            elementText: element.getTitle()
        });
        
        return singleTaskWrapper;
    });

    // eventListener to show/hide and expand a project
    newProjectButtonListener(divButtonsProjectName, expandImage);

    // Buttons to show/hide and expand project
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);
    
    // Wrapper for all tasks of the current project
    Array.from(allTasksElements)
        .forEach(element => allTasksWrapper.appendChild(element));

    // Append all elements to a div that wraps all the content of a project
    divWrapper.append(divButtonsProjectName, allTasksWrapper);

    return userProjectsSection.appendChild(divWrapper);
}

// Set new project eventListeners, to show/hide and expand content to main-content div (not yet implemented)
export function newProjectButtonListener(buttonShowHide, buttonExpand){
    buttonShowHide.addEventListener('click', () => openCloseProjectTasks(buttonShowHide));
    buttonExpand.addEventListener('click', (event) => {
        expandProjectTasks(buttonExpand);
        event.stopPropagation();
    });
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

// Check if the project title input is filled, and create a new project
function createProjectHandler(form, buttonNewProject){
    const formData = new FormData(form);

    if(!formData.get('project_name')){
        errorFieldCreator(document.getElementById('project-name'));
    }
    else {
        form.style.cssText = 'display: none';
        buttonNewProject.style.cssText = 'opacity: 1';
        const project = Project(formData.get('project_name'));
        createProjectElement(project);
    }
}

// Remove new project form and shows the 'plus' button again
function cancelProjectHandler(form, buttonNewProject){
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
    buttonNewProject.style.cssText = 'opacity: 1';
}