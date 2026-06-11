// Custom Text Scramble Animation Class
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        const length = newText.length;
        const step = 5; // frame delay between each letter starting to scramble
        const scrambleDuration = 10; // how many frames each letter scrambles
        
        for (let i = 0; i < length; i++) {
            const from = ' '; // start as empty space
            const to = newText[i] || ' ';
            let start = i * step;
            let end = start + scrambleDuration + Math.floor(Math.random() * 8);
            
            if (to === ' ') {
                start = 0;
                end = 0;
            }
            
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Matrix Rain Canvas Loader
const loader = document.getElementById("loader");
const loaderTx = loader.getContext("2d");
const font_size = 10;
let columns = 0;
let drops = [];

// Adjust Canvas Height and Width dynamically
function resizeLoader() {
    if (loader) {
        loader.height = window.innerHeight;
        loader.width = window.innerWidth;
        columns = Math.floor(loader.width / font_size);
        drops = [];
        for (let x = 0; x < columns; x++) {
            // Fully populate the screen height initially
            drops[x] = {
                y: Math.random() * (loader.height / font_size),
                speed: 1.5 + Math.random() * 2
            };
        }
    }
}
resizeLoader();
window.addEventListener('resize', resizeLoader);

let code = "1001000111010101010101100101001111110101010101111010";
code = code.split("");

function drawMatrix() {
    if (!loader || !loaderTx) return;
    loaderTx.fillStyle = "rgba(42, 41, 39, 0.08)";
    loaderTx.fillRect(0, 0, loader.width, loader.height);
    loaderTx.fillStyle = "#FF1313"; // Neon Red
    loaderTx.font = font_size + "px Space Grotesk, monospace";
    
    for (let i = 0; i < drops.length; i++) {
        let text = code[Math.floor(Math.random() * code.length)];
        loaderTx.fillText(text, i * font_size, drops[i].y * font_size);
        
        if (drops[i].y * font_size > loader.height && Math.random() > 0.975) {
            drops[i].y = 0;
            drops[i].speed = 1.5 + Math.random() * 2;
        }
        drops[i].y += drops[i].speed;
    }
}

const loaderInterval = loader ? setInterval(drawMatrix, 33) : null;

// Remove Loader on Window Load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loaderInterval) clearInterval(loaderInterval);
        const loaderWrp = document.querySelector('.loader-wrapper');
        if (loaderWrp) {
            loaderWrp.classList.add('loader-wrapper--hidden');
            setTimeout(() => {
                loaderWrp.remove();
            }, 500);
        }

        // Trigger Text Scramble
        const scrambleTitle = document.getElementById('scramble-title');
        if (scrambleTitle) {
            const scrambler = new TextScramble(scrambleTitle);
            scrambler.setText(scrambleTitle.getAttribute('data-text'));
        }
    }, 1500); // 1.5 second matrix rain loader play
});

// Fallback loader removal (if load event doesn't fire fast enough)
setTimeout(() => {
    const loaderWrp = document.querySelector('.loader-wrapper');
    if (loaderWrp) {
        if (loaderInterval) clearInterval(loaderInterval);
        loaderWrp.classList.add('loader-wrapper--hidden');
        setTimeout(() => {
            loaderWrp.remove();
        }, 500);
    }
}, 3000);

// Custom Cursor movements
const cursorDot = document.querySelector('.cursor-dot');
const cursorBorder = document.querySelector('.cursor-border');

let mouseX = 0, mouseY = 0;
let borderX = 0, borderY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    }
});

// Smooth trailing border effect
function animateCursor() {
    const ease = 0.12; // lower number = more lag/smooth
    borderX += (mouseX - borderX) * ease;
    borderY += (mouseY - borderY) * ease;
    
    if (cursorBorder) {
        cursorBorder.style.left = borderX + 'px';
        cursorBorder.style.top = borderY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hovers
const interactives = document.querySelectorAll('.interactive, a, button, input, textarea');
interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (cursorBorder && cursorDot) {
            cursorBorder.style.width = '42px';
            cursorBorder.style.height = '42px';
            cursorBorder.style.backgroundColor = 'rgba(255, 19, 19, 0.1)';
            cursorBorder.style.borderColor = 'rgba(255, 19, 19, 0.6)';
            cursorDot.style.backgroundColor = '#ffffff';
            cursorDot.style.width = '10px';
            cursorDot.style.height = '10px';
        }
    });
    item.addEventListener('mouseleave', () => {
        if (cursorBorder && cursorDot) {
            cursorBorder.style.width = '26px';
            cursorBorder.style.height = '26px';
            cursorBorder.style.backgroundColor = 'transparent';
            cursorBorder.style.borderColor = 'var(--accent)';
            cursorDot.style.backgroundColor = 'var(--accent)';
            cursorDot.style.width = '6px';
            cursorDot.style.height = '6px';
        }
    });
});

// Mobile Burger Menu toggle
const burger = document.querySelector('.menu-burger');
const navMenu = document.querySelector('.navbar-menu');
const navItems = document.querySelectorAll('.navbar-menu__item');

if (burger && navMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('burger-active');
        navMenu.classList.toggle('menu-active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('burger-active');
            navMenu.classList.remove('menu-active');
        });
    });
}

// Header scroll effect
const header = document.querySelector('.site-header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0px';
            header.style.backgroundColor = 'rgba(30, 29, 27, 0.9)';
        } else {
            header.style.padding = '0px';
            header.style.backgroundColor = 'rgba(42, 41, 39, 0.7)';
        }
    });
}

// Pure JS Contact Form Handler saving submissions to localStorage
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        
        const formData = {
            name: nameInput ? nameInput.value : '',
            email: emailInput ? emailInput.value : '',
            message: messageInput ? messageInput.value : '',
            date: new Date().toLocaleString()
        };

        // Save to localStorage
        const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        existingMessages.push(formData);
        localStorage.setItem('contact_messages', JSON.stringify(existingMessages));

        alert('Thank you for your message, ' + formData.name + '! It has been saved to client-side localStorage.');
        contactForm.reset();
    });
}

// Interactive Peaking Avatar eye-tracking and tilt
const leftPupil = document.getElementById('left-pupil');
const rightPupil = document.getElementById('right-pupil');
const leftEyeSclera = document.getElementById('left-eye-sclera');
const rightEyeSclera = document.getElementById('right-eye-sclera');
const peakingAvatarContainer = document.querySelector('.peaking-avatar-container');

if (leftPupil && rightPupil && leftEyeSclera && rightEyeSclera && peakingAvatarContainer) {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // 1. Calculate pupil tracking offsets
        const leftRect = leftEyeSclera.getBoundingClientRect();
        const rightRect = rightEyeSclera.getBoundingClientRect();

        const leftCenterX = leftRect.left + leftRect.width / 2;
        const leftCenterY = leftRect.top + leftRect.height / 2;
        const rightCenterX = rightRect.left + rightRect.width / 2;
        const rightCenterY = rightRect.top + rightRect.height / 2;

        const leftDx = mouseX - leftCenterX;
        const leftDy = mouseY - leftCenterY;
        const leftAngle = Math.atan2(leftDy, leftDx);
        // Map distance to a max of 2px pupil shift
        const leftDist = Math.min(2.0, Math.hypot(leftDx, leftDy) / 45);

        const rightDx = mouseX - rightCenterX;
        const rightDy = mouseY - rightCenterY;
        const rightAngle = Math.atan2(rightDy, rightDx);
        const rightDist = Math.min(2.0, Math.hypot(rightDx, rightDy) / 45);

        const leftTx = Math.cos(leftAngle) * leftDist;
        const leftTy = Math.sin(leftAngle) * leftDist;
        const rightTx = Math.cos(rightAngle) * rightDist;
        const rightTy = Math.sin(rightAngle) * rightDist;

        leftPupil.setAttribute('transform', `translate(${leftTx}, ${leftTy})`);
        rightPupil.setAttribute('transform', `translate(${rightTx}, ${rightTy})`);

        // 2. Calculate avatar container slight tilt/shift towards mouse
        const containerRect = peakingAvatarContainer.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        const containerDx = mouseX - containerCenterX;
        const containerDy = mouseY - containerCenterY;

        // Gently translate and tilt the container towards the mouse
        const tiltX = Math.min(5, Math.max(-5, containerDx / 120));
        const tiltY = Math.min(4, Math.max(-4, containerDy / 150));
        
        // Apply transform
        peakingAvatarContainer.style.transform = `translate(${tiltX}px, ${tiltY}px)`;
    });
}
