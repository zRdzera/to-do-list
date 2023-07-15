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

// Handy function to create a button with an image inside (right-side of a task elements and add new task button)
export function buttonWithImg(elementClass, imgSrc, optionalSpanText){
    const button = document.createElement('button');
    button.setAttribute('class', `${elementClass}`);
    button.setAttribute('type', 'button');

    const img = document.createElement('img');
    img.src = `${imgSrc}`;

    if(optionalSpanText){
        const span = document.createElement('span');
        span.textContent = `${optionalSpanText}`;
        span.style.cssText = 'order: 2'; // change order of span, putting him after the img
        button.appendChild(span);
    }

    button.appendChild(img);
    return button;
}

// Function that comes in handy to create elements that goes inside a project
export function createElement(tagName, ...rest){
    const restParameters = rest[0]; // Need this because it comes as an array
    const {elementClass, elementId, elementSrc, elementText} = restParameters;
    const element = document.createElement(`${tagName}`);

    if(elementId)
        element.setAttribute('id', `${elementId}`);

    if(elementClass)
        element.setAttribute('class', `${elementClass}`);

    if(elementSrc)
        element.src = elementSrc;

    if(elementText)
        element.textContent = elementText;

    return element;
}