import { default as Project } from "../app-logic/project.js";

export default function setEventListenerNewProject(){
    const buttonClicked = document.getElementById('add-new-project');
    buttonClicked.addEventListener('click', (event) => createProjectDiv(event));
}

function createProjectDiv(buttonClicked){
    const projectWrapper = document.createElement('form');
    projectWrapper.setAttribute('id', 'form-add-project');

    // Input to place the new project's name
    const projectName = document.createElement('input');
    projectName.setAttribute('placeholder', 'Project name');

    // Icons that goes inside both buttons (It's gonna change with webpack)
    const selectIcon = document.createElement('img');
    selectIcon.src = '/dist/assets/selected-icon.svg';
    const cancelIcon = document.createElement('img');
    cancelIcon.src = '/dist/assets/cancel-icon.svg';

    // Button to confirm the creation of a new project
    const addButton = document.createElement('button');
    addButton.appendChild(selectIcon);
    addButton.addEventListener('click', () => Project('a'));

    // Button to cancel the creation of a new project
    const cancelButton = document.createElement('button');
    cancelButton.appendChild(cancelIcon);

    // Wrapper for cancel and create project buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.append(addButton, cancelButton);
    projectWrapper.append(projectName, buttonsWrapper);

    const parentNode = buttonClicked.srcElement.parentNode;
    parentNode.appendChild(projectWrapper);
}