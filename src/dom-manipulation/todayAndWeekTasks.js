import Project from "../app-logic/project.js";
import { getProjectListStorage } from "../app-logic/storage.js";
import { clearMainAndAppendNode, createElement } from "../commonFunctions.js";
import { createProjectMain } from "./projectMain.js";

export function getFilteredTasks(action){
    const userProjects = getProjectListStorage();
    let tasksFiltered, projectAndTasksElements, headerSection;

    if(action === 'today'){
        tasksFiltered = Array.from(userProjects)
            .map(project => getTodayTasks(project))
            .filter(project => project !== undefined);

        headerSection = createElement('h3', {elementId: 'today-header', elementText: `Today's tasks`});
    }
    else {
        tasksFiltered = Array.from(userProjects)
            .map(project => getWeekTasks(project))
            .filter(project => project !== undefined);

        headerSection = createElement('h3', {elementId: 'week-header', elementText: `Week tasks`});
    }
    
    projectAndTasksElements = tasksFiltered.map(project => {
        const projectElement = createProjectMain(project);
        projectElement.removeChild(projectElement.querySelector('.add-task'));
        return projectElement;
    });

    if(projectAndTasksElements.length !== 0)
        clearMainAndAppendNode(projectAndTasksElements, headerSection);
    else
        clearMainAndAppendNode(headerSection);
}

// Get today's tasks of a project and return them in a "new" project object
function getTodayTasks(project){
    const projectObject = Project(project);
    projectObject.getAllTasks().map(task => {
        if(!(task.getDueDate() === new Date().toLocaleDateString('en-CA'))){
            projectObject.removeTaskFromProject(task.getTaskId());
        }
    });

    if(!(projectObject.getAllTasks().length === 0))
        return projectObject;
}

function getWeekTasks(project){
    const projectObject = Project(project);
    projectObject.getAllTasks().map(task => {
        if(!(isBetweenThisWeek(task.getDueDate()))){
            projectObject.removeTaskFromProject(task.getTaskId());
        }
    });

    if(!(projectObject.getAllTasks().length === 0))
        return projectObject;
}

function isBetweenThisWeek(date){
    const today = new Date();
    const dayStartWeek = new Date(today.setDate(today.getDate() - today.getDay())).toLocaleDateString('en-CA');
    const dayEndWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toLocaleDateString('en-CA');

    return date >= dayStartWeek && date <= dayEndWeek ? true : false;
}