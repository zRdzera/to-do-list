import { cancelTaskHandler, createTaskHandler } from "../app-logic/taskCreationHandler.js";
import { divCreator, buttonCreator } from "../commonFunctions.js";

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
    
    const divPriorityLow = divCreator('Low', 'low', 'radio', 'priority');
    const divPriorityMedium = divCreator('Medium', 'medium', 'radio', 'priority');
    const divPriorityHigh = divCreator('High', 'high', 'radio', 'priority');

    fieldsetPriorities.append(
        fieldsetPrioritiesLegend, 
        divPriorityLow, 
        divPriorityMedium, 
        divPriorityHigh
    );

    // Form buttons (Add task and Cancel)
    const divButtons = document.createElement('div');
    divButtons.setAttribute('id', 'form-buttons');

    const submitButton = buttonCreator('Add Task', 'add-task', 'button');
    submitButton.addEventListener('click', () => createTaskHandler(form));

    const cancelButton = buttonCreator('Cancel', 'cancel-task', 'button');
    cancelButton.addEventListener('click', () => cancelTaskHandler(form));
    
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