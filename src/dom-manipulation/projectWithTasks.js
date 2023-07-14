import Project from "../app-logic/project.js";
import { getProjectById } from "../app-logic/projectStorage.js";
import { createElement } from "../commonFunctions.js";

// Expand a project in the main-content div (not yet implemented)
export function expandProjectTasks(buttonThatTriggered){
    const selectedProjectDivParent = buttonThatTriggered.parentElement.parentElement;
    const projectId = selectedProjectDivParent.getAttribute('id');
    
    // Checks if the project exists
    const project = getProjectById(projectId);
    if(project){
        const projectObject = Project(project); // If projects exists, create a new object based on him, to be able to manipulate
        
        // Append the project expanded from aside and display it in the #main-content element
        const mainContentDiv = document.getElementById('main-content');
        const projectMainElement = createProjectAndTaskElement(projectObject);
        mainContentDiv.appendChild(projectMainElement);
    }
}

// Create a HTML project element to place in the #main-content
function createProjectAndTaskElement(project){
    const projectId = project.getProjectId();
    const projectName = project.getTitle();
    const projectTasks = project.getAllTasks();

    const projectWrapper = createElement('div', {elementId: `${projectId}`, elementClass: 'project-wrapper'});
    const projectNameH3 = createElement('h3', {elementClass: 'project-name', elementText: `${projectName}`});
    const projectTasksWrapper = createElement('div', {elementClass: 'project-tasks'});

    // Generate an HTML element for each existent task
    const tasks = Array.from(projectTasks).map(task => {
        const taskWrapper = createElement('div', {elementId: `${task.getTaskId()}`, elementClass: 'task'})
        
        // Left side of a task displayed in the #main-content
        const leftSideWrapper = createElement('div', {elementClass: 'task-left-side'});
        const priorityButton = createElement('button', {elementClass: `task-priority ${task.getPriority()}`});
        const taskNameAndDueDate = createElement('div', {elementClass: 'task-name-and-date'});
        const taskName = createElement('p', {elementClass: 'task-name', elementText: `${task.getName()}`});
        const taskDueDate = createElement('p', {elementClass: 'task-due-date', elementText: `${task.getDueDate()}`});
        taskNameAndDueDate.append(taskName, taskDueDate);
        leftSideWrapper.append(priorityButton, taskNameAndDueDate);
        
        // Right side (buttons to change state of a task) of a task displayed in the #main-content
        const rightSideWrapper = createElement('div', {elementClass: 'task-right-side'});
        const expandButton = createElement('button', {elementClass: 'expand-task'});
        const editButton = createElement('button', {elementClass: 'edit-task'});
        const removeButton = createElement('button', {elementClass: 'delete-task'});
        rightSideWrapper.append(expandButton, editButton, removeButton);

        // Append to the task wrapper and next append to the div that
        taskWrapper.append(leftSideWrapper, rightSideWrapper);
        projectTasksWrapper.appendChild(taskWrapper);
    });

    // Button to add a new task to the project
    const newTaskButton = createElement('button', {elementClass: 'add-task'});
    const imgInsideButton = createElement('img', {elementSrc: '/dist/assets/plus-icon-task-add.svg'});
    const buttonText = createElement('span', {elementText: 'Add new task'});
    newTaskButton.append(imgInsideButton, buttonText);

    // Append all elements to the project wrapper (hold all tasks and infos of a single project)
    projectWrapper.append(projectNameH3, projectTasksWrapper, newTaskButton);

    return projectWrapper;
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
}

function hideTasksOfProject(button){
    const parentProject = button.parentElement;
    const tasksOfProject = parentProject.lastElementChild;
    tasksOfProject.style.cssText = 'display: none;';
}

function showTasksOfProject(button){
    const parentProject = button.parentElement;
    const tasksOfProject = parentProject.lastElementChild;
    tasksOfProject.style.cssText = 'display: flex;';
}