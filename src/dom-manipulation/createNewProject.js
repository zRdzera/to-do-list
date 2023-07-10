import { buttonCreator, divCreator, errorFieldCreator } from "../commonFunctions.js";

export default function setEventListenerNewProject(){
    const buttonClicked = document.getElementById('add-new-project');
    buttonClicked.addEventListener('click', (event) => {
        buttonClicked.style.cssText = 'display: none';
        createNewProjectForm(event.currentTarget);
    });
}

function createNewProjectForm(buttonNewProject){
    const projectWrapper = document.createElement('form');
    projectWrapper.setAttribute('id', 'form-add-project');

    // Input to place the new project's name
    const projectName = divCreator('Project name', 'project-name', 'text', 'project_name');

    // Icons that goes inside both buttons (It's gonna change with webpack)
    const selectIcon = document.createElement('img');
    selectIcon.src = '/dist/assets/selected-icon.svg';
    const cancelIcon = document.createElement('img');
    cancelIcon.src = '/dist/assets/cancel-icon.svg';

    // Button to confirm the creation of a new project
    const addButton = buttonCreator('', 'create-project-button', 'button');
    addButton.appendChild(selectIcon);
    addButton.addEventListener('click', () => createProjectHandler(projectWrapper));

    // Button to cancel the creation of a new project
    const cancelButton = buttonCreator('', 'cancel-project-button', 'button');
    cancelButton.appendChild(cancelIcon);
    cancelButton.addEventListener('click', () => cancelProjectHandler(projectWrapper, buttonNewProject));

    // Wrapper for cancel and create project buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.append(addButton, cancelButton);
   
    projectWrapper.append(projectName, buttonsWrapper);

    const parentNode = buttonNewProject.parentNode;
    parentNode.insertBefore(projectWrapper, buttonNewProject);
}

// Check if the project title input is filled, and create a new project
function createProjectHandler(form){
    const formData = new FormData(form);

    if(!formData.get('project_name')){
        errorFieldCreator(document.getElementById('project-name').parentElement);
    }
    else {
        form.style.cssText = 'display: none';
    }
}

// Hide new project form and shows de 'plus' button again
function cancelProjectHandler(form, buttonNewProject){
    form.style.cssText = 'display: none';
    buttonNewProject.style.cssText = 'display: inline-block';
}