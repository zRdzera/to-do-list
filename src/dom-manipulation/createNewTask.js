import Project from "../app-logic/project.js";
import { alterExistentProject, generateNewTaskId, getProjectById } from "../app-logic/projectStorage.js";
import Task from "../app-logic/task.js";
import { cleanProjectId, createElement, errorFieldCreator } from "../commonFunctions.js";
import { createTaskElementAside } from "./projectAside.js";
import { createTaskElementMain } from "./projectMain.js";

// Function to generate a form to create a new task, inside an existent project
export default function createNewTaskForm(buttonNewTask){
    const form = document.createElement('form');
    form.setAttribute('id', 'form-new-task');
    
    const divTitle = divCreator('Title', 'task-name', 'text', 'task_name');
    const divDueDate = divCreator('Due date', 'due-date-input', 'date', 'due_date');
    const divDescription = divCreator('Description', 'description-input', 'text', 'description');
   
    // Fieldset with radio buttons for priority selection
    const fieldsetPriorities = document.createElement('fieldset');
    const fieldsetPrioritiesLegend = document.createElement('legend');
    fieldsetPrioritiesLegend.textContent = 'Priority';
    
    // Default value for priority
    const divNoPriority = divCreator('No priority', 'no-priority', 'radio', 'priority');
    divNoPriority.lastChild.setAttribute('checked', '');

    const divPriorityLow = divCreator('Low', 'low', 'radio', 'priority');
    const divPriorityHigh = divCreator('High', 'high', 'radio', 'priority');

    // Form buttons (Add task and Cancel)
    const divButtons = document.createElement('div');
    divButtons.setAttribute('id', 'form-buttons');

    const submitButton = buttonWithTextCreator('Add Task', 'add-task', 'button');
    submitButton.addEventListener('click', () => newTaskHandler(form, buttonNewTask));

    const cancelButton = buttonWithTextCreator('Cancel', 'cancel-task', 'button');
    cancelButton.addEventListener('click', () => removeTaskForm(form));

    fieldsetPriorities.append(
        fieldsetPrioritiesLegend,
        divNoPriority,
        divPriorityLow,
        divPriorityHigh
    );
    
    divButtons.append(
        submitButton,
        cancelButton
    );

    form.append(
        divTitle, 
        divDueDate, 
        divDescription,
        fieldsetPriorities,
        divButtons
    );
    
    // Append the form to the main-content
    const mainContentDiv = document.getElementById('main-content');

    return mainContentDiv.appendChild(form);
}

// If user clicks on the add task button, the info that comes from the form is handled
function newTaskHandler(form, buttonNewTask){
    const formData = new FormData(form);

    if(!formData.get('task_name')){
        errorFieldCreator(document.getElementById('title-input'));
    }
    else {
        let taskParameters = [];
        formData.forEach((value, key) => {
            if(value === '')
                taskParameters.push({[`${key}`]: undefined});
            else
                taskParameters.push({[`${key}`]: value});
        });

        const parentProjectId = cleanProjectId(buttonNewTask.parentElement.getAttribute('id'));
        const newTask = saveTaskToProject(taskParameters, parentProjectId);
        createTaskElement(newTask, parentProjectId);
        removeTaskForm(form);
    }
}

// Generate a new task element in both parent project sections (aside and main-content)
function createTaskElement(task, projectId){
    // Place the new element within the project in the aside
    const asideProjectElement = document.getElementById(`aside_${projectId}`);
    const tasksSectionAside = asideProjectElement.querySelector('.project-tasks-aside');
    const taskElementAside = createTaskElementAside(task);
    tasksSectionAside.appendChild(taskElementAside);

    // Place the new element within the project in the main-content
    const mainProjectElement = document.getElementById(`main_${projectId}`);
    const tasksSectionMain = mainProjectElement.querySelector('.project-tasks-main');
    const taskElementMain = createTaskElementMain(task);
    tasksSectionMain.appendChild(taskElementMain);    
}

// If user clicks on the cancel button, the form for the new task is closed
function removeTaskForm(form){
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
}

// Get project from storage and transform him in a project object to store the new task inside of it via the method addTaskToProject()
function saveTaskToProject(taskParameters, parentProjectId){
    let task_name, due_date, description, priority;
    [{task_name}, {due_date}, {description}, {priority}] = taskParameters;

    // Checks if the project exists
    const projectFromStorage = getProjectById(parentProjectId);

    if(projectFromStorage){
        const projectObject = Project(projectFromStorage);
        const newTask = Task(task_name, due_date, description, priority, generateNewTaskId(projectObject));
        
        projectObject.addTaskToProject(newTask);
        alterExistentProject(projectObject);

        return newTask;
    }
}

// Handy function to create a button with a text
function buttonWithTextCreator(buttonText, buttonId, buttonType){
    const button = document.createElement('button');
    
    button.setAttribute('id', `${buttonId}`);
    button.setAttribute('type', `${buttonType}`)
    button.textContent = `${buttonText}`;

    return button;
}

// Function that comes in handy to create elements that goes inside the form for a new task
function divCreator(labelText, inputId, inputType, inputName){
    const divWrapper = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', `${inputId}`);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.setAttribute('type', `${inputType}`);
    input.setAttribute('id', `${inputId}`);
    input.setAttribute('name', `${inputName}`);

    if(input.type === 'radio')
        input.setAttribute('value', `${inputId}`);

    divWrapper.append(label, input);

    return divWrapper;
}