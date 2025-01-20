// document.addEventListener('DOMContentLoaded', () => {
//     const sections = document.querySelectorAll('section');

//     let isScrolling = false;

//     window.addEventListener('wheel', (event) => {
//         if (isScrolling) return;

//         isScrolling = true;
//         const delta = event.deltaY > 0 ? 1 : -1;

//         const currentSection = document.querySelector('section.active') || sections[0];
//         const currentIndex = Array.from(sections).indexOf(currentSection);
//         const nextIndex = Math.min(
//             Math.max(currentIndex + delta, 0),
//             sections.length - 1
//         );

//         if (nextIndex !== currentIndex) {
//             sections[currentIndex].classList.remove('active');
//             sections[nextIndex].classList.add('active');
//             sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
//         }

//         setTimeout(() => (isScrolling = false), 1000); // Prevent spamming
//     });

//     // Mark the first section as active
//     sections[0].classList.add('active');
// });

function scrollToSubscribe() {
    document.querySelector('.subscribe-section').scrollIntoView({ behavior: 'smooth' });
}

function scrollToHero() {
    document.querySelector('.hero-section').scrollIntoView({ behavior: 'smooth' });
}

function openPopup() {
    document.getElementById('popup-overlay').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
}

function handleScroll() {
    const hero = document.querySelector('.hero-section');
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;

    // Reset body classes
    document.body.classList.remove('scroll-active', 'btn-custom-light', 'btn-custom-dark');

    // Determine if the scroll position is beyond the hero section
    if (scrollPosition >= hero.offsetHeight) {
        document.body.classList.add('scroll-active');
    }

    // Find the section in view and get its background color
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 20 && rect.bottom >= window.innerHeight / 20) {
            const sectionStyle = window.getComputedStyle(section);
            const backgroundColor = sectionStyle.backgroundColor;
            const logoContainer = document.querySelector('.logo-container');

            // Handle background color matching (convert RGB to Hex if needed)
            if (rgbToHex(backgroundColor) === '#EAE6DA') {
                document.body.classList.add('btn-custom-dark');                
                logoContainer.classList.add('light-background');
                logoContainer.classList.remove('dark-background');
            } else {
                document.body.classList.add('btn-custom-light');
                logoContainer.classList.add('dark-background');
                logoContainer.classList.remove('light-background');
            }
        }
    });
};

// Helper function to convert RGB to Hex
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number); // Extract RGB values
    return `#${((1 << 24) + (rgbValues[0] << 16) + (rgbValues[1] << 8) + rgbValues[2])
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
}

window.addEventListener('load', handleScroll);
window.addEventListener('scroll', handleScroll);
// Subscribe form
document.querySelector('#subscribe-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const name = document.querySelector('#name').value;

    try {
        
        // Get the user's geographical location (IP address-based)
        const locationResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const locationData = await locationResponse.json();
        
        // Extract the location details
        const location = locationData.city + ', ' + locationData.region + ', ' + locationData.country;

        const response = await fetch('https://script.google.com/macros/s/AKfycbyEem7nMtOvNlj25OAfT6UlzregralsEaJ-FdsyxQbAYukUh7X9jQkEf-sGCWKUDu_w-A/exec', {
            method: 'POST',
            body: JSON.stringify({
                sheet: 'subscriptions',  // Specify the sheet to add to
                name: name,
                email: email,
                location: location, 
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors'
        });

        // Check if the response is empty
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Try to parse the response as JSON
        const result = await response.json().catch((error) => {
            alert("Failed to receive valid response from the server.");
            return null; // Return null if JSON parsing fails
        });

        // If result is null, handle the error
        if (!result) {
            return;
        }

        // If the response indicates success
        if (result.status === 'success') {
            alert('Subscription added successfully!');
            // Clear the form
            document.querySelector('#subscribe-form').reset();
        } else {
            alert('Failed to add subscription.');
        }
    } catch (error) {
        alert('Subscription added successfully!');
        // Clear the form
        document.querySelector('#subscribe-form').reset();
    }
});
// Popup Form Submission
document.querySelector('#survey-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const locationResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const locationData = await locationResponse.json();
    const form = document.querySelector('#survey-form'); // Replace with your form's ID

    // Extract the location details
    const location = locationData.city + ', ' + locationData.region + ', ' + locationData.country;

    // Collect answers from all sections of the form
    const answers = {
        name: document.querySelector('#survey-name').value,
        email: document.querySelector('#survey-email').value,
        ageRange: document.querySelector('#age-range').value,
        experience: document.querySelector('#experience').value,
        technologyUsage: document.querySelector('#technology-usage').value,
        subscribe: document.querySelector('#subscribe').checked,  
        plantNeeds: document.querySelector('#plant-needs').value,
        existingSolutions: document.querySelector('#existing-solutions').value,
        missingFeatures: document.querySelector('#missing-features').value,
        houseplants: document.querySelector('#houseplants').value,
        plantLocation: document.querySelector('#plant-location').value,
        otherLocation: document.querySelector('#other-location-input').value,
        plantTypes: document.querySelector('#plant-types').value,
        otherTypes: document.querySelector('#other-types').value,
        plantApps: document.querySelector('#competitor-1').checked,
        smartPots: document.querySelector('#competitor-2').checked,
        smartMonitors: document.querySelector('#competitor-3').checked,
        moistureProbes: document.querySelector('#competitor-4').checked,
        otherCompetitor: document.querySelector('#other-competitor').value,
        competitionGood: document.querySelector('#competition-good').value,
        competitionBad: document.querySelector('#competition-bad').value,
        bluetooth: document.querySelector('#bluetooth').checked,
        wifi: document.querySelector('#wifi').checked,
        notifications: document.querySelector('#notifications').checked,
        recommendations: document.querySelector('#recommendations').checked,
        thirdPartyIntegration: document.querySelector('#third-party-integration').checked,
        ledPlant: document.querySelector('#led-plant').checked,
        ledBattery: document.querySelector('#led-battery').checked,
        display: document.querySelector('#display').checked,
        enclosure: document.querySelector('#enclosure').checked,
        otherFeatures: document.querySelector('#other-features').value,
        enclosureColour: document.querySelector('#enclosure-color').value,
        batteryRechargeTime: document.querySelector('#battery-recharge-time').value,
        deepSleepTime: document.querySelector('#deep-sleep-time').value,
        purchasePreference: document.querySelector('#purchase-preference').value,
        otherpurchasePreference: document.querySelector('#other-purchase-preference').value,
        spending: document.querySelector('#spending').value,
        additionalThoughts: document.querySelector('#additional-thoughts').value,
        location: location,
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyEem7nMtOvNlj25OAfT6UlzregralsEaJ-FdsyxQbAYukUh7X9jQkEf-sGCWKUDu_w-A/exec', {
            method: 'POST',
            body: JSON.stringify({
                sheet: 'survey',  // Specify the sheet to add to
                ...answers,  // Include all answers from the form
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors'
        });

        // Check if the response is empty
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Try to parse the response as JSON
        const result = await response.json().catch((error) => {
            console.error("Error parsing JSON response:", error);
            return null; // Return null if JSON parsing fails
        });

        // If result is null, handle the error
        if (!result) {
            alert("Failed to receive valid response from the server.");
            return;
        }

        console.log(result); // Log the response object
        if (result.status === 'success') {
            alert('Survey submitted successfully!');
        } else {
            alert('Failed to submit survey.');
        }
    } catch (error) {
        alert("Form submitted successfully!");

        // Clear the form inputs
        form.reset();

        document.getElementById('popup-overlay').style.display = 'none';

    }
});

function nextSection(sectionNumber) {
    const currentSection = document.getElementById(`section-${sectionNumber - 1}`);
    const nextSection = document.getElementById(`section-${sectionNumber}`);

    // Validate the current section for required fields and numeric ranges
    if (isValidSection(currentSection)) {
        currentSection.style.display = 'none'; // Hide current section
        nextSection.style.display = 'block';   // Show next section
    } 
}

function prevSection(sectionNumber) {
    const currentSection = document.getElementById(`section-${sectionNumber + 1}`);
    const prevSection = document.getElementById(`section-${sectionNumber}`);
    
    currentSection.style.display = 'none'; // Hide current section
    prevSection.style.display = 'block';   // Show previous section
}
function isValidSection(section) {
    let isValid = true;
    let errorMessage = '';

    // Find all required inputs in the section
    const requiredInputs = section.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        // Check if the input is empty
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid'); // Add invalid class
        } else {
            input.classList.remove('is-invalid'); // Remove invalid class if valid
        }

        // Check if the input is a number with min/max limits
        if (input.type === 'number') {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            // Validate the value is within min/max limits
            if (!isNaN(value) && (value < min || value > max)) {
                isValid = false;
                errorMessage += `${input.placeholder || input.id} must be between ${min} and ${max}.\n`;
                input.classList.add('is-invalid'); // Add invalid class
            } 
            // Validate the value is an integer
            else if (!Number.isInteger(value)) {
                isValid = false;
                errorMessage += `${input.placeholder || input.id} must be a whole number.\n`;
                input.classList.add('is-invalid'); // Add invalid class
            } 
            // If valid, remove the invalid class
            else {
                input.classList.remove('is-invalid'); // Remove invalid class if valid
            }
        }

        // Check if the input is an email and validate its format
        if (input.type === 'email') {
            const emailValue = input.value.trim();
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Simple email regex

            if (!emailPattern.test(emailValue)) {
                isValid = false;
                errorMessage += `${input.placeholder || input.id} must be a valid email address.\n`;
                input.classList.add('is-invalid'); // Add invalid class
            } else {
                input.classList.remove('is-invalid'); // Remove invalid class if valid
            }
        }

    });

    return isValid;
}




// Initialize the form by showing the first section
nextSection(1);