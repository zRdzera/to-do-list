export function openCloseAside(){
    const hamburguerMenu = document.getElementById('hamburguer-menu-button');
    hamburguerMenu.addEventListener('click', () => {
        const currentClass = hamburguerMenu.getAttribute('class');
        
        if(currentClass === 'show'){
            hamburguerMenu.setAttribute('class', 'hide');
            hideAside();
        }
        else {
            hamburguerMenu.setAttribute('class', 'show');
            showAside();
        }
    });
}

function showAside(){
    const aside = document.getElementById('aside-navigation');
    aside.style.cssText = 'display: none;';
}

function hideAside(){
    const aside = document.getElementById('aside-navigation');
    aside.style.cssText = 'display: flex; flex-direction: column';
}