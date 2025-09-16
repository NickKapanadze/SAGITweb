// Language switcher functionality
let translations = {};
let currentLang = localStorage.getItem('language') || 'ge'; // Default to Georgian

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('/assets/lang.json');
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Apply translations based on current language
function applyTranslations() {
    // Update language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = translations[currentLang].buttons.switchLang;
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = translations[currentLang];
        
        // Navigate through the nested objects
        for (const key of keys) {
            if (value[key] !== undefined) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${element.getAttribute('data-i18n')}`);
                return;
            }
        }
        
        // Handle different element types
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
            element.placeholder = value;
        } else if (element.tagName === 'META') {
            element.content = value;
        } else {
            element.textContent = value;
        }
    });
}

// Switch language
function switchLanguage() {
    currentLang = currentLang === 'ge' ? 'en' : 'ge';
    localStorage.setItem('language', currentLang);
    applyTranslations();
}

// Initialize language settings
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    
    // Add event listener to language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', switchLanguage);
    }
});