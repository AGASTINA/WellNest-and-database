-- Clear existing data for clean initialization
DELETE FROM doctors WHERE id <= 100;
DELETE FROM hospitals WHERE id <= 100;
DELETE FROM users WHERE id <= 100;

-- Reset auto-increment counters
ALTER TABLE users ALTER COLUMN id RESTART WITH 1;
ALTER TABLE doctors ALTER COLUMN id RESTART WITH 1;
ALTER TABLE hospitals ALTER COLUMN id RESTART WITH 1;

-- Insert test user with ID 1
INSERT INTO users (id, name, email, password, role, auth_provider, created_at, updated_at)
VALUES (1, 'Test User', 'user@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DK5wuhUmyCQP2jUZbHxubVxvjQFN7m', 'USER', 'LOCAL', NOW(), NOW());

-- Insert admin user with ID 2
INSERT INTO users (id, name, email, password, role, auth_provider, created_at, updated_at)
VALUES (2, 'Admin User', 'admin@wellnest.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DK5wuhUmyCQP2jUZbHxubVxvjQFN7m', 'ADMIN', 'LOCAL', NOW(), NOW());

-- Password: password123 (BCrypt encoded)

-- Insert sample doctors
INSERT INTO doctors (id, name, specialization, qualification, experience_years, about, email, phone_number, consultation_fee, languages, hospital_name, address, city, state, zip_code, country, latitude, longitude, availability_days, availability_hours, rating, total_reviews, is_available, created_at, updated_at)
VALUES 
(1, 'Dr. Rajesh Kumar', 'Cardiology', 'MD, DM (Cardiology)', 15, 'Senior Cardiologist specializing in interventional cardiology and preventive heart care.', 'dr.rajesh@apollochennai.com', '+91-44-2829-3333', 800.00, 'English, Tamil, Hindi', 'Apollo Hospitals', 'Greams Road, Thousand Lights', 'Chennai', 'Tamil Nadu', '600006', 'India', 13.0569, 80.2446, 'Mon,Tue,Wed,Thu,Fri,Sat', '09:00-17:00', 4.8, 450, true, NOW(), NOW()),
(2, 'Dr. Lakshmi Subramanian', 'General Medicine', 'MBBS, MD', 12, 'Experienced physician focusing on diabetes, hypertension and lifestyle diseases.', 'dr.lakshmi@fortis.com', '+91-44-3926-6000', 600.00, 'English, Tamil', 'Fortis Malar Hospital', 'Adyar', 'Chennai', 'Tamil Nadu', '600020', 'India', 13.0123, 80.2565, 'Mon,Wed,Fri,Sat', '08:00-16:00', 4.7, 320, true, NOW(), NOW()),
(3, 'Dr. Priya Ramachandran', 'Nutrition & Dietetics', 'MSc, PhD (Nutrition)', 10, 'Clinical nutritionist specializing in South Indian diet plans and weight management.', 'dr.priya@kauvery.com', '+91-44-4000-6000', 500.00, 'English, Tamil, Malayalam', 'Kauvery Hospital', 'Alwarpet', 'Chennai', 'Tamil Nadu', '600018', 'India', 13.0339, 80.2536, 'Tue,Wed,Thu,Fri,Sat', '10:00-18:00', 4.9, 280, true, NOW(), NOW()),
(4, 'Dr. Arun Shankar', 'Orthopedics', 'MS (Ortho), DNB', 18, 'Orthopedic surgeon with expertise in joint replacement and sports injuries.', 'dr.arun@kmch.com', '+91-422-400-0100', 700.00, 'English, Tamil', 'KMCH Hospital', 'Trichy Road', 'Coimbatore', 'Tamil Nadu', '641014', 'India', 11.0293, 76.9866, 'Mon,Tue,Thu,Fri,Sat', '09:00-17:00', 4.8, 390, true, NOW(), NOW()),
(5, 'Dr. Meenakshi Patel', 'Endocrinology', 'MD, DM (Endocrinology)', 14, 'Endocrinologist specializing in diabetes, thyroid disorders and PCOS management.', 'dr.meenakshi@vijayahospital.com', '+91-44-3988-3000', 650.00, 'English, Tamil, Hindi', 'Vijaya Hospital', 'Vadapalani', 'Chennai', 'Tamil Nadu', '600026', 'India', 13.0504, 80.2127, 'Mon,Tue,Wed,Thu,Fri', '08:00-16:00', 4.8, 410, true, NOW(), NOW()),
(6, 'Dr. Venkatesh Sundaram', 'Physical Therapy', 'BPT, MPT', 8, 'Physiotherapist specializing in sports rehabilitation and chronic pain management.', 'dr.venkat@sims.com', '+91-44-4225-0250', 400.00, 'English, Tamil', 'SIMS Hospital', 'Vadapalani', 'Chennai', 'Tamil Nadu', '600026', 'India', 13.0502, 80.2125, 'Mon,Tue,Wed,Thu,Fri,Sat', '07:00-19:00', 4.7, 260, true, NOW(), NOW());

-- Insert sample hospitals (Tamil Nadu)
INSERT INTO hospitals (id, name, hospital_type, description, email, phone_number, emergency_number, address, city, state, zip_code, country, latitude, longitude, facilities, specialties, bed_capacity, has_emergency, has_ambulance, has_parking, operating_hours, rating, total_reviews, is_active, created_at, updated_at)
VALUES 
(1, 'Apollo Hospitals', 'GENERAL', 'Multi-specialty tertiary care hospital with world-class infrastructure and 24/7 emergency care.', 'info@apollochennai.com', '+91-44-2829-3333', '+91-44-2829-4429', 'Greams Road, Thousand Lights', 'Chennai', 'Tamil Nadu', '600006', 'India', 13.0569, 80.2446, 'ICU, NICU, Emergency, Operation Theater, Cath Lab, Radiology, Laboratory, Pharmacy, Blood Bank', 'Cardiology, Neurology, Orthopedics, Oncology, Pediatrics, Nephrology, Gastroenterology', 500, true, true, true, '24/7', 4.6, 1250, true, NOW(), NOW()),
(2, 'Fortis Malar Hospital', 'GENERAL', 'Premier healthcare facility providing comprehensive medical care with advanced technology.', 'info@fortismalar.com', '+91-44-3926-6000', '+91-44-3926-6001', 'Adyar', 'Chennai', 'Tamil Nadu', '600020', 'India', 13.0123, 80.2565, 'ICU, Emergency, Operation Theater, Radiology, Laboratory, Pharmacy, Dialysis Unit', 'Cardiology, Neurosurgery, Orthopedics, Oncology, Nephrology', 400, true, true, true, '24/7', 4.5, 980, true, NOW(), NOW()),
(3, 'Kauvery Hospital', 'SPECIALTY', 'Quaternary care hospital specializing in critical care and multi-organ transplants.', 'contact@kauvery.com', '+91-44-4000-6000', '+91-44-4000-6001', 'Alwarpet', 'Chennai', 'Tamil Nadu', '600018', 'India', 13.0339, 80.2536, 'Advanced ICU, Emergency, Operation Theater, Transplant Unit, Radiology, Laboratory, Pharmacy', 'Critical Care, Cardiology, Neurology, Nephrology, Hepatology, Transplant Surgery', 350, true, true, true, '24/7', 4.7, 870, true, NOW(), NOW()),
(4, 'KMCH (Kovai Medical Center)', 'GENERAL', 'Leading multi-specialty hospital in Coimbatore with comprehensive healthcare services.', 'info@kmch.com', '+91-422-400-0100', '+91-422-400-0101', 'Trichy Road', 'Coimbatore', 'Tamil Nadu', '641014', 'India', 11.0293, 76.9866, 'ICU, Emergency, Operation Theater, Radiology, Laboratory, Pharmacy, Blood Bank, Ambulance', 'All Specialties including Cardiology, Orthopedics, Neurology, Oncology', 600, true, true, true, '24/7', 4.6, 1100, true, NOW(), NOW()),
(5, 'Vijaya Hospital', 'GENERAL', 'Multi-specialty tertiary care hospital with state-of-the-art medical facilities.', 'info@vijayahospital.com', '+91-44-3988-3000', '+91-44-3988-3001', 'Vadapalani', 'Chennai', 'Tamil Nadu', '600026', 'India', 13.0504, 80.2127, 'ICU, NICU, Emergency, Operation Theater, Radiology, Laboratory, Pharmacy, Blood Bank', 'Cardiology, Orthopedics, Neurology, Gastroenterology, Urology', 450, true, true, true, '24/7', 4.5, 920, true, NOW(), NOW()),
(6, 'SIMS Hospital', 'SPECIALTY', 'Advanced tertiary care hospital specializing in liver, kidney and multi-organ transplants.', 'info@simshospitals.com', '+91-44-4225-0250', '+91-44-4225-0251', 'Vadapalani', 'Chennai', 'Tamil Nadu', '600026', 'India', 13.0502, 80.2125, 'Super Specialty ICU, Transplant Unit, Operation Theater, Dialysis, Radiology, Laboratory', 'Gastroenterology, Hepatology, Nephrology, Urology, Critical Care', 300, true, true, true, '24/7', 4.7, 750, true, NOW(), NOW()),
(7, 'Madras Medical Mission', 'SPECIALTY', 'Cardiac specialty hospital with focus on heart surgeries and interventional procedures.', 'contact@mmm.org.in', '+91-44-2250-0500', '+91-44-2250-0911', 'Mogappair', 'Chennai', 'Tamil Nadu', '600037', 'India', 13.0878, 80.1842, 'Cardiac ICU, Cath Lab, Operation Theater, Echo Lab, Radiology, Pharmacy', 'Cardiology, Cardiac Surgery, Cardiothoracic Surgery', 200, true, true, true, '24/7', 4.6, 680, true, NOW(), NOW()),
(8, 'Meenakshi Mission Hospital', 'GENERAL', 'Multi-specialty hospital providing quality healthcare with modern facilities.', 'info@mmhrc.in', '+0452-258-5555', '+0452-258-5911', 'Lake Area', 'Madurai', 'Tamil Nadu', '625107', 'India', 9.9386, 78.1216, 'ICU, Emergency, Operation Theater, Radiology, Laboratory, Pharmacy, Blood Bank', 'General Medicine, Surgery, Orthopedics, Pediatrics, Gynecology', 400, true, true, true, '24/7', 4.4, 620, true, NOW(), NOW()),
(9, 'PSG Hospitals', 'GENERAL', 'Comprehensive healthcare institution with excellence in medical education and patient care.', 'info@psghealth.ac.in', '+91-422-257-1001', '+91-422-257-1911', 'Peelamedu', 'Coimbatore', 'Tamil Nadu', '641004', 'India', 11.0254, 77.0047, 'ICU, Emergency, Operation Theater, Radiology, Laboratory, Pharmacy, Blood Bank', 'All Specialties', 750, true, true, true, '24/7', 4.5, 1080, true, NOW(), NOW()),
(10, 'GEM Hospital', 'SPECIALTY', 'Leading gastroenterology and endosurgery hospital with international standards.', 'info@gemhospitals.com', '+91-422-236-9999', '+91-422-236-9911', 'Pappanaickenpalayam', 'Coimbatore', 'Tamil Nadu', '641037', 'India', 11.0711, 77.0145, 'Advanced Endoscopy, Operation Theater, ICU, Radiology, Laboratory', 'Gastroenterology, Hepatology, Laparoscopic Surgery, Bariatric Surgery', 250, true, true, true, '24/7', 4.8, 920, true, NOW(), NOW());

-- Insert sample medical records for test user
INSERT INTO medical_records (id, user_id, record_type, title, description, doctor_name, hospital_name, diagnosis, medications, allergies, blood_type, chronic_conditions, record_date, created_at, updated_at)
VALUES 
(1, 1, 'VISIT_NOTE', 'Annual Physical Examination', 'Routine annual checkup - all vitals normal', 'Dr. Lakshmi Subramanian', 'Fortis Malar Hospital', 'Healthy - no concerns', 'None', 'Penicillin', 'O+', 'None', NOW(), NOW(), NOW()),
(2, 1, 'LAB_RESULT', 'Blood Work Results', 'Comprehensive metabolic panel and lipid profile', 'Dr. Rajesh Kumar', 'Apollo Hospitals', 'Normal cholesterol and glucose levels', 'None', 'Penicillin', 'O+', 'None', NOW(), NOW(), NOW());

-- Insert sample health metrics for test user
INSERT INTO health_metrics (id, user_id, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, blood_sugar, cholesterol_total, cholesterol_hdl, cholesterol_ldl, body_temperature, oxygen_saturation, weight, height, bmi, steps_count, calories_burned, workout_duration_minutes, notes, recorded_at, created_at)
VALUES 
(1, 1, 120, 80, 72, 95.0, 180.0, 55.0, 110.0, 98.6, 98, 75.0, 175.0, 24.5, 8500, 350, 45, 'Feeling energetic after morning workout', NOW(), NOW()),
(2, 1, 118, 78, 70, 92.0, 175.0, 58.0, 105.0, 98.4, 99, 74.5, 175.0, 24.3, 10200, 420, 60, 'Great cardio session', NOW() - INTERVAL '1' DAY, NOW() - INTERVAL '1' DAY);

-- Reset auto-increment counters to avoid primary key conflicts (H2 database)
ALTER TABLE users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE doctors ALTER COLUMN id RESTART WITH 100;
ALTER TABLE hospitals ALTER COLUMN id RESTART WITH 100;
ALTER TABLE medical_records ALTER COLUMN id RESTART WITH 100;
ALTER TABLE health_metrics ALTER COLUMN id RESTART WITH 100;
ALTER TABLE consultations ALTER COLUMN id RESTART WITH 100;
ALTER TABLE workout_plans ALTER COLUMN id RESTART WITH 100;
ALTER TABLE workout_sessions ALTER COLUMN id RESTART WITH 100;
ALTER TABLE fitness_goals ALTER COLUMN id RESTART WITH 100;
ALTER TABLE meals ALTER COLUMN id RESTART WITH 100;
ALTER TABLE sleep_logs ALTER COLUMN id RESTART WITH 100;
ALTER TABLE memberships ALTER COLUMN id RESTART WITH 100;

-- Insert sample fitness goals
INSERT INTO fitness_goals (id, user_id, goal_type, target_weight, target_calories, target_steps, target_workout_minutes, start_date, target_date, status, progress_percentage, notes, created_at, updated_at)
VALUES 
(1, 1, 'WEIGHT_LOSS', 70.0, 2000, 10000, 45, NOW() - INTERVAL '7' DAY, NOW() + INTERVAL '83' DAY, 'ACTIVE', 15.5, 'Targeting 5kg weight loss in 3 months through consistent cardio and calorie control', NOW() - INTERVAL '7' DAY, NOW()),
(2, 1, 'ENDURANCE', null, 2200, 12000, 60, NOW() - INTERVAL '14' DAY, NOW() + INTERVAL '76' DAY, 'ACTIVE', 25.0, 'Training for 10K run - building stamina gradually', NOW() - INTERVAL '14' DAY, NOW());

-- Insert sample Indian cuisine meals
INSERT INTO meals (id, user_id, meal_type, meal_name, cuisine_type, calories, protein_grams, carbs_grams, fat_grams, fiber_grams, ingredients, portion_size, is_vegetarian, is_vegan, meal_date, notes, created_at)
VALUES 
(1, 1, 'BREAKFAST', 'Masala Dosa', 'SOUTH_INDIAN', 380, 10, 58, 12, 5, 'Rice, Urad Dal, Potato, Onion, Spices', '1 dosa with potato filling', true, true, NOW(), 'Crispy and delicious breakfast', NOW()),
(2, 1, 'LUNCH', 'Chicken Biryani', 'NORTH_INDIAN', 520, 28, 58, 18, 3, 'Basmati Rice, Chicken, Yogurt, Spices, Onion', '1 serving (400g)', false, false, NOW(), 'Homemade biryani with raita', NOW()),
(3, 1, 'SNACK', 'Samosa (2 pieces)', 'INDIAN', 320, 6, 38, 16, 4, 'Potato, Peas, Flour, Spices', '2 medium samosas', true, true, NOW(), 'Evening snack with chai', NOW()),
(4, 1, 'DINNER', 'Palak Paneer', 'NORTH_INDIAN', 280, 14, 12, 20, 5, 'Spinach, Paneer, Cream, Spices', '1 serving (300g)', true, false, NOW(), 'Served with 2 rotis', NOW()),
(5, 1, 'BREAKFAST', 'Idli Sambar', 'SOUTH_INDIAN', 250, 8, 48, 3, 6, 'Rice, Urad Dal, Lentils, Vegetables, Spices', '3 idlis with sambar', true, true, NOW() - INTERVAL '1' DAY, 'Light and healthy breakfast', NOW() - INTERVAL '1' DAY),
(6, 1, 'LUNCH', 'Rajma Chawal', 'NORTH_INDIAN', 480, 16, 72, 12, 14, 'Kidney Beans, Rice, Tomatoes, Spices', '1 serving rice + kidney bean curry', true, true, NOW() - INTERVAL '1' DAY, 'Protein-rich vegetarian meal', NOW() - INTERVAL '1' DAY),
(7, 1, 'DINNER', 'Grilled Fish with Veggies', 'CONTINENTAL', 430, 34, 18, 20, 7, 'Fish fillet, olive oil, mixed vegetables, herbs', '1 plate', false, false, NOW() - INTERVAL '10' DAY, 'High protein dinner', NOW() - INTERVAL '10' DAY),
(8, 1, 'LUNCH', 'Paneer Tikka Bowl', 'INDIAN', 510, 24, 42, 28, 8, 'Paneer, millet, salad, mint chutney', '1 bowl', true, false, NOW() - INTERVAL '21' DAY, 'Post-workout meal', NOW() - INTERVAL '21' DAY),
(9, 1, 'BREAKFAST', 'Oats Upma', 'INDIAN', 320, 11, 49, 8, 9, 'Oats, vegetables, mustard, curry leaves', '1 bowl', true, true, NOW() - INTERVAL '36' DAY, 'Fiber-rich breakfast', NOW() - INTERVAL '36' DAY),
(10, 1, 'DINNER', 'Dal Khichdi', 'INDIAN', 390, 14, 61, 10, 8, 'Rice, moong dal, ghee, cumin, turmeric', '1 bowl', true, true, NOW() - INTERVAL '49' DAY, 'Light recovery meal', NOW() - INTERVAL '49' DAY),
(11, 1, 'LUNCH', 'Chicken Curry + Brown Rice', 'INDIAN', 560, 31, 52, 22, 6, 'Chicken curry, brown rice, spices', '1 plate', false, false, NOW() - INTERVAL '63' DAY, 'Balanced macros', NOW() - INTERVAL '63' DAY),
(12, 1, 'BREAKFAST', 'Poha with Peanuts', 'INDIAN', 300, 9, 47, 9, 5, 'Flattened rice, peanuts, onions, lemon', '1 serving', true, true, NOW() - INTERVAL '78' DAY, 'Quick breakfast', NOW() - INTERVAL '78' DAY),
(13, 1, 'DINNER', 'Tofu Stir Fry', 'ASIAN', 410, 23, 29, 21, 7, 'Tofu, broccoli, bell peppers, sesame', '1 bowl', true, true, NOW() - INTERVAL '92' DAY, 'Plant protein meal', NOW() - INTERVAL '92' DAY),
(14, 1, 'LUNCH', 'Sambar Rice', 'SOUTH_INDIAN', 460, 13, 73, 12, 10, 'Rice, lentils, vegetables, tamarind', '1 plate', true, true, NOW() - INTERVAL '108' DAY, 'Comfort lunch', NOW() - INTERVAL '108' DAY),
(15, 1, 'SNACK', 'Sprouts Chaat', 'INDIAN', 220, 13, 28, 6, 8, 'Moong sprouts, onion, tomato, lemon', '1 bowl', true, true, NOW() - INTERVAL '121' DAY, 'Evening protein snack', NOW() - INTERVAL '121' DAY),
(16, 1, 'DINNER', 'Egg Bhurji + Chapati', 'INDIAN', 470, 26, 39, 22, 5, 'Eggs, onions, tomatoes, spices, chapati', '2 chapatis + bhurji', false, false, NOW() - INTERVAL '138' DAY, 'Hearty dinner', NOW() - INTERVAL '138' DAY),
(17, 1, 'LUNCH', 'Vegetable Pulao + Raita', 'INDIAN', 520, 12, 76, 17, 6, 'Basmati rice, vegetables, curd', '1 serving', true, false, NOW() - INTERVAL '154' DAY, 'Weekend lunch', NOW() - INTERVAL '154' DAY),
(18, 1, 'BREAKFAST', 'Ragi Dosa', 'SOUTH_INDIAN', 310, 10, 46, 9, 7, 'Ragi flour, urad dal, spices', '2 dosas', true, true, NOW() - INTERVAL '169' DAY, 'Calcium-rich breakfast', NOW() - INTERVAL '169' DAY);

-- Insert sample workout sessions across several months for graph presentation
INSERT INTO workout_sessions (id, user_id, workout_plan_id, workout_name, workout_type, duration_minutes, calories_burned, completed_at, notes, created_at)
VALUES
(1, 1, null, 'Morning Walk', 'Walking', 30, 120, NOW() - INTERVAL '2' DAY, 'Easy pace', NOW() - INTERVAL '2' DAY),
(2, 1, null, 'Evening Run', 'Running', 35, 300, NOW() - INTERVAL '1' DAY, 'Interval run', NOW() - INTERVAL '1' DAY),
(3, 1, null, 'Yoga Flow', 'Yoga', 40, 150, NOW() - INTERVAL '4' DAY, 'Mobility focus', NOW() - INTERVAL '4' DAY),
(4, 1, null, 'Cycling Session', 'Cycling', 45, 280, NOW() - INTERVAL '7' DAY, 'Outdoor route', NOW() - INTERVAL '7' DAY),
(5, 1, null, 'Strength Circuit', 'Weightlifting', 50, 320, NOW() - INTERVAL '12' DAY, 'Upper body day', NOW() - INTERVAL '12' DAY),
(6, 1, null, 'Brisk Walk', 'Walking', 38, 160, NOW() - INTERVAL '18' DAY, 'Post-lunch walk', NOW() - INTERVAL '18' DAY),
(7, 1, null, 'Tempo Run', 'Running', 42, 360, NOW() - INTERVAL '25' DAY, 'Steady pace', NOW() - INTERVAL '25' DAY),
(8, 1, null, 'Pool Training', 'Swimming', 40, 290, NOW() - INTERVAL '33' DAY, 'Lap training', NOW() - INTERVAL '33' DAY),
(9, 1, null, 'HIIT Blast', 'Weightlifting', 32, 275, NOW() - INTERVAL '46' DAY, 'Short intense workout', NOW() - INTERVAL '46' DAY),
(10, 1, null, 'Recovery Yoga', 'Yoga', 35, 130, NOW() - INTERVAL '58' DAY, 'Stretch and breath', NOW() - INTERVAL '58' DAY),
(11, 1, null, 'Cardio Run', 'Running', 48, 390, NOW() - INTERVAL '72' DAY, 'Long run', NOW() - INTERVAL '72' DAY),
(12, 1, null, 'Cycling Intervals', 'Cycling', 50, 340, NOW() - INTERVAL '85' DAY, 'Mixed intervals', NOW() - INTERVAL '85' DAY),
(13, 1, null, 'Power Walk', 'Walking', 45, 190, NOW() - INTERVAL '99' DAY, 'Incline walk', NOW() - INTERVAL '99' DAY),
(14, 1, null, 'Strength Day', 'Weightlifting', 55, 360, NOW() - INTERVAL '113' DAY, 'Legs and core', NOW() - INTERVAL '113' DAY),
(15, 1, null, 'Sunrise Swim', 'Swimming', 42, 300, NOW() - INTERVAL '127' DAY, 'Technique drills', NOW() - INTERVAL '127' DAY),
(16, 1, null, 'Easy Jog', 'Running', 30, 220, NOW() - INTERVAL '141' DAY, 'Recovery run', NOW() - INTERVAL '141' DAY),
(17, 1, null, 'Mobility Yoga', 'Yoga', 38, 145, NOW() - INTERVAL '156' DAY, 'Hip mobility', NOW() - INTERVAL '156' DAY),
(18, 1, null, 'Long Ride', 'Cycling', 60, 430, NOW() - INTERVAL '173' DAY, 'Weekend endurance', NOW() - INTERVAL '173' DAY);

-- Insert sleep + hydration logs for both recent week and historical trend
INSERT INTO sleep_logs (id, user_id, sleep_date, bed_time, wake_time, hours_slept, sleep_quality, notes, water_glasses, created_at)
VALUES
(1, 1, CURRENT_DATE, TIME '22:45:00', TIME '06:30:00', 7.75, 4, 'Felt fresh in the morning', 9, NOW()),
(2, 1, CURRENT_DATE - INTERVAL '1' DAY, TIME '23:10:00', TIME '06:40:00', 7.50, 4, 'Slept well', 8, NOW() - INTERVAL '1' DAY),
(3, 1, CURRENT_DATE - INTERVAL '2' DAY, TIME '22:30:00', TIME '06:15:00', 7.75, 5, 'Excellent sleep', 10, NOW() - INTERVAL '2' DAY),
(4, 1, CURRENT_DATE - INTERVAL '3' DAY, TIME '23:30:00', TIME '06:20:00', 6.83, 3, 'Woke up once at night', 7, NOW() - INTERVAL '3' DAY),
(5, 1, CURRENT_DATE - INTERVAL '4' DAY, TIME '22:55:00', TIME '06:35:00', 7.67, 4, 'Good sleep quality', 9, NOW() - INTERVAL '4' DAY),
(6, 1, CURRENT_DATE - INTERVAL '5' DAY, TIME '23:20:00', TIME '06:25:00', 7.08, 3, 'Late caffeine intake', 6, NOW() - INTERVAL '5' DAY),
(7, 1, CURRENT_DATE - INTERVAL '6' DAY, TIME '22:40:00', TIME '06:20:00', 7.67, 4, 'Steady hydration helped', 8, NOW() - INTERVAL '6' DAY),
(8, 1, CURRENT_DATE - INTERVAL '15' DAY, TIME '23:00:00', TIME '06:30:00', 7.50, 4, 'Normal day', 8, NOW() - INTERVAL '15' DAY),
(9, 1, CURRENT_DATE - INTERVAL '30' DAY, TIME '22:35:00', TIME '06:05:00', 7.50, 4, 'Consistent schedule', 9, NOW() - INTERVAL '30' DAY),
(10, 1, CURRENT_DATE - INTERVAL '45' DAY, TIME '23:15:00', TIME '06:00:00', 6.75, 3, 'Work stress', 7, NOW() - INTERVAL '45' DAY),
(11, 1, CURRENT_DATE - INTERVAL '60' DAY, TIME '22:20:00', TIME '06:10:00', 7.83, 5, 'Very restful', 10, NOW() - INTERVAL '60' DAY),
(12, 1, CURRENT_DATE - INTERVAL '75' DAY, TIME '23:05:00', TIME '06:25:00', 7.33, 4, 'Improving pattern', 8, NOW() - INTERVAL '75' DAY),
(13, 1, CURRENT_DATE - INTERVAL '90' DAY, TIME '22:50:00', TIME '06:15:00', 7.42, 4, 'Good night', 9, NOW() - INTERVAL '90' DAY),
(14, 1, CURRENT_DATE - INTERVAL '110' DAY, TIME '23:25:00', TIME '06:05:00', 6.67, 3, 'Late bedtime', 6, NOW() - INTERVAL '110' DAY),
(15, 1, CURRENT_DATE - INTERVAL '130' DAY, TIME '22:30:00', TIME '06:20:00', 7.83, 5, 'Excellent recovery', 10, NOW() - INTERVAL '130' DAY),
(16, 1, CURRENT_DATE - INTERVAL '150' DAY, TIME '23:00:00', TIME '06:10:00', 7.17, 4, 'Average sleep', 8, NOW() - INTERVAL '150' DAY),
(17, 1, CURRENT_DATE - INTERVAL '170' DAY, TIME '22:40:00', TIME '06:00:00', 7.33, 4, 'Consistent hydration', 9, NOW() - INTERVAL '170' DAY);

-- Insert sample membership (FREE plan for test user)
INSERT INTO memberships (id, user_id, plan_type, billing_cycle, price, start_date, end_date, status, payment_method, payment_status, transaction_id, auto_renewal, created_at, updated_at)
VALUES 
(1, 1, 'FREE', 'MONTHLY', 0.00, NOW() - INTERVAL '30' DAY, NOW() + INTERVAL '335' DAY, 'ACTIVE', null, 'COMPLETED', 'TXN-FREE000001', false, NOW() - INTERVAL '30' DAY, NOW());
