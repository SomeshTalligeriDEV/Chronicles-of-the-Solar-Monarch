/* ===============================================
   CHRONICLES OF THE SOLAR MONARCH - STORY ENGINE
   Adaptive branching narratives with NASA data integration
   =============================================== */

class StoryEngine {
    constructor() {
        this.currentStory = null;
        this.currentPage = 0;
        this.totalPages = 0;
        this.storyData = {};
        this.userChoices = [];
        this.adaptations = {};
        this.voiceEnabled = false;
        this.arMode = false;
        
        // Voice synthesis
        this.speechSynth = window.speechSynthesis;
        this.voice = null;
        
        // Story assets
        this.imageBasePath = 'assets/images/';
        this.audioBasePath = 'assets/audio/stories/';
        
        this.init();
    }

    init() {
        console.log('📚 Initializing Story Engine...');
        
        this.setupVoiceSupport();
        this.setupEventListeners();
        this.loadStoryDefinitions();
    }

    setupVoiceSupport() {
        if (this.speechSynth) {
            // Wait for voices to load
            if (this.speechSynth.getVoices().length === 0) {
                this.speechSynth.addEventListener('voiceschanged', () => {
                    this.selectVoice();
                });
            } else {
                this.selectVoice();
            }
        }
    }

    selectVoice() {
        const voices = this.speechSynth.getVoices();
        // Prefer female, English voices for storytelling
        this.voice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        console.log('🎤 Voice selected:', this.voice?.name);
    }

    setupEventListeners() {
        // Story navigation
        const backBtn = document.getElementById('story-back');
        const nextBtn = document.getElementById('story-next');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => this.previousPage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
        
        // Story controls
        const voiceToggle = document.getElementById('voice-toggle');
        const arToggle = document.getElementById('ar-toggle');
        const quizMode = document.getElementById('quiz-mode');
        
        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => this.toggleVoice());
        }
        
        if (arToggle) {
            arToggle.addEventListener('click', () => this.toggleAR());
        }
        
        if (quizMode) {
            quizMode.addEventListener('click', () => this.showQuiz());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    loadStoryDefinitions() {
        // Define our three core stories
        this.storyDefinitions = {
            'solar-storm': {
                title: 'Farmer Mia and the Solar Storm',
                character: 'Mia',
                age: 10,
                setting: 'Rural farm in Iowa',
                theme: 'Solar flares and GPS disruption',
                pages: 10,
                illustrations: [
                    'sunstorm/1.png',
                    'sunstorm/2.png',
                    'sunstorm/3.png',
                    'sunstorm/4.png',
                    'sunstorm/5.png',
                    'sunstorm/6.png',
                    'sunstorm/7.png',
                    'sunstorm/8.png',
                    'sunstorm/9.png',
                    'sunstorm/10.png'
                ],
                narrative: {
                    opening: "Meet Mia, a clever 10-year-old who lives on a corn farm in Iowa. Today feels different - the Sun has something special planned!",
                    conflict: "When a powerful solar flare races toward Earth, Mia's family farm faces unexpected challenges as GPS systems fail.",
                    resolution: "Through quick thinking and old-fashioned navigation, Mia helps save the harvest and witnesses the beautiful aurora caused by the space weather."
                }
            },
            'geomagnetic-storm': {
                title: 'Pilot Alex and the Magnetic Mayhem',
                character: 'Alex',
                age: 12,
                setting: 'Commercial airliner over Alaska',
                theme: 'Geomagnetic storms and aviation',
                pages: 12,
                illustrations: [
                    'geomagneticstrom/1.png',
                    'geomagneticstrom/2.png',
                    'geomagneticstrom/3.png',
                    'geomagneticstrom/4.png',
                    'geomagneticstrom/5.png',
                    'geomagneticstrom/6.png',
                    'geomagneticstrom/7.png',
                    'geomagneticstrom/8.png',
                    'geomagneticstrom/9.png',
                    'geomagneticstrom/10.png',
                    'geomagneticstrom/11.png',
                    'geomagneticstrom/12.png'
                ],
                narrative: {
                    opening: "Alex dreams of becoming a pilot and today she's in the cockpit as a junior observer on a flight to Alaska!",
                    conflict: "A geomagnetic storm disrupts radio communications and navigation systems, challenging the flight crew.",
                    resolution: "Alex learns about Earth's magnetic field while helping the crew navigate safely and capturing amazing aurora photos."
                }
            },
            'cme': {
                title: 'Photographer Luna and the Corona Quest',
                character: 'Luna',
                age: 11,
                setting: 'Remote observatory in Canada',
                theme: 'Coronal Mass Ejections and aurora photography',
                pages: 12,
                illustrations: [
                    'luna-observatory-setup.png',
                    'luna-camera-equipment.png',
                    'luna-cme-alert.png',
                    'luna-waiting-darkness.png',
                    'luna-first-aurora.png',
                    'luna-camera-glitch.png',
                    'luna-manual-settings.png',
                    'luna-spectacular-aurora.png',
                    'luna-time-lapse.png',
                    'luna-sharing-photos.png',
                    'luna-science-explanation.png',
                    'luna-viral-success.png'
                ],
                narrative: {
                    opening: "Luna is a young photographer who loves capturing the night sky. Tonight, she's chasing the perfect aurora shot!",
                    conflict: "A massive Coronal Mass Ejection heads toward Earth, promising incredible auroras but also causing camera equipment failures.",
                    resolution: "Luna adapts her technique, captures stunning aurora images, and learns about the Sun-Earth connection while going viral online."
                }
            }
        };
        
        console.log('📖 Story definitions loaded');
    }

    async loadStory(storyType) {
        console.log(`📗 Loading story: ${storyType}`);
        
        if (!this.storyDefinitions[storyType]) {
            throw new Error(`Story type ${storyType} not found`);
        }
        
        this.currentStory = storyType;
        this.currentPage = 0;
        this.userChoices = [];
        this.storyData = this.storyDefinitions[storyType];
        this.totalPages = this.storyData.pages;
        
        // Check for NASA data adaptations
        if (window.SpaceWeatherAPI) {
            this.adaptations = window.SpaceWeatherAPI.checkStoryAdaptations();
            console.log('🌟 Story adaptations:', this.adaptations);
        }
        
        // Generate dynamic story content
        await this.generateStoryContent();
        
        // Display first page
        this.displayPage(0);
        
        // Update progress bar
        this.updateProgress();
        
        console.log('✅ Story loaded successfully');
    }

    async generateStoryContent() {
        // Generate story pages with branching narratives
        this.pages = [];
        
        for (let i = 0; i < this.totalPages; i++) {
            const page = await this.generatePage(i);
            this.pages.push(page);
        }
    }

    async generatePage(pageIndex) {
        const storyType = this.currentStory;
        const character = this.storyData.character;
        
        // Base story content for each page
        const pageContent = this.getBasePageContent(storyType, pageIndex);
        
        // Apply NASA data adaptations
        const adaptedContent = this.applyNASAAdaptations(pageContent, pageIndex);
        
        // Add interactive elements
        const interactiveContent = this.addInteractiveElements(adaptedContent, pageIndex);
        
        return interactiveContent;
    }

    getBasePageContent(storyType, pageIndex) {
        // Define the core narrative for each story and page
        const storyContent = {
            'solar-storm': [
                {
                    title: "A Perfect Farm Morning",
                    text: "Mia stretches and looks out her bedroom window at the golden Iowa cornfields. The GPS on Dad's tractor is already beeping, ready for another day of precision farming. But high above, the Sun is stirring with powerful energy...",
                    choices: ["Help Dad with morning chores", "Check the weather forecast first", "Look for unusual clouds in the sky"],
                    hotspots: [{ x: 65, y: 40, fact: "GPS systems rely on satellites 12,500 miles above Earth!" }]
                },
                {
                    title: "Technology Troubles Begin",
                    text: "As Mia climbs into the tractor cab, the GPS screen flickers strangely. 'That's odd,' says Dad, tapping the display. Unknown to them, a powerful M-class solar flare just erupted from the Sun, sending charged particles racing toward Earth at incredible speeds!",
                    choices: ["Try restarting the GPS", "Use the backup compass", "Call the equipment company"],
                    hotspots: [{ x: 30, y: 60, fact: "Solar flares travel at 1,000 km/s - much faster than hurricanes!" }]
                },
                {
                    title: "GPS Goes Haywire",
                    text: "The GPS now shows the tractor floating in the middle of the Pacific Ocean! Dad chuckles, but Mia notices their location jumping wildly across the map. 'The satellites must be confused,' she says, remembering her science class about space weather.",
                    choices: ["Explain space weather to Dad", "Try manual navigation", "Wait for the system to fix itself"],
                    hotspots: [{ x: 50, y: 30, fact: "GPS can be off by 5-10 meters during solar storms!" }]
                },
                {
                    title: "The Solar Storm Hits",
                    text: "Above them, invisible charged particles from the solar flare slam into Earth's magnetic field. The radio crackles with static, and Mia sees the neighbors' tractors also stopping in confusion. This is a real space weather event happening right now!",
                    choices: ["Listen to emergency radio", "Check on the neighbors", "Document the event"],
                    hotspots: [{ x: 40, y: 70, fact: "Solar storms can disrupt radio for hours or even days!" }]
                },
                {
                    title: "Old-School Navigation",
                    text: "Mia remembers Grandpa's stories about farming before GPS. She finds the old compass in the toolbox and helps Dad navigate using field markers and the sun's position. 'Sometimes the old ways are the best ways,' Dad says proudly.",
                    choices: ["Use the compass method", "Create field markers", "Teach Dad about magnetic declination"],
                    hotspots: [{ x: 60, y: 45, fact: "Compasses point to magnetic north, not true north!" }]
                },
                {
                    title: "Community Cooperation",
                    text: "Word spreads that all the GPS systems are down. Farmers start calling each other, sharing tips and helping coordinate the harvest. Mia realizes that people working together can overcome any technological challenge!",
                    choices: ["Coordinate with neighbors", "Share navigation tips", "Create a communication network"],
                    hotspots: [{ x: 35, y: 55, fact: "The 1859 Carrington Event disrupted telegraph systems worldwide!" }]
                },
                {
                    title: "The Science Behind It",
                    text: "That evening, Mia researches space weather online (the internet works better now). She learns about solar flares, coronal mass ejections, and how they affect technology. The Sun is like a giant, powerful neighbor that sometimes gets a bit too energetic!",
                    choices: ["Read about solar cycles", "Watch NASA videos", "Plan a school presentation"],
                    hotspots: [{ x: 45, y: 35, fact: "The Sun follows an 11-year cycle of high and low activity!" }]
                },
                {
                    title: "Aurora Surprise",
                    text: "As darkness falls, Mia notices a green glow on the northern horizon. 'Aurora!' she gasps. The same solar storm that caused problems is now creating a beautiful light show! Her family rushes outside to witness this rare sight so far south.",
                    choices: ["Take photos of the aurora", "Call friends to see it", "Learn about aurora colors"],
                    hotspots: [{ x: 50, y: 20, fact: "Auroras happen when solar particles hit our atmosphere!" }]
                },
                {
                    title: "Family Aurora Party",
                    text: "The whole family spreads blankets in the backyard, watching green and pink lights dance across the sky. Mia explains to her little brother how the same space weather that broke their GPS created this magical display. It's like the Sun is putting on a show just for them!",
                    choices: ["Explain the science", "Make aurora predictions", "Plan future aurora watching"],
                    hotspots: [{ x: 55, y: 65, fact: "Aurora colors depend on which gases the particles hit!" }]
                },
                {
                    title: "Prepared for the Future",
                    text: "Mia creates an emergency kit with compass, paper maps, and a battery radio. She also bookmarks NASA's space weather website. 'Now we're ready for the next solar storm!' she tells Dad. The experience made her dream of becoming a space weather scientist and helping protect technology from solar storms!",
                    choices: ["Create emergency plans", "Study space weather careers", "Share her story with others"],
                    hotspots: [{ x: 30, y: 40, fact: "NOAA's Space Weather Prediction Center monitors the Sun 24/7!" }]
                }
            ],
            'geomagnetic-storm': [
                {
                    title: "Junior Observer Alex",
                    text: "Alex buckles into the cockpit jump seat, her pilot badge gleaming. Captain Sarah explains the flight path to Anchorage as they taxi for takeoff. Alex dreams of flying her own plane someday, not knowing that space weather is about to test the crew's skills!",
                    choices: ["Ask about navigation systems", "Study the flight instruments", "Look for weather patterns"],
                    hotspots: [{ x: 70, y: 30, fact: "Commercial pilots must understand space weather effects!" }]
                },
                {
                    title: "Takeoff and Clear Skies",
                    text: "The aircraft lifts smoothly into the bright morning sky. Alex watches the ground shrink below as Captain Sarah points out the navigation displays. Everything seems perfect for their flight to Alaska, but high above Earth's atmosphere, charged particles from a recent solar flare are beginning to interact with our planet's magnetic field.",
                    choices: ["Learn about the flight route", "Ask about weather monitoring", "Study the radio equipment"],
                    hotspots: [{ x: 45, y: 60, fact: "Planes fly at 35,000 feet, but space weather affects us from 50+ miles up!" }]
                },
                {
                    title: "First Signs of Trouble",
                    text: "As they cruise over Canada, the radio crackles with unusual static. Co-pilot Mike frowns at the navigation display - the GPS readings are starting to drift slightly. 'Might be some space weather,' Captain Sarah mentions calmly. Alex remembers her science class about Earth's magnetic field protecting us from solar particles.",
                    choices: ["Ask about space weather effects", "Monitor the instruments", "Listen to air traffic control"],
                    hotspots: [{ x: 55, y: 40, fact: "GPS satellites orbit 12,500 miles above Earth in the radiation-filled magnetosphere!" }]
                },
                {
                    title: "Radio Communications Disrupted",
                    text: "Suddenly, the radio fills with static and voices fade in and out. Air traffic control in Edmonton sounds distant and choppy. Alex notices the compass spinning slightly - something she's never seen before. The geomagnetic storm is intensifying, and their airplane is flying right through its effects!",
                    choices: ["Try different radio frequencies", "Check backup communication systems", "Monitor the magnetic compass"],
                    hotspots: [{ x: 35, y: 70, fact: "Radio waves bounce off Earth's ionosphere, which gets disturbed during geomagnetic storms!" }]
                },
                {
                    title: "Navigation Challenges",
                    text: "The GPS shows their position jumping around by several miles. Captain Sarah switches to backup navigation systems, using ground-based radio beacons and old-fashioned dead reckoning. 'This is why we train for multiple navigation methods,' she explains to Alex, who watches in fascination as the crew adapts.",
                    choices: ["Learn about backup navigation", "Calculate position manually", "Monitor other aircraft"],
                    hotspots: [{ x: 60, y: 25, fact: "Before GPS, pilots navigated using stars, radio beacons, and careful calculations!" }]
                },
                {
                    title: "The Science Explained",
                    text: "Co-pilot Mike explains to Alex how charged particles from the Sun interact with Earth's magnetic field, creating the beautiful aurora but also disrupting technology. 'It's like the Earth is wearing a magnetic shield,' he says, 'but sometimes particles leak through at the poles, right where we're flying!'",
                    choices: ["Ask about Earth's magnetic field", "Learn about aurora formation", "Study the storm's effects"],
                    hotspots: [{ x: 50, y: 55, fact: "Earth's magnetic field protects us, but it's weaker at the magnetic poles!" }]
                },
                {
                    title: "Teamwork in the Cockpit",
                    text: "The crew works together like a well-oiled machine. Captain Sarah flies the plane while Mike handles communications and navigation. Alex helps by monitoring instruments and taking notes. Even with the space weather challenges, the professional teamwork keeps everyone safe and on course.",
                    choices: ["Assist with instrument monitoring", "Help with flight calculations", "Support crew communication"],
                    hotspots: [{ x: 40, y: 45, fact: "Commercial aviation has multiple backup systems for exactly these situations!" }]
                },
                {
                    title: "Passenger Reassurance",
                    text: "Some passengers notice the radio static and ask about the slight changes in flight path. Flight attendant Lisa calmly explains they're experiencing minor space weather effects - like a storm, but in space! Alex realizes how important it is to stay calm and informed during unusual situations.",
                    choices: ["Help explain space weather", "Assist with passenger questions", "Monitor the situation"],
                    hotspots: [{ x: 65, y: 35, fact: "Most passengers never notice space weather effects, thanks to skilled pilots!" }]
                },
                {
                    title: "Ground Control Coordination",
                    text: "Air traffic controllers across the region coordinate carefully as multiple flights experience similar navigation issues. They use backup radar systems and increase spacing between aircraft. Alex marvels at how the entire aviation system has protocols for space weather events.",
                    choices: ["Listen to air traffic control", "Learn about backup systems", "Track other flights"],
                    hotspots: [{ x: 30, y: 50, fact: "Air traffic control has special procedures for space weather events!" }]
                },
                {
                    title: "Aurora Spectacular",
                    text: "As they approach Alaska in the early evening, Alex gasps at the most incredible sight - brilliant green and purple auroras dancing across the entire sky! The same geomagnetic storm causing their navigation troubles is creating this magnificent light show. Passengers press against windows in amazement.",
                    choices: ["Take photos of the aurora", "Learn about aurora colors", "Share the view with passengers"],
                    hotspots: [{ x: 50, y: 20, fact: "Auroras occur 60-200 miles above Earth - much higher than planes fly!" }]
                },
                {
                    title: "Successful Landing",
                    text: "Despite the space weather challenges, Captain Sarah makes a perfect landing in Anchorage. The ground crew reports that the aurora is one of the strongest they've seen this year. Alex feels proud to have been part of a flight crew that safely navigated through a geomagnetic storm.",
                    choices: ["Celebrate the successful flight", "Document the experience", "Plan future flights"],
                    hotspots: [{ x: 55, y: 65, fact: "Alaska sees auroras regularly because it's close to the magnetic north pole!" }]
                },
                {
                    title: "Future Space Weather Pilot",
                    text: "As they taxi to the gate, Alex asks Captain Sarah about becoming a pilot who specializes in space weather operations. 'We need more pilots who understand these effects,' Sarah smiles. Alex decides to study both aviation and space science, inspired by this incredible flight through a geomagnetic storm. She now knows that pilots need to understand space weather to keep flights safe!",
                    choices: ["Research pilot training programs", "Study space weather careers", "Plan her aviation future"],
                    hotspots: [{ x: 45, y: 75, fact: "The FAA now requires pilots to learn about space weather effects on aviation!" }]
                }
            ],
            'cme': [
                // Similar structure for Luna's photography story
                {
                    title: "The Perfect Shot Setup",
                    text: "Luna adjusts her camera settings at the remote Canadian observatory, excited about tonight's aurora forecast. Her time-lapse setup is perfect, but she doesn't know that a massive Coronal Mass Ejection is heading straight for Earth!",
                    choices: ["Check camera battery levels", "Review aurora photography tips", "Monitor space weather alerts"],
                    hotspots: [{ x: 40, y: 50, fact: "CMEs can travel from Sun to Earth in just 15 hours!" }]
                },
                // Continue with 11 more pages for Luna's story...
            ]
        };
        
        return storyContent[storyType][pageIndex];
    }

    applyNASAAdaptations(pageContent, pageIndex) {
        // Modify story content based on real NASA data
        let adaptedContent = { ...pageContent };
        
        if (this.adaptations.solarFlare && pageIndex < 4) {
            adaptedContent.text += " \n\n🌟 REAL-TIME UPDATE: NASA has detected recent solar flare activity! Your story is happening during actual space weather conditions.";
            adaptedContent.choices.push("Check current NASA space weather data");
        }
        
        if (this.adaptations.cmeArrival && pageIndex >= 6 && pageIndex <= 9) {
            adaptedContent.text += " \n\n⚡ LIVE EVENT: A real CME is arriving at Earth right now! The aurora in this story might be visible in real life tonight.";
            adaptedContent.choices.push("Look up tonight's aurora forecast");
        }
        
        if (this.adaptations.geomagneticStorm) {
            adaptedContent.text += " \n\n🌍 ACTIVE NOW: Earth is experiencing a geomagnetic storm similar to this story! Check outside for possible aurora activity.";
        }
        
        return adaptedContent;
    }

    addInteractiveElements(content, pageIndex) {
        // Add quiz questions, facts, and interactive choices
        const enhanced = { ...content };
        
        // Add educational fact for each page
        const facts = window.SpaceWeatherAPI?.getRandomFact() || "Space weather affects technology all around us!";
        enhanced.educationalFact = facts;
        
        // Add branching logic
        enhanced.branchingLogic = (choice) => {
            // Different choices lead to different outcomes
            switch (choice) {
                case 0: // First choice - cautious approach
                    return { outcome: 'careful', points: 10, description: 'You chose the cautious approach!' };
                case 1: // Second choice - active approach  
                    return { outcome: 'active', points: 15, description: 'You took action!' };
                case 2: // Third choice - creative approach
                    return { outcome: 'creative', points: 20, description: 'Creative thinking!' };
                default:
                    return { outcome: 'default', points: 5, description: 'Good choice!' };
            }
        };
        
        return enhanced;
    }

    displayPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.pages.length) return;
        
        const page = this.pages[pageIndex];
        const storyTitle = document.getElementById('story-title');
        const storyNarrative = document.getElementById('story-narrative');
        const storyImage = document.getElementById('story-image');
        const storyChoices = document.getElementById('story-choices');
        const storyHotspots = document.getElementById('story-hotspots');
        
        // Update content
        if (storyTitle) storyTitle.textContent = page.title;
        if (storyNarrative) storyNarrative.innerHTML = page.text;
        
        // Update image
        if (storyImage) {
            const imagePath = this.imageBasePath + this.storyData.illustrations[pageIndex];
            storyImage.src = imagePath;
            storyImage.alt = page.title;
        }
        
        // Clear and populate choices
        if (storyChoices) {
            storyChoices.innerHTML = '';
            page.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice;
                button.addEventListener('click', () => this.makeChoice(index));
                storyChoices.appendChild(button);
            });
        }
        
        // Add hotspots
        if (storyHotspots && page.hotspots) {
            storyHotspots.innerHTML = '';
            page.hotspots.forEach((hotspot, index) => {
                const spot = document.createElement('div');
                spot.className = 'hotspot animate-pulse';
                spot.style.left = hotspot.x + '%';
                spot.style.top = hotspot.y + '%';
                spot.title = hotspot.fact;
                spot.addEventListener('click', () => this.showHotspotInfo(hotspot));
                storyHotspots.appendChild(spot);
            });
        }
        
        // Auto-read if voice is enabled
        if (this.voiceEnabled && page.text) {
            this.speakText(page.text);
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        console.log(`📄 Displaying page ${pageIndex + 1} of ${this.totalPages}`);
    }

    makeChoice(choiceIndex) {
        const currentPage = this.pages[this.currentPage];
        const outcome = currentPage.branchingLogic(choiceIndex);
        
        // Record choice
        this.userChoices.push({
            page: this.currentPage,
            choice: choiceIndex,
            outcome: outcome
        });
        
        // Show choice outcome
        this.showChoiceOutcome(outcome);
        
        // Advance to next page after a delay
        setTimeout(() => {
            this.nextPage();
        }, 2000);
        
        console.log(`✅ Choice made: ${choiceIndex}, outcome: ${outcome.outcome}`);
    }

    showChoiceOutcome(outcome) {
        // Create temporary outcome display
        const outcomeDiv = document.createElement('div');
        outcomeDiv.className = 'choice-outcome animate-score';
        outcomeDiv.innerHTML = `
            <div class="outcome-text">${outcome.description}</div>
            <div class="outcome-points">+${outcome.points} points</div>
        `;
        
        outcomeDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            border: 2px solid var(--aurora-green);
            border-radius: 15px;
            padding: 1rem 2rem;
            text-align: center;
            z-index: 100;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(6, 255, 165, 0.4);
        `;
        
        document.body.appendChild(outcomeDiv);
        
        // Remove after animation
        setTimeout(() => {
            outcomeDiv.remove();
        }, 2000);
    }

    showHotspotInfo(hotspot) {
        // Create info tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'hotspot-info animate-ar-appear';
        tooltip.innerHTML = `
            <div class="info-icon">💡</div>
            <div class="info-text">${hotspot.fact}</div>
        `;
        
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            border: 2px solid var(--hologram-cyan);
            border-radius: 15px;
            padding: 1rem 1.5rem;
            max-width: 300px;
            text-align: center;
            z-index: 200;
            backdrop-filter: blur(10px);
            box-shadow: var(--card-glow);
        `;
        
        document.body.appendChild(tooltip);
        
        // Remove on click or after 4 seconds
        const removeTooltip = () => tooltip.remove();
        tooltip.addEventListener('click', removeTooltip);
        setTimeout(removeTooltip, 4000);
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.displayPage(this.currentPage);
            this.updateProgress();
        } else {
            this.completeStory();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.displayPage(this.currentPage);
            this.updateProgress();
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const currentPageEl = document.getElementById('current-page');
        const totalPagesEl = document.getElementById('total-pages');
        
        if (progressFill) {
            const progress = ((this.currentPage + 1) / this.totalPages) * 100;
            progressFill.style.width = progress + '%';
        }
        
        if (currentPageEl) currentPageEl.textContent = this.currentPage + 1;
        if (totalPagesEl) totalPagesEl.textContent = this.totalPages;
    }

    updateNavigationButtons() {
        const backBtn = document.getElementById('story-back');
        const nextBtn = document.getElementById('story-next');
        
        if (backBtn) {
            backBtn.disabled = this.currentPage === 0;
        }
        
        if (nextBtn) {
            nextBtn.textContent = this.currentPage === this.totalPages - 1 ? 'Complete Story' : 'Next →';
        }
    }

    completeStory() {
        console.log('🎉 Story completed!');
        
        // Calculate score
        const totalPoints = this.userChoices.reduce((sum, choice) => sum + choice.outcome.points, 0);
        
        // Show completion screen
        this.showCompletionScreen(totalPoints);
        
        // Unlock achievements
        if (window.solarMonarchApp) {
            window.solarMonarchApp.unlockAchievement('first_story');
            
            // Check if all stories completed
            const completedStories = this.getCompletedStories();
            if (completedStories.length === 3) {
                window.solarMonarchApp.unlockAchievement('all_stories');
            }
        }
        
        // Save progress
        this.saveStoryProgress(totalPoints);
    }

    showCompletionScreen(totalPoints) {
        const storyContainer = document.getElementById('story-container');
        const completionHTML = `
            <div class="story-completion animate-fade-in">
                <div class="completion-content">
                    <h2>🎉 Story Complete!</h2>
                    <div class="completion-stats">
                        <div class="stat">
                            <span class="stat-value">${totalPoints}</span>
                            <span class="stat-label">Points Earned</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${this.userChoices.length}</span>
                            <span class="stat-label">Choices Made</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${this.totalPages}</span>
                            <span class="stat-label">Pages Read</span>
                        </div>
                    </div>
                    <div class="completion-summary">
                        <h3>Your Space Weather Journey</h3>
                        <p>You've experienced how real space weather affects life on Earth! 
                        The story you just read is based on actual NASA data and real events 
                        that happen when our Sun gets active.</p>
                    </div>
                    <div class="completion-actions">
                        <button id="story-quiz" class="completion-btn">Take Quiz 🧠</button>
                        <button id="story-share" class="completion-btn">Share Story 📱</button>
                        <button id="story-again" class="completion-btn">Read Again 🔄</button>
                        <button id="story-home" class="completion-btn">Home 🏠</button>
                    </div>
                </div>
            </div>
        `;
        
        storyContainer.innerHTML = completionHTML;
        
        // Add event listeners
        document.getElementById('story-quiz')?.addEventListener('click', () => this.showQuiz());
        document.getElementById('story-share')?.addEventListener('click', () => this.shareStory());
        document.getElementById('story-again')?.addEventListener('click', () => this.loadStory(this.currentStory));
        document.getElementById('story-home')?.addEventListener('click', () => {
            if (window.solarMonarchApp) {
                window.solarMonarchApp.exitStory();
            }
        });
    }

    showQuiz() {
        // Get relevant quiz questions
        const questions = window.SpaceWeatherAPI?.getQuizQuestions(3, null, this.getStoryCategory()) || [];
        
        if (questions.length === 0) {
            alert('Quiz questions not available at the moment.');
            return;
        }
        
        // Create quiz interface
        const quizHTML = `
            <div class="story-quiz animate-fade-in">
                <h3>🧠 Space Weather Quiz</h3>
                <div id="quiz-content">
                    <!-- Quiz questions will be populated here -->
                </div>
            </div>
        `;
        
        const storyText = document.querySelector('.story-text');
        if (storyText) {
            storyText.innerHTML = quizHTML;
            this.populateQuiz(questions);
        }
    }

    populateQuiz(questions) {
        // Implementation for quiz display
        console.log('📝 Displaying quiz with', questions.length, 'questions');
    }

    getStoryCategory() {
        const categories = {
            'solar-storm': 'impacts',
            'geomagnetic-storm': 'aurora',
            'cme': 'cme'
        };
        return categories[this.currentStory] || 'general';
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const voiceBtn = document.getElementById('voice-toggle');
        
        if (voiceBtn) {
            voiceBtn.textContent = this.voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off';
            voiceBtn.classList.toggle('active', this.voiceEnabled);
        }
        
        if (this.voiceEnabled && this.speechSynth) {
            const currentPage = this.pages[this.currentPage];
            if (currentPage) {
                this.speakText(currentPage.text);
            }
        } else if (this.speechSynth) {
            this.speechSynth.cancel();
        }
    }

    speakText(text) {
        if (!this.speechSynth || !this.voice) return;
        
        // Clean text for speech
        const cleanText = text.replace(/[🌟⚡🌍💡]/g, '').replace(/\n/g, ' ');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.voice;
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        this.speechSynth.speak(utterance);
    }

    toggleAR() {
        this.arMode = !this.arMode;
        const arBtn = document.getElementById('ar-toggle');
        const arOverlay = document.getElementById('ar-overlay');
        
        if (arBtn) {
            arBtn.textContent = this.arMode ? '🥽 AR On' : '🥽 AR Off';
            arBtn.classList.toggle('active', this.arMode);
        }
        
        if (arOverlay) {
            arOverlay.classList.toggle('active', this.arMode);
        }
        
        console.log('🥽 AR Mode:', this.arMode ? 'ON' : 'OFF');
    }

    handleKeyboard(event) {
        if (!this.currentStory) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                this.previousPage();
                break;
            case 'ArrowRight':
            case ' ':
                event.preventDefault();
                this.nextPage();
                break;
            case '1':
            case '2':
            case '3':
                const choiceIndex = parseInt(event.key) - 1;
                if (choiceIndex < this.pages[this.currentPage]?.choices.length) {
                    this.makeChoice(choiceIndex);
                }
                break;
        }
    }

    applyAdaptations(adaptations) {
        // Apply real-time story modifications
        this.adaptations = { ...this.adaptations, ...adaptations };
        
        // Regenerate current page with new adaptations
        if (this.currentStory && this.currentPage < this.pages.length) {
            const updatedPage = this.applyNASAAdaptations(
                this.pages[this.currentPage], 
                this.currentPage
            );
            this.pages[this.currentPage] = updatedPage;
            this.displayPage(this.currentPage);
        }
    }

    shareStory() {
        const shareData = {
            title: `Chronicles of the Solar Monarch - ${this.storyData.title}`,
            text: `I just completed an amazing space weather adventure! Join me in learning about real NASA data through interactive stories.`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
                .then(() => alert('Story link copied to clipboard!'))
                .catch(() => console.error('Failed to copy'));
        }
    }

    saveStoryProgress(points) {
        const progress = JSON.parse(localStorage.getItem('solarMonarchProgress') || '{}');
        
        if (!progress.storiesCompleted) progress.storiesCompleted = [];
        if (!progress.storiesCompleted.includes(this.currentStory)) {
            progress.storiesCompleted.push(this.currentStory);
        }
        
        progress.totalPoints = (progress.totalPoints || 0) + points;
        
        localStorage.setItem('solarMonarchProgress', JSON.stringify(progress));
    }

    getCompletedStories() {
        const progress = JSON.parse(localStorage.getItem('solarMonarchProgress') || '{}');
        return progress.storiesCompleted || [];
    }
}

// Export for global use
window.StoryEngine = StoryEngine;