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

// QR Code functionality
function showQRCode() {
    const qrContainer = document.getElementById('qrCodeContainer');
    if (!qrContainer) {
        console.error('QR container not found');
        alert('Error: No se pudo encontrar el contenedor del código QR.');
        return;
    }

    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.log('QRCode library not loaded, waiting for it...');
        qrContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando librería QR...</p></div>';
        
        // Wait for library to load
        waitForQRCodeLibrary((success) => {
            if (success) {
                generateAndShowQRCode();
            } else {
                qrContainer.innerHTML = '<p class="text-danger">Error: No se pudo cargar la librería QR Code. Por favor, recarga la página.</p>';
                alert('Error: No se pudo cargar la librería QR Code. Por favor, recarga la página.');
            }
        });
        return;
    }

    // Library is available, generate QR code
    generateAndShowQRCode();
}

function generateAndShowQRCode() {
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

    const qrContainer = document.getElementById('qrCodeContainer');
    qrContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Generando...</span></div><p class="mt-2">Generando código QR...</p></div>'; // Show loading state
    
    try {
        // Generate QR code
        QRCode.toCanvas(qrContainer, vcardData, {
            width: 256,
            height: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function (error) {
            if (error) {
                console.error('Error generating QR code:', error);
                qrContainer.innerHTML = '<p class="text-danger">Error generando el código QR. Por favor, intenta de nuevo.</p>';
            } else {
                console.log('QR code generated successfully');
            }
        });
        
        // Show the modal
        const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
        qrModal.show();
    } catch (error) {
        console.error('Exception in generateAndShowQRCode:', error);
        qrContainer.innerHTML = '<p class="text-danger">Error inesperado generando el código QR. Por favor, recarga la página.</p>';
        
        // Still show the modal even if QR generation fails
        const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
        qrModal.show();
    }
}

function downloadQRCode() {
    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded');
        alert('Error: La librería QR Code no se ha cargado correctamente. Por favor, recarga la página.');
        return;
    }

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

    try {
        // Generate QR code as data URL
        QRCode.toDataURL(vcardData, {
            width: 512,
            height: 512,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function (error, url) {
            if (error) {
                console.error('Error generating QR code for download:', error);
                alert('Error generando el código QR para descarga. Por favor, intenta de nuevo.');
                return;
            }
            
            console.log('QR code generated for download successfully');
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lunova-soluciones-qr.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    } catch (error) {
        console.error('Exception in downloadQRCode:', error);
        alert('Error inesperado generando el código QR para descarga. Por favor, intenta de nuevo.');
    }
}

// Function to check if QRCode library is loaded
function checkQRCodeLibrary() {
    if (typeof QRCode === 'undefined') {
        console.warn('QRCode library not loaded yet');
        return false;
    }
    return true;
}

// Function to wait for QRCode library to load
function waitForQRCodeLibrary(callback, maxAttempts = 10) {
    let attempts = 0;
    
    const checkLibrary = () => {
        attempts++;
        if (checkQRCodeLibrary()) {
            console.log('QRCode library loaded successfully after', attempts, 'attempts');
            callback(true);
            return;
        }
        
        if (attempts >= maxAttempts) {
            console.error('QRCode library failed to load after', maxAttempts, 'attempts');
            callback(false);
            return;
        }
        
        // Wait 500ms before next attempt
        setTimeout(checkLibrary, 500);
    };
    
    checkLibrary();
}

// Add event listener to check library when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check QRCode library after a short delay to ensure it's loaded
    setTimeout(() => {
        if (checkQRCodeLibrary()) {
            console.log('QRCode library loaded successfully');
        } else {
            console.warn('QRCode library not loaded immediately, will retry...');
        }
    }, 1000);
});
