import Project from "../app-logic/project.js";
import Task from "../app-logic/task.js";
import { updateExistentProject, generateNewTaskId, getProjectById } from "../app-logic/storage.js";
import { getTaskElements, removeEmptyHint, taskFormDataHandler } from "../commonFunctions.js";
import { appendToModal, removeFromModal } from "./modal.js";
import { createTaskElementAside } from "./projectAside.js";
import { createTaskElementMain } from "./projectMain.js";

// Function to generate a form to create a new task, inside an existent project
export default function newTaskForm(form, projectId){
    const formTitle = form.querySelector('.form-header');
    formTitle.textContent = 'Add a new task';
    const submitButton = form.querySelector('#add-task');
    submitButton.addEventListener('click', () => newTaskHandler(form, projectId));
    appendToModal(form);
}

// If user clicks on the add task button, the info that comes from the form is handled
function newTaskHandler(form, projectId){
    const taskParameters = taskFormDataHandler(form, projectId);
    
    if(taskParameters){
        const newTask = saveTaskToProject(taskParameters, projectId);
        createTaskElement(newTask, projectId);
        removeFromModal(form);
    }
}

// Get project from storage and transform him in a project object to store the new task inside of it via the method addTaskToProject()
function saveTaskToProject(taskParameters, parentProjectId){
    let task_name, due_date, description, priority;
    [{task_name}, {due_date}, {description}, {priority}] = taskParameters;

    // Checks if the project exists
    const projectFromStorage = getProjectById(parentProjectId);

    if(projectFromStorage){
        const projectObject = Project(projectFromStorage);
        const newTask = Task(task_name, due_date, description, priority, generateNewTaskId(projectObject));
        
        projectObject.addTaskToProject(newTask);
        updateExistentProject(projectObject); // Update the project in the storage with the new task

        return newTask;
    }
}

// Generate a new task element in both parent project sections (aside and main-content)
function createTaskElement(task, projectId){
    const {taskListAside, taskListMain} = getTaskElements(task, projectId);

    if(taskListAside.children[0].getAttribute('class') === 'project-empty-hint') 
        removeEmptyHint(taskListAside);

    // Place the new element within the project in the aside
    const taskElementAside = createTaskElementAside(task);
    taskListAside.appendChild(taskElementAside);

    // Place the new element within the project in the main-content
    const taskElementMain = createTaskElementMain(task, projectId);
    taskListMain.appendChild(taskElementMain);
}
