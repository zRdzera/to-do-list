import Project from "../app-logic/project.js";
import saveProject, { alterExistentProject, getProjectById } from "../app-logic/projectStorage.js";
import Task from "../app-logic/task.js";
import { createElement, errorFieldCreator } from "../commonFunctions.js";

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
    submitButton.addEventListener('click', () => createTaskHandler(form, buttonNewTask));

    const cancelButton = buttonWithTextCreator('Cancel', 'cancel-task', 'button');
    cancelButton.addEventListener('click', () => cancelTaskHandler(form));

    fieldsetPriorities.append(
        fieldsetPrioritiesLegend,
        divNoPriority,
        divPriorityLow,
        divPriorityHigh
    );
    
    divButtons.append(
        submitButton,
        cancelButton
    )

    form.append(
        divTitle, 
        divDueDate, 
        divDescription,
        fieldsetPriorities,
        divButtons
    )
    
    // Append the form to the main-content
    const mainContentDiv = document.getElementById('main-content');

    return mainContentDiv.appendChild(form);
}

// If user clicks on the add task button, the info that comes from the form is handled
function createTaskHandler(form, buttonNewTask){
    const formData = new FormData(form);

    if(!formData.get('task_name')){
        errorFieldCreator(document.getElementById('title-input'));
    }
    else {
        let parametersForNewTask = [];
        formData.forEach((value, key) => {
            if(value === '')
                parametersForNewTask.push({[`${key}`]: undefined});
            else
                parametersForNewTask.push({[`${key}`]: value});
        });

        // Get all parameters from the new task form and create a new task object
        let task_name, due_date, description, priority;
        [{task_name}, {due_date}, {description}, {priority}] = parametersForNewTask;
        const newTask = Task(task_name, due_date, description, priority);

        const parentProjectId = buttonNewTask.parentElement.getAttribute('id');
        addTaskToProject(newTask, parentProjectId);
    }
}

// If user clicks on the cancel button, the form for the new task is closed
function cancelTaskHandler(form){
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
}

// Get project from storage and transform him in a project object to store the new task inside of it via the method addTaskToProject()
function addTaskToProject(task, parentProjectId){
    const projectFromStorage = getProjectById(parentProjectId);

    if(projectFromStorage){
        const projectObject = Project(projectFromStorage);
        projectObject.addTaskToProject(task);
        alterExistentProject(projectObject);
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