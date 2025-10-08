$(document).ready(function() {
  $('.ctf-item').click(function(e) {
    // Check if the click was on an element that should NOT trigger card navigation
    if ($(e.target).is('a, button, .no-propagation') || 
        $(e.target).closest('a, button, .no-propagation').length) {
        return; // Don't navigate, let the element handle its own click
    }

    window.location.href = $(this).data('url');
  });
});
class FloatingPencilArt {
    constructor() {
        this.container = document.getElementById('ascii-pencils');
        this.pencils = [];
        
        // Your provided ASCII art
        this.pencilArt = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣷⣄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠲⣄⠙⢿⣿⡿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣤⠈⠳⡄⠉⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠂⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⠞⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠘⢁⣴⠟⢁⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢾⣷⣄⠁⠴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣰⠄⠙⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`.trim();
        
        this.init();
    }

    createPencil() {
        const pencil = document.createElement('div');
        pencil.className = 'pencil';
        
        let x = Math.random() * window.innerWidth*0.45;
        let y = Math.random() * window.innerHeight*0.45;
        
        // Random properties
        const scale = Math.random()+1;
        const rotationSpeed = (Math.random() - 0.5) * 4; // Between -1.5 and 1.5
        
        // Movement properties
        const floatAmplitude = Math.random() + 10 + 0.5; // Floating intensity
        
        // Pencil colors
        const colors = ['#40be3bff', '#549c44ff', '#75bb6eff', '#22ae03ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        pencil.style.left = x + 'px';
        pencil.style.top = y + 'px';
        pencil.style.color = color;
        pencil.style.opacity = 1;
        pencil.textContent = this.pencilArt;
        
        this.container.appendChild(pencil);
        
        return {
            element: pencil,
            x: x,
            y: y,
            rotation: Math.random() * 360,
            rotationSpeed: rotationSpeed,
            scale: scale,
            floatOffset: Math.random(),
            floatAmplitude: floatAmplitude,
            createdAt: Date.now(),
            lifeDuration: 4000 + Math.random() * 5000 // 30-60 seconds
        };
    }

    updatePencil(pencil) {
        const now = Date.now();
        const time = now / 1000;
        
        // Add floating motion
        const floatY = Math.sin(time * 2 + pencil.floatOffset) * pencil.floatAmplitude;
        
        // Update rotation
        pencil.rotation += pencil.rotationSpeed;
        
        // Apply all transformations
        pencil.element.style.transform = `
            translate(${pencil.x}px, ${pencil.y + floatY}px) 
            rotate(${pencil.rotation}deg) 
            scale(${pencil.scale})
        `;
        
        // Fade out pencils that are about to expire
        const age = now - pencil.createdAt;
        if (age > pencil.lifeDuration - 2000) {
            const fadeProgress = (age - (pencil.lifeDuration - 2000)) / 2000;
            pencil.element.style.opacity = Math.max(0, pencil.element.style.opacity - fadeProgress * 0.1);
        }
        
        return age < pencil.lifeDuration;
    }

    animate() {
        // Update all pencils
        this.pencils = this.pencils.filter(pencil => this.updatePencil(pencil));
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    init() {
        this.animate();
        // Continuously add new pencils
        setInterval(() => {
            if (this.pencils.length < 10) {
                this.pencils.push(this.createPencil());
            }
        }, 10);
        
        // Handle window resize
        this.handleResize();
    }

    handleResize() {
        window.addEventListener('resize', () => {
            // Adjust pencil positions to stay within new bounds
            this.pencils.forEach(pencil => {
                pencil.x = Math.min(pencil.x, window.innerWidth - 50);
                pencil.y = Math.min(pencil.y, window.innerHeight - 50);
            });
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FloatingPencilArt(); // Use the dynamic version with different movement patterns
});

// Reinitialize on resize to prevent accumulation
window.addEventListener('resize', () => {
    const container = document.getElementById('ascii-pencils');
    if (container) {
        container.innerHTML = '';
        setTimeout(() => {
            new FloatingPencilArt();
        }, 250);
    }
});