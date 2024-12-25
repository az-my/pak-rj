document.addEventListener("DOMContentLoaded", () => {
    const startTimeField = document.getElementById("startTime");
    const endTimeField = document.getElementById("endTime");

    // Helper function to generate time intervals in 30-minute steps
    const generateTimeOptions = (start = 0, end = 1440) => {
        const options = [];
        for (let minutes = start; minutes <= end; minutes += 30) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            options.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
        }
        return options;
    };

    // Populate Start Time with 30-minute intervals from 00:00 to 24:00
    const populateStartTime = () => {
        const startOptions = generateTimeOptions();
        startOptions.forEach((time) => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            startTimeField.appendChild(option);
        });
    };

    // Populate End Time based on selected Start Time
    const populateEndTime = (startTime) => {
        // Clear existing options in End Time
        endTimeField.innerHTML = "";

        // Calculate start time in minutes
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMinute;

        // Generate options starting 30 minutes after Start Time, up to 24:00
        const endOptions = generateTimeOptions(startMinutes + 30, 1440);
        endOptions.forEach((time) => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            endTimeField.appendChild(option);
        });
    };

    // Event listener for Start Time field
    if (startTimeField && endTimeField) {
        startTimeField.addEventListener("change", (event) => {
            const selectedStartTime = event.target.value;
            if (selectedStartTime) {
                populateEndTime(selectedStartTime);
            }
        });
    }

    // Initial population of Start Time options
    populateStartTime();
});
