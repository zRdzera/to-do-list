import Project from "../app-logic/project.js";
import storeProject from "../app-logic/projectStorage.js";
import { buttonWithImg, createElement, errorFieldCreator } from "../commonFunctions.js";
import { expandProjectTasks } from "./projectMain.js";

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

    // Button to confirm the creation of a new project
    const addButton = buttonWithImg('create-project-button', '/dist/assets/aside-icons/selected-icon.svg');
    addButton.addEventListener('click', () => createProjectHandler(formWrapper, buttonNewProject));

    // Button to cancel the creation of a new project
    const cancelButton = buttonWithImg('cancel-project-button', '/dist/assets/aside-icons/cancel-icon.svg');
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
    const projectId = projectObject.getProjectId();
    const projectTitle = projectObject.getTitle();
    const projectTasks = projectObject.getAllTasks();
    
    const arrowDownImage = createElement('img', {elementSrc: '/dist/assets/aside-icons/arrow-down-icon-22.png'});
    const buttonText = createElement('p', {elementText: `${projectTitle}`});
    const expandImage = createElement('img', {elementSrc: '/dist/assets/aside-icons/expand-icon.png', elementClass: 'expand-project-tasks'});
    const allTasksElements = projectTasks.map(element => {
        const singleTaskWrapper = createElement('div', {
            elementClass: 'task-aside', 
            elementId: `${element.getTaskId()}`,
            elementText: element.getName()
        });
        
        return singleTaskWrapper;
    });

    // Wrap buttons to show/hide and expand project to a div
    const divButtonsProjectName = createElement('div', {elementClass: 'project show'});
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);
    
    // eventListener to show/hide and expand a project
    newProjectButtonListener(divButtonsProjectName, expandImage);

    // Buttons to show/hide and expand project
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);
    
    // Buttons to show/hide and expand project
    divButtonsProjectName.append(arrowDownImage, buttonText, expandImage);
    
    // Wrapper for all tasks of the current project
    const allTasksWrapper = createElement('div', {elementClass: 'project-tasks'});
    Array.from(allTasksElements)
        .forEach(element => allTasksWrapper.appendChild(element));

    // Append all elements to a div that wraps all the content of a project
    const divWrapper = createElement('div', {elementClass: 'project-name-and-tasks', elementId: `${projectId}`});
    divWrapper.append(divButtonsProjectName, allTasksWrapper);

    // Section that contains all user's projects
    const userProjectsSection = document.getElementById('list-projects-user');

    return userProjectsSection.appendChild(divWrapper);
}

// Set new project eventListeners, to show/hide and expand content to main-content div (not yet implemented)
export function newProjectButtonListener(buttonShowHide, buttonExpand){
    buttonShowHide.addEventListener('click', () => openCloseProjectTasks(buttonShowHide));
    buttonExpand.addEventListener('click', (event) => {
        expandProjectTasks(buttonExpand); // Expand means that the project will be expanded to the main-content
        event.stopPropagation();
    });
}

// Handle show/hide tasks of a project, by clicking in the project div
export function openCloseProjectTasks(projectButton){
    const iconInsideButton = projectButton.getElementsByTagName('img')[0];
    
    // Mantain default class that's used for button styling
    const divClasses = projectButton.getAttribute('class').split(' ');
    const permanentClass = divClasses[0];
    const changeableClass = divClasses[1];

    if(changeableClass === 'show'){
        projectButton.setAttribute('class', `${permanentClass} hide`);
       
        // Arrow effect using an animation defined in the css file, from open to closed (bottom to right)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms normal forwards;'
        , 150);

        hideTasksOfProject(projectButton);
    }
    else {
        projectButton.setAttribute('class', `${permanentClass} show`);   
        
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
        tasksOfProject.style.cssText = 'display: none;';
    }

    // Function used to show tasks of a project, by clicking in the project name (if closed)
    function showTasksOfProject(button){
        const parentProject = button.parentElement;
        const tasksOfProject = parentProject.lastElementChild;
        tasksOfProject.style.cssText = 'display: flex;';
    }
}

// Check if the project title input is filled, and create a new project (HTML and Storage)
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
        storeProject(project);
    }
}

// Remove new project form and shows the 'plus' button again
function cancelProjectHandler(form, buttonNewProject){
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
    buttonNewProject.style.cssText = 'opacity: 1';
}