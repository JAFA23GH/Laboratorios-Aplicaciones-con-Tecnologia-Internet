document.addEventListener('DOMContentLoaded', () => {
    async function loadConfig() {
        try {
            const configResponse = await fetch('configES.json');

            if (!configResponse.ok) {
                throw new Error(`HTTP error fetching config: ${configResponse.status}`);
            }

            const config = await configResponse.json();

            if (config) {
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle && config.sitio) {
                    pageTitle.textContent = `${config.sitio[0]}${config.sitio[1]} ${config.sitio[2]}`;
                } else {
                     console.warn('Element with id "pageTitle" not found or config.sitio is missing.');
                }

                const headerTitle = document.getElementById('headerTitle');
                 if (headerTitle && config.sitio) {
                     headerTitle.innerHTML = `${config.sitio[0]}<span class="UCV">${config.sitio[1]}</span>&nbsp; ${config.sitio[2]}`;
                 } else {
                     console.warn('Element with id "headerTitle" not found or config.sitio is missing.');
                 }

                const welcomeMessageContainer = document.getElementById('welcomeMessageContainer');
                if (welcomeMessageContainer && config.saludo) {
                     welcomeMessageContainer.textContent = `${config.saludo}!`;
                } else {
                     console.warn('Element with id "welcomeMessageContainer" not found or config.saludo is missing.');
                }

                const searchPlaceholder = document.getElementById('searchPlaceholder');
                if (searchPlaceholder && config.buscar !== undefined) {
                    searchPlaceholder.placeholder = config.buscar + '...';
                } else {
                    console.warn('Element with id "searchPlaceholder" not found or config.buscar is missing.');
                }

                const searchButton = document.getElementById('searchButtonText');
                 if (searchButton && config.buscar !== undefined) {
                     searchButton.textContent = config.buscar;
                 } else {
                     console.warn('Element with id "searchButtonText" not found or config.buscar is missing.');
                 }

                const footerText = document.getElementById('footerText');
                if (footerText && config.copyRight) {
                    footerText.textContent = config.copyRight;
                } else {
                    console.warn('Element with id "footerText" not found or config.copyRight is missing.');
                }

            } else {
                console.error('Configuration data not loaded or is empty.');
            }

        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    loadConfig();
});