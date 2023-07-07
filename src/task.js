// Used to generate unique identifier for a task
const idGenerator = (function (){
    let index = 0;
    return () => index++;
})();

export default function Task(taskTitle, dueDate = 'none', description = 'none', priority = 'none'){
    const _taskId = idGenerator();
    let _title = taskTitle;
    let _dueDate = dueDate;
    let _description = description;
    let _priority = priority;

    // Getter for taskId
    const getTaskId = () => _taskId;

    // Getter and Setter for title
    const getTitle = () => _title;
    const setTitle = (newTitle) => _title = newTitle;

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
        getTitle,
        setTitle,
        getDueDate,
        setDueDate,
        getDescription,
        setDescription,
        getPriority,
        setPriority
    }
}