import { removeFromModal } from "./dom-manipulation/modal.js";

// Function to select the parent project of a task, the list which the task it's inside and the task itself
export function getTaskElements(task, projectId){
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

export function createEmptyHint(taskList){
    const emptyHint = createElement('p', {elementClass: 'project-empty-hint', elementText: 'No tasks yet!'});
    taskList.appendChild(emptyHint);
}

export function removeEmptyHint(taskList){
    taskList.removeChild(taskList.children[0]);
}

export function createCommonTaskForm(){
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
    cancelButton.addEventListener('click', () => removeFromModal(form));

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
export function taskFormDataHandler(form){
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

export function errorFieldCreator(elementToAppendBelow){
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
export function buttonWithImg(elementClass, imgSrc, optionalSpanText){
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
export function createElement(tagName, ...rest){
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
export const cleanProjectId = (rawId) => rawId.slice(rawId.indexOf('_') + 1);

// Function that comes in handy to create elements that goes inside the form for a new task
export function divCreator(labelText, inputId, inputType, inputName){
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
export function buttonWithTextCreator(buttonText, buttonId, buttonType){
    const button = document.createElement('button');
    
    button.setAttribute('id', `${buttonId}`);
    button.setAttribute('type', `${buttonType}`)
    button.textContent = `${buttonText}`;

    return button;
}