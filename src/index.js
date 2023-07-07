import { default as project } from "./project.js";
import { default as task } from "./task.js";

const defaultProject = (() => project('Home'))();
const defaultTask = (
    () => task('This Task', '2023-09-09', 'This is a description', 'high')
)();

defaultProject.addTaskToProject(defaultTask);

console.log(defaultProject);
console.log(defaultTask);

console.log(defaultProject.getAllTasks()[0].getTitle());