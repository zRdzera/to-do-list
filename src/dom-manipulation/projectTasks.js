// Expand a project in the main-content div (not yet implemented)
export function expandProjectTasks(buttonThatTriggered){
    const outerParent = buttonThatTriggered.parentElement.parentElement;
    const listOfTasks = outerParent.querySelectorAll('.project-tasks');

    console.log(listOfTasks);
}

// Handle show/hide tasks of a project, by clicking in the project div
export function openCloseProjectTasks(projectButton){
    const iconInsideButton = projectButton.getElementsByTagName('img')[0];
    
    // Mantain default class that's used for button styling
    const divClasses = projectButton.getAttribute('class').split(' ');
    const permanentClass = divClasses[0];
    const changeableClass = divClasses[1];

    if(changeableClass === 'show'){
        projectButton.setAttribute('class', `${permanentClass} hide`);
       
        // Arrow effect using an animation defined in the css file, from open to closed (bottom to right)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms normal forwards;'
        , 150);

        hideTasksOfProject(projectButton);
    }
    else {
        projectButton.setAttribute('class', `${permanentClass} show`);   
        
        // Arrow effect using an animation defined in the css file, from closed to open (right to bottom)
        iconInsideButton.style.cssText = 'opacity: 0;';
        setTimeout(
            () => iconInsideButton.style.cssText = 'animation: projectsButtonChangingDirection 150ms reverse backwards;'
        , 150);

        showTasksOfProject(projectButton);
    }
}

function hideTasksOfProject(button){
    const parentProject = button.parentElement;
    const tasksOfProject = parentProject.lastElementChild;
    tasksOfProject.style.cssText = 'display: none;';
}

function showTasksOfProject(button){
    const parentProject = button.parentElement;
    const tasksOfProject = parentProject.lastElementChild;
    tasksOfProject.style.cssText = 'display: flex;';
}