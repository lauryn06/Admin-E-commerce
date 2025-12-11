const login = document.querySelector('.AdminLogin');

const text = document.querySelector('.message');
const username = document.querySelector('.names');
const password = document.querySelector('.passwords');

login.addEventListener('click', () => {
    if (username.value === "admin" && password.value === "admin123") {
        text.textContent = "Login Successful";
        text.style.color = "green";
        location.href = "dashboard.html";
    } else {
        text.textContent = "Login Failed! Try Again.";
        text.style.color = "red";
    }
});
