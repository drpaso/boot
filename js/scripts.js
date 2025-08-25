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
    console.log('=== QR CODE DEBUG START ===');
    console.log('showQRCode function called');
    console.log('QRCode library available:', typeof QRCode !== 'undefined');
    console.log('Bootstrap Modal available:', typeof bootstrap !== 'undefined');
    console.log('QRCode load failed flag:', window.QRCodeLoadFailed);
    console.log('QRCode object:', QRCode);
    console.log('=== QR CODE DEBUG END ===');
    
    const qrContainer = document.getElementById('qrCodeContainer');
    if (!qrContainer) {
        console.error('QR container not found');
        alert('Error: No se pudo encontrar el contenedor del código QR.');
        return;
    }

    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        // If we know the library failed to load, don't wait
        if (window.QRCodeLoadFailed) {
            console.log('QRCode library known to have failed, attempting manual load...');
            qrContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando librería QR manualmente...</p></div>';
            
            loadQRCodeLibraryManually((success) => {
                if (success) {
                    generateAndShowQRCode();
                } else {
                    qrContainer.innerHTML = '<p class="text-danger">Error: No se pudo cargar la librería QR Code. Por favor, recarga la página.</p>';
                    alert('Error: No se pudo cargar la librería QR Code. Por favor, recarga la página.');
                    
                    // Show modal anyway with error message
                    try {
                        const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
                        qrModal.show();
                    } catch (modalError) {
                        console.error('Error showing modal:', modalError);
                    }
                }
            });
            return;
        }
        
        console.log('QRCode library not loaded, waiting for it...');
        qrContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando librería QR...</p></div>';
        
        // Wait for library to load
        waitForQRCodeLibrary((success) => {
            if (success) {
                generateAndShowQRCode();
            } else {
                qrContainer.innerHTML = '<p class="text-danger">Error: No se pudo cargar la librería QR Code. Por favor, recarga la página.</p>';
                alert('Error: No se pudo cargar la librería QR Code. Por favor, recarga la página.');
                
                // Show modal anyway with error message
                try {
                    const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
                    qrModal.show();
                } catch (modalError) {
                    console.error('Error showing modal:', modalError);
                }
            }
        });
        return;
    }

    // Library is available, generate QR code
    console.log('About to generate QR code...');
    
    // First, try a simple test QR code
    try {
        console.log('Testing simple QR code generation...');
        const testContainer = document.createElement('div');
        testContainer.id = 'testQR';
        testContainer.style.width = '100px';
        testContainer.style.height = '100px';
        testContainer.style.border = '1px solid red';
        
        QRCode.toCanvas(testContainer, 'TEST', {
            width: 100,
            height: 100
        }, function (error) {
            if (error) {
                console.error('Simple QR test failed:', error);
            } else {
                console.log('Simple QR test successful!');
            }
        });
        
        // Add test QR to page temporarily
        document.body.appendChild(testContainer);
        setTimeout(() => document.body.removeChild(testContainer), 3000);
        
    } catch (testError) {
        console.error('Exception in simple QR test:', testError);
    }
    
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
        try {
            const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
            qrModal.show();
        } catch (modalError) {
            console.error('Error showing modal:', modalError);
            // Fallback: show alert with QR code info
            alert('Código QR generado. Si no puedes ver la ventana modal, recarga la página.');
        }
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
            // Try to load manually as last resort
            loadQRCodeLibraryManually(callback);
            return;
        }
        
        // Wait 500ms before next attempt
        setTimeout(checkLibrary, 500);
    };
    
    checkLibrary();
}

// Function to manually load QRCode library
function loadQRCodeLibraryManually(callback) {
    console.log('Attempting to load QRCode library manually...');
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js';
    script.onload = function() {
        console.log('QRCode library loaded manually successfully');
        callback(true);
    };
    script.onerror = function() {
        console.error('Failed to load QRCode library manually');
        callback(false);
    };
    
    document.head.appendChild(script);
}

// Function to retry QR code generation
function retryQRCode() {
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
        generateAndShowQRCode();
    }
}

// Test function to debug basic functionality
function testButton() {
    console.log('Test button clicked - basic functionality working');
    
    // Test if we can access DOM elements
    const qrContainer = document.getElementById('qrCodeContainer');
    console.log('QR Container found:', qrContainer !== null);
    
    // Test if Bootstrap is available
    console.log('Bootstrap available:', typeof bootstrap !== 'undefined');
    
    // Test if QRCode library is available
    console.log('QRCode library available:', typeof QRCode !== 'undefined');
    
    // Additional diagnostic information
    console.log('QRCode load failed flag:', window.QRCodeLoadFailed);
    console.log('Page URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    
    // Check network status
    if (navigator.onLine) {
        console.log('Network: Online');
    } else {
        console.log('Network: Offline');
    }
    
    // Show comprehensive status
    let statusMessage = 'Estado del sistema:\n';
    statusMessage += `• JavaScript básico: ✅ Funcionando\n`;
    statusMessage += `• Contenedor QR: ${qrContainer !== null ? '✅ Encontrado' : '❌ No encontrado'}\n`;
    statusMessage += `• Bootstrap: ${typeof bootstrap !== 'undefined' ? '✅ Disponible' : '❌ No disponible'}\n`;
    statusMessage += `• Librería QR: ${typeof QRCode !== 'undefined' ? '✅ Cargada' : '❌ No cargada'}\n`;
    statusMessage += `• Fallback flag: ${window.QRCodeLoadFailed ? '❌ Falló' : '✅ OK'}\n`;
    statusMessage += `• Red: ${navigator.onLine ? '✅ En línea' : '❌ Sin conexión'}`;
    
    alert(statusMessage);
}

// Simple QR test function
function testSimpleQR() {
    console.log('=== SIMPLE QR TEST START ===');
    
    if (typeof QRCode === 'undefined') {
        alert('QRCode library not available! Check console for details.');
        console.error('QRCode library not available for simple test');
        return;
    }
    
    console.log('QRCode library available for simple test');
    
    // Create a simple test container
    const testContainer = document.createElement('div');
    testContainer.id = 'simpleQRTest';
    testContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid blue;
        padding: 20px;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    testContainer.innerHTML = '<h4>QR Test</h4><div id="qrTestArea"></div><button onclick="this.parentElement.remove()">Close</button>';
    
    document.body.appendChild(testContainer);
    
    const qrArea = document.getElementById('qrTestArea');
    
    try {
        console.log('Attempting to generate simple QR code...');
        QRCode.toCanvas(qrArea, 'LUNOVA TEST', {
            width: 200,
            height: 200,
            margin: 2
        }, function (error) {
            if (error) {
                console.error('Simple QR generation failed:', error);
                qrArea.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
            } else {
                console.log('Simple QR generation successful!');
                qrArea.innerHTML += '<p style="color: green;">QR Code generated successfully!</p>';
            }
        });
    } catch (e) {
        console.error('Exception in simple QR test:', e);
        qrArea.innerHTML = '<p style="color: red;">Exception: ' + e.message + '</p>';
    }
    
    console.log('=== SIMPLE QR TEST END ===');
}

// Add event listener to check library when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    console.log('Page URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    
    // Check QRCode library after a short delay to ensure it's loaded
    setTimeout(() => {
        console.log('Checking QRCode library after timeout...');
        if (checkQRCodeLibrary()) {
            console.log('QRCode library loaded successfully');
        } else {
            console.warn('QRCode library not loaded immediately, will retry...');
        }
    }, 1000);
    
    // Additional check after 3 seconds
    setTimeout(() => {
        console.log('Final QRCode library check...');
        if (checkQRCodeLibrary()) {
            console.log('QRCode library loaded successfully (final check)');
        } else {
            console.error('QRCode library failed to load after 3 seconds');
            console.log('Available global objects:', Object.keys(window).filter(key => key.includes('QR') || key.includes('qrcode')));
        }
    }, 3000);
});
