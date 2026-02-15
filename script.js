const ADMIN_EMAIL = "admin@college.com";
const ADMIN_PASSWORD = "admin123";

// Toggle Forms
function showSignup() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("signupSection").style.display = "block";
}

function showLogin() {
    document.getElementById("signupSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
}

// Signup (Student only)
function signup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    showLogin();
}

// Login (Student + Admin)
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Admin login check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        window.location.href = "admin.html";
        return;
    }

    // Student login
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", email);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Credentials!");
    }
}

// Submit Complaint
function submitComplaint() {
    const category = document.getElementById("category").value;
    const text = document.getElementById("complaintText").value;
    const user = localStorage.getItem("loggedInUser");

    if (!category || !text) {
        alert("Please fill all fields!");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.push({
        email: user,
        category,
        text,
        status: "Pending"
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted!");
    document.getElementById("complaintText").value = "";
    loadUserComplaints();
}

// Load Student Complaints
function loadUserComplaints() {
    const user = localStorage.getItem("loggedInUser");
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let container = document.getElementById("complaintList");

    if (!container) return;

    container.innerHTML = "";

    complaints.filter(c => c.email === user)
        .forEach(c => {
            container.innerHTML += `
                <div class="complaint-card">
                    <p><strong>Category:</strong> ${c.category}</p>
                    <p>${c.text}</p>
                    <p class="status">${c.status}</p>
                </div>
            `;
        });
}

// Admin View
function loadAdminComplaints() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let container = document.getElementById("adminComplaintList");

    container.innerHTML = "";

    complaints.forEach((c, index) => {
        container.innerHTML += `
            <div class="admin-card">
                <p><strong>Email:</strong> ${c.email}</p>
                <p><strong>Category:</strong> ${c.category}</p>
                <p>${c.text}</p>
                <label>Status:</label>
                <select onchange="updateStatus(${index}, this.value)">
                    <option ${c.status=="Pending"?"selected":""}>Pending</option>
                    <option ${c.status=="In Progress"?"selected":""}>In Progress</option>
                    <option ${c.status=="Resolved"?"selected":""}>Resolved</option>
                    <option ${c.status=="Rejected"?"selected":""}>Rejected</option>
                </select>
            </div>
        `;
    });
}
// Update Status
function updateStatus(index, status) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints[index].status = status;
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadAdminComplaints();
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// Auto load for student dashboard
if (window.location.pathname.includes("dashboard.html")) {
    loadUserComplaints();
}