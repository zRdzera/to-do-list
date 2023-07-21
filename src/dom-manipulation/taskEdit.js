import Project from "../app-logic/project.js";
import { updateExistentProject, getProjectById } from "../app-logic/storage.js";
import { getTaskElements, taskFormDataHandler } from "../commonFunctions.js";
import { appendToModal, removeFromModal } from "./modal.js";
import { createTaskElementAside } from "./projectAside.js";
import { createTaskElementMain } from "./projectMain.js";

export function editTaskForm(task, projectId, form){
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
    appendToModal(form);
}

function editTaskHandler(form, projectId){
    const taskParameters = taskFormDataHandler(form, projectId);
    
    if(taskParameters){
        const changedTask = saveModTaskToProject(taskParameters, projectId);
        updateTaskElement(changedTask, projectId);
        removeFromModal(form);
    }
}

function saveModTaskToProject(taskParameters, parentProjectId){
    let task_id, task_name, due_date, description, priority;
    [{task_name}, {due_date}, {description}, {priority}, {task_id}] = taskParameters;

    // Checks if the project exists
    const projectFromStorage = getProjectById(parentProjectId);

    if(projectFromStorage){
        const projectObject = Project(projectFromStorage);
        const taskToChange = projectObject.getTaskById(task_id);
        
        taskToChange.setName(task_name);
        taskToChange.setDueDate(due_date);
        taskToChange.setDescription(description);
        taskToChange.setPriority(priority);

        updateExistentProject(projectObject); // Update the project in the storage with the modified task 

        return taskToChange;
    }
}

// Update the element in the DOM with the new values (aside and main sections)
function updateTaskElement(task, projectId){
    const {taskListAside, taskAside, taskListMain, taskMain} = getTaskElements(task, projectId);

    // Update task element within the project in the aside (remove the old task and place it the new)
    const updatedAsideTask = createTaskElementAside(task);
    taskListAside.insertBefore(updatedAsideTask, taskAside);
    taskListAside.removeChild(taskAside);

    // Update task element within the project in the main-content (remove the old task and place it the new)
    const updatedMainTask = createTaskElementMain(task, projectId);
    taskListMain.insertBefore(updatedMainTask, taskMain);
    taskListMain.removeChild(taskMain);
}