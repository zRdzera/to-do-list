import { removeProjectStorage } from "../app-logic/storage.js";

export function removeProjectHandler(projectId){
    const mainContent = document.getElementById('main-content');
    const projectMainToRemove = mainContent.querySelector(`#main_${projectId}`);
    mainContent.removeChild(projectMainToRemove);

    const asideProjectsList = document.getElementById('list-projects-user');
    const projectAsideToRemove = asideProjectsList.querySelector(`#aside_${projectId}`);
    asideProjectsList.removeChild(projectAsideToRemove);

    removeProjectStorage(projectId);
}