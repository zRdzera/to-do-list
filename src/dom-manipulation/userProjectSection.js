import { default as createNewProjectForm, openCloseProjectTasks  } from "./projectAside.js";
import { expandProjectTasks } from "./projectMain.js";

// IIFE to start all eventListeners related to the user-projects section (for projects stored previously)
const startListenersProjectsSection = (function (){
    // Button to show/hide user's projects
    const userProjectsButton = document.getElementById('user-projects-button');
    userProjectsButton.addEventListener('click', () => openCloseMyProjects(userProjectsButton));

    // Button to create new project
    const addNewProjectButton = document.getElementById('add-new-project-button');
    addNewProjectButton.addEventListener('click', (event) => createNewProjectForm(event.currentTarget));

    // eventListener for each button inside each project div to show/hide tasks of the project clicked
    const projectButton = document.getElementsByClassName('project');
    Array.from(projectButton)
        .forEach(button => button.addEventListener('click', () => openCloseProjectTasks(button)));

    // eventListener for each expand img inside each project div to expand project and his task to main-content div (not yet implemented)
    const expandProjectButton = document.getElementsByClassName('expand-project-tasks');
    Array.from(expandProjectButton)
        .forEach(button => button.addEventListener('click', (event) => {
            expandProjectTasks(button);
            event.stopPropagation();
        })
    );
})();

// Handle show/hide all user's projects (div that contains My Projects text)
function openCloseMyProjects(button){
    const iconInsideButton = button.getElementsByTagName('img')[0];

    if(button.getAttribute('class') === 'show'){
        button.setAttribute('class', 'hide');
       
        // Arrow effect using an animation defined in the css file, from open to closed (bottom to right)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms normal forwards;'
        , 150);

        hideProjects();
    }
    else {
        button.setAttribute('class', 'show');   
        
        // Arrow effect using an animation defined in the css file, from closed to open (right to bottom)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms reverse backwards;'
        , 150);

        showProjects();
    }
}

function hideProjects(){
    const listOfProjects = document.getElementById('list-projects-user');
    listOfProjects.style.cssText = 'display: none;';
}

function showProjects(){
    const listOfProjects = document.getElementById('list-projects-user');
    listOfProjects.style.cssText = 'display: flex;';
}