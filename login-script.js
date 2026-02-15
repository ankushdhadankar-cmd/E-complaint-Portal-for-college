function studentLogin() {
    const username = prompt("Enter Student Username:");
    const password = prompt("Enter Student Password:");

    if (username && password) {
        localStorage.setItem("role", "student");
        window.location.href = "student.html";
    } else {
        alert("Invalid Student Login");
    }
}

function adminLogin() {
    const username = prompt("Enter Admin Username:");
    const password = prompt("Enter Admin Password:");

    if (username === "admin" && password === "1234") {
        localStorage.setItem("role", "admin");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid Admin Credentials");
    }
}
