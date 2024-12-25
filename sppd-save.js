const API_SPPD_ADD = "https://rj.up.railway.app/api/google-sheets/sppd_add";

const form = document.getElementById("sppdForm");

const alertContainer = document.createElement("div");
alertContainer.id = "alert-container";
alertContainer.classList.add("hidden", "fixed", "top-5", "left-1/2", "transform", "-translate-x-1/2", "z-50");
document.body.appendChild(alertContainer);

const alert = document.createElement("div");
alert.id = "alert";
alertContainer.appendChild(alert);

const closeAlert = document.createElement("button");
closeAlert.textContent = "×";
closeAlert.classList.add("absolute", "top-2", "right-3", "text-xl", "text-gray-600", "hover:text-gray-800");
alert.appendChild(closeAlert);

const alertTitle = document.createElement("strong");
alertTitle.id = "alert-title";
alert.appendChild(alertTitle);

const alertMessage = document.createElement("span");
alertMessage.id = "alert-message";
alert.appendChild(alertMessage);

closeAlert.addEventListener("click", () => {
    alertContainer.classList.add("hidden");
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_SPPD_ADD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alertTitle.textContent = "Success";
            alertMessage.textContent = result.message;
            alert.classList.add("bg-green-100", "border", "border-green-400", "text-green-700", "px-4", "py-3", "rounded", "relative");
        } else {
            alertTitle.textContent = "Error";
            alertMessage.textContent = result.error;
            alert.classList.add("bg-red-100", "border", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "relative");
        }

        alertContainer.classList.remove("hidden");
    } catch (error) {
        alertTitle.textContent = "Error";
        alertMessage.textContent = "An error occurred while processing your request.";
        alert.classList.add("bg-red-100", "border", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "relative");
        alertContainer.classList.remove("hidden");
    }
});
