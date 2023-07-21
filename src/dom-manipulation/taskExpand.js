import { createElement } from "../commonFunctions.js";
import { appendToModal } from "./modal.js";

export function expandTasksInfo(task, projectId, taskForm){
    const taskTitle = task.getName();
    const taskDueDate = task.getDueDate();
    const taskDescription = task.getDescription();
    let taskPriority = task.getPriority();
    taskPriority = taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1);

    const formTitle = taskForm.querySelector('.form-header');
    formTitle.textContent = `${taskTitle}`;
    taskForm.removeChild(formTitle.nextElementSibling); // Remove the task name input

    const formDueDate = taskForm.querySelector('#due-date-input');
    formDueDate.value = `${taskDueDate}`;
    formDueDate.readOnly = true;

    const formDescription = taskForm.querySelector('#description-input');
    formDescription.textContent = `${taskDescription}`;
    formDescription.readOnly = true;
    formDescription.style.cssText = 'resize: none';

    const formPriority = taskForm.querySelector('fieldset');
    while(formPriority.children.length > 1){
        formPriority.removeChild(formPriority.lastElementChild);
    }
    const priorityText = createElement('p', {elementText: `${taskPriority}`});
    formPriority.appendChild(priorityText);

    const cancelButton = taskForm.querySelector('#cancel-task');
    cancelButton.textContent = 'Go back';
    cancelButton.parentElement.removeChild(cancelButton.previousElementSibling);
    cancelButton.parentElement.style.cssText = 'justify-content: flex-end';

    appendToModal(taskForm);
}