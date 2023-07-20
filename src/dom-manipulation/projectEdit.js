import Project from "../app-logic/project.js";
import { getProjectById, updateExistentProject } from "../app-logic/storage.js";
import { buttonWithImg, createElement } from "../commonFunctions.js";

export function editProjectHandler(projectId){
    const projectWrapper = document.getElementById(`main_${projectId}`);
    const projectHeader = projectWrapper.querySelector('.project-header');
    const projectName = projectWrapper.querySelector('.project-name');
    const projectButtons = projectName.nextElementSibling; 
    projectButtons.style.cssText = 'opacity: 0'; // Hide the project buttons (edit and delete icons)
    
    const oldProjectName = projectName.textContent; // Used in case of user cancel the title edit
    projectName.setAttribute('contentEditable', 'true');
    projectName.style.cssText = 'border: 1px solid black;';
    projectName.focus();

    const confirmButton = buttonWithImg('confirm-project-name', '/dist/assets/main-icons/selected-icon-28.svg');
    confirmButton.addEventListener('click', () => titleEditHandler(projectName, projectButtons, projectId));
    const cancelButton = buttonWithImg('confirm-project-name', '/dist/assets/main-icons/cancel-icon-28.svg');
    cancelButton.addEventListener('click', () => removeTitleEdit(projectName, projectButtons, oldProjectName));
    const wrapperButtons = createElement('div', {elementClass: 'edit-project-buttons'});
    wrapperButtons.append(confirmButton, cancelButton);

    projectHeader.insertBefore(wrapperButtons, projectName.nextElementSibling);
}

function titleEditHandler(nameElement, projectButtons, projectId){
    const newTitle = nameElement.textContent;
    const project = getProjectById(projectId);
    const projectObject = Project(project);
    projectObject.setTitle(newTitle);
    updateExistentProject(projectObject);
    updateProjectElement(newTitle, projectId);
    removeTitleEdit(nameElement, projectButtons);
}

function updateProjectElement(newTitle, projectId){
    const projectAside = document.getElementById(`aside_${projectId}`);
    const titleAsideSection = projectAside.querySelector('.project');
    const projectTitleAside = titleAsideSection.querySelector('p');
    projectTitleAside.textContent = newTitle;

    const projectMain = document.getElementById(`main_${projectId}`);
    const titleMainSection = projectMain.querySelector('.project-name');
    titleMainSection.textContent = newTitle;
}

function removeTitleEdit(element, projectButtons, oldElementName){
    if(oldElementName)
        element.textContent = oldElementName;

    element.removeAttribute('contentEditable');
    element.style.cssText = 'border-color: transparent;';
    projectButtons.style.cssText = 'opacity: 1';
    
    const elementParent = element.parentElement;
    elementParent.removeChild(element.nextElementSibling);
}