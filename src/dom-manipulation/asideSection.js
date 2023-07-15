export default function openCloseAside(){
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
    aside.setAttribute('class', 'aside-show'); // Add this class to put main-content back to its place
    aside.style.cssText = 'display: flex;';
}

function hideAside(){
    const aside = document.getElementById('aside-navigation');
    aside.setAttribute('class', 'aside-hide'); // Add this class to allow the main-content to grow
    aside.style.cssText = 'display: none;';
}