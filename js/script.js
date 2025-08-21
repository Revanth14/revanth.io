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

// Website Status Indicator
function updateStatusIndicator() {
    const statusText = document.getElementById('statusText');
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
    if (daysSinceUpdate <= 7) {
        statusDot.style.background = 'var(--accent)'; // Green - recently updated
    } else if (daysSinceUpdate <= 30) {
        statusDot.style.background = 'var(--primary)'; // Blue - updated this month  
    } else {
        statusDot.style.background = '#fbbf24'; // Yellow - needs update
    }
}

// Initialize status indicator on page load
document.addEventListener('DOMContentLoaded', updateStatusIndicator);

// Initialize status indicator on page load
document.addEventListener('DOMContentLoaded', updateStatusIndicator);