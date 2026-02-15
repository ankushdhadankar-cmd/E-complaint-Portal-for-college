// Restrict access
if (localStorage.getItem("role") !== "student") {
    alert("Access Denied");
    window.location.href = "login.html";
}

function submitComplaint() {
    const name = document.getElementById("name").value;
    const complaint = document.getElementById("complaint").value;

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    const newComplaint = {
        id: Date.now(),
        name: name,
        complaint: complaint,
        status: "Pending"
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted Successfully");
}
