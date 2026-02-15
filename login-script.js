// User database (in real app, this would be a backend)
let usersDatabase = [
    {
        id: 1,
        name: 'Demo Student',
        email: 'student@college.edu',
        password: 'password123',
        rollNumber: '2021CSE001',
        createdAt: '2026-01-01'
    }
];

let currentUser = null;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        redirectToDashboard();
    }
    
    setupLoginForm();
    setupSignupForm();
    setupForgotPasswordForm();
});

// Setup Login Form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Find user
        const user = usersDatabase.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login successful
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                rollNumber: user.rollNumber
            };
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Redirect to main page
            redirectToDashboard();
        } else {
            // Login failed
            showLoginError('Invalid email or password. Please try again.');
        }
    });
}

function showLoginError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Setup Signup Form
function setupSignupForm() {
    const form = document.getElementById('signupForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const rollNumber = document.getElementById('signupRoll').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validation
        if (password !== confirmPassword) {
            showSignupError('Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            showSignupError('Password must be at least 6 characters!');
            return;
        }
        
        // Check if email already exists
        if (usersDatabase.find(u => u.email === email)) {
            showSignupError('Email already registered!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: usersDatabase.length + 1,
            name: name,
            email: email,
            password: password,
            rollNumber: rollNumber,
            createdAt: getCurrentDate()
        };
        
        usersDatabase.push(newUser);
        
        // Show success message
        const successDiv = document.getElementById('signupSuccess');
        const errorDiv = document.getElementById('signupError');
        
        errorDiv.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Reset form
        form.reset();
        
        // Close modal after 2 seconds
        setTimeout(() => {
            closeSignup();
            // Clear success message
            successDiv.style.display = 'none';
        }, 2000);
    });
}

function showSignupError(message) {
    const errorDiv = document.getElementById('signupError');
    const errorText = document.getElementById('signupErrorText');
    const successDiv = document.getElementById('signupSuccess');
    
    errorText.textContent = message;
    successDiv.style.display = 'none';
    errorDiv.style.display = 'block';
}

// Setup Forgot Password Form
function setupForgotPasswordForm() {
    const form = document.getElementById('forgotForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value.trim();
        
        // Check if email exists
        const user = usersDatabase.find(u => u.email === email);
        
        if (user) {
            // Show success message
            const successDiv = document.getElementById('forgotSuccess');
            const errorDiv = document.getElementById('forgotError');
            
            errorDiv.style.display = 'none';
            successDiv.style.display = 'block';
            
            // In real app, send email here
            console.log('Reset link sent to:', email);
            
            // Reset form
            form.reset();
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeForgot();
                successDiv.style.display = 'none';
            }, 3000);
        } else {
            // Show error message
            const errorDiv = document.getElementById('forgotError');
            const errorText = document.getElementById('forgotErrorText');
            
            errorText.textContent = 'Email not found in our system!';
            errorDiv.style.display = 'block';
        }
    });
}

// Modal Functions
function showSignup() {
    document.getElementById('signupModal').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('errorMessage').style.display = 'none';
}

function closeSignup() {
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('signupForm').reset();
    document.getElementById('signupError').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'none';
}

function showForgotPassword() {
    document.getElementById('forgotModal').style.display = 'flex';
}

function closeForgot() {
    document.getElementById('forgotModal').style.display = 'none';
    document.getElementById('forgotForm').reset();
    document.getElementById('forgotError').style.display = 'none';
    document.getElementById('forgotSuccess').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const signupModal = document.getElementById('signupModal');
    const forgotModal = document.getElementById('forgotModal');
    
    if (event.target === signupModal) {
        closeSignup();
    }
    if (event.target === forgotModal) {
        closeForgot();
    }
};

// Redirect to Dashboard
function redirectToDashboard() {
    window.location.href = 'index.html';
}

// Get Current Date
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}