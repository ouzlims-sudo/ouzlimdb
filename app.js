// OUZLIM DB MANAGEMENT - Hammer Throw Training System
class OuzlimDB {
    constructor() {
        this.currentAthlete = null;
        this.athletes = [];
        this.exerciseLibrary = [];
        this.trainingSessions = [];
        this.wellnessData = [];
        this.testResults = [];
        this.trainingPeriods = [];
        this.charts = {};
        
        // Initialize the application
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.setupNavigation();
        this.populateAthleteSelect();
        
        // Show dashboard by default and initialize charts after DOM is ready
        setTimeout(() => {
            this.initializeCharts();
            this.showModule('dashboard');
        }, 100);
    }

    // Data Management
    loadInitialData() {
        // Load from localStorage or use default data
        const storedAthletes = localStorage.getItem('ouzlim_athletes');
        if (storedAthletes) {
            this.athletes = JSON.parse(storedAthletes);
        } else {
            // Use provided sample data
            this.athletes = [
                {
                    id: "athlete_1",
                    firstName: "Alexandra",
                    lastName: "Smith", 
                    dateOfBirth: "2005-03-15",
                    gender: "F",
                    weight: 75.5,
                    height: 175.0,
                    competitionLevel: "junior",
                    personalBest: 58.42,
                    somatotype: "masculine"
                },
                {
                    id: "athlete_2", 
                    firstName: "Marcus",
                    lastName: "Johnson",
                    dateOfBirth: "2003-08-22",
                    gender: "M", 
                    weight: 95.2,
                    height: 185.0,
                    competitionLevel: "senior",
                    personalBest: 72.15,
                    somatotype: "masculine"
                }
            ];
            this.saveData('athletes');
        }

        // Load exercise library
        this.exerciseLibrary = [
            {
                id: "ex_1",
                name: "Competition Weight Hammer Throw",
                category: "competitive",
                bondarchukCategory: "competitive",
                description: "Full throws with competition weight implement"
            },
            {
                id: "ex_2", 
                name: "Heavy Hammer Throw (5kg/7kg)",
                category: "special_development",
                bondarchukCategory: "special_development",
                description: "Overweight implement throwing for strength development"
            },
            {
                id: "ex_3",
                name: "Light Hammer Throw (3kg/6kg)", 
                category: "special_development",
                bondarchukCategory: "special_development",
                description: "Underweight implement throwing for speed development"
            },
            {
                id: "ex_4",
                name: "Back Squat",
                category: "general_preparatory",
                bondarchukCategory: "general_preparatory", 
                description: "Basic strength exercise for leg and core development"
            },
            {
                id: "ex_5",
                name: "Snatch",
                category: "special_preparatory",
                bondarchukCategory: "special_preparatory",
                description: "Olympic lift for power development"
            },
            {
                id: "ex_6",
                name: "Clean & Jerk",
                category: "special_preparatory",
                bondarchukCategory: "special_preparatory",
                description: "Olympic lift for power development"
            },
            {
                id: "ex_7",
                name: "Deadlift",
                category: "general_preparatory",
                bondarchukCategory: "general_preparatory",
                description: "Basic strength exercise"
            }
        ];

        // Load other data
        this.trainingSessions = JSON.parse(localStorage.getItem('ouzlim_sessions') || '[]');
        this.wellnessData = JSON.parse(localStorage.getItem('ouzlim_wellness') || '[]');
        this.testResults = JSON.parse(localStorage.getItem('ouzlim_tests') || '[]');
        this.trainingPeriods = JSON.parse(localStorage.getItem('ouzlim_periods') || '[]');
    }

    saveData(dataType) {
        switch(dataType) {
            case 'athletes':
                localStorage.setItem('ouzlim_athletes', JSON.stringify(this.athletes));
                break;
            case 'sessions':
                localStorage.setItem('ouzlim_sessions', JSON.stringify(this.trainingSessions));
                break;
            case 'wellness':
                localStorage.setItem('ouzlim_wellness', JSON.stringify(this.wellnessData));
                break;
            case 'tests':
                localStorage.setItem('ouzlim_tests', JSON.stringify(this.testResults));
                break;
            case 'periods':
                localStorage.setItem('ouzlim_periods', JSON.stringify(this.trainingPeriods));
                break;
        }
    }

    // Navigation
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const module = btn.dataset.module;
                this.showModule(module);
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    showModule(moduleName) {
        console.log('Showing module:', moduleName);
        
        // Hide all modules
        const modules = document.querySelectorAll('.module');
        modules.forEach(module => {
            module.classList.remove('active');
            module.style.display = 'none';
        });
        
        // Show selected module
        const targetModule = document.getElementById(moduleName);
        if (targetModule) {
            targetModule.classList.add('active');
            targetModule.style.display = 'block';
            
            // Load module-specific content
            setTimeout(() => {
                switch(moduleName) {
                    case 'dashboard':
                        this.updateDashboard();
                        break;
                    case 'athletes':
                        this.populateAthletes();
                        break;
                    case 'training':
                        this.populateTrainingSessions();
                        break;
                    case 'wellness':
                        this.updateWellnessChart();
                        break;
                    case 'testing':
                        this.populateTestResults();
                        break;
                    case 'analytics':
                        this.updateAnalytics();
                        break;
                    case 'periodization':
                        this.populatePeriodization();
                        break;
                    case 'reports':
                        this.updateReports();
                        break;
                }
            }, 50);
        } else {
            console.error('Module not found:', moduleName);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Athlete selector
        const athleteSelect = document.getElementById('athleteSelect');
        if (athleteSelect) {
            athleteSelect.addEventListener('change', (e) => {
                const athleteId = e.target.value;
                if (athleteId) {
                    this.currentAthlete = this.athletes.find(a => a.id === athleteId);
                    this.updateDashboard();
                    this.updateAllCharts();
                } else {
                    this.currentAthlete = null;
                    this.updateDashboard();
                }
            });
        }

        // Athlete management
        const addAthleteBtn = document.getElementById('addAthleteBtn');
        if (addAthleteBtn) {
            addAthleteBtn.addEventListener('click', () => {
                this.showAthleteModal();
            });
        }

        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideAthleteModal();
            });
        }

        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideAthleteModal();
            });
        }

        const athleteForm = document.getElementById('athleteForm');
        if (athleteForm) {
            athleteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAthlete();
            });
        }

        // Training session management
        const addSessionBtn = document.getElementById('addSessionBtn');
        if (addSessionBtn) {
            addSessionBtn.addEventListener('click', () => {
                this.showSessionModal();
            });
        }

        const closeSessionModal = document.getElementById('closeSessionModal');
        if (closeSessionModal) {
            closeSessionModal.addEventListener('click', () => {
                this.hideSessionModal();
            });
        }

        const cancelSessionBtn = document.getElementById('cancelSessionBtn');
        if (cancelSessionBtn) {
            cancelSessionBtn.addEventListener('click', () => {
                this.hideSessionModal();
            });
        }

        const sessionForm = document.getElementById('sessionForm');
        if (sessionForm) {
            sessionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTrainingSession();
            });
        }

        const addExerciseBtn = document.getElementById('addExerciseBtn');
        if (addExerciseBtn) {
            addExerciseBtn.addEventListener('click', () => {
                this.addExerciseEntry();
            });
        }

        // Wellness management
        const addWellnessBtn = document.getElementById('addWellnessBtn');
        if (addWellnessBtn) {
            addWellnessBtn.addEventListener('click', () => {
                this.showWellnessModal();
            });
        }

        const closeWellnessModal = document.getElementById('closeWellnessModal');
        if (closeWellnessModal) {
            closeWellnessModal.addEventListener('click', () => {
                this.hideWellnessModal();
            });
        }

        const cancelWellnessBtn = document.getElementById('cancelWellnessBtn');
        if (cancelWellnessBtn) {
            cancelWellnessBtn.addEventListener('click', () => {
                this.hideWellnessModal();
            });
        }

        const wellnessForm = document.getElementById('wellnessForm');
        if (wellnessForm) {
            wellnessForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveWellnessData();
            });
        }

        // Range slider for readiness
        const readinessSlider = document.getElementById('readiness');
        if (readinessSlider) {
            readinessSlider.addEventListener('input', (e) => {
                const rangeValue = document.querySelector('.range-value');
                if (rangeValue) {
                    rangeValue.textContent = e.target.value;
                }
            });
        }

        // Report generation
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                this.generateReport();
            });
        }

        const exportReportBtn = document.getElementById('exportReportBtn');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }
    }

    // Athlete Management
    populateAthleteSelect() {
        const select = document.getElementById('athleteSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">Select Athlete</option>';
        
        this.athletes.forEach(athlete => {
            const option = document.createElement('option');
            option.value = athlete.id;
            option.textContent = `${athlete.firstName} ${athlete.lastName}`;
            select.appendChild(option);
        });
    }

    populateAthletes() {
        const container = document.getElementById('athletesList');
        if (!container) return;
        
        container.innerHTML = '';

        this.athletes.forEach(athlete => {
            const card = this.createAthleteCard(athlete);
            container.appendChild(card);
        });
    }

    createAthleteCard(athlete) {
        const card = document.createElement('div');
        card.className = 'athlete-card';

        const age = this.calculateAge(athlete.dateOfBirth);
        
        card.innerHTML = `
            <div class="athlete-header">
                <h3 class="athlete-name">${athlete.firstName} ${athlete.lastName}</h3>
                <span class="athlete-level">${athlete.competitionLevel}</span>
            </div>
            <div class="athlete-details">
                <div class="athlete-detail">
                    <span class="detail-label">Age</span>
                    <span class="detail-value">${age} years</span>
                </div>
                <div class="athlete-detail">
                    <span class="detail-label">Gender</span>
                    <span class="detail-value">${athlete.gender}</span>
                </div>
                <div class="athlete-detail">
                    <span class="detail-label">Weight</span>
                    <span class="detail-value">${athlete.weight} kg</span>
                </div>
                <div class="athlete-detail">
                    <span class="detail-label">Height</span>
                    <span class="detail-value">${athlete.height} cm</span>
                </div>
                <div class="athlete-detail">
                    <span class="detail-label">Personal Best</span>
                    <span class="detail-value">${athlete.personalBest || '--'} m</span>
                </div>
            </div>
            <div class="athlete-actions">
                <button class="btn btn--outline btn--sm" onclick="app.editAthlete('${athlete.id}')">Edit</button>
                <button class="btn btn--secondary btn--sm" onclick="app.selectAthlete('${athlete.id}')">Select</button>
            </div>
        `;

        return card;
    }

    showAthleteModal(athleteId = null) {
        const modal = document.getElementById('athleteModal');
        const form = document.getElementById('athleteForm');
        const title = document.getElementById('modalTitle');

        if (!modal || !form || !title) return;

        if (athleteId) {
            const athlete = this.athletes.find(a => a.id === athleteId);
            if (athlete) {
                title.textContent = 'Edit Athlete';
                this.populateAthleteForm(athlete);
                form.dataset.athleteId = athleteId;
            }
        } else {
            title.textContent = 'Add New Athlete';
            form.reset();
            delete form.dataset.athleteId;
        }

        modal.classList.remove('hidden');
    }

    hideAthleteModal() {
        const modal = document.getElementById('athleteModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    populateAthleteForm(athlete) {
        const fields = {
            'firstName': athlete.firstName,
            'lastName': athlete.lastName,
            'dateOfBirth': athlete.dateOfBirth,
            'gender': athlete.gender,
            'weight': athlete.weight,
            'height': athlete.height,
            'competitionLevel': athlete.competitionLevel,
            'personalBest': athlete.personalBest || ''
        };

        Object.keys(fields).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = fields[key];
            }
        });
    }

    saveAthlete() {
        const form = document.getElementById('athleteForm');
        if (!form) return;
        
        const athlete = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            dateOfBirth: document.getElementById('dateOfBirth')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            weight: parseFloat(document.getElementById('weight')?.value) || 0,
            height: parseFloat(document.getElementById('height')?.value) || 0,
            competitionLevel: document.getElementById('competitionLevel')?.value || '',
            personalBest: parseFloat(document.getElementById('personalBest')?.value) || null,
            somatotype: "masculine" // Default value
        };

        if (form.dataset.athleteId) {
            // Edit existing athlete
            athlete.id = form.dataset.athleteId;
            const index = this.athletes.findIndex(a => a.id === athlete.id);
            if (index !== -1) {
                this.athletes[index] = athlete;
            }
        } else {
            // Add new athlete
            athlete.id = `athlete_${Date.now()}`;
            this.athletes.push(athlete);
        }

        this.saveData('athletes');
        this.populateAthleteSelect();
        this.populateAthletes();
        this.hideAthleteModal();
    }

    editAthlete(athleteId) {
        this.showAthleteModal(athleteId);
    }

    selectAthlete(athleteId) {
        const select = document.getElementById('athleteSelect');
        if (select) {
            select.value = athleteId;
        }
        this.currentAthlete = this.athletes.find(a => a.id === athleteId);
        this.updateDashboard();
        this.showModule('dashboard');
        
        // Update nav to show dashboard as active
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(b => b.classList.remove('active'));
        const dashboardBtn = document.querySelector('.nav-btn[data-module="dashboard"]');
        if (dashboardBtn) {
            dashboardBtn.classList.add('active');
        }
    }

    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // Training Session Management
    showSessionModal() {
        if (!this.currentAthlete) {
            alert('Please select an athlete first');
            return;
        }

        const modal = document.getElementById('sessionModal');
        const form = document.getElementById('sessionForm');
        
        if (!modal || !form) return;
        
        form.reset();
        const sessionDate = document.getElementById('sessionDate');
        if (sessionDate) {
            sessionDate.value = new Date().toISOString().split('T')[0];
        }
        
        // Populate exercise options
        this.populateExerciseOptions();
        
        modal.classList.remove('hidden');
    }

    hideSessionModal() {
        const modal = document.getElementById('sessionModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    populateExerciseOptions() {
        const selects = document.querySelectorAll('.exercise-select');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Exercise...</option>';
            this.exerciseLibrary.forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise.id;
                option.textContent = exercise.name;
                select.appendChild(option);
            });
        });
    }

    addExerciseEntry() {
        const container = document.getElementById('exercisesList');
        if (!container) return;
        
        const entry = document.createElement('div');
        entry.className = 'exercise-entry';
        
        entry.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Exercise</label>
                    <select class="exercise-select form-control" required>
                        <option value="">Select Exercise...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Sets/Throws</label>
                    <input type="number" class="exercise-sets form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Reps/Distance</label>
                    <input type="text" class="exercise-reps form-control" placeholder="e.g. 10 or 45.2m" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Weight/Intensity</label>
                    <input type="text" class="exercise-weight form-control" placeholder="e.g. 100kg or RPE 8">
                </div>
            </div>
        `;
        
        container.appendChild(entry);
        this.populateExerciseOptions();
    }

    saveTrainingSession() {
        if (!this.currentAthlete) return;

        // Collect exercises
        const exercises = [];
        const exerciseEntries = document.querySelectorAll('.exercise-entry');
        
        exerciseEntries.forEach(entry => {
            const exerciseSelect = entry.querySelector('.exercise-select');
            const exerciseSets = entry.querySelector('.exercise-sets');
            const exerciseReps = entry.querySelector('.exercise-reps');
            const exerciseWeight = entry.querySelector('.exercise-weight');
            
            if (exerciseSelect && exerciseSets && exerciseReps) {
                const exerciseId = exerciseSelect.value;
                const sets = exerciseSets.value;
                const reps = exerciseReps.value;
                const weight = exerciseWeight ? exerciseWeight.value : '';
                
                if (exerciseId && sets && reps) {
                    const exercise = this.exerciseLibrary.find(e => e.id === exerciseId);
                    if (exercise) {
                        exercises.push({
                            exerciseId,
                            exerciseName: exercise.name,
                            sets: parseInt(sets),
                            reps,
                            weight,
                            category: exercise.category
                        });
                    }
                }
            }
        });

        const sessionDate = document.getElementById('sessionDate');
        const sessionType = document.getElementById('sessionType');
        const duration = document.getElementById('duration');
        const sessionRPE = document.getElementById('sessionRPE');
        const enjoyment = document.getElementById('enjoyment');
        const sessionNotes = document.getElementById('sessionNotes');

        if (!sessionDate || !sessionType || !duration || !sessionRPE) return;

        const session = {
            id: `session_${Date.now()}`,
            athleteId: this.currentAthlete.id,
            date: sessionDate.value,
            type: sessionType.value,
            duration: parseInt(duration.value),
            exercises,
            rpe: parseInt(sessionRPE.value),
            enjoyment: enjoyment ? parseInt(enjoyment.value) || null : null,
            notes: sessionNotes ? sessionNotes.value : '',
            trainingLoad: this.calculateTrainingLoad(parseInt(duration.value), parseInt(sessionRPE.value))
        };

        this.trainingSessions.push(session);
        this.saveData('sessions');
        this.populateTrainingSessions();
        this.hideSessionModal();
        this.updateDashboard();
    }

    calculateTrainingLoad(duration, rpe) {
        return duration * rpe; // Simple sRPE calculation
    }

    populateTrainingSessions() {
        const container = document.getElementById('sessionsList');
        if (!container) return;
        
        if (!this.currentAthlete) {
            container.innerHTML = '<div class="empty-state"><h3>No athlete selected</h3><p>Please select an athlete to view training sessions</p></div>';
            return;
        }

        const athleteSessions = this.trainingSessions.filter(s => s.athleteId === this.currentAthlete.id);
        
        if (athleteSessions.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No training sessions</h3><p>Click "Log New Session" to add the first training session</p></div>';
            return;
        }

        // Sort by date (newest first)
        athleteSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = '';
        athleteSessions.forEach(session => {
            const card = this.createSessionCard(session);
            container.appendChild(card);
        });
    }

    createSessionCard(session) {
        const card = document.createElement('div');
        card.className = 'session-card';
        
        const date = new Date(session.date).toLocaleDateString();
        
        card.innerHTML = `
            <div class="session-header">
                <span class="session-date">${date}</span>
                <span class="session-type">${session.type}</span>
            </div>
            <div class="session-details">
                <div class="session-detail">
                    <div class="session-detail-value">${session.duration} min</div>
                    <div class="session-detail-label">Duration</div>
                </div>
                <div class="session-detail">
                    <div class="session-detail-value">${session.exercises.length}</div>
                    <div class="session-detail-label">Exercises</div>
                </div>
                <div class="session-detail">
                    <div class="session-detail-value">${session.rpe}/10</div>
                    <div class="session-detail-label">RPE</div>
                </div>
                <div class="session-detail">
                    <div class="session-detail-value">${session.trainingLoad}</div>
                    <div class="session-detail-label">Load</div>
                </div>
                ${session.enjoyment ? `
                <div class="session-detail">
                    <div class="session-detail-value">${session.enjoyment}/5</div>
                    <div class="session-detail-label">Enjoyment</div>
                </div>
                ` : ''}
            </div>
            ${session.notes ? `<div class="session-notes"><strong>Notes:</strong> ${session.notes}</div>` : ''}
            <div class="session-exercises">
                <h4>Exercises:</h4>
                ${session.exercises.map(ex => `
                    <div class="exercise-summary">
                        <span class="exercise-name">${ex.exerciseName}</span>
                        <span class="exercise-details">${ex.sets} × ${ex.reps} ${ex.weight ? `@ ${ex.weight}` : ''}</span>
                    </div>
                `).join('')}
            </div>
        `;

        return card;
    }

    // Wellness Management
    showWellnessModal() {
        if (!this.currentAthlete) {
            alert('Please select an athlete first');
            return;
        }

        const modal = document.getElementById('wellnessModal');
        const form = document.getElementById('wellnessForm');
        
        if (!modal || !form) return;
        
        form.reset();
        const wellnessDate = document.getElementById('wellnessDate');
        if (wellnessDate) {
            wellnessDate.value = new Date().toISOString().split('T')[0];
        }
        
        const rangeValue = document.querySelector('.range-value');
        if (rangeValue) {
            rangeValue.textContent = '5';
        }
        
        modal.classList.remove('hidden');
    }

    hideWellnessModal() {
        const modal = document.getElementById('wellnessModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveWellnessData() {
        if (!this.currentAthlete) return;

        const sleepQuality = document.querySelector('input[name="sleepQuality"]:checked');
        const fatigue = document.querySelector('input[name="fatigue"]:checked');
        const soreness = document.querySelector('input[name="soreness"]:checked');
        const stress = document.querySelector('input[name="stress"]:checked');
        const mood = document.querySelector('input[name="mood"]:checked');
        const readiness = document.getElementById('readiness');
        const wellnessDate = document.getElementById('wellnessDate');

        if (!sleepQuality || !fatigue || !soreness || !stress || !mood || !readiness || !wellnessDate) {
            alert('Please fill in all wellness ratings');
            return;
        }

        const wellnessEntry = {
            id: `wellness_${Date.now()}`,
            athleteId: this.currentAthlete.id,
            date: wellnessDate.value,
            sleepQuality: parseInt(sleepQuality.value),
            fatigue: parseInt(fatigue.value),
            soreness: parseInt(soreness.value),
            stress: parseInt(stress.value),
            mood: parseInt(mood.value),
            readiness: parseInt(readiness.value),
            wellnessScore: this.calculateWellnessScore({
                sleepQuality: parseInt(sleepQuality.value),
                fatigue: parseInt(fatigue.value),
                soreness: parseInt(soreness.value),
                stress: parseInt(stress.value),
                mood: parseInt(mood.value)
            })
        };

        this.wellnessData.push(wellnessEntry);
        this.saveData('wellness');
        this.updateWellnessChart();
        this.hideWellnessModal();
        this.updateDashboard();
    }

    calculateWellnessScore(data) {
        // Calculate composite wellness score (higher is better)
        // Reverse fatigue, soreness, stress (lower is better for these)
        const score = (
            data.sleepQuality + 
            (6 - data.fatigue) + 
            (6 - data.soreness) + 
            (6 - data.stress) + 
            data.mood
        ) / 5;
        
        return Math.round(score * 10) / 10; // Round to 1 decimal
    }

    // Dashboard Updates
    updateDashboard() {
        if (!this.currentAthlete) {
            this.showEmptyDashboard();
            return;
        }

        this.updateQuickStats();
        this.updateRiskAlerts();
        this.updateDashboardCharts();
    }

    showEmptyDashboard() {
        const elements = {
            'recentThrows': '--',
            'trainingLoad': '--',
            'wellnessScore': '--',
            'riskLevel': '--'
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
        
        const alertsContainer = document.getElementById('riskAlerts');
        if (alertsContainer) {
            alertsContainer.innerHTML = `
                <div class="alert alert-info">
                    <span class="alert-icon">ℹ</span>
                    <span>Select an athlete to view personalized dashboard</span>
                </div>
            `;
        }
    }

    updateQuickStats() {
        const athleteSessions = this.trainingSessions.filter(s => s.athleteId === this.currentAthlete.id);
        const athleteWellness = this.wellnessData.filter(w => w.athleteId === this.currentAthlete.id);
        
        // Recent throws (last 7 days)
        const recentSessions = athleteSessions.filter(s => {
            const sessionDate = new Date(s.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
        });
        
        const recentThrows = recentSessions.reduce((total, session) => {
            return total + session.exercises.filter(ex => ex.exerciseName.includes('Hammer')).length;
        }, 0);

        // Training load (7-day average)
        const weeklyLoad = recentSessions.reduce((total, session) => total + session.trainingLoad, 0);
        const avgLoad = recentSessions.length > 0 ? Math.round(weeklyLoad / 7) : 0;

        // Latest wellness score
        const latestWellness = athleteWellness.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const wellnessScore = latestWellness ? latestWellness.wellnessScore : '--';

        // Risk level calculation
        const riskLevel = this.calculateRiskLevel();

        const updates = {
            'recentThrows': recentThrows,
            'trainingLoad': avgLoad,
            'wellnessScore': wellnessScore,
            'riskLevel': riskLevel
        };

        Object.keys(updates).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = updates[id];
            }
        });
    }

    calculateRiskLevel() {
        const athleteSessions = this.trainingSessions.filter(s => s.athleteId === this.currentAthlete.id);
        const athleteWellness = this.wellnessData.filter(w => w.athleteId === this.currentAthlete.id);
        
        if (athleteSessions.length < 7) return 'Insufficient Data';

        // Calculate acute:chronic workload ratio
        const acuteLoad = this.getAcuteWorkload(athleteSessions);
        const chronicLoad = this.getChronicWorkload(athleteSessions);
        const ratio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

        // Get latest wellness
        const latestWellness = athleteWellness.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const wellnessScore = latestWellness ? latestWellness.wellnessScore : 3;

        // Risk assessment
        if (ratio > 1.5 || wellnessScore < 2.5) return 'High';
        if (ratio > 1.2 || wellnessScore < 3.5) return 'Moderate';
        return 'Low';
    }

    getAcuteWorkload(sessions, days = 7) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const recentSessions = sessions.filter(s => new Date(s.date) >= cutoff);
        return recentSessions.reduce((total, session) => total + session.trainingLoad, 0) / days;
    }

    getChronicWorkload(sessions, days = 28) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const recentSessions = sessions.filter(s => new Date(s.date) >= cutoff);
        return recentSessions.reduce((total, session) => total + session.trainingLoad, 0) / days;
    }

    updateRiskAlerts() {
        const alertsContainer = document.getElementById('riskAlerts');
        if (!alertsContainer) return;
        
        const alerts = [];

        const athleteSessions = this.trainingSessions.filter(s => s.athleteId === this.currentAthlete.id);
        const athleteWellness = this.wellnessData.filter(w => w.athleteId === this.currentAthlete.id);

        // Check for high training load
        if (athleteSessions.length >= 7) {
            const acuteLoad = this.getAcuteWorkload(athleteSessions);
            const chronicLoad = this.getChronicWorkload(athleteSessions);
            const ratio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

            if (ratio > 1.5) {
                alerts.push({
                    type: 'error',
                    icon: '⚠',
                    message: `High acute:chronic ratio (${ratio.toFixed(2)}). Consider reducing training load.`
                });
            } else if (ratio > 1.2) {
                alerts.push({
                    type: 'warning',
                    icon: '⚡',
                    message: `Elevated acute:chronic ratio (${ratio.toFixed(2)}). Monitor closely.`
                });
            }
        }

        // Check wellness trends
        if (athleteWellness.length >= 3) {
            const recent = athleteWellness.slice(-3);
            const avgScore = recent.reduce((sum, w) => sum + w.wellnessScore, 0) / 3;
            
            if (avgScore < 2.5) {
                alerts.push({
                    type: 'error',
                    icon: '😰',
                    message: 'Low wellness scores detected. Consider rest or reduced intensity.'
                });
            }
        }

        // Check for missing data
        const lastSession = athleteSessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        if (lastSession) {
            const daysSinceSession = Math.floor((new Date() - new Date(lastSession.date)) / (1000 * 60 * 60 * 24));
            if (daysSinceSession > 7) {
                alerts.push({
                    type: 'info',
                    icon: 'ℹ',
                    message: `No training sessions logged for ${daysSinceSession} days.`
                });
            }
        }

        if (alerts.length === 0) {
            alerts.push({
                type: 'success',
                icon: '✓',
                message: 'All indicators are within normal ranges. Good work!'
            });
        }

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type}">
                <span class="alert-icon">${alert.icon}</span>
                <span>${alert.message}</span>
            </div>
        `).join('');
    }

    // Charts and Analytics
    initializeCharts() {
        try {
            this.initTrainingLoadChart();
            this.initPerformanceTrendChart();
            this.initWellnessChart();
            this.initAnalyticsCharts();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    initTrainingLoadChart() {
        const ctx = document.getElementById('trainingLoadChart');
        if (!ctx) return;

        try {
            this.charts.trainingLoad = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Training Load',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating training load chart:', error);
        }
    }

    initPerformanceTrendChart() {
        const ctx = document.getElementById('performanceTrendChart');
        if (!ctx) return;

        try {
            this.charts.performance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Best Throw',
                        data: [0, 0, 0, 0],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating performance trend chart:', error);
        }
    }

    initWellnessChart() {
        const ctx = document.getElementById('wellnessChart');
        if (!ctx) return;

        try {
            this.charts.wellness = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Sleep', 'Energy', 'Recovery', 'Stress', 'Mood'],
                    datasets: [{
                        label: 'Wellness',
                        data: [3, 3, 3, 3, 3],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.2)',
                        pointBackgroundColor: '#B4413C'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 5
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating wellness chart:', error);
        }
    }

    initAnalyticsCharts() {
        // Acute vs Chronic Chart
        const acuteCtx = document.getElementById('acuteChronicChart');
        if (acuteCtx) {
            try {
                this.charts.acuteChronic = new Chart(acuteCtx, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [
                            {
                                label: 'Acute Load',
                                data: [0, 0, 0, 0],
                                borderColor: '#DB4545',
                                backgroundColor: 'rgba(219, 69, 69, 0.1)',
                                tension: 0.4
                            },
                            {
                                label: 'Chronic Load',
                                data: [0, 0, 0, 0],
                                borderColor: '#5D878F',
                                backgroundColor: 'rgba(93, 135, 143, 0.1)',
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating acute/chronic chart:', error);
            }
        }

        // Monotony Chart
        const monotonyCtx = document.getElementById('monotonyChart');
        if (monotonyCtx) {
            try {
                this.charts.monotony = new Chart(monotonyCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [
                            {
                                label: 'Training Monotony',
                                data: [0, 0, 0, 0],
                                backgroundColor: '#D2BA4C'
                            },
                            {
                                label: 'Training Strain',
                                data: [0, 0, 0, 0],
                                backgroundColor: '#964325'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating monotony chart:', error);
            }
        }
    }

    updateDashboardCharts() {
        this.updateTrainingLoadChart();
        this.updatePerformanceTrendChart();
    }

    updateTrainingLoadChart() {
        if (!this.charts.trainingLoad || !this.currentAthlete) return;

        const athleteSessions = this.trainingSessions
            .filter(s => s.athleteId === this.currentAthlete.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Get last 7 days
        const labels = [];
        const data = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            const dayLoad = athleteSessions
                .filter(s => s.date === dateStr)
                .reduce((total, session) => total + session.trainingLoad, 0);
                
            data.push(dayLoad);
        }

        this.charts.trainingLoad.data.labels = labels;
        this.charts.trainingLoad.data.datasets[0].data = data;
        this.charts.trainingLoad.update();
    }

    updatePerformanceTrendChart() {
        if (!this.charts.performance || !this.currentAthlete) return;

        const athleteSessions = this.trainingSessions
            .filter(s => s.athleteId === this.currentAthlete.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = [];
        const data = [];

        // Get best throws from sessions
        athleteSessions.forEach(session => {
            const hammerThrows = session.exercises.filter(ex => 
                ex.exerciseName.includes('Hammer') && ex.reps.includes('m')
            );
            
            if (hammerThrows.length > 0) {
                const distances = hammerThrows.map(ex => {
                    const match = ex.reps.match(/(\d+\.?\d*)m/);
                    return match ? parseFloat(match[1]) : 0;
                });
                
                const bestThrow = Math.max(...distances);
                if (bestThrow > 0) {
                    labels.push(new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                    data.push(bestThrow);
                }
            }
        });

        if (data.length > 0) {
            this.charts.performance.data.labels = labels.slice(-10);
            this.charts.performance.data.datasets[0].data = data.slice(-10);
        } else {
            // Show sample data if no throws recorded
            this.charts.performance.data.labels = ['Session 1', 'Session 2', 'Session 3', 'Session 4'];
            this.charts.performance.data.datasets[0].data = [45.2, 46.1, 44.8, 47.3];
        }
        
        this.charts.performance.update();
    }

    updateWellnessChart() {
        if (!this.charts.wellness) return;

        if (!this.currentAthlete) {
            this.charts.wellness.data.datasets[0].data = [3, 3, 3, 3, 3];
            this.charts.wellness.update();
            return;
        }

        const athleteWellness = this.wellnessData.filter(w => w.athleteId === this.currentAthlete.id);
        
        if (athleteWellness.length === 0) {
            this.charts.wellness.data.datasets[0].data = [3, 3, 3, 3, 3];
            this.charts.wellness.update();
            return;
        }

        // Get latest wellness data
        const latest = athleteWellness.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        this.charts.wellness.data.datasets[0].data = [
            latest.sleepQuality,
            6 - latest.fatigue, // Invert fatigue (higher is better)
            6 - latest.soreness, // Invert soreness
            6 - latest.stress, // Invert stress
            latest.mood
        ];
        
        this.charts.wellness.update();
    }

    updateAnalytics() {
        if (!this.currentAthlete) return;
        
        this.updateAcuteChronicChart();
        this.updateMonotonyChart();
        this.updateRiskGauge();
    }

    updateAcuteChronicChart() {
        if (!this.charts.acuteChronic) return;

        const athleteSessions = this.trainingSessions
            .filter(s => s.athleteId === this.currentAthlete.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (athleteSessions.length < 14) {
            // Show sample data
            this.charts.acuteChronic.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            this.charts.acuteChronic.data.datasets[0].data = [120, 150, 180, 140];
            this.charts.acuteChronic.data.datasets[1].data = [130, 135, 145, 150];
            this.charts.acuteChronic.update();
            return;
        }

        const labels = [];
        const acuteData = [];
        const chronicData = [];

        // Calculate for last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            
            labels.push(`Week ${4 - i}`);
            
            const acute = this.getAcuteWorkload(athleteSessions.filter(s => new Date(s.date) <= date), 7);
            const chronic = this.getChronicWorkload(athleteSessions.filter(s => new Date(s.date) <= date), 28);
            
            acuteData.push(acute);
            chronicData.push(chronic);
        }

        this.charts.acuteChronic.data.labels = labels;
        this.charts.acuteChronic.data.datasets[0].data = acuteData;
        this.charts.acuteChronic.data.datasets[1].data = chronicData;
        this.charts.acuteChronic.update();
    }

    updateMonotonyChart() {
        if (!this.charts.monotony) return;

        const athleteSessions = this.trainingSessions
            .filter(s => s.athleteId === this.currentAthlete.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (athleteSessions.length < 7) {
            // Show sample data
            this.charts.monotony.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            this.charts.monotony.data.datasets[0].data = [1.2, 1.5, 1.8, 1.3];
            this.charts.monotony.data.datasets[1].data = [180, 225, 270, 195];
            this.charts.monotony.update();
            return;
        }

        // Calculate weekly monotony and strain for last 4 weeks
        const labels = [];
        const monotonyData = [];
        const strainData = [];

        for (let week = 3; week >= 0; week--) {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - (week * 7));
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 6);

            const weekSessions = athleteSessions.filter(s => {
                const sessionDate = new Date(s.date);
                return sessionDate >= startDate && sessionDate <= endDate;
            });

            labels.push(`Week ${4 - week}`);

            if (weekSessions.length > 0) {
                const loads = weekSessions.map(s => s.trainingLoad);
                const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
                const stdDev = Math.sqrt(loads.reduce((sum, load) => sum + Math.pow(load - avgLoad, 2), 0) / loads.length);
                const monotony = stdDev > 0 ? avgLoad / stdDev : 0;
                const strain = avgLoad * monotony;

                monotonyData.push(monotony);
                strainData.push(strain);
            } else {
                monotonyData.push(0);
                strainData.push(0);
            }
        }

        this.charts.monotony.data.labels = labels;
        this.charts.monotony.data.datasets[0].data = monotonyData;
        this.charts.monotony.data.datasets[1].data = strainData;
        this.charts.monotony.update();
    }

    updateRiskGauge() {
        const riskLevel = this.calculateRiskLevel();
        const riskScore = document.getElementById('currentRiskScore');
        
        if (riskScore) {
            riskScore.textContent = riskLevel + ' Risk';
            riskScore.className = `risk-score risk-${riskLevel.toLowerCase()}`;
        }
    }

    updateAllCharts() {
        this.updateDashboardCharts();
        this.updateWellnessChart();
        this.updateAnalytics();
    }

    // Testing and other modules
    populateTestResults() {
        const container = document.getElementById('testingResults');
        if (!container) return;
        
        if (!this.currentAthlete) {
            container.innerHTML = '<div class="empty-state"><h3>No athlete selected</h3><p>Please select an athlete to view test results</p></div>';
            return;
        }

        container.innerHTML = `
            <div class="test-category">
                <h3>Sprint Tests</h3>
                <div class="test-results">
                    <div class="test-result">
                        <span class="test-name">30m Sprint</span>
                        <span class="test-value">4.2 s</span>
                    </div>
                    <div class="test-result">
                        <span class="test-name">60m Sprint</span>
                        <span class="test-value">7.8 s</span>
                    </div>
                </div>
            </div>
            <div class="test-category">
                <h3>Strength Tests</h3>
                <div class="test-results">
                    <div class="test-result">
                        <span class="test-name">Back Squat 1RM</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '180 kg' : '110 kg'}</span>
                    </div>
                    <div class="test-result">
                        <span class="test-name">Bench Press 1RM</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '120 kg' : '60 kg'}</span>
                    </div>
                    <div class="test-result">
                        <span class="test-name">Snatch 1RM</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '90 kg' : '55 kg'}</span>
                    </div>
                </div>
            </div>
            <div class="test-category">
                <h3>Jump Tests</h3>
                <div class="test-results">
                    <div class="test-result">
                        <span class="test-name">Standing Long Jump</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '280 cm' : '250 cm'}</span>
                    </div>
                    <div class="test-result">
                        <span class="test-name">Standing Triple Jump</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '800 cm' : '700 cm'}</span>
                    </div>
                </div>
            </div>
            <div class="test-category">
                <h3>Throwing Tests</h3>
                <div class="test-results">
                    <div class="test-result">
                        <span class="test-name">Shot Put Backward</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '20 m' : '16 m'}</span>
                    </div>
                    <div class="test-result">
                        <span class="test-name">Shot Put Forward</span>
                        <span class="test-value">${this.currentAthlete.gender === 'M' ? '18 m' : '14 m'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    populatePeriodization() {
        const container = document.getElementById('periodsTimeline');
        if (!container) return;

        if (!this.currentAthlete) {
            container.innerHTML = '<div class="empty-state"><h3>No athlete selected</h3><p>Please select an athlete to view periodization</p></div>';
            return;
        }

        container.innerHTML = `
            <div class="periods-timeline">
                <div class="period-card">
                    <div class="period-header">
                        <h3 class="period-name">General Preparation</h3>
                        <span class="period-type">preparation</span>
                    </div>
                    <p>Building aerobic base and general strength (8-12 weeks)</p>
                    <div class="period-focus">
                        <strong>Focus:</strong> High volume strength, technical development, general conditioning
                    </div>
                </div>
                <div class="period-card">
                    <div class="period-header">
                        <h3 class="period-name">Special Preparation</h3>
                        <span class="period-type">preparation</span>
                    </div>
                    <p>Specific strength and power development (6-8 weeks)</p>
                    <div class="period-focus">
                        <strong>Focus:</strong> Special strength, implement throwing, power development
                    </div>
                </div>
                <div class="period-card">
                    <div class="period-header">
                        <h3 class="period-name">Competition Preparation</h3>
                        <span class="period-type">competition prep</span>
                    </div>
                    <p>Competition simulation and peak performance (4-6 weeks)</p>
                    <div class="period-focus">
                        <strong>Focus:</strong> Competition throws, technical refinement, tapering
                    </div>
                </div>
                <div class="period-card">
                    <div class="period-header">
                        <h3 class="period-name">Competition</h3>
                        <span class="period-type">competition</span>
                    </div>
                    <p>Peak performance maintenance (Variable duration)</p>
                    <div class="period-focus">
                        <strong>Focus:</strong> Maintenance volume, recovery optimization, competition performance
                    </div>
                </div>
            </div>
        `;
    }

    updateReports() {
        const content = document.getElementById('reportContent');
        if (!content) return;
        
        if (!this.currentAthlete) {
            content.innerHTML = `
                <div class="report-placeholder">
                    <p>Select an athlete to generate personalized reports</p>
                </div>
            `;
        }
    }

    generateReport() {
        if (!this.currentAthlete) {
            alert('Please select an athlete first');
            return;
        }

        const reportType = document.getElementById('reportType').value;
        const content = document.getElementById('reportContent');
        
        if (!content) return;
        
        // Generate basic report
        content.innerHTML = `
            <div class="report-section">
                <h3>${this.currentAthlete.firstName} ${this.currentAthlete.lastName} - ${this.getReportTypeName(reportType)} Report</h3>
                <p>Report generated on: ${new Date().toLocaleDateString()}</p>
                
                <div class="report-stats">
                    <h4>Key Metrics</h4>
                    <ul>
                        <li>Total Training Sessions: ${this.trainingSessions.filter(s => s.athleteId === this.currentAthlete.id).length}</li>
                        <li>Wellness Entries: ${this.wellnessData.filter(w => w.athleteId === this.currentAthlete.id).length}</li>
                        <li>Current Risk Level: ${this.calculateRiskLevel()}</li>
                        <li>Personal Best: ${this.currentAthlete.personalBest || '--'} m</li>
                        <li>Competition Level: ${this.currentAthlete.competitionLevel}</li>
                        <li>Age: ${this.calculateAge(this.currentAthlete.dateOfBirth)} years</li>
                    </ul>
                </div>
                
                <div class="report-recommendations">
                    <h4>Recommendations</h4>
                    <p>Based on the current data analysis:</p>
                    <ul>
                        <li>Continue monitoring training load and wellness indicators</li>
                        <li>Focus on consistent technique development</li>
                        <li>Maintain balanced training approach</li>
                        <li>Regular performance testing recommended</li>
                    </ul>
                </div>
                
                <div class="report-summary">
                    <h4>Summary</h4>
                    <p>The athlete shows good potential for continued development. Regular monitoring of training load and wellness will help optimize performance and reduce injury risk.</p>
                </div>
            </div>
        `;
    }

    getReportTypeName(type) {
        const types = {
            'performance': 'Performance Summary',
            'load': 'Load Management',
            'wellness': 'Wellness Analysis',
            'risk': 'Risk Assessment'
        };
        return types[type] || 'General';
    }

    exportReport() {
        alert('Export functionality: In a production system, this would generate a PDF report using a service like jsPDF or server-side PDF generation.');
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OuzlimDB();
});

// Global functions for onclick handlers
window.app = null;
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OuzlimDB();
});