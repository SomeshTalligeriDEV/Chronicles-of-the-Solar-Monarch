/* ===============================================
   CHRONICLES OF THE SOLAR MONARCH - MAIN SCRIPT
   Core application logic and initialization
   =============================================== */

class SolarMonarchApp {
    constructor() {
        this.currentSection = 'hero';
        this.currentStory = null;
        this.userProgress = this.loadProgress();
        this.achievements = new Set(this.userProgress.achievements || []);
        this.isLoading = true;
        this.theme = localStorage.getItem('theme') || 'dark';
        
        // Initialize modules
        this.galaxyGenerator = null;
        this.storyEngine = null;
        this.dashboard = null;
        this.multiplayer = null;
        this.aiTutor = null;
        this.achievementSystem = null;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
        this.handleStoryLaunch = this.handleStoryLaunch.bind(this);
        this.updateNASAData = this.updateNASAData.bind(this);
    }

    async init() {
        console.log('🚀 Initializing Chronicles of the Solar Monarch...');
        
        try {
            // Set initial theme
            document.documentElement.setAttribute('data-theme', this.theme);
            
            // Initialize loading sequence
            await this.initializeLoadingSequence();
            
            // Initialize galaxy background
            await this.initializeGalaxyBackground();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize NASA data updates
            this.initializeNASADataUpdates();
            
            // Initialize modules
            await this.initializeModules();
            
            // Complete loading
            await this.completeLoading();
            
            // Start the experience
            this.startExperience();
            
            console.log('✨ App initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showErrorState(error);
        }
    }

    async initializeLoadingSequence() {
        const loadingBar = document.querySelector('.loading-bar');
        const loadingText = document.querySelector('.loading-text');
        
        const loadingSteps = [
            { text: 'Connecting to NASA satellites...', progress: 20, delay: 500 },
            { text: 'Downloading space weather data...', progress: 40, delay: 800 },
            { text: 'Generating procedural galaxy...', progress: 60, delay: 600 },
            { text: 'Initializing story engine...', progress: 80, delay: 700 },
            { text: 'Preparing cosmic adventure...', progress: 100, delay: 500 }
        ];

        for (const step of loadingSteps) {
            loadingText.textContent = step.text;
            loadingBar.style.width = `${step.progress}%`;
            await this.delay(step.delay);
        }
    }

    async initializeGalaxyBackground() {
        const canvas = document.getElementById('galaxy-canvas');
        if (canvas && window.GalaxyGenerator) {
            this.galaxyGenerator = new GalaxyGenerator(canvas);
            this.galaxyGenerator.initialize();
        }
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', this.handleNavigation);
        
        // Story launches
        document.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', () => {
                const storyType = card.dataset.story;
                this.handleStoryLaunch(storyType);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Judge panel toggle
        const judgeToggle = document.getElementById('judge-toggle');
        const judgePanel = document.getElementById('judge-panel');
        if (judgeToggle && judgePanel) {
            judgeToggle.addEventListener('click', () => {
                judgePanel.classList.toggle('active');
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Asteroid field interaction
        this.setupAsteroidField();

        // Resize handler for responsive canvas
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleNavigation(event) {
        const navLink = event.target.closest('.nav-link');
        if (navLink) {
            event.preventDefault();
            const targetSection = navLink.getAttribute('href').substring(1);
            this.navigateToSection(targetSection);
        }
    }

    async navigateToSection(sectionId) {
        if (this.currentSection === sectionId) return;

        console.log(`🧭 Navigating to ${sectionId}`);

        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`)?.classList.add('active');

        // Hide current section
        document.querySelectorAll('.hero-section, .dashboard-section, .multiplayer-section, .ai-tutor-section')
            .forEach(section => section.classList.add('hidden'));

        // Show target section
        const targetElement = document.getElementById(sectionId) || 
                            document.getElementById(`${sectionId}-section`);
        
        if (targetElement) {
            targetElement.classList.remove('hidden');
            targetElement.classList.add('fade-in');
        }

        // Initialize section-specific functionality
        switch (sectionId) {
            case 'dashboard':
                await this.initializeDashboard();
                break;
            case 'multiplayer':
                await this.initializeMultiplayer();
                break;
            case 'ai-tutor':
                await this.initializeAITutor();
                break;
            case 'home':
                this.updateHeroData();
                break;
        }

        this.currentSection = sectionId;
    }

    async handleStoryLaunch(storyType) {
        console.log(`📖 Launching story: ${storyType}`);
        
        try {
            // Show warp transition
            await this.playWarpTransition();
            
            // Initialize story engine if not already done
            if (!this.storyEngine && window.StoryEngine) {
                this.storyEngine = new StoryEngine();
            }
            
            // Load and start the story
            if (this.storyEngine) {
                await this.storyEngine.loadStory(storyType);
                this.currentStory = storyType;
                
                // Track achievement
                this.unlockAchievement('first_story');
                
                // Hide hero section and show story
                document.getElementById('hero-section').classList.add('hidden');
                document.getElementById('story-container').classList.remove('hidden');
            }
            
        } catch (error) {
            console.error('❌ Failed to launch story:', error);
            this.showError('Failed to load story. Please try again.');
        }
    }

    async playWarpTransition() {
        const warpCanvas = document.getElementById('warp-canvas');
        if (warpCanvas && window.WarpTransition) {
            warpCanvas.classList.remove('hidden');
            const warpEffect = new WarpTransition(warpCanvas);
            await warpEffect.play();
            warpCanvas.classList.add('hidden');
        } else {
            // Fallback transition
            await this.delay(1000);
        }
    }

    initializeNASADataUpdates() {
        // Update NASA data display immediately
        this.updateNASAData();
        
        // Set up periodic updates (every 30 seconds)
        setInterval(() => {
            this.updateNASAData();
        }, 30000);
        
        // Simulate data variations every 10 seconds
        setInterval(() => {
            if (window.SpaceWeatherAPI) {
                window.SpaceWeatherAPI.updateRealTimeData();
                this.updateLiveDataDisplay();
            }
        }, 10000);
    }

    updateNASAData() {
        if (!window.SpaceWeatherAPI) return;
        
        try {
            const status = window.SpaceWeatherAPI.getCurrentStatus();
            
            // Update card data snippets
            const flareRisk = document.querySelector('[data-live="flare-risk"]');
            if (flareRisk) flareRisk.textContent = status.solarFlareRisk;
            
            const magneticActivity = document.querySelector('[data-live="magnetic-activity"]');
            if (magneticActivity) magneticActivity.textContent = status.magneticActivity;
            
            const cmeEvents = document.querySelector('[data-live="cme-events"]');
            if (cmeEvents) cmeEvents.textContent = `${status.cmeEvents} Active`;
            
            // Check for story adaptations
            const adaptations = window.SpaceWeatherAPI.checkStoryAdaptations();
            if (Object.keys(adaptations).length > 0) {
                this.applyStoryAdaptations(adaptations);
            }
            
        } catch (error) {
            console.warn('⚠️ Failed to update NASA data:', error);
        }
    }

    updateLiveDataDisplay() {
        // Update any live data displays in the dashboard
        if (this.dashboard && this.currentSection === 'dashboard') {
            this.dashboard.updateLiveData();
        }
    }

    applyStoryAdaptations(adaptations) {
        // Apply real-time story modifications based on space weather
        console.log('🌟 Applying story adaptations:', adaptations);
        
        if (this.storyEngine && this.currentStory) {
            this.storyEngine.applyAdaptations(adaptations);
        }
        
        // Show notification for significant events
        for (const [type, modification] of Object.entries(adaptations)) {
            if (modification.intensity === 'extreme') {
                this.showSpaceWeatherAlert(type, modification);
            }
        }
    }

    setupAsteroidField() {
        const asteroidField = document.getElementById('asteroid-field');
        if (!asteroidField) return;

        // Generate interactive asteroids
        for (let i = 0; i < 15; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = 'asteroid';
            asteroid.innerHTML = '☄️';
            
            // Random positioning
            asteroid.style.position = 'absolute';
            asteroid.style.left = `${Math.random() * 100}%`;
            asteroid.style.top = `${Math.random() * 100}%`;
            asteroid.style.fontSize = `${1 + Math.random() * 2}rem`;
            asteroid.style.cursor = 'pointer';
            asteroid.style.zIndex = '5';
            asteroid.style.transition = 'transform 0.3s ease';
            
            // Add hover and click effects
            asteroid.addEventListener('mouseenter', () => {
                asteroid.style.transform = 'scale(1.5) rotate(45deg)';
            });
            
            asteroid.addEventListener('mouseleave', () => {
                asteroid.style.transform = 'scale(1) rotate(0deg)';
            });
            
            asteroid.addEventListener('click', () => {
                this.showAsteroidFact(asteroid);
            });
            
            asteroidField.appendChild(asteroid);
        }
    }

    showAsteroidFact(asteroid) {
        const fact = window.SpaceWeatherAPI?.getRandomFact() || 
                    "Space weather affects technology all around us!";
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'asteroid-tooltip';
        tooltip.textContent = fact;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--card-bg);
            border: 2px solid var(--card-border);
            border-radius: 10px;
            padding: 1rem;
            max-width: 250px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: fade-in-up 0.3s ease-out;
            backdrop-filter: blur(10px);
            box-shadow: var(--card-glow);
        `;
        
        // Position tooltip near asteroid
        const rect = asteroid.getBoundingClientRect();
        tooltip.style.left = `${rect.left + 30}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        
        document.body.appendChild(tooltip);
        
        // Remove tooltip after 3 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.style.animation = 'fade-out 0.3s ease-out';
                setTimeout(() => tooltip.remove(), 300);
            }
        }, 3000);
        
        // Add mining effect
        asteroid.style.animation = 'icon-bounce 0.5s ease-out';
        setTimeout(() => {
            asteroid.style.animation = '';
        }, 500);
    }

    async initializeModules() {
        // Initialize Story Engine
        if (window.StoryEngine) {
            this.storyEngine = new StoryEngine();
            console.log('📚 Story Engine initialized');
        }
        
        // Initialize Achievement System
        if (window.AchievementSystem) {
            this.achievementSystem = new AchievementSystem();
            console.log('🏆 Achievement System initialized');
        }
        
        // Other modules will be initialized on-demand
    }

    async initializeDashboard() {
        if (!this.dashboard && window.Dashboard) {
            this.dashboard = new Dashboard();
            await this.dashboard.initialize();
            console.log('📊 Dashboard initialized');
        }
    }

    async initializeMultiplayer() {
        if (!this.multiplayer && window.Multiplayer) {
            this.multiplayer = new Multiplayer();
            await this.multiplayer.initialize();
            console.log('🎮 Multiplayer initialized');
        }
    }

    async initializeAITutor() {
        if (!this.aiTutor && window.AITutor) {
            this.aiTutor = new AITutor();
            await this.aiTutor.initialize();
            console.log('🤖 AI Tutor initialized');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Update theme toggle icon
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    handleKeyboard(event) {
        // Accessibility keyboard shortcuts
        switch (event.key) {
            case 'Escape':
                // Close any open modals or return to home
                if (this.currentStory) {
                    this.exitStory();
                }
                break;
            case 'h':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.navigateToSection('home');
                }
                break;
            case 'd':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.navigateToSection('dashboard');
                }
                break;
        }
    }

    handleResize() {
        // Update canvas sizes
        if (this.galaxyGenerator) {
            this.galaxyGenerator.resize();
        }
        
        if (this.dashboard) {
            this.dashboard.resize();
        }
    }

    unlockAchievement(achievementId) {
        if (this.achievements.has(achievementId)) return;
        
        this.achievements.add(achievementId);
        this.saveProgress();
        
        // Show achievement notification
        this.showAchievementToast(achievementId);
        
        console.log(`🏆 Achievement unlocked: ${achievementId}`);
    }

    showAchievementToast(achievementId) {
        const achievement = window.NASA_DATA?.achievements[achievementId];
        if (!achievement) return;
        
        const toast = document.getElementById('achievement-toast');
        if (!toast) return;
        
        const title = toast.querySelector('.achievement-title');
        const desc = toast.querySelector('.achievement-desc');
        const icon = toast.querySelector('.achievement-icon');
        
        title.textContent = achievement.title;
        desc.textContent = achievement.description;
        icon.textContent = achievement.icon;
        
        toast.classList.remove('hidden');
        toast.classList.add('animate-achievement');
        
        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.remove('animate-achievement');
        }, 4000);
    }

    showSpaceWeatherAlert(type, modification) {
        // Create and show space weather alert
        const alert = document.createElement('div');
        alert.className = 'space-weather-alert';
        alert.innerHTML = `
            <div class="alert-icon">⚡</div>
            <div class="alert-content">
                <h4>Space Weather Alert</h4>
                <p>${modification.dialogue}</p>
            </div>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-bg);
            border: 2px solid var(--solar-orange);
            border-radius: 15px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(238, 108, 77, 0.4);
            z-index: var(--z-modal);
            animation: slide-down 0.5s ease-out;
        `;
        
        document.body.appendChild(alert);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alert.style.animation = 'slide-up 0.5s ease-out';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    }

    updateHeroData() {
        this.updateNASAData();
        
        // Refresh asteroid field with new facts
        const existingAsteroids = document.querySelectorAll('.asteroid');
        existingAsteroids.forEach(asteroid => {
            asteroid.addEventListener('click', () => {
                this.showAsteroidFact(asteroid);
            });
        });
    }

    exitStory() {
        if (this.currentStory) {
            document.getElementById('story-container').classList.add('hidden');
            document.getElementById('hero-section').classList.remove('hidden');
            this.currentStory = null;
            this.navigateToSection('home');
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('solarMonarchProgress');
            return saved ? JSON.parse(saved) : {
                achievements: [],
                storiesCompleted: [],
                quizScores: {},
                totalPoints: 0
            };
        } catch {
            return {
                achievements: [],
                storiesCompleted: [],
                quizScores: {},
                totalPoints: 0
            };
        }
    }

    saveProgress() {
        const progress = {
            achievements: Array.from(this.achievements),
            storiesCompleted: this.userProgress.storiesCompleted || [],
            quizScores: this.userProgress.quizScores || {},
            totalPoints: this.userProgress.totalPoints || 0
        };
        
        localStorage.setItem('solarMonarchProgress', JSON.stringify(progress));
        this.userProgress = progress;
    }

    showError(message) {
        console.error('❌', message);
        // TODO: Implement user-friendly error display
    }

    showErrorState(error) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-state">
                    <h2>🛸 Houston, we have a problem!</h2>
                    <p>Failed to initialize the space weather system.</p>
                    <p>Error: ${error.message}</p>
                    <button onclick="location.reload()" class="retry-btn">🔄 Retry Mission</button>
                </div>
            `;
        }
    }

    async completeLoading() {
        await this.delay(500);
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
            }, 500);
        }
    }

    startExperience() {
        // Start any auto-play animations
        if (this.galaxyGenerator) {
            this.galaxyGenerator.startAnimations();
        }
        
        // Show welcome message for first-time users
        if (this.userProgress.achievements.length === 0) {
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 1000);
        }
        
        // Enable interactions
        document.body.classList.add('loaded');
    }

    showWelcomeMessage() {
        // Create welcome overlay
        const welcome = document.createElement('div');
        welcome.className = 'welcome-overlay';
        welcome.innerHTML = `
            <div class="welcome-content">
                <h2>🌟 Welcome, Space Explorer!</h2>
                <p>You're about to embark on incredible space weather adventures powered by real NASA data.</p>
                <p>Click on the glowing story cards to begin your cosmic journey!</p>
                <button class="welcome-close">Let's Explore! 🚀</button>
            </div>
        `;
        
        welcome.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            animation: fade-in 0.5s ease-out;
        `;
        
        const content = welcome.querySelector('.welcome-content');
        content.style.cssText = `
            background: var(--card-bg);
            border: 2px solid var(--card-border);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            max-width: 500px;
            backdrop-filter: blur(10px);
            box-shadow: var(--card-glow);
        `;
        
        const closeBtn = welcome.querySelector('.welcome-close');
        closeBtn.style.cssText = `
            background: linear-gradient(45deg, var(--hologram-cyan), var(--aurora-green));
            border: none;
            color: var(--primary-bg);
            padding: 1rem 2rem;
            border-radius: 50px;
            font-family: var(--font-primary);
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
            transition: var(--transition-smooth);
        `;
        
        closeBtn.addEventListener('click', () => {
            welcome.style.animation = 'fade-out 0.5s ease-out';
            setTimeout(() => welcome.remove(), 500);
        });
        
        document.body.appendChild(welcome);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.solarMonarchApp = new SolarMonarchApp();
    window.solarMonarchApp.init();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarMonarchApp;
}