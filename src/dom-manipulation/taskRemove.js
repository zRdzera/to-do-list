import Project from "../app-logic/project.js";
import { updateExistentProject, getProjectById } from "../app-logic/storage.js";
import { createEmptyHint, getTaskElements } from "../commonFunctions.js";

export function deleteTaskFromProject(task, projectId){
    const {taskListAside, taskAside, taskListMain, taskMain} = getTaskElements(task, projectId);

    taskListAside.removeChild(taskAside);
    taskListMain.removeChild(taskMain);

    if(taskListAside.children.length === 0) createEmptyHint(taskListAside);

    // Checks if the project exists
    const projectFromStorage = getProjectById(projectId);

    if(projectFromStorage){
        const projectObject = Project(projectFromStorage);
        projectObject.removeTaskFromProject(task.getTaskId());
        
        updateExistentProject(projectObject);
    }
}