import React, { useState } from 'react';
import bmiApi from '../utils/bmiApi';
import './BMICalculator.css';

const BMI_PROFILE_STORAGE_KEY = 'wellnest-bmi-profile';

const BMICalculator = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('male');
    const [result, setResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const calculateBMI = async () => {
        if (!age || !height || !weight) {
            alert('Please fill in all fields');
            return;
        }

        setIsCalculating(true);

        try {
            const data = await bmiApi.calculateBmi(age, height, weight, gender);

            setResult({
                bmi: data.bmi,
                category: data.category,
                color: data.color,
                range: data.healthyRange,
                bmr: data.dailyCalories,
                water: data.waterLiters,
                macros: {
                    protein: data.macros.protein,
                    carbs: data.macros.carbs,
                    fats: data.macros.fats
                },
                foodRecommendations: data.foodRecommendations
            });

            localStorage.setItem(BMI_PROFILE_STORAGE_KEY, JSON.stringify({
                age,
                height,
                weight,
                gender,
                result: {
                    bmi: data.bmi,
                    category: data.category
                }
            }));

            setIsCalculating(false);
            setShowResult(true);
        } catch (error) {
            console.error('BMI Calculation failed:', error);
            alert('Server error while getting recommendations. Please try again.');
            setIsCalculating(false);
        }
    };

    const calculatorRef = React.useRef(null);

    const handleReset = () => {
        setShowResult(false);
        setResult(null);
        // Scroll to form if needed
        if (calculatorRef.current) {
            calculatorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div ref={calculatorRef} className={`bmi-container ${showResult ? 'expanded' : ''}`}>
            {!showResult ? (
                <div className="bmi-form-card">
                    <div className="bmi-header">
                        <h3>BMI Calculator</h3>
                        <p>Enter your details to get a personalized health snapshot</p>
                    </div>

                    <div className="bmi-form-grid">
                        <div className="input-group">
                            <label>Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Years"
                            />
                        </div>

                        <div className="input-group">
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="cm"
                            />
                        </div>

                        <div className="input-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="kg"
                            />
                        </div>

                        <div className="input-group">
                            <label>Gender</label>
                            <div className="gender-radio-group">
                                <label className={`radio-item ${gender === 'male' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={() => setGender('male')}
                                    />
                                    <span>Male</span>
                                </label>
                                <label className={`radio-item ${gender === 'female' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={() => setGender('female')}
                                    />
                                    <span>Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        className={`calculate-btn ${isCalculating ? 'loading' : ''}`}
                        onClick={calculateBMI}
                        disabled={isCalculating}
                    >
                        {isCalculating ? 'Calculating...' : 'Calculate BMI'}
                    </button>
                </div>
            ) : (
                <div className="bmi-result-card animate-in">
                    <div className="result-top-row">
                        {/* Left Result Plate */}
                        <div className="result-plate">
                            <div className="plate-header">BMI RESULT</div>
                            <div className="bmi-score" style={{ color: result.color }}>
                                {result.bmi} <span className="unit">KG/M²</span>
                            </div>
                            <div className="category-badge" style={{ backgroundColor: result.color + '20', color: result.color }}>
                                {result.category}
                            </div>
                            <div className="healthy-range">
                                Healthy: <strong>{result.range}</strong>
                            </div>
                        </div>

                        {/* Action Strategy */}
                        <div className="strategy-card">
                            <div className="strategy-header">ACTION STRATEGY</div>
                            <h2 className="strategy-title">
                                {result.category === 'NORMAL' ? '"Stable weight."' :
                                    result.category === 'UNDERWEIGHT' ? '"Nutrient Focus."' :
                                        '"Calorie Control."'}
                            </h2>
                            <div className="strategy-tags">
                                <div className="tag"><span className="check">✓</span> BALANCE DIET</div>
                                <div className="tag"><span className="check">✓</span> ACTIVE LIFESTYLE</div>
                                <div className="tag"><span className="check">✓</span> MACRO CONSISTENCY</div>
                            </div>
                        </div>

                        {/* Macro Breakdown */}
                        <div className="macros-card">
                            <h3 className="section-title">MACRO TARGET BREAKDOWN</h3>
                            <div className="macro-item protein">
                                <span>PROTEIN</span>
                                <strong>{result.macros.protein}g</strong>
                            </div>
                            <div className="macro-item carbs">
                                <span>CARBOHYDRATES</span>
                                <strong>{result.macros.carbs}g</strong>
                            </div>
                            <div className="macro-item fat">
                                <span>HEALTHY FATS</span>
                                <strong>{result.macros.fats}g</strong>
                            </div>
                        </div>
                    </div>

                    <div className="result-bottom-row">
                        {/* Energy & Water Mini Cards */}
                        <div className="mini-stats">
                            <div className="mini-card energy">
                                <div className="icon">
                                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <span className="label">ENERGY</span>
                                    <div className="val">{result.bmr} <span className="unit">KCAL</span></div>
                                </div>
                            </div>
                            <div className="mini-card water">
                                <div className="icon">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="stat-content">
                                    <span className="label">LITERS</span>
                                    <div className="val">{result.water} <span className="unit">LTR</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Food Recommendations */}
                        <div className="food-recommendations">
                            <div className="section-divider">SPECIALIZED FOOD RECOMMENDATIONS</div>
                            <div className="food-grid">
                                <div className="food-col">
                                    <div className="col-header"><span className="dot protein"></span> PROTEINS</div>
                                    {result.foodRecommendations.proteins.map((food, i) => (
                                        <div key={i} className="food-item">
                                            <span className="food-icon">{food.icon}</span> {food.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="food-col">
                                    <div className="col-header"><span className="dot carbs"></span> CARBOHYDRATES</div>
                                    {result.foodRecommendations.carbs.map((food, i) => (
                                        <div key={i} className="food-item">
                                            <span className="food-icon">{food.icon}</span> {food.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="food-col">
                                    <div className="col-header"><span className="dot fat"></span> HEALTHY FATS</div>
                                    {result.foodRecommendations.fats.map((food, i) => (
                                        <div key={i} className="food-item">
                                            <span className="food-icon">{food.icon}</span> {food.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="reset-btn" onClick={handleReset}>Recalculate</button>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
