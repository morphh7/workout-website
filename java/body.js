// Body Calculators
document.addEventListener("DOMContentLoaded", () => {
    const calculatorsSection = document.getElementById('calculators');
    const calculatorSection = document.querySelector('.calculator-section');
    
    // Get all calculator divs
    const calculators = {
        bodyFat: document.getElementById('bodyFat'),
        sleep: document.getElementById('sleep'),
    };

    // Hide all calculators initially
    if (calculatorsSection) {
        calculators.bodyFat.style.display = 'none';
        calculators.sleep.style.display = 'none';
        calculatorSection.style.display = 'none';
    }

    // Handle calculator selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('href').substring(1);
            
            // Hide all calculators first
            calculators.bodyFat.style.display = 'none';
            calculators.sleep.style.display = 'none';

            // Show selected calculator
            const selectedCalc = document.getElementById(target);
            if (selectedCalc) {
                calculatorSection.style.display = 'block';
                selectedCalc.style.display = 'block';
                selectedCalc.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Body Fat Calculator
    const bodyFatForm = document.getElementById('bodyFatForm');
    if (bodyFatForm) {
        // Show/hide hip measurement based on gender
        const genderSelect = document.getElementById('bodyFat-gender');
        const hipInputGroup = document.getElementById('hip-input-group');
        
        genderSelect.addEventListener('change', function() {
            hipInputGroup.style.display = this.value === 'female' ? 'block' : 'none';
            if (this.value === 'male') {
                document.getElementById('bodyFat-hip').value = '';
            }
        });

        bodyFatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const gender = document.getElementById('bodyFat-gender').value;
            const height = parseFloat(document.getElementById('bodyFat-height').value);
            const neck = parseFloat(document.getElementById('bodyFat-neck').value);
            const waist = parseFloat(document.getElementById('bodyFat-waist').value);
            const hip = gender === 'female' ? parseFloat(document.getElementById('bodyFat-hip').value) : 0;

            if (isNaN(height) || isNaN(neck) || isNaN(waist) || (gender === 'female' && isNaN(hip))) {
                alert('Please enter valid measurements for all fields');
                return;
            }
            
            const bodyFat = calculateBodyFat(gender, height, neck, waist, hip);
            const category = getBodyFatCategory(gender, bodyFat);
            
            document.getElementById('bodyFatValue').textContent = `${bodyFat.toFixed(1)}%`;
            document.getElementById('bodyFatCategory').textContent = `Category: ${category}`;
        });
    }

    // Sleep Impact Calculator
    const sleepForm = document.getElementById('sleepForm');
    if (sleepForm) {
        sleepForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const hours = parseFloat(document.getElementById('sleep-hours').value);
            const quality = document.getElementById('sleep-quality').value;
            
            if (isNaN(hours)) {
                alert('Please enter valid number for sleep hours');
                return;
            }
            
            const impact = calculateSleepImpact(hours, quality);
            document.getElementById('sleepImpact').textContent = impact.message;
            document.getElementById('sleepRecommendation').textContent = impact.recommendation;
        });
    }
});

// Calculator Functions
function calculateBodyFat(gender, height, neck, waist, hip) {
    // U.S. Navy Body Fat Calculator formula
    if (gender === 'male') {
        // Male formula: %BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
        const logWaistNeck = Math.log10(waist - neck);
        const logHeight = Math.log10(height);
        return 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
    } else {
        // Female formula: %BF = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
        const logWaistHipNeck = Math.log10(waist + hip - neck);
        const logHeight = Math.log10(height);
        return 495 / (1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight) - 450;
    }
}

function getBodyFatCategory(gender, bodyFat) {
    const categories = {
        male: [
            { max: 2, category: 'Essential Fat' },
            { max: 5, category: 'Athletic' },
            { max: 13, category: 'Fitness' },
            { max: 17, category: 'Average' },
            { max: 24, category: 'Overweight' },
            { max: 100, category: 'Obese' }
        ],
        female: [
            { max: 10, category: 'Essential Fat' },
            { max: 13, category: 'Athletic' },
            { max: 20, category: 'Fitness' },
            { max: 24, category: 'Average' },
            { max: 31, category: 'Overweight' },
            { max: 100, category: 'Obese' }
        ]
    };

    const genderCategories = categories[gender];
    for (const cat of genderCategories) {
        if (bodyFat <= cat.max) {
            return cat.category;
        }
    }
    return 'Unknown';
}

function calculateSleepImpact(hours, quality) {
    let impact = '';
    let recommendation = '';
    
    if (hours < 6) {
        impact = 'Significant negative impact on recovery and muscle growth';
        recommendation = 'Aim for at least 7-9 hours of sleep per night';
    } else if (hours < 7) {
        impact = 'Moderate negative impact on recovery';
        recommendation = 'Try to get 7-8 hours of sleep for optimal recovery';
    } else if (hours <= 9) {
        impact = 'Optimal sleep duration for recovery and growth';
        recommendation = 'Maintain this sleep schedule';
    } else {
        impact = 'Adequate sleep duration, but quality is important';
        recommendation = 'Focus on sleep quality and consistency';
    }
    
    // Adjust based on sleep quality
    if (quality === 'poor') {
        impact += ' (Poor sleep quality)';
        recommendation += '. Consider improving sleep hygiene';
    } else if (quality === 'excellent') {
        impact += ' (Excellent sleep quality)';
    }
    
    return {
        message: impact,
        recommendation: recommendation
    };
}