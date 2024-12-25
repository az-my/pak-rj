document.addEventListener("DOMContentLoaded", () => {
    const startTimeField = document.getElementById("startTime");
    const endTimeField = document.getElementById("endTime");
    const durationField = document.getElementById("duration");

    // Helper function to format numbers in Indonesian format
    const formatIndonesianNumber = (value) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Function to calculate duration in hours
    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return ""; // Return empty if fields are not selected

        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        // Convert time to total minutes
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        // Calculate duration in minutes
        const durationMinutes = endTotalMinutes - startTotalMinutes;

        // Convert minutes to hours (decimal format)
        if (durationMinutes > 0) {
            const durationInHours = durationMinutes / 60;
            return formatIndonesianNumber(durationInHours); // Format as Indonesian number
        }

        return "";
    };

    // Event listener for Start Time and End Time fields
    if (startTimeField && endTimeField && durationField) {
        const updateDuration = () => {
            const startTime = startTimeField.value;
            const endTime = endTimeField.value;
            const duration = calculateDuration(startTime, endTime);
            durationField.value = duration;

            // Dispatch change event to trigger other calculations
            const event = new Event("change");
            durationField.dispatchEvent(event);
        };

        // Update duration when either Start Time or End Time changes
        startTimeField.addEventListener("change", updateDuration);
        endTimeField.addEventListener("change", updateDuration);
    }
});
