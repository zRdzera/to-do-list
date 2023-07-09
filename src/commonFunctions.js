export function errorFieldCreator(elementToAppend){
    const p = document.createElement('p');
    p.textContent = 'You need to fill this field!';
    p.style.cssText = 'width: max-content; font-size: 12px';

    elementToAppend.appendChild(p);
    setTimeout(() => elementToAppend.removeChild(p), 1000);
}

export function buttonCreator(buttonText, buttonId, buttonType){
    const button = document.createElement('button');
    
    button.setAttribute('id', `${buttonId}`);
    button.setAttribute('type', `${buttonType}`)
    button.textContent = `${buttonText}`;

    return button;
}

export function divCreator(labelText, inputId, inputType, inputName){
    const divWrapper = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', `${inputId}`);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.setAttribute('type', `${inputType}`);
    input.setAttribute('id', `${inputId}`);
    input.setAttribute('name', `${inputName}`);

    if(input.type === 'radio')
        input.setAttribute('value', `${inputId}`);

    divWrapper.append(label, input);

    return divWrapper;
}