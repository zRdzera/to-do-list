import Project from "../app-logic/project.js";
import { updateExistentProject, getProjectById } from "../app-logic/storage.js";
import { createEmptyHint, getTaskElements } from "../commonFunctions.js";

export function deleteTaskFromProject(task, projectId){
    const {taskListAside, taskAside, taskListMain, taskMain} = getTaskElements(task, projectId);

    taskListAside.removeChild(taskAside);
    taskListMain.removeChild(taskMain);

    if(taskListAside.children.length === 0) 
        createEmptyHint(taskListAside);

    if(taskListMain.children.length === 0)
        updateMainToday(projectId);

    // Checks if the project exists
    const projectFromStorage = getProjectById(projectId);

    if(projectFromStorage){
        const projectObject = Project(projectFromStorage);
        projectObject.removeTaskFromProject(task.getTaskId());
        
        updateExistentProject(projectObject);
    }
}

// Update main content when user remove any task (of any project) in the today section
// E.g if the user removes a task of a project and this project doesn't have no more tasks, remove it from the main content
function updateMainToday(projectId){
    const main = document.getElementById('main-content');
    const projectWrapper = main.querySelector(`#main_${projectId}`);
    main.removeChild(projectWrapper);
}