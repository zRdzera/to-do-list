import Project from "../app-logic/project.js";
import { getProjectById } from "../app-logic/projectStorage.js";
import { buttonWithImg, createElement } from "../commonFunctions.js";
import createNewTaskForm from "./createNewTask.js";

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
        const projectMainElement = createProjectMain(projectObject);
        mainContentDiv.appendChild(projectMainElement);
    }
}

// Create a HTML project element to place in the #main-content
function createProjectMain(project){
    const projectId = project.getProjectId();
    const projectName = project.getTitle();
    const projectTasks = project.getAllTasks();

    const projectWrapper = createElement('div', {elementId: `${projectId}`, elementClass: 'project-wrapper'});
    const projectNameH3 = createElement('h3', {elementClass: 'project-name', elementText: `${projectName}`});
    const projectTasksWrapper = createElement('div', {elementClass: 'project-tasks'});

    // Generate an HTML element for each existent task
    const tasks = Array.from(projectTasks).map(task => {
        const taskElement = createTaskElement(task);
        projectTasksWrapper.appendChild(taskElement); // Append to the list that contains all tasks
    });
    
    // Button to add a new task to the project
    const newTaskButton = buttonWithImg('add-task', '/dist/assets/main-icons/plus-icon-task-add.svg', 'Add new task');
    newTaskButton.addEventListener('click', () => console.log(createNewTaskForm()));

    // Append all elements to the project wrapper (hold all tasks and infos of a single project)
    projectWrapper.append(projectNameH3, projectTasksWrapper, newTaskButton);

    return projectWrapper;
}

function createTaskElement(task){
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
    const expandButton = buttonWithImg('expand-task', '/dist/assets/main-icons/eye-icon.png');
    const editButton = buttonWithImg('edit-task', '/dist/assets/main-icons/edit-icon.svg');
    const removeButton = buttonWithImg('delete-task', '/dist/assets/main-icons/remove-icon.svg');
    rightSideWrapper.append(expandButton, editButton, removeButton);

    // Append to the task wrapper
    taskWrapper.append(leftSideWrapper, rightSideWrapper);

    return taskWrapper;
}