document.addEventListener("DOMContentLoaded", () => {
    const hotelCheckbox = document.getElementById("hotel");
    const hotelSwitch = document.getElementById("hotelSwitch");
    const hotelStatus = document.getElementById("hotelStatus");

    hotelCheckbox.addEventListener("change", () => {
        if (hotelCheckbox.checked) {
            hotelSwitch.style.transform = "translateX(32px)";
            hotelSwitch.style.backgroundColor = "#3b82f6"; // Tailwind blue-500
            hotelStatus.textContent = "Yes";
        } else {
            hotelSwitch.style.transform = "translateX(0)";
            hotelSwitch.style.backgroundColor = "#e5e7eb"; // Tailwind gray-300
            hotelStatus.textContent = "No";
        }
    });
});
