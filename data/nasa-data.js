/* ===============================================
   CHRONICLES OF THE SOLAR MONARCH - NASA DATA
   Static space weather data from NASA DONKI API
   Real events from 2024-2025 for demo purposes
   =============================================== */

// NASA DONKI (Database of Notifications, Knowledge, Information) Data
// This simulates real-time space weather data for educational purposes

const NASA_DATA = {
    // Current Space Weather Status
    currentStatus: {
        solarFlareRisk: "Moderate",
        magneticActivity: "Active", 
        cmeEvents: 3,
        kIndex: 4,
        solarWindSpeed: 452, // km/s
        protonFlux: "Normal",
        lastUpdated: new Date().toISOString(),
        activeRegions: 2
    },

    // Solar Flare Events (M-Class and X-Class)
    solarFlares: [
        {
            id: "FL_001",
            class: "M2.1",
            date: "2024-10-15T14:23:00Z",
            peakTime: "2024-10-15T14:35:00Z",
            duration: 720, // seconds
            sourceRegion: "AR3464",
            coordinates: "N15W45",
            description: "Moderate solar flare with radio blackout effects",
            impactLevel: "Minor",
            affectedTech: ["HF Radio", "GPS Navigation"],
            storyImpact: {
                farmerMia: "GPS tractor guidance fails during planting",
                pilotAlex: "Radio communication disrupted over polar routes",
                photographerLuna: "Camera electronics experience minor glitches"
            }
        },
        {
            id: "FL_002", 
            class: "X1.8",
            date: "2024-09-28T11:15:00Z",
            peakTime: "2024-09-28T11:42:00Z",
            duration: 1620, // seconds
            sourceRegion: "AR3452",
            coordinates: "S08E23",
            description: "Strong solar flare causing widespread radio blackouts",
            impactLevel: "Strong",
            affectedTech: ["HF Radio", "GPS", "Satellite Communications"],
            storyImpact: {
                farmerMia: "Complete GPS failure forces manual navigation",
                pilotAlex: "Emergency backup navigation systems activated", 
                photographerLuna: "Digital camera resets, loses photo settings"
            }
        },
        {
            id: "FL_003",
            class: "M5.7",
            date: "2024-11-02T08:45:00Z",
            peakTime: "2024-11-02T09:12:00Z", 
            duration: 1080, // seconds
            sourceRegion: "AR3478",
            coordinates: "N22E15",
            description: "Significant M-class flare with moderate impacts",
            impactLevel: "Moderate",
            affectedTech: ["Aviation Radio", "Satellite Operations"],
            storyImpact: {
                farmerMia: "Weather station data becomes unreliable",
                pilotAlex: "ATC communication requires frequency changes",
                photographerLuna: "Time-lapse sequence interrupted by reboot"
            }
        }
    ],

    // Coronal Mass Ejection Events
    cmeEvents: [
        {
            id: "CME_001",
            date: "2024-10-16T02:36:00Z",
            speed: 856, // km/s
            direction: "Earth-directed",
            halfAngle: 45, // degrees
            sourceLocation: "N15W45",
            arrivalTime: "2024-10-18T15:30:00Z",
            description: "Fast Earth-directed CME following M2.1 flare",
            geomagneticStormLevel: "G2-Moderate",
            kpIndex: 6,
            duration: 18, // hours
            impacts: {
                aurora: {
                    visibility: "Enhanced",
                    latitudeRange: "55-65 degrees",
                    colors: ["Green", "Red", "Purple"],
                    intensity: "Moderate to Strong"
                },
                technology: {
                    satellites: "Orbital drag increases",
                    powerGrids: "Voltage corrections needed",
                    gps: "Accuracy degraded 1-5 meters",
                    aviation: "Polar route diversions"
                }
            },
            storyImpact: {
                farmerMia: "Spectacular aurora show over farm, but GPS drift affects precision agriculture",
                pilotAlex: "Flight path adjusted to avoid polar regions, passengers see amazing aurora",
                photographerLuna: "Perfect aurora photography opportunity with enhanced colors and activity"
            }
        },
        {
            id: "CME_002",
            date: "2024-09-30T16:24:00Z", 
            speed: 1245, // km/s
            direction: "Earth-directed",
            halfAngle: 62, // degrees
            sourceLocation: "S08E23",
            arrivalTime: "2024-10-02T08:15:00Z",
            description: "Very fast CME causing strong geomagnetic storm",
            geomagneticStormLevel: "G3-Strong",
            kpIndex: 7,
            duration: 24, // hours
            impacts: {
                aurora: {
                    visibility: "Widespread",
                    latitudeRange: "45-70 degrees", 
                    colors: ["Bright Green", "Red", "Purple", "Blue"],
                    intensity: "Strong to Severe"
                },
                technology: {
                    satellites: "Surface charging, anomalies possible",
                    powerGrids: "Transformer damage possible",
                    gps: "Accuracy degraded 5-10 meters",
                    aviation: "HF radio blackouts"
                }
            },
            storyImpact: {
                farmerMia: "Power outage affects barn operations, but sees once-in-lifetime aurora",
                pilotAlex: "Major flight delays due to communication issues and route changes",
                photographerLuna: "Aurora visible at unusually southern latitudes, viral photo opportunity"
            }
        }
    ],

    // Geomagnetic Storm Events
    geomagneticStorms: [
        {
            id: "GST_001",
            startTime: "2024-10-18T12:00:00Z",
            endTime: "2024-10-19T18:00:00Z",
            maxKpIndex: 6,
            stormLevel: "G2-Moderate",
            cause: "CME arrival (CME_001)",
            description: "Moderate geomagnetic storm with enhanced aurora",
            regions: ["North America", "Northern Europe", "Asia"],
            impacts: {
                powerSystems: "Minor voltage corrections",
                spacecraftOperations: "Surface charging possible", 
                radioNavigationSystems: "HF radio affected",
                auroraActivity: "Enhanced at high latitudes"
            },
            measurements: {
                dstIndex: -85, // nT
                planetaryKIndex: [4, 5, 6, 6, 5, 4, 3, 3],
                solarWindSpeed: 625, // km/s
                magneticFieldStrength: 15 // nT
            }
        },
        {
            id: "GST_002",
            startTime: "2024-10-02T06:00:00Z",
            endTime: "2024-10-03T14:00:00Z", 
            maxKpIndex: 7,
            stormLevel: "G3-Strong",
            cause: "CME arrival (CME_002)",
            description: "Strong geomagnetic storm with widespread effects",
            regions: ["Global"],
            impacts: {
                powerSystems: "Voltage corrections required",
                spacecraftOperations: "Surface charging likely",
                radioNavigationSystems: "Intermittent HF radio blackouts",
                auroraActivity: "Visible to mid-latitudes"
            },
            measurements: {
                dstIndex: -165, // nT
                planetaryKIndex: [5, 6, 7, 7, 6, 5, 4, 4],
                solarWindSpeed: 758, // km/s
                magneticFieldStrength: 25 // nT
            }
        }
    ],

    // High Energy Particle Events
    sepEvents: [
        {
            id: "SEP_001",
            date: "2024-10-15T14:45:00Z",
            fluxLevel: "S1-Minor", 
            peakIntensity: "15.8 pfu",
            duration: 8, // hours
            associatedFlare: "FL_001",
            description: "Minor solar energetic particle event",
            impacts: {
                aviation: "Minor radiation exposure increase at flight altitudes",
                astronauts: "Increased radiation monitoring recommended",
                electronics: "Single event upsets possible in sensitive systems"
            }
        }
    ],

    // Solar Wind Data (simulated real-time measurements)
    solarWindData: {
        speed: 452, // km/s
        density: 8.5, // particles/cm³ 
        temperature: 95000, // Kelvin
        magneticField: {
            total: 12.3, // nT
            bx: -2.1,
            by: 8.4,
            bz: -9.2
        },
        protonFlux: {
            "10MeV": 0.85, // particles/(cm²·s·sr·MeV)
            "100MeV": 0.023
        }
    },

    // Educational Facts for Stories
    educationalFacts: {
        solarFlares: [
            "Solar flares are explosions on the Sun that release the energy equivalent of billions of hydrogen bombs!",
            "X-class flares are the strongest, while M-class are medium and C-class are small.",
            "The fastest particles from solar flares reach Earth in just 8 minutes at light speed.",
            "Solar flares can disrupt radio communications and GPS systems worldwide.",
            "The biggest solar flare ever recorded was an X28 in 2003!"
        ],
        cmeEvents: [
            "CMEs hurl billions of tons of plasma into space at speeds up to 3,000 km/s!",
            "A typical CME takes 1-3 days to travel from Sun to Earth.",
            "CMEs cause the beautiful aurora lights when they interact with Earth's magnetic field.",
            "The 1859 Carrington Event was so strong that telegraph wires sparked and started fires!",
            "CMEs can cause satellites to tumble out of control in space."
        ],
        geomagneticStorms: [
            "Earth's magnetic field acts like a giant shield protecting us from space weather.",
            "The northern lights (aurora) are caused by particles hitting our atmosphere during magnetic storms.",
            "Geomagnetic storms can cause power blackouts affecting millions of people.",
            "Migrating animals like sea turtles and birds use Earth's magnetic field for navigation.",
            "The strongest geomagnetic storms can cause aurora to be visible near the equator!"
        ],
        spaceWeatherImpacts: [
            "Space weather affects over $2 trillion worth of technology globally.",
            "GPS systems can be off by several meters during severe space weather events.",
            "Astronauts must take shelter during major solar particle events.",
            "Airlines reroute flights over polar regions during strong space weather.",
            "Power companies monitor space weather to protect electrical grids."
        ]
    },

    // Interactive Quiz Questions
    quizQuestions: [
        {
            id: "Q001",
            question: "How long does it take for a typical CME to travel from the Sun to Earth?",
            options: [
                "8 minutes (like sunlight)",
                "1-3 days", 
                "1 week",
                "1 month"
            ],
            correct: 1,
            explanation: "CMEs travel much slower than light, typically taking 1-3 days to reach Earth at speeds of 300-2000 km/s.",
            difficulty: "easy",
            category: "cme"
        },
        {
            id: "Q002", 
            question: "What causes the beautiful aurora (northern lights)?",
            options: [
                "Sunlight reflecting off ice crystals",
                "Charged particles hitting our atmosphere during magnetic storms",
                "Lightning in the upper atmosphere", 
                "Reflection from snow on mountains"
            ],
            correct: 1,
            explanation: "Aurora are created when charged particles from space weather events collide with gases in Earth's atmosphere, causing them to glow.",
            difficulty: "medium",
            category: "aurora"
        },
        {
            id: "Q003",
            question: "Which technology is MOST affected by solar flares?",
            options: [
                "Car engines",
                "Kitchen appliances", 
                "HF radio communications",
                "Bicycles"
            ],
            correct: 2,
            explanation: "Solar flares cause radio blackouts, especially affecting HF (high frequency) radio communications used by aviation and emergency services.",
            difficulty: "easy",
            category: "impacts"
        },
        {
            id: "Q004",
            question: "What was special about the 1859 Carrington Event?",
            options: [
                "It was the first solar flare ever observed",
                "It caused telegraph wires to spark and start fires",
                "It lasted for 10 years",
                "It made the Sun turn purple"
            ],
            correct: 1,
            explanation: "The 1859 Carrington Event was the strongest geomagnetic storm in recorded history, causing telegraph systems worldwide to fail and even start fires.",
            difficulty: "hard", 
            category: "history"
        },
        {
            id: "Q005",
            question: "How much is space weather estimated to affect in terms of global technology value?",
            options: [
                "$2 billion",
                "$20 billion", 
                "$200 billion",
                "$2 trillion"
            ],
            correct: 3,
            explanation: "Space weather affects over $2 trillion worth of technology globally, including satellites, power grids, aviation, and GPS systems.",
            difficulty: "medium",
            category: "economics"
        }
    ],

    // Achievement Triggers
    achievements: {
        "first_story": {
            title: "Space Weather Explorer",
            description: "Completed your first space weather adventure!",
            icon: "🚀",
            points: 100
        },
        "all_stories": {
            title: "Solar System Navigator", 
            description: "Experienced all three space weather scenarios!",
            icon: "🌟",
            points: 500
        },
        "quiz_master": {
            title: "Space Weather Expert",
            description: "Answered 5 quiz questions correctly!",
            icon: "🧠",
            points: 300
        },
        "aurora_hunter": {
            title: "Aurora Hunter",
            description: "Captured the perfect aurora moment!",
            icon: "🌌", 
            points: 200
        },
        "data_analyst": {
            title: "NASA Data Detective",
            description: "Explored the live space weather dashboard!",
            icon: "📊",
            points: 150
        },
        "multiplayer_champion": {
            title: "Cosmic Champion",
            description: "Won a multiplayer space weather quiz battle!",
            icon: "🏆",
            points: 400
        }
    },

    // Story Adaptation Rules
    adaptationRules: {
        solarFlare: {
            trigger: (data) => data.solarFlares.some(flare => 
                new Date(flare.date) > new Date(Date.now() - 24*60*60*1000)
            ),
            storyModifications: {
                intensity: "high",
                dialogue: "Recent solar activity detected! Your GPS might be extra unreliable today.",
                choices: ["Use backup compass navigation", "Risk continuing with GPS", "Wait for clearer conditions"]
            }
        },
        cmeArrival: {
            trigger: (data) => data.cmeEvents.some(cme => 
                new Date(cme.arrivalTime) > new Date(Date.now() - 12*60*60*1000) &&
                new Date(cme.arrivalTime) < new Date(Date.now() + 12*60*60*1000)
            ),
            storyModifications: {
                intensity: "extreme",
                dialogue: "Alert! A major CME is arriving now - aurora activity will be incredible!",
                choices: ["Rush outside for photos", "Stay inside for safety", "Set up time-lapse camera"]
            }
        },
        geomagneticStorm: {
            trigger: (data) => data.geomagneticStorms.some(storm =>
                new Date(storm.startTime) < new Date() && new Date(storm.endTime) > new Date()
            ),
            storyModifications: {
                intensity: "active", 
                dialogue: "We're in the middle of a geomagnetic storm - perfect for aurora watching!",
                choices: ["Head to dark sky location", "Use camera with high ISO", "Check aurora forecast apps"]
            }
        }
    }
};

// Utility Functions for Data Access
const SpaceWeatherAPI = {
    // Get current space weather status
    getCurrentStatus: () => NASA_DATA.currentStatus,
    
    // Get recent solar flares (last 30 days)
    getRecentFlares: (days = 30) => {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return NASA_DATA.solarFlares.filter(flare => new Date(flare.date) > cutoff);
    },
    
    // Get active CME events
    getActiveCMEs: () => {
        const now = new Date();
        return NASA_DATA.cmeEvents.filter(cme => {
            const arrival = new Date(cme.arrivalTime);
            const duration = cme.duration || 24; // hours
            const end = new Date(arrival.getTime() + duration * 60 * 60 * 1000);
            return arrival <= now && end >= now;
        });
    },
    
    // Get current geomagnetic activity
    getCurrentGeomagneticActivity: () => {
        const now = new Date();
        return NASA_DATA.geomagneticStorms.find(storm => 
            new Date(storm.startTime) <= now && new Date(storm.endTime) >= now
        ) || null;
    },
    
    // Get random educational fact
    getRandomFact: (category = null) => {
        const categories = Object.keys(NASA_DATA.educationalFacts);
        const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
        const facts = NASA_DATA.educationalFacts[selectedCategory];
        return facts[Math.floor(Math.random() * facts.length)];
    },
    
    // Get quiz questions by difficulty/category
    getQuizQuestions: (count = 5, difficulty = null, category = null) => {
        let questions = NASA_DATA.quizQuestions;
        
        if (difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        
        if (category) {
            questions = questions.filter(q => q.category === category);
        }
        
        // Shuffle and return requested count
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },
    
    // Check story adaptation triggers
    checkStoryAdaptations: () => {
        const adaptations = {};
        
        for (const [key, rule] of Object.entries(NASA_DATA.adaptationRules)) {
            if (rule.trigger(NASA_DATA)) {
                adaptations[key] = rule.storyModifications;
            }
        }
        
        return adaptations;
    },
    
    // Simulate real-time data updates
    updateRealTimeData: () => {
        // Simulate small variations in solar wind data
        NASA_DATA.solarWindData.speed += (Math.random() - 0.5) * 20;
        NASA_DATA.solarWindData.density += (Math.random() - 0.5) * 2;
        NASA_DATA.currentStatus.kIndex = Math.max(0, Math.min(9, 
            NASA_DATA.currentStatus.kIndex + (Math.random() - 0.5) * 2
        ));
        
        // Update timestamp
        NASA_DATA.currentStatus.lastUpdated = new Date().toISOString();
        
        return NASA_DATA.currentStatus;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NASA_DATA, SpaceWeatherAPI };
} else {
    // Browser environment - attach to window
    window.NASA_DATA = NASA_DATA;
    window.SpaceWeatherAPI = SpaceWeatherAPI;
}