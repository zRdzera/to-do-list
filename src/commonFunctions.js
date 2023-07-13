export function errorFieldCreator(elementToAppendBelow){
    // Don't allow to create a lot of error advises
    if(elementToAppendBelow.nextElementSibling)
        return;

    const errorField = document.createElement('p');
    errorField.textContent = 'You need to fill this field!';
    errorField.style.cssText = 
        `width: max-content; 
        font-size: 11px; 
        position: absolute;
        margin-top: 8px;
        margin-left: 5px`;

    const parent = elementToAppendBelow.parentElement;
    parent.style.cssText = 'position: relative;'
    parent.appendChild(errorField);

    setTimeout(() => parent.removeChild(errorField), 1500);
}

export function buttonCreator(buttonText, buttonId, buttonType){
    const button = document.createElement('button');
    
    button.setAttribute('id', `${buttonId}`);
    button.setAttribute('type', `${buttonType}`)
    button.textContent = `${buttonText}`;

    return button;
}