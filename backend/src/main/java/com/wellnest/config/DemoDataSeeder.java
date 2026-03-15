package com.wellnest.config;

import com.wellnest.entity.Meal;
import com.wellnest.entity.Sleep;
import com.wellnest.entity.User;
import com.wellnest.entity.WorkoutSession;
import com.wellnest.repository.MealRepository;
import com.wellnest.repository.SleepRepository;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private static final String DEMO_MARKER = "DEMO_SEED_PRESENTATION";
    private static final int[] DEMO_DAY_OFFSETS = buildDemoDayOffsets(70); // > 2 months

    private final UserRepository userRepository;
    private final MealRepository mealRepository;
    private final WorkoutSessionRepository workoutSessionRepository;
    private final SleepRepository sleepRepository;

    @Override
    public void run(String... args) {
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            log.info("Demo seeder: no users found, skipping demo data generation");
            return;
        }

        for (User user : users) {
            seedMeals(user);
            seedWorkouts(user);
            seedSleepAndHydration(user);
        }
    }

    private void seedMeals(User user) {
        List<Meal> existing = mealRepository.findByUserIdOrderByMealDateDesc(user.getId());
        Set<LocalDate> seededDates = new HashSet<>();
        existing.stream()
            .filter(m -> m.getNotes() != null && m.getNotes().contains(DEMO_MARKER))
            .forEach(m -> seededDates.add(m.getMealDate().toLocalDate()));

        String[] mealTypes = {
            "BREAKFAST", "LUNCH", "DINNER", "SNACK", "LUNCH", "DINNER",
            "BREAKFAST", "LUNCH", "DINNER", "SNACK", "BREAKFAST", "LUNCH",
            "DINNER", "SNACK", "BREAKFAST", "LUNCH", "DINNER", "SNACK"
        };
        String[] mealNames = {
            "Masala Dosa", "Chicken Biryani", "Palak Paneer", "Sprouts Chaat", "Rajma Chawal", "Grilled Fish",
            "Idli Sambar", "Paneer Tikka Bowl", "Dal Khichdi", "Fruit Bowl", "Oats Upma", "Sambar Rice",
            "Egg Bhurji + Chapati", "Roasted Makhana", "Ragi Dosa", "Vegetable Pulao", "Tofu Stir Fry", "Peanut Sundal"
        };
        int[] calories = {380, 520, 300, 220, 480, 430, 250, 510, 390, 180, 320, 460, 470, 210, 310, 520, 410, 230};
        double[] proteins = {10, 28, 14, 13, 16, 34, 8, 24, 14, 4, 11, 13, 26, 8, 10, 12, 23, 9};

        List<Meal> toSave = new ArrayList<>();

        for (int i = 0; i < DEMO_DAY_OFFSETS.length; i++) {
            int offset = DEMO_DAY_OFFSETS[i];
            LocalDate day = LocalDate.now().minusDays(offset);
            if (seededDates.contains(day)) {
                continue;
            }

            LocalDateTime mealDate = day.atTime(8 + (i % 10), 15);

            Meal meal = new Meal();
            meal.setUser(user);
            meal.setMealType(mealTypes[i % mealTypes.length]);
            meal.setMealName(mealNames[i % mealNames.length]);
            meal.setCuisineType("INDIAN");
            meal.setCalories(calories[i % calories.length]);
            meal.setProteinGrams(proteins[i % proteins.length]);
            meal.setCarbsGrams(Math.max(20.0, calories[i % calories.length] * 0.12));
            meal.setFatGrams(Math.max(5.0, calories[i % calories.length] * 0.03));
            meal.setFiberGrams(5.0 + (i % 5));
            meal.setPortionSize("1 serving");
            String mealName = mealNames[i % mealNames.length];
            meal.setIsVegetarian(!(mealName.contains("Chicken") || mealName.contains("Fish") || mealName.contains("Egg")));
            meal.setIsVegan(meal.getIsVegetarian() && !mealName.contains("Paneer") && !mealName.contains("Dosa"));
            meal.setMealDate(mealDate);
            meal.setCreatedAt(mealDate.plusMinutes(5));
            meal.setNotes(DEMO_MARKER);
            toSave.add(meal);
        }

        if (!toSave.isEmpty()) {
            mealRepository.saveAll(toSave);
            log.info("Demo seeder: inserted {} meals for user {}", toSave.size(), user.getEmail());
        }
    }

    private void seedWorkouts(User user) {
        List<WorkoutSession> existing = workoutSessionRepository.findByUserIdOrderByCompletedAtDesc(user.getId());
        Set<LocalDate> seededDates = new HashSet<>();
        existing.stream()
            .filter(w -> w.getNotes() != null && w.getNotes().contains(DEMO_MARKER))
            .forEach(w -> seededDates.add(w.getCompletedAt().toLocalDate()));

        String[] workoutTypes = {
            "Walking", "Running", "Yoga", "Cycling", "Weightlifting", "Walking",
            "Running", "Swimming", "Weightlifting", "Yoga", "Running", "Cycling",
            "Walking", "Weightlifting", "Swimming", "Running", "Yoga", "Cycling"
        };
        String[] workoutNames = {
            "Morning Walk", "Evening Run", "Yoga Flow", "Cycling Session", "Strength Circuit", "Brisk Walk",
            "Tempo Run", "Pool Training", "HIIT Blast", "Recovery Yoga", "Cardio Run", "Cycling Intervals",
            "Power Walk", "Strength Day", "Sunrise Swim", "Easy Jog", "Mobility Yoga", "Long Ride"
        };
        int[] duration = {30, 35, 40, 45, 50, 38, 42, 40, 32, 35, 48, 50, 45, 55, 42, 30, 38, 60};
        int[] burned = {120, 300, 150, 280, 320, 160, 360, 290, 275, 130, 390, 340, 190, 360, 300, 220, 145, 430};

        List<WorkoutSession> toSave = new ArrayList<>();

        for (int i = 0; i < DEMO_DAY_OFFSETS.length; i++) {
            int offset = DEMO_DAY_OFFSETS[i];
            LocalDate day = LocalDate.now().minusDays(offset);
            if (seededDates.contains(day)) {
                continue;
            }

            LocalDateTime completedAt = day.atTime(18, 0);

            WorkoutSession ws = new WorkoutSession();
            ws.setUser(user);
            ws.setWorkoutPlan(null);
            ws.setWorkoutName(workoutNames[i % workoutNames.length]);
            ws.setWorkoutType(workoutTypes[i % workoutTypes.length]);
            ws.setDurationMinutes(duration[i % duration.length]);
            ws.setCaloriesBurned(burned[i % burned.length]);
            ws.setCompletedAt(completedAt);
            ws.setCreatedAt(completedAt.plusMinutes(1));
            ws.setNotes(DEMO_MARKER);
            toSave.add(ws);
        }

        if (!toSave.isEmpty()) {
            workoutSessionRepository.saveAll(toSave);
            log.info("Demo seeder: inserted {} workouts for user {}", toSave.size(), user.getEmail());
        }
    }

    private void seedSleepAndHydration(User user) {
        List<Sleep> existing = sleepRepository.findByUserIdOrderBySleepDateDesc(user.getId());

        Set<LocalDate> existingDates = new HashSet<>();
        for (Sleep s : existing) {
            if (s.getNotes() != null && s.getNotes().contains(DEMO_MARKER)) {
                existingDates.add(s.getSleepDate());
            }
        }

        List<Sleep> toSave = new ArrayList<>();

        for (int i = 0; i < DEMO_DAY_OFFSETS.length; i++) {
            LocalDate date = LocalDate.now().minusDays(DEMO_DAY_OFFSETS[i]);
            if (existingDates.contains(date)) {
                continue;
            }

            double hours = 6.8 + (i % 5) * 0.3;
            int quality = 3 + (i % 3);
            int glasses = 6 + (i % 5);

            Sleep sleep = new Sleep();
            sleep.setUser(user);
            sleep.setSleepDate(date);
            sleep.setBedTime(LocalTime.of(22 + (i % 2), 30));
            sleep.setWakeTime(LocalTime.of(6, 15));
            sleep.setHoursSlept(Math.min(hours, 8.2));
            sleep.setSleepQuality(Math.min(quality, 5));
            sleep.setWaterGlasses(glasses);
            sleep.setNotes(DEMO_MARKER);
            sleep.setCreatedAt(LocalDateTime.now().minusDays(DEMO_DAY_OFFSETS[i]));
            toSave.add(sleep);
        }

        if (!toSave.isEmpty()) {
            sleepRepository.saveAll(toSave);
            log.info("Demo seeder: inserted {} sleep logs for user {}", toSave.size(), user.getEmail());
        }
    }

    private static int[] buildDemoDayOffsets(int maxDaysBack) {
        List<Integer> offsets = new ArrayList<>();

        // Dense recent week for charts
        IntStream.rangeClosed(0, 6).forEach(offsets::add);

        // Then every 3rd day up to maxDaysBack
        for (int d = 9; d <= maxDaysBack; d += 3) {
            offsets.add(d);
        }

        return offsets.stream().mapToInt(Integer::intValue).toArray();
    }
}
