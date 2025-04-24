// Diet Calculators
document.addEventListener("DOMContentLoaded", () => {
    const calculatorsSection = document.getElementById('calculators');
    const calculatorSection = document.querySelector('.calculator-section');
    
    // Get all calculator divs
    const calculators = {
        calories: document.getElementById('calories'),
        macros: document.getElementById('macros'),
        water: document.getElementById('water')
    };

    // Hide all calculators initially
    if (calculatorsSection) {
        calculators.calories.style.display = 'none';
        calculators.macros.style.display = 'none';
        calculators.water.style.display = 'none';
        calculatorSection.style.display = 'none';
    }

    // Handle calculator selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('href').substring(1);
            
            // Hide all calculators first
            calculators.calories.style.display = 'none';
            calculators.macros.style.display = 'none';
            calculators.water.style.display = 'none';

            // Show selected calculator
            const selectedCalc = document.getElementById(target);
            if (selectedCalc) {
                calculatorSection.style.display = 'block';
                selectedCalc.style.display = 'block';
                selectedCalc.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Calorie Calculator
    const calorieForm = document.getElementById('calorieForm');
    if (calorieForm) {
        calorieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const weight = parseFloat(document.getElementById('calorie-weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const activity = parseFloat(document.getElementById('activity').value);
            const targetWeight = parseFloat(document.getElementById('target-body-weight').value);
            const timeToGoal = parseFloat(document.getElementById('time-to-goal').value);
            
            if (isNaN(weight) || isNaN(height) || isNaN(age)) {
                alert('Please enter valid numbers for weight, height, and age');
                return;
            }
            
            const calories = calculateCalories(age, gender, weight, height, activity, targetWeight, timeToGoal);
            document.getElementById('calorieValue').textContent = `${Math.round(calories)} calories per day`;
        });
    }

    // Macro Calculator
    const macroForm = document.getElementById('macroForm');
    if (macroForm) {
        macroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('macro-weight').value);
            const goalType = document.getElementById('goal-type').value;
            const activityLevel = parseFloat(document.getElementById('activity-level').value);
            
            if (isNaN(weight)) {
                alert('Please enter valid number for weight');
                return;
            }
            
            const macros = calculateMacros(weight, activityLevel, goalType);
            document.getElementById('proteinValue').textContent = `${macros.protein}g`;
            document.getElementById('carbsValue').textContent = `${macros.carbs}g`;
            document.getElementById('fatsValue').textContent = `${macros.fat}g`;
            document.getElementById('totalCalories').textContent = `Total Calories: ${macros.calories}`;
        });
    }

    // Water Intake Calculator
    const waterForm = document.getElementById('waterForm');
    if (waterForm) {
        waterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('water-weight').value);
            const activity = parseFloat(document.getElementById('water-activity').value);
            
            if (isNaN(weight) || isNaN(activity)) {
                alert('Please enter valid numbers for weight and activity level');
                return;
            }
            
            const waterIntake = calculateWaterIntake(weight, activity);
            document.getElementById('waterAmount').textContent = `${waterIntake.liters.toFixed(1)} liters per day`;
            document.getElementById('waterGlasses').textContent = `Approximately ${waterIntake.glasses} glasses per day`;
        });
    }
});

// Calculator Functions
const one_kg_in_calories = 7700;
let total_kg_to_lose = 0;
let total_kg_to_gain = 0;
let total_calories_to_lose = 0;
let total_calories_to_gain = 0;
let total_calories_to_lose_per_week = 0;
let total_calories_to_gain_per_week = 0;

function calculateCalories(age, gender, weight, height, activity, targetWeight, timeToGoal) {
    // Calculate BMR
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE
    let tdee = bmr * activity;

    if (targetWeight && timeToGoal) {
        total_kg_to_lose = weight - targetWeight;
        total_kg_to_gain = targetWeight - weight;
    
        total_calories_to_lose = one_kg_in_calories * total_kg_to_lose;
        total_calories_to_gain = one_kg_in_calories * total_kg_to_gain;
    
        total_calories_to_lose_per_week = total_calories_to_lose / timeToGoal;
        total_calories_to_gain_per_week = total_calories_to_gain / timeToGoal;
    
        // Adjust for goal
        if (targetWeight > weight) {
            tdee += (total_calories_to_gain_per_week / 7);
        } else {
            tdee -= (total_calories_to_lose_per_week / 7);
        }
    }

    return tdee;
}

function calculateMacros(weight, activityLevel, goalType) {
    const baseCalories = weight * 24 * parseFloat(activityLevel);
    
    let proteinMultiplier, fatMultiplier, calorieAdjustment;
    
    switch(goalType) {
        case 'fat-loss':
            proteinMultiplier = 2.2;    // 2.2g protein per kg
            fatMultiplier = 0.8;        // 0.8g fat per kg
            calorieAdjustment = -500;   // Calorie deficit
            break;
        case 'maintenance':
            proteinMultiplier = 2.0;    // 2.0g protein per kg
            fatMultiplier = 1.0;        // 1.0g fat per kg
            calorieAdjustment = 0;      // No adjustment
            break;
        case 'muscle-gain':
            proteinMultiplier = 2.4;    // 2.4g protein per kg
            fatMultiplier = 1.0;        // 1.0g fat per kg
            calorieAdjustment = 500;    // Calorie surplus
            break;
    }
    
    // Calculate daily calories with adjustment
    const dailyCalories = baseCalories + calorieAdjustment;
    
    // Calculate macros in grams
    const protein = weight * proteinMultiplier;
    const fat = weight * fatMultiplier;
    
    // Calculate remaining calories for carbs
    const proteinCalories = protein * 4;    // 4 calories per gram of protein
    const fatCalories = fat * 9;            // 9 calories per gram of fat
    const remainingCalories = dailyCalories - proteinCalories - fatCalories;
    
    // Convert remaining calories to carbs (4 calories per gram)
    const carbs = Math.max(0, remainingCalories / 4);
    
    return {
        calories: Math.round(dailyCalories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
    };
}

function calculateWaterIntake(weight, activity) {
  // Base water intake: 30-35ml per kg of body weight
  const baseIntake = weight * 0.033;
  
  // Adjust for activity level (1.2-2.0 multiplier)
  const activityMultiplier = 1 + ((activity - 1) * 0.2);
  
  // Calculate total water intake in liters
  const liters = baseIntake * activityMultiplier;
  
  // Convert to glasses (assuming 250ml per glass)
  const glasses = Math.round(liters * 4);
  
  return {
      liters: liters,
      glasses: glasses
  };
} 