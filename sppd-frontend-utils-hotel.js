function toggleHotel() {
    const hotelCheckbox = document.getElementById("hotel");
    const hotelStatus = document.getElementById("hotelStatus");
    const hotelSwitch = document.getElementById("hotelSwitch");
    const hotelSwitchBg = document.getElementById("hotelSwitchBg");

    // Toggle checkbox state
    hotelCheckbox.checked = !hotelCheckbox.checked;

    // Update switch and status
    if (hotelCheckbox.checked) {
        hotelSwitchBg.classList.remove("bg-gray-300");
        hotelSwitchBg.classList.add("bg-green-500");
        hotelSwitch.style.transform = "translateX(100%)";
        hotelStatus.textContent = "Yes";
    } else {
        hotelSwitchBg.classList.remove("bg-green-500");
        hotelSwitchBg.classList.add("bg-gray-300");
        hotelSwitch.style.transform = "translateX(0)";
        hotelStatus.textContent = "No";
    }

    // Trigger recalculations
    // triggerAllCalculations();
}
