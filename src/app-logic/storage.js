// Add a new created project to the project-list JSON object stored
export default function storeProject(project){
    const allowSave = checkIfProjectExists(project.getProjectId());

    if(allowSave === false) // If the above function returns false, the project will not be stored
        return;

    const jsonProject = projectToJson(project);
    const projectsStorage = getProjectListStorage();
    projectsStorage.push(jsonProject);

    localStorage.setItem('projects-list', JSON.stringify(projectsStorage));
}

// Check if the project to be stored already exists in the storage
function checkIfProjectExists(projectId){
    const storedProjects = getProjectListStorage();
    const allowSave = storedProjects.every(project => project.project_id !== projectId);
    
    return allowSave;
}

// Retrieve user's projects storage. If is user's first time, create a new list of projects
function getProjectListStorage(){
    if(!localStorage.getItem('projects-list')){
        localStorage.setItem('projects-list', JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem('projects-list'));
}

// Transform project object (that contains all functions) to a JSON object
function projectToJson(project){
    const project_id = project.getProjectId();
    const name = project.getTitle();
    const task_list = [];
   
    // Convert all tasks to JSON like objects
    Array.from(project.getAllTasks())
        .forEach(
            task => task_list.push(taskToJson(task))
        );

    return {
        project_id,
        name,
        task_list
    }
}

/* Transform task object (that contains all functions) to a JSON object,
to be properly stored in the localStorage together with corresponding project */
function taskToJson(task){
    const id = task.getTaskId();
    const name = task.getTitle();
    const due_date = task.getDueDate();
    const priority = task.getPriority();

    return {
        id,
        name,
        due_date,
        priority
    }
}