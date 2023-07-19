export function appendToModal(htmlElement){
    const modalBox = document.getElementById('modal-box');
    clearModal(modalBox);

    modalBox.appendChild(htmlElement);
    changeModalState(modalBox);
}

export function removeFromModal(htmlElement){
    const modalBox = document.getElementById('modal-box');
    modalBox.removeChild(htmlElement);
    changeModalState(modalBox);
}

export function changeModalState(modal){
    const currentClass = modal.getAttribute('class');

    if(currentClass === 'show')
        modal.setAttribute('class', 'hide');
    else
        modal.setAttribute('class', 'show');
}

function clearModal(modal){
    while(modal.firstElementChild){
        modal.removeChild(modal.lastElementChild);
    }
}