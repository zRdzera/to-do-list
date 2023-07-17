// Add a new created project to the project-list JSON object stored
export default function saveProject(project){
    const allowSave = checkIfProjectExists(project.getTitle());

    // If the above function returns false, the project will not be stored
    if(allowSave === false) return;
        
    const jsonProject = projectToJson(project);
    const projectsStorage = getProjectListStorage();
    projectsStorage.push(jsonProject);

    localStorage.setItem('projects-list', JSON.stringify(projectsStorage));
}

// Change some part of an existent project
export function alterExistentProject(project){
    const jsonProject = projectToJson(project);
    const projectsStorage = getProjectListStorage();

    const indexOfProjectToAlter = Array.from(projectsStorage)
        .findIndex(storedProject => storedProject._projectId === project.getProjectId());

    projectsStorage[indexOfProjectToAlter] = jsonProject;

    localStorage.setItem('projects-list', JSON.stringify(projectsStorage));
}

// Generate an identifier for a new task created, based on the last task inside a project parent
export function generateNewTaskId(project){
    const storedProjects = getProjectListStorage();

    const projectParent = Array.from(storedProjects)
        .find(storedProject => storedProject._projectId === project.getProjectId());

    if(projectParent._listOfTasks.length !== 0){
        let lastIdNumber = projectParent._listOfTasks.at(-1).id.split('_')[1];
        return `task_${++lastIdNumber}`;
    }
    else {
        return `task_${0}`;
    }
}

// Generate an identifier for a new project created, based on the last project existent
export function generateNewProjectId(){
    const storedProjects = getProjectListStorage();

    if(storedProjects.length !== 0){
        let lastIdNumber = storedProjects.at(-1)._projectId.split('_')[1];
        return `project_${++lastIdNumber}`;
    }
    else{
        return `project_${0}`;
    }
}

export function getProjectById(id){
    const storedProjects = getProjectListStorage();
    return storedProjects.find(project => project._projectId === id);
}

// Check if the project to be stored already exists in the storage
function checkIfProjectExists(projectTitle){
    const storedProjects = getProjectListStorage();
    const allowSave = storedProjects.every(project => project._title !== projectTitle);
    return allowSave;
}

// Retrieve user's projects storage. If it is user's first time using the tododoo, create a new list of projects
export function getProjectListStorage(){
    if(!localStorage.getItem('projects-list')){
        localStorage.setItem('projects-list', JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem('projects-list'));
}

// Transform project object (that contains all functions) to a JSON object
function projectToJson(project){
    const _projectId = project.getProjectId();
    const _title = project.getTitle();
    const _listOfTasks = [];
   
    // Convert all tasks to JSON like objects
    Array.from(project.getAllTasks())
        .forEach(
            task => _listOfTasks.push(taskToJson(task))
        );

    return {
        _projectId,
        _title,
        _listOfTasks
    }
}

/* Transform task object (that contains all functions) to a JSON object,
to be properly stored in the localStorage together with corresponding project */
function taskToJson(task){
    const id = task.getTaskId();
    const name = task.getName();
    const description = task.getDescription();
    const due_date = task.getDueDate();
    const priority = task.getPriority();

    return {
        id,
        name,
        description,
        due_date,
        priority
    }
}