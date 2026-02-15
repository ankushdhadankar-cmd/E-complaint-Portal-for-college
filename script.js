// ==================== LOGIN CHECK ====================
// Check if user is logged in FIRST
function checkUserLogin() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // User is logged in, show greeting
    const user = JSON.parse(currentUser);
    const greeting = document.getElementById('userGreeting');
    if (greeting) {
        greeting.textContent = `Welcome, ${user.name}!`;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// ==================== PAGE INITIALIZATION ====================
// Initialize the page - CHECK LOGIN FIRST!
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();  // THIS MUST BE FIRST!
    setupNavigation();
    setupComplaintForm();
    updateStatistics();
});

// Empty database - no sample data
let complaintsDatabase = [];

// ==================== NAVIGATION ====================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for logout link
            if (this.getAttribute('href') === '#logout') {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== COMPLAINT FORM ====================
function setupComplaintForm() {
    const form = document.getElementById('complaintForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const complaint = {
            id: generateReferenceId(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            rollNumber: formData.get('rollNumber'),
            department: formData.get('department'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            description: formData.get('description'),
            anonymous: formData.get('anonymous') ? true : false,
            status: 'submitted',
            submittedDate: getCurrentDate(),
            lastUpdated: getCurrentDate(),
            resolutionDate: null,
            timeline: [
                {
                    date: getCurrentDate(),
                    status: 'submitted',
                    description: 'Complaint submitted successfully'
                }
            ]
        };
        
        // Add to database
        complaintsDatabase.push(complaint);
        
        // Show success message
        showSuccessMessage(complaint.id);
        
        // Reset form
        form.reset();
        
        // Update statistics
        updateStatistics();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function generateReferenceId() {
    const date = new Date();
    const year = date.getFullYear();
    const count = complaintsDatabase.length + 1;
    return `COMP-${year}-${String(count).padStart(3, '0')}`;
}

function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

function showSuccessMessage(referenceId) {
    const successDiv = document.getElementById('successMessage');
    const refIdSpan = document.getElementById('referenceId');
    
    if (!successDiv || !refIdSpan) return;
    
    refIdSpan.textContent = referenceId;
    successDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// ==================== TRACK COMPLAINT ====================
function trackComplaint() {
    const referenceNumber = document.getElementById('referenceNumber').value.trim().toUpperCase();
    
    if (!referenceNumber) {
        alert('Please enter a reference ID');
        return;
    }
    
    // Find complaint
    const complaint = complaintsDatabase.find(c => c.id === referenceNumber);
    
    if (complaint) {
        displayComplaintDetails(complaint);
    } else {
        showNotFoundMessage();
    }
}

function displayComplaintDetails(complaint) {
    // Hide not found message
    const notFoundDiv = document.getElementById('notFoundMessage');
    if (notFoundDiv) {
        notFoundDiv.style.display = 'none';
    }
    
    // Show complaint details
    const detailsDiv = document.getElementById('complaintDetails');
    if (!detailsDiv) return;
    
    // Fill in details
    const detailRefId = document.getElementById('detailRefId');
    const detailStatus = document.getElementById('detailStatus');
    const detailCategory = document.getElementById('detailCategory');
    const detailPriority = document.getElementById('detailPriority');
    const detailDate = document.getElementById('detailDate');
    const detailUpdated = document.getElementById('detailUpdated');
    const detailResolution = document.getElementById('detailResolution');
    
    if (detailRefId) detailRefId.textContent = complaint.id;
    if (detailStatus) detailStatus.innerHTML = getStatusBadge(complaint.status);
    if (detailCategory) detailCategory.textContent = getCategoryLabel(complaint.category);
    if (detailPriority) detailPriority.innerHTML = getPriorityBadge(complaint.priority);
    if (detailDate) detailDate.textContent = formatDate(complaint.submittedDate);
    if (detailUpdated) detailUpdated.textContent = formatDate(complaint.lastUpdated);
    if (detailResolution) detailResolution.textContent = complaint.resolutionDate ? 
        formatDate(complaint.resolutionDate) : 'Not yet resolved';
    
    // Build timeline
    const timelineDiv = document.getElementById('statusTimeline');
    if (timelineDiv) {
        timelineDiv.innerHTML = '';
        
        complaint.timeline.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-date">${formatDate(item.date)}</div>
                    <div class="timeline-status">${getStatusLabel(item.status)}</div>
                    <div class="timeline-description">${item.description}</div>
                </div>
            `;
            timelineDiv.appendChild(timelineItem);
        });
    }
    
    detailsDiv.style.display = 'block';
}

function showNotFoundMessage() {
    const detailsDiv = document.getElementById('complaintDetails');
    const notFoundDiv = document.getElementById('notFoundMessage');
    
    if (detailsDiv) detailsDiv.style.display = 'none';
    if (notFoundDiv) notFoundDiv.style.display = 'block';
}

// ==================== STATUS AND PRIORITY BADGES ====================
function getStatusBadge(status) {
    const statusColors = {
        'submitted': '<span style="background: #3b82f6; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Submitted</span>',
        'acknowledged': '<span style="background: #8b5cf6; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Acknowledged</span>',
        'in_progress': '<span style="background: #f59e0b; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">In Progress</span>',
        'resolved': '<span style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Resolved</span>',
        'closed': '<span style="background: #6b7280; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Closed</span>'
    };
    return statusColors[status] || '<span>Unknown</span>';
}

function getPriorityBadge(priority) {
    const priorityColors = {
        'low': '<span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Low</span>',
        'medium': '<span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Medium</span>',
        'high': '<span style="background: #fed7aa; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">High</span>',
        'urgent': '<span style="background: #fee2e2; color: #7f1d1d; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem;">Urgent</span>'
    };
    return priorityColors[priority] || '<span>Unknown</span>';
}

function getStatusLabel(status) {
    const labels = {
        'submitted': 'Submitted',
        'acknowledged': 'Acknowledged',
        'in_progress': 'In Progress',
        'resolved': 'Resolved',
        'closed': 'Closed'
    };
    return labels[status] || 'Unknown';
}

function getCategoryLabel(category) {
    const labels = {
        'academic': 'Academic Issues',
        'harassment': 'Harassment/Bullying',
        'infrastructure': 'Infrastructure/Facilities',
        'fee': 'Fee Related',
        'faculty': 'Faculty Conduct',
        'examination': 'Examination Issues',
        'hostel': 'Hostel Issues',
        'other': 'Other'
    };
    return labels[category] || 'Unknown';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// ==================== STATISTICS ====================
function updateStatistics() {
    const total = complaintsDatabase.length;
    const resolved = complaintsDatabase.filter(c => c.status === 'resolved').length;
    const pending = complaintsDatabase.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    const totalComplaints = document.getElementById('totalComplaints');
    const resolvedComplaints = document.getElementById('resolvedComplaints');
    const pendingComplaints = document.getElementById('pendingComplaints');
    const resolutionRateElement = document.getElementById('resolutionRate');
    
    if (totalComplaints) totalComplaints.textContent = total;
    if (resolvedComplaints) resolvedComplaints.textContent = resolved;
    if (pendingComplaints) pendingComplaints.textContent = pending;
    if (resolutionRateElement) resolutionRateElement.textContent = resolutionRate + '%';
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#logout') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
