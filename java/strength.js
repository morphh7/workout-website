// Strength Calculators
document.addEventListener("DOMContentLoaded", () => {
    const calculatorsSection = document.getElementById('calculators');
    const calculatorSection = document.querySelector('.calculator-section');
    
    const calculators = {
        oneRM: document.getElementById('oneRM'),
        progression: document.getElementById('progression'),
        muscleRecovery: document.getElementById('muscleRecovery')
    };

    // hide all calculators initially
    if (calculatorsSection) {
        calculators.oneRM.style.display = 'none';
        calculators.progression.style.display = 'none';
        calculators.muscleRecovery.style.display = 'none';
        calculatorSection.style.display = 'none';
    }

    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('href').substring(1);
            
            calculators.oneRM.style.display = 'none';
            calculators.progression.style.display = 'none';
            calculators.muscleRecovery.style.display = 'none';

            // Show selected calculator
            const selectedCalc = document.getElementById(target);
            if (selectedCalc) {
                calculatorSection.style.display = 'block';
                selectedCalc.style.display = 'block';
                selectedCalc.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 1RM Calculator
    const oneRMForm = document.getElementById('oneRMForm');
    if (oneRMForm) {
        oneRMForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('oneRM-weight').value);
            const reps = parseInt(document.getElementById('reps').value);
            
            if (isNaN(weight) || isNaN(reps)) {
                alert('Please enter valid numbers for weight and reps');
                return;
            }
            
            const oneRM = calculate1RM(weight, reps);
            document.getElementById('oneRMValue').textContent = `${Math.round(oneRM)} kg`;
        });
    }

    // Progression Calculator
    const progressionForm = document.getElementById('progressionForm');
    if (progressionForm) {
        progressionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentLift = parseFloat(document.getElementById('current-lift').value);
            const targetLift = parseFloat(document.getElementById('target-lift').value);
            const trainingFrequency = parseInt(document.getElementById('training-frequency').value);
            const experienceLevel = document.getElementById('experience-level').value;
            
            if (isNaN(currentLift) || isNaN(targetLift) || isNaN(trainingFrequency)) {
                alert('Please enter valid numbers for all fields');
                return;
            }
            
            const prediction = calculateProgression(currentLift, targetLift, trainingFrequency, experienceLevel);
            document.getElementById('progressionValue').textContent = `Predictions based on your inputs:`;
            document.getElementById('timeToGoal').textContent = `Estimated time to reach your goal: ${prediction.monthsToGoal} months`;
            document.getElementById('weeklyRate').textContent = `Weekly progression needed: ${prediction.weeklyRate.toFixed(2)} kg`;
            document.getElementById('monthlyRate').textContent = `Monthly progression needed: ${prediction.monthlyRate.toFixed(2)} kg`;
            document.getElementById('liftDifference').textContent = `Estimated lift difference: ${prediction.liftDifference.toFixed(2)} kg`;
        });
    }

    // Combined Volume and Recovery Calculator
    const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('volume-weight').value);
            const sets = parseInt(document.getElementById('sets').value);
            const reps = parseInt(document.getElementById('volume-reps').value);
            const frequency = parseInt(document.getElementById('volume-frequency').value);
            const intensity = parseInt(document.getElementById('intensity').value);
            const muscleGroup = document.getElementById('muscle-group').value;
            
            if (isNaN(weight) || isNaN(sets) || isNaN(reps) || isNaN(frequency) || isNaN(intensity)) {
                alert('Please enter valid numbers for all fields');
                return;
            }
            
            // Calculate volume
            const volume = calculateTrainingVolume(weight, sets, reps, frequency);
            
            // Estimate recovery based on volume and intensity
            const recovery = estimateRecovery(intensity, volume.weekly, muscleGroup);
            
            // Display results
            document.getElementById('weeklyVolume').textContent = `Weekly Volume: ${volume.weekly} kg`;
            document.getElementById('monthlyVolume').textContent = `Monthly Volume: ${volume.monthly} kg`;
            document.getElementById('recoveryTime').textContent = `Estimated Recovery Time: ${recovery.time}`;
            document.getElementById('recoveryNotes').textContent = recovery.notes;
        });
    }
});

// Calculator Functions
function calculate1RM(weight, reps) {
    if (reps === 1) return weight;

    return weight / Math.exp(-(reps + 0.64) / 44.2);
}

function calculateProgression(currentLift, targetLift, trainingFrequency, experienceLevel) {
    const liftDifference = targetLift - currentLift;
    
    // Base progression rates (kg per month) based on experience level
    const baseRates = {
        'beginner': 5,
        'intermediate': 2.5,
        'advanced': 1.25
    };
    
    // Adjust rate based on training frequency
    const frequencyMultiplier = 1 + ((trainingFrequency - 1) * 0.1);
    const monthlyRate = baseRates[experienceLevel] * frequencyMultiplier;
    const monthsToGoal = Math.ceil(liftDifference / monthlyRaerte);
    const weeklyRate = monthlyRate / 4;
    
    return {
        monthsToGoal,
        weeklyRate,
        monthlyRate,
        liftDifference
    };
}

function calculateTrainingVolume(weight, sets, reps, frequency) {
    const weeklyVolume = weight * sets * reps * frequency;
    const monthlyVolume = weeklyVolume * 4;
    
    return {
        weekly: Math.round(weeklyVolume),
        monthly: Math.round(monthlyVolume)
    };
}

function estimateRecovery(intensity, volume, muscleGroup) {
    // Base recovery time in hours
    let baseTime = 48;
    
    // Adjust for intensity
    if (intensity > 80) baseTime *= 1.5;
    else if (intensity < 50) baseTime *= 0.75;
    
    // Adjust for volume
    if (volume > 10000) baseTime *= 1.3;
    else if (volume < 5000) baseTime *= 0.8;
    
    // Adjust for muscle group
    const muscleGroupMultipliers = {
        'legs': 1.5,
        'back': 1.3,
        'chest': 1.2,
        'shoulders': 1.1,
        'arms': 1.0
    };
    
    baseTime *= muscleGroupMultipliers[muscleGroup];
    
    // Convert to days
    const days = Math.ceil(baseTime / 24);
    
    // Generate recovery notes based on volume and intensity
    let notes = 'Recovery time may vary based on nutrition, sleep, and overall training load.';
    
    if (volume > 15000) {
        notes += ' This is a very high volume workout. Consider splitting it into multiple sessions.';
    } else if (volume < 5000) {
        notes += ' This is a moderate volume workout. You can train this muscle group again in a few days.';
    }
    
    if (intensity > 85) {
        notes += ' High intensity workout detected. Make sure to get adequate rest and nutrition.';
    }
    
    return {
        time: `${days} days`,
        notes: notes
    };
} 