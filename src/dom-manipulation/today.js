import Project from "../app-logic/project.js";
import { getProjectListStorage } from "../app-logic/storage.js";
import { clearMainAndAppendNode, createElement } from "../commonFunctions.js";
import { createProjectMain } from "./projectMain.js";

export function todayTasksSection(){
    const userProjects = getProjectListStorage();

    const projectsTodayTasks= Array.from(userProjects)
        .map(project => getProjectTodayTasks(project))
        .filter(project => project !== undefined);
    
    const todayProjectsElements = projectsTodayTasks.map(project => {
        const projectElement = createProjectMain(project);
        projectElement.removeChild(projectElement.querySelector('.add-task'));
        return projectElement;
    });

    const todayHeader = createElement('h3', {elementId: 'today-header', elementText: `Today's tasks`});
    if(todayProjectsElements.length !== 0)
        clearMainAndAppendNode(todayProjectsElements, todayHeader);
    else
        clearMainAndAppendNode(todayHeader);
}

// Get today's tasks of a project and return them in a "new" project object
export function getProjectTodayTasks(project){
    const projectObject = Project(project);
    projectObject.getAllTasks().map(task => {
        if(!(task.getDueDate() === new Date().toLocaleDateString('en-CA'))){
            projectObject.removeTaskFromProject(task.getTaskId());
        }
    });

    if(!(projectObject.getAllTasks().length === 0))
        return projectObject;
}