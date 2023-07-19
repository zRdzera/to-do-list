import Project from "../app-logic/project.js";
import { alterExistentProject, getProjectById } from "../app-logic/storage.js";
import { createEmptyHint, getTaskElements } from "../commonFunctions.js";

export function deleteTaskFromProject(task, projectId){
    updateListProject(task, projectId);
    const {taskListAside, taskAside, taskListMain, taskMain} = getTaskElements(task, projectId);

    taskListAside.removeChild(taskAside);
    taskListMain.removeChild(taskMain);

    if(taskListAside.children.length === 0) createEmptyHint(taskListAside);
}

function updateListProject(task, projectId){
    const projectFromStorage = getProjectById(projectId);
    const projectObject = Project(projectFromStorage);
    projectObject.removeTaskFromProject(task.getTaskId());
    alterExistentProject(projectObject);
}