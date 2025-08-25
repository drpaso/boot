/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});

// vCard functionality
function downloadVCard() {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Lunova Soluciones
ORG:Lunova Soluciones
TEL:+1 915 328 2762
EMAIL:info@lunovasoluciones.com
URL:lunovasoluciones.com
TITLE:Empresa de Servicios IT
NOTE:Especialistas en servicios de IT para PYMES. Soporte técnico, ciberseguridad, servicios cloud y gestión de infraestructura IT 24/7.
ADR:;;El Paso;TX;;;USA
END:VCARD`;

    const blob = new Blob([vcardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lunova-soluciones.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function addToContacts() {
    // Check if the Web Contacts API is available
    if ('contacts' in navigator && 'ContactsManager' in window) {
        const contactInfo = {
            name: ['Lunova Soluciones'],
            tel: ['+1 915 328 2762'],
            email: ['info@lunovasoluciones.com'],
            url: ['lunovasoluciones.com'],
            organization: ['Lunova Soluciones'],
            title: ['Empresa de Servicios IT']
        };

        navigator.contacts.select(['name', 'tel', 'email'], { multiple: false })
            .then((contacts) => {
                // This will open the native contacts app
                console.log('Contacts selected:', contacts);
            })
            .catch((err) => {
                console.error('Error accessing contacts:', err);
                // Fallback to download vCard
                downloadVCard();
            });
    } else {
        // Fallback for browsers that don't support Web Contacts API
        alert('Tu navegador no soporta la API de contactos. Descargando vCard en su lugar.');
        downloadVCard();
    }
}
