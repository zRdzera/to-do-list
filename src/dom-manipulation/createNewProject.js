import { buttonCreator, errorFieldCreator } from "../commonFunctions.js";

export default function createNewProjectForm(buttonNewProject){
    buttonNewProject.style.cssText = 'opacity: 0';

    const projectWrapper = document.createElement('form');
    projectWrapper.setAttribute('id', 'form-add-project');

    // Input to place the new project's name
    const projectNameInput = document.createElement('input');
    Object.assign(projectNameInput, {
        type: 'text',
        id: 'project-name',
        name: 'project_name',
        placeholder: `New project's name`
    });

    const projectNameDiv = document.createElement('div');
    projectNameDiv.appendChild(projectNameInput)

    // Icons that goes inside both buttons (It's gonna change with webpack)
    const selectIcon = document.createElement('img');
    selectIcon.src = '/dist/assets/aside-icons/selected-icon.svg';
    const cancelIcon = document.createElement('img');
    cancelIcon.src = '/dist/assets/aside-icons/cancel-icon.svg';

    // Button to confirm the creation of a new project
    const addButton = buttonCreator('', 'create-project-button', 'button');
    addButton.appendChild(selectIcon);
    addButton.addEventListener('click', () => createProjectHandler(projectWrapper, buttonNewProject));

    // Button to cancel the creation of a new project
    const cancelButton = buttonCreator('', 'cancel-project-button', 'button');
    cancelButton.appendChild(cancelIcon);
    cancelButton.addEventListener('click', () => cancelProjectHandler(projectWrapper, buttonNewProject));

    // Wrapper for cancel and create project buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.append(addButton, cancelButton);
    projectWrapper.append(projectNameDiv, buttonsWrapper);

    const parentOfNewProjectButton = buttonNewProject.parentNode;
    const parentOfParent = parentOfNewProjectButton.parentNode;
    
    parentOfParent.insertBefore(projectWrapper, parentOfParent.childNodes[2]);
}

// Check if the project title input is filled, and create a new project
function createProjectHandler(form, buttonNewProject){
    const formData = new FormData(form);

    if(!formData.get('project_name')){
        errorFieldCreator(document.getElementById('project-name'));
    }
    else {
        form.style.cssText = 'display: none';
        buttonNewProject.style.cssText = 'opacity: 1';
    }
}

// Remove new project form and shows the 'plus' button again
function cancelProjectHandler(form, buttonNewProject){
    const parentElement = form.parentElement;
    parentElement.removeChild(form);
    buttonNewProject.style.cssText = 'opacity: 1';
}