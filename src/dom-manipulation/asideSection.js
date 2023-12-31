import Project from "../app-logic/project.js";
import { getProjectListStorage } from "../app-logic/storage.js";
import { default as createNewProjectForm, createProjectAside } from "./projectAside.js";
import { getWeekTasks, getFilteredTasks } from "./todayAndWeekTasks.js";

// Function to start all eventListeners related to the user-projects section and initial elements (for projects stored previously)
export default function startUIAndListeners(){
    openCloseAside();
    
    // Start the today section, as the first selected
    const todayButton = document.getElementById('today-todo-button');
    todayButton.classList.add('tab-selected');
    getFilteredTasks('today');
    todayButton.addEventListener('click', () => {
        selectTab(todayButton);
        getFilteredTasks('today');
    });

    const weekButton = document.getElementById('week-todo-button');
    weekButton.addEventListener('click', () => {
        selectTab(weekButton);
        getFilteredTasks('week');
    })

    // Button to show/hide user's projects
    const userProjectsButton = document.getElementById('user-projects-button');
    userProjectsButton.addEventListener('click', () => openCloseMyProjects(userProjectsButton));

    // Button to create new project
    const addNewProjectButton = document.getElementById('add-new-project-button');
    addNewProjectButton.addEventListener('click', (event) => createNewProjectForm(event.currentTarget));

    // Get all user's projects and create a new element on the aside
    const allUserProjects = getProjectListStorage();
    Array.from(allUserProjects).forEach(project => {
        const projectObject = Project(project);
        createProjectAside(projectObject);
    });
};

export function selectTab(elementClicked){
    const currentTabSelected = document.getElementsByClassName('tab-selected')[0];

    if(!(currentTabSelected === undefined)){
        currentTabSelected.classList.remove('tab-selected');
    }

    elementClicked.classList.add('tab-selected');
}

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

function showProjects(){
    const listOfProjects = document.getElementById('list-projects-user');
    listOfProjects.style.cssText = 'display: flex;';
}

function hideProjects(){
    const listOfProjects = document.getElementById('list-projects-user');
    listOfProjects.style.cssText = 'display: none;';
}

// Function to open and hide the aside menu when clicked
function openCloseAside(){
    const hamburguerMenu = document.getElementById('hamburguer-menu-button');
    hamburguerMenu.addEventListener('click', () => {
        const currentClass = hamburguerMenu.getAttribute('class');
        
        if(currentClass === 'show'){
            hamburguerMenu.setAttribute('class', 'hide');
            toggleAside();
        }
        else {
            hamburguerMenu.setAttribute('class', 'show');
            toggleAside();
        }
    });
}

function toggleAside(){
    const aside = document.getElementById('aside-navigation');

    if(aside.getAttribute('class') === 'aside-show'){
        aside.setAttribute('class', 'aside-hide');
        aside.style.cssText = 'display: none;';
    }
    else {
        aside.setAttribute('class', 'aside-show'); // Add this class to put main-content back to its place
        aside.style.cssText = 'display: flex;';
    }
}