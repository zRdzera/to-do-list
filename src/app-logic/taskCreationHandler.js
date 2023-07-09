import { errorFieldCreator } from "../commonFunctions.js";

// If user clicks on the add task button, the info that comes from the form is handled
export function createTaskHandler(form){
    const formData = new FormData(form);

    if(!formData.get('title')){
        errorFieldCreator(document.getElementById('title-input').parentNode);
    }
    else {
        form.style.cssText = 'display: none';
    }
}

// If user clicks on the cancel button, the form for the new task is closed
export function cancelTaskHandler(form){
    // form.style.cssText = 'display: none';
}