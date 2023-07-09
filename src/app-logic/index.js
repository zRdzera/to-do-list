import createForm from "../dom-manipulation/formNewTask.js";
import { default as project } from "./project.js";
import { default as task } from "./task.js";
import { default as setEventListenerNewProject } from "../dom-manipulation/createNewProject.js";

setEventListenerNewProject();

const defaultProject = (() => project('Home'))();
const defaultTask = (
    () => task('This Task', '2023-09-09', 'This is a description', 'high')
)();


// Used for tests
const form = createForm();
const body = document.getElementsByTagName('body')[0];
body.appendChild(form);