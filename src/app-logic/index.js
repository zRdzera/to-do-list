import createForm from "../dom-manipulation/createNewTask.js";
import { default as project } from "./project.js";
import { default as task } from "./task.js";
import { default as openCloseAside } from "../dom-manipulation/asideMenu.js";
import * as startListenersProjectsSection from "../dom-manipulation/userProjectSection.js";
import { createProjectElement } from "../dom-manipulation/createNewProject.js";
import { default as storeProject } from "./storage.js";

openCloseAside();
// userProjectsHandler();

// Parameters used for test
const defaultProject = project('Work');
const defaultProject2 = project('Workzada');
const defaultTask = (
    () => task('This Task', '2023-09-09', 'This is a description', 'high')
)();
const defaultTask2 = (
    () => task('This Taskzinha', '2023-09-09', 'This is a description', 'high')
)();

defaultProject.addTaskToProject(defaultTask);
defaultProject.addTaskToProject(defaultTask2);

storeProject(defaultProject);
storeProject(defaultProject2);

// const dom = createProjectElement(defaultProject);
// createProjectElement(defaultProject2);
// console.log(dom);