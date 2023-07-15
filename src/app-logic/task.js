// Used to generate unique identifier for a task (Still need to figure it out how the id will be correctly generated)
const idGenerator = (function (){
    let index = 0;
    return () => index++;
})();

export default function Task(taskName, dueDate = 'none', description = 'none', priority = 'none', taskId){
    let _taskId;
    
    // Used to create an object based on an existent (JSON object that comes from storage to Task object)
    if(taskId)
        _taskId = taskId;
    else
        _taskId = idGenerator();

    let _name = taskName;
    let _dueDate = dueDate;
    let _description = description;
    let _priority = priority;

    // Getter for taskId
    const getTaskId = () => _taskId;

    // Getter and Setter for title
    const getName = () => _name;
    const setName = (newTitle) => _name = newTitle;

    // Getter and Setter for dueDate
    const getDueDate = () => _dueDate;
    const setDueDate = (newDueDate) => _dueDate = newDueDate;

    // Getter and Setter for description
    const getDescription = () => _description;
    const setDescription = (newDescription) => _description = newDescription;

    // Getter and Setter for priority
    const getPriority = () => _priority;
    const setPriority = (newPriority) => _priority = newPriority;

    return {
        getTaskId,
        getName,
        setName,
        getDueDate,
        setDueDate,
        getDescription,
        setDescription,
        getPriority,
        setPriority
    }
}