// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'home') {
        observer.observe(section);
    }
});

// Dynamic greeting based on time
const hour = new Date().getHours();
let greeting = "Hi";
if (hour >= 5 && hour < 12) greeting = "Good Morning";
else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
else if (hour >= 17 && hour < 22) greeting = "Good Evening";

// Update hero greeting if needed
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    heroTitle.textContent = `${greeting}, I'm Revanth`;
}

// Certificate Modal Functions
function showCertificate(certType) {
    const modal = document.getElementById('certModal');
    const certImage = document.getElementById('certImage');
    
    // Map certification types to image paths
    const certPaths = {
        'cloud-practitioner': 'certificates/aws-cloud-practitioner.jpeg',
        'ai-practitioner': 'certificates/aws-ai-practitioner.jpeg',
        'data-engineer': 'certificates/aws-data-engineer.jpeg',
        'solutions-architect': 'certificates/aws-solutions-architect.jpeg'
    };
    
    certImage.src = certPaths[certType];
    modal.style.display = 'block';
}

function closeCertificate() {
    const modal = document.getElementById('certModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('certModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Website Status Indicator (optional - only if element exists)
function updateStatusIndicator() {
    const statusText = document.getElementById('statusText');
    if (!statusText) return; // Exit if status indicator doesn't exist
    
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short' });
    const currentYear = now.getFullYear();
    
    // Update the main status text
    statusText.textContent = `Updated ${currentMonth} ${currentYear}`;
    
    // You can manually update this when you make changes
    const lastUpdate = new Date('2025-08-20'); // Update this date when you deploy changes
    const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
    
    // Change status dot color based on recency
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        if (daysSinceUpdate <= 7) {
            statusDot.style.background = 'var(--accent)'; // Green - recently updated
        } else if (daysSinceUpdate <= 30) {
            statusDot.style.background = 'var(--primary)'; // Blue - updated this month  
        } else {
            statusDot.style.background = '#fbbf24'; // Yellow - needs update
        }
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    console.log('Toggle mobile menu clicked'); // Debug log
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        console.log('Menu toggled', navLinks.classList.contains('active')); // Debug log
    } else {
        console.log('Elements not found:', { mobileMenuBtn, navLinks }); // Debug log
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...'); // Debug log
    
    // Initialize status indicator if it exists
    updateStatusIndicator();
    
    // Initialize mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    console.log('Mobile menu button found:', mobileMenuBtn); // Debug log
    
    if (mobileMenuBtn) {
        // Add both click and touchstart for better mobile support
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked!'); // Debug log
            toggleMobileMenu();
        });
        
        mobileMenuBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button touched!'); // Debug log
            toggleMobileMenu();
        }, { passive: false });
        
        console.log('Event listeners added to mobile menu button');
    } else {
        console.log('Mobile menu button not found!');
    }
    
    // Add event listeners to nav links to close menu when clicked
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        if (mobileMenuBtn && navLinks && !mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });
});