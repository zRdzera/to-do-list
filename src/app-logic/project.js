import Task from "./task.js";

// Used to generate unique identifier for a project
const idGenerator = (function (){
    let index = 0;
    return () => index++;
})();

export default function Project(parameter){
    let _projectId;
    let _title;
    let _listOfTasks;

    // Used to create an object based on an existent (JSON object that comes from storage to Project object)
    if(typeof parameter === 'object'){
        _projectId = parameter._projectId;
        _title = parameter._title;
        _listOfTasks = parameter._listOfTasks.map(
            task => Task(task.name, task.due_date, task.description, task.priority, task.id)
        );
    }
    else {
        _projectId = idGenerator();
        _title = parameter;
        _listOfTasks = [];
    }

    // Getter for projectId
    const getProjectId = () => _projectId;

    // Getter and Setter for title
    const getTitle = () => _title;
    const setTitle = (newTitle) => _title = newTitle;

    // Methods to manipulate tasks inside a Project 
    const getAllTasks = () => _listOfTasks;
    const getTaskById = (taskIndex) => _listOfTasks.find(task => task.getId() === taskIndex);
    const addTaskToProject = (task) => _listOfTasks.push(task);
    const removeTaskFromProject = (taskId) => {
        _listOfTasks = _listOfTasks.filter(task => task.getTaskId() !== taskId);
    }

    return {
        getProjectId,
        getTitle,
        setTitle,
        addTaskToProject,
        removeTaskFromProject,
        getAllTasks,
        getTaskById
    }
}