
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const newChatBtn = document.getElementById("newChat");
const userInput = document.getElementById("userInput");

// Мәзірдің артқы қараңғы қабаты
const backdrop = document.createElement("div");
backdrop.className = "sidebar-backdrop";
document.body.appendChild(backdrop);

// Мәзірді ашу және жабу
function openSidebar() {
    sidebar.classList.add("open");
    backdrop.classList.add("visible");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("visible");
}

function toggleSidebar() {
    if (sidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// ≡ батырмасы
menuBtn.addEventListener("click", event => {
    event.stopPropagation();
    toggleSidebar();
});

// Қараңғы аймақты басқанда мәзір жабылады
backdrop.addEventListener("click", closeSidebar);

// Escape арқылы жабу
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeSidebar();
    }
});

// Жаңа чат
newChatBtn.addEventListener("click", () => {
    ChatEngine.newChat();
});

// Ұсынылған сұрақтар
document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", () => {
        userInput.value = button.dataset.prompt;
        userInput.focus();
    });
});

// Навигация
document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        if (button.dataset.page !== "chat") {
            alert("Бұл бөлім келесі жаңартуларда іске қосылады!");
            return;
        }

        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        closeSidebar();
    });
});

// Мәтін жазған кезде өрісті үлкейту
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";

    userInput.style.height =
        Math.min(userInput.scrollHeight, 130) + "px";
});
