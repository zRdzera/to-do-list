export function newProjectButtonListener(button){
    button.addEventListener('click', () => openCloseProjectTasks(button));
}

export function openCloseProjectTasks(projectButton){
    const iconInsideButton = projectButton.getElementsByTagName('img')[0];
    
    const buttonClasses = projectButton.getAttribute('class').split(' ');
    const permanentClass = buttonClasses[0];
    const changeableClass = buttonClasses[1];

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