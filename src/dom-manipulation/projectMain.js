import Project from "../app-logic/project.js";
import { getProjectById } from "../app-logic/storage.js";
import { buttonWithImg, cleanProjectId, createCommonTaskForm, createElement } from "../commonFunctions.js";
import { default as newTaskForm } from "./taskCreation.js";
import { editTaskForm } from "./taskEdit.js";
import { deleteTaskFromProject } from "./taskRemove.js";

// Expand a project in the main-content div (not yet implemented)
export function expandProjectTasks(buttonThatTriggered){
    const selectedProjectDivParent = buttonThatTriggered.parentElement.parentElement;
    let parentProjectCleanId = cleanProjectId(selectedProjectDivParent.getAttribute('id'));

    // Checks if the project exists
    const project = getProjectById(parentProjectCleanId);
    
    if(project){
        const projectObject = Project(project); // If projects exists, create a "new" object based on him, to be able to manipulate
        
        // Append the project expanded from aside and display it in the #main-content element
        const projectMainElement = createProjectMain(projectObject);
        clearMainAndAppendNode(projectMainElement);
    }
}

// Create a HTML project element to place in the #main-content
function createProjectMain(project){
    const projectId = project.getProjectId();
    const projectName = project.getTitle();
    const projectTasks = project.getAllTasks();

    const projectWrapper = createElement('div', {elementId: `main_${projectId}`, elementClass: 'project-wrapper'});
    const projectNameH3 = createElement('h3', {elementClass: 'project-name', elementText: `${projectName}`});
    const projectTasksWrapper = createElement('div', {elementClass: 'project-tasks-main'});

    // Generate an HTML element for each existent task
    Array.from(projectTasks).map(task => {
        const taskElement = createTaskElementMain(task, projectId);
        projectTasksWrapper.appendChild(taskElement); // Append to the list that contains all tasks
    });
    
    // Button to add a new task to the project
    const newTaskButton = buttonWithImg('add-task', '/dist/assets/main-icons/plus-icon-task-add.svg', 'Add new task');
    newTaskButton.addEventListener('click', () => {
        let taskForm = createCommonTaskForm();
        newTaskForm(taskForm, projectId);
    });

    // Append all elements to the project wrapper (hold all tasks and infos of a single project)
    projectWrapper.append(projectNameH3, projectTasksWrapper, newTaskButton);

    return projectWrapper;
}

// Clear main-content and append the 'expanded' project from aside
function clearMainAndAppendNode(element){
    const mainContent = document.getElementById('main-content');
    while(mainContent.lastElementChild){
        mainContent.removeChild(mainContent.lastElementChild);
    }
    mainContent.appendChild(element);
}

export function createTaskElementMain(task, projectId){
    const taskWrapper = createElement('div', {elementId: `main_${task.getTaskId()}`, elementClass: 'task-main'});

    // Left side of a task displayed in the #main-content
    const leftSideWrapper = createElement('div', {elementClass: 'task-left-side'});
    const priorityButton = createElement('button', {elementClass: `task-priority-main ${task.getPriority()}`});
    const taskNameAndDueDate = createElement('div', {elementClass: 'task-name-and-date'});
    const taskName = createElement('p', {elementClass: 'task-name', elementText: `${task.getName()}`});
    const taskDueDate = createElement('p', {elementClass: 'task-due-date', elementText: `${task.getDueDate()}`});
    taskNameAndDueDate.append(taskName, taskDueDate);
    leftSideWrapper.append(priorityButton, taskNameAndDueDate);
    
    // Right side (buttons to change state of a task) of a task displayed in the #main-content
    const rightSideWrapper = createElement('div', {elementClass: 'task-right-side'});
    const expandButton = buttonWithImg('expand-task', '/dist/assets/main-icons/eye-icon.png');
    const editButton = buttonWithImg('edit-task', '/dist/assets/main-icons/edit-icon.svg');
    editButton.addEventListener('click', () => {
        let taskForm = createCommonTaskForm();
        editTaskForm(task, projectId, taskForm);
    });
    const removeButton = buttonWithImg('delete-task', '/dist/assets/main-icons/remove-icon.svg');
    removeButton.addEventListener('click', () => deleteTaskFromProject(task, projectId));
    rightSideWrapper.append(expandButton, editButton, removeButton);

    // Append to the task wrapper
    taskWrapper.append(leftSideWrapper, rightSideWrapper);

    return taskWrapper;
}