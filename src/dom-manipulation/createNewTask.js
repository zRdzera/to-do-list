import { divCreator, buttonCreator, errorFieldCreator } from "../commonFunctions.js";

export default function createNewTaskForm(){
    const form = document.createElement('form');
    form.setAttribute('id', 'form-new-task');
    
    const divTitle = divCreator('Title', 'title-input', 'text', 'title');
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
    const divPriorityMedium = divCreator('Medium', 'medium', 'radio', 'priority');
    const divPriorityHigh = divCreator('High', 'high', 'radio', 'priority');

    // Form buttons (Add task and Cancel)
    const divButtons = document.createElement('div');
    divButtons.setAttribute('id', 'form-buttons');

    const submitButton = buttonCreator('Add Task', 'add-task', 'button');
    submitButton.addEventListener('click', () => createTaskHandler(form));

    const cancelButton = buttonCreator('Cancel', 'cancel-task', 'button');
    cancelButton.addEventListener('click', () => cancelTaskHandler(form));

    fieldsetPriorities.append(
        fieldsetPrioritiesLegend,
        divNoPriority,
        divPriorityLow, 
        divPriorityMedium, 
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

    return form;
}

// If user clicks on the add task button, the info that comes from the form is handled
function createTaskHandler(form){
    const formData = new FormData(form);

    if(!formData.get('title')){
        errorFieldCreator(document.getElementById('title-input').parentElement);
    }
    else {
        form.style.cssText = 'display: none';
    }
}

// If user clicks on the cancel button, the form for the new task is closed
function cancelTaskHandler(form){
    // form.style.cssText = 'display: none';
}