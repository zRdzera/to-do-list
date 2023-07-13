// Used to generate unique identifier for a project
const idGenerator = (function (){
    let index = 0;
    return () => index++;
})();

export default function Project(projectTitle){
    const _projectId = idGenerator();
    let _title = projectTitle;
    let _listOfTasks = [];

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