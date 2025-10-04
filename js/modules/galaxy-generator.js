/* ===============================================
   CHRONICLES OF THE SOLAR MONARCH - GALAXY GENERATOR
   Procedural starfield and cosmic background effects
   =============================================== */

class GalaxyGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.comets = [];
        this.nebulae = [];
        this.animationId = null;
        this.lastTime = 0;
        
        // Configuration
        this.config = {
            starCount: 800,
            cometCount: 3,
            nebulaCount: 5,
            twinkleSpeed: 0.02,
            cometSpeed: 0.3,
            nebulaSpeed: 0.001,
            parallaxLayers: 3
        };
        
        // Performance settings
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.isVisible = true;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.resize();
        this.setupVisibilityHandling();
    }

    initialize() {
        console.log('🌌 Initializing Galaxy Generator...');
        
        this.generateStars();
        this.generateComets();
        this.generateNebulae();
        
        console.log(`✨ Generated ${this.stars.length} stars, ${this.comets.length} comets, ${this.nebulae.length} nebulae`);
    }

    generateStars() {
        this.stars = [];
        
        for (let i = 0; i < this.config.starCount; i++) {
            const star = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5,
                brightness: Math.random(),
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: (Math.random() * 0.02 + 0.01) * (this.reduceMotion ? 0.1 : 1),
                color: this.getStarColor(),
                layer: Math.floor(Math.random() * this.config.parallaxLayers)
            };
            
            this.stars.push(star);
        }
    }

    generateComets() {
        if (this.reduceMotion) {
            this.comets = [];
            return;
        }
        
        this.comets = [];
        
        for (let i = 0; i < this.config.cometCount; i++) {
            this.createComet();
        }
    }

    createComet() {
        const comet = {
            x: -100,
            y: Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.2,
            vx: (Math.random() * 2 + 1) * this.config.cometSpeed,
            vy: (Math.random() - 0.5) * 0.5 * this.config.cometSpeed,
            size: Math.random() * 4 + 2,
            trail: [],
            maxTrailLength: 20,
            color: this.getCometColor(),
            opacity: Math.random() * 0.7 + 0.3,
            nextSpawn: Date.now() + Math.random() * 10000 + 5000 // 5-15 seconds
        };
        
        this.comets.push(comet);
    }

    generateNebulae() {
        this.nebulae = [];
        
        for (let i = 0; i < this.config.nebulaCount; i++) {
            const nebula = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 200 + 100,
                color: this.getNebulaColor(),
                opacity: Math.random() * 0.1 + 0.05,
                driftSpeed: (Math.random() - 0.5) * this.config.nebulaSpeed * (this.reduceMotion ? 0.1 : 1),
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.nebulae.push(nebula);
        }
    }

    getStarColor() {
        const colors = [
            '#ffffff', // White
            '#fffacd', // Light yellow
            '#87ceeb', // Sky blue
            '#ffb6c1', // Light pink
            '#98fb98', // Pale green
            '#dda0dd'  // Plum
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getCometColor() {
        const colors = [
            'rgba(0, 245, 255, 0.8)',    // Cyan
            'rgba(255, 255, 255, 0.9)',  // White
            'rgba(255, 200, 100, 0.7)',  // Orange
            'rgba(100, 255, 200, 0.6)'   // Mint
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getNebulaColor() {
        const colors = [
            'rgba(106, 76, 147, 0.3)',   // Purple
            'rgba(61, 90, 128, 0.3)',    // Blue
            'rgba(238, 108, 77, 0.2)',   // Orange
            'rgba(247, 37, 133, 0.2)',   // Pink
            'rgba(6, 255, 165, 0.1)'     // Green
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startAnimations() {
        if (this.animationId) return;
        
        console.log('🎬 Starting galaxy animations...');
        this.animate();
    }

    stopAnimations() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            console.log('⏸️ Galaxy animations stopped');
        }
    }

    animate(currentTime = 0) {
        if (!this.isVisible) {
            this.animationId = requestAnimationFrame(this.animate.bind(this));
            return;
        }
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw nebulae (background layer)
        this.drawNebulae(deltaTime);
        
        // Draw stars with parallax
        this.drawStars(deltaTime);
        
        // Draw comets (foreground layer)
        this.drawComets(deltaTime);
        
        // Continue animation
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    drawStars(deltaTime) {
        this.stars.forEach(star => {
            // Update twinkle animation
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = (Math.sin(star.twinklePhase) + 1) * 0.5;
            const alpha = star.brightness * (0.3 + twinkle * 0.7);
            
            // Parallax effect based on layer
            const parallaxOffset = (star.layer + 1) * 0.1;
            const displayX = star.x + Math.sin(this.lastTime * 0.0001) * parallaxOffset;
            const displayY = star.y + Math.cos(this.lastTime * 0.0001) * parallaxOffset * 0.5;
            
            // Draw star
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = star.color;
            this.ctx.shadowColor = star.color;
            this.ctx.shadowBlur = star.size * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(displayX, displayY, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add sparkle effect for larger stars
            if (star.size > 2 && twinkle > 0.8) {
                this.drawSparkle(displayX, displayY, star.size, star.color);
            }
            
            this.ctx.restore();
        });
    }

    drawSparkle(x, y, size, color) {
        const sparkleSize = size * 3;
        
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.6;
        
        // Draw cross sparkle
        this.ctx.beginPath();
        this.ctx.moveTo(x - sparkleSize, y);
        this.ctx.lineTo(x + sparkleSize, y);
        this.ctx.moveTo(x, y - sparkleSize);
        this.ctx.lineTo(x, y + sparkleSize);
        this.ctx.stroke();
        
        // Draw diagonal sparkle
        this.ctx.beginPath();
        this.ctx.moveTo(x - sparkleSize * 0.7, y - sparkleSize * 0.7);
        this.ctx.lineTo(x + sparkleSize * 0.7, y + sparkleSize * 0.7);
        this.ctx.moveTo(x + sparkleSize * 0.7, y - sparkleSize * 0.7);
        this.ctx.lineTo(x - sparkleSize * 0.7, y + sparkleSize * 0.7);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawComets(deltaTime) {
        if (this.reduceMotion) return;
        
        this.comets.forEach((comet, index) => {
            // Update position
            comet.x += comet.vx;
            comet.y += comet.vy;
            
            // Add position to trail
            comet.trail.push({ x: comet.x, y: comet.y });
            if (comet.trail.length > comet.maxTrailLength) {
                comet.trail.shift();
            }
            
            // Draw trail
            if (comet.trail.length > 1) {
                this.ctx.save();
                this.ctx.strokeStyle = comet.color;
                this.ctx.lineWidth = comet.size;
                this.ctx.lineCap = 'round';
                
                for (let i = 1; i < comet.trail.length; i++) {
                    const alpha = (i / comet.trail.length) * comet.opacity;
                    this.ctx.globalAlpha = alpha;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(comet.trail[i - 1].x, comet.trail[i - 1].y);
                    this.ctx.lineTo(comet.trail[i].x, comet.trail[i].y);
                    this.ctx.stroke();
                }
                
                this.ctx.restore();
            }
            
            // Draw comet head
            this.ctx.save();
            this.ctx.globalAlpha = comet.opacity;
            this.ctx.fillStyle = comet.color;
            this.ctx.shadowColor = comet.color;
            this.ctx.shadowBlur = comet.size * 3;
            
            this.ctx.beginPath();
            this.ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Remove comet if it's off screen
            if (comet.x > this.canvas.width + 100) {
                this.comets.splice(index, 1);
            }
        });
        
        // Spawn new comets periodically
        const now = Date.now();
        if (this.comets.length < this.config.cometCount) {
            this.createComet();
        }
    }

    drawNebulae(deltaTime) {
        this.nebulae.forEach(nebula => {
            // Update drift position
            nebula.x += nebula.driftSpeed;
            nebula.y += nebula.driftSpeed * 0.5;
            
            // Wrap around screen
            if (nebula.x > this.canvas.width + nebula.radius) {
                nebula.x = -nebula.radius;
            }
            if (nebula.y > this.canvas.height + nebula.radius) {
                nebula.y = -nebula.radius;
            }
            
            // Update pulse animation
            nebula.pulsePhase += nebula.pulseSpeed;
            const pulse = (Math.sin(nebula.pulsePhase) + 1) * 0.5;
            const currentOpacity = nebula.opacity * (0.5 + pulse * 0.5);
            
            // Create radial gradient
            const gradient = this.ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, nebula.radius
            );
            
            gradient.addColorStop(0, nebula.color.replace(/[\d\.]+\)$/g, `${currentOpacity})`));
            gradient.addColorStop(0.5, nebula.color.replace(/[\d\.]+\)$/g, `${currentOpacity * 0.5})`));
            gradient.addColorStop(1, nebula.color.replace(/[\d\.]+\)$/g, '0)'));
            
            // Draw nebula
            this.ctx.save();
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        
        // Set canvas size with device pixel ratio for crisp rendering
        this.canvas.width = rect.width * this.devicePixelRatio;
        this.canvas.height = rect.height * this.devicePixelRatio;
        
        // Scale context to match device pixel ratio
        this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
        
        // Set CSS size
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Regenerate content for new dimensions
        if (this.stars.length > 0) {
            this.generateStars();
            this.generateNebulae();
        }
        
        console.log(`🖼️ Galaxy canvas resized to ${rect.width}x${rect.height}`);
    }

    setupVisibilityHandling() {
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            
            if (this.isVisible) {
                console.log('👁️ Galaxy animations resumed');
            } else {
                console.log('💤 Galaxy animations paused');
            }
        });
        
        // Handle reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addListener((e) => {
            this.reduceMotion = e.matches;
            if (this.reduceMotion) {
                this.config.twinkleSpeed *= 0.1;
                this.config.nebulaSpeed *= 0.1;
                this.comets = []; // Remove comets for reduced motion
                console.log('♿ Reduced motion mode enabled');
            } else {
                this.config.twinkleSpeed *= 10;
                this.config.nebulaSpeed *= 10;
                this.generateComets(); // Restore comets
                console.log('🎬 Full motion mode enabled');
            }
        });
    }

    // Interactive methods for story integration
    addCometShower() {
        if (this.reduceMotion) return;
        
        console.log('☄️ Triggering comet shower!');
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createComet();
            }, i * 500);
        }
    }

    addSupernova(x, y) {
        console.log('💥 Creating supernova effect!');
        
        // Create temporary bright star
        const supernova = {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            size: 1,
            maxSize: 50,
            duration: 2000,
            startTime: Date.now(),
            color: '#ffffff'
        };
        
        const animateSupernova = () => {
            const elapsed = Date.now() - supernova.startTime;
            const progress = elapsed / supernova.duration;
            
            if (progress >= 1) return;
            
            // Expansion phase
            if (progress < 0.3) {
                supernova.size = supernova.maxSize * (progress / 0.3);
            } 
            // Fade phase
            else {
                supernova.size = supernova.maxSize * (1 - (progress - 0.3) / 0.7);
            }
            
            // Draw supernova
            this.ctx.save();
            this.ctx.globalAlpha = 1 - progress;
            this.ctx.fillStyle = supernova.color;
            this.ctx.shadowColor = supernova.color;
            this.ctx.shadowBlur = supernova.size * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(supernova.x, supernova.y, supernova.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            requestAnimationFrame(animateSupernova);
        };
        
        animateSupernova();
    }

    setIntensity(level) {
        // Adjust visual intensity based on story events
        switch (level) {
            case 'calm':
                this.config.twinkleSpeed = 0.01;
                this.config.cometSpeed = 0.1;
                break;
            case 'active':
                this.config.twinkleSpeed = 0.02;
                this.config.cometSpeed = 0.3;
                break;
            case 'storm':
                this.config.twinkleSpeed = 0.05;
                this.config.cometSpeed = 0.8;
                this.addCometShower();
                break;
        }
        
        console.log(`🌊 Galaxy intensity set to: ${level}`);
    }

    destroy() {
        this.stopAnimations();
        this.stars = [];
        this.comets = [];
        this.nebulae = [];
        console.log('🗑️ Galaxy Generator destroyed');
    }
}

// Export for global use
window.GalaxyGenerator = GalaxyGenerator;