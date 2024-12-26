document.addEventListener("DOMContentLoaded", () => {
    const totalHoursField = document.getElementById("totalHours");
    const totalCostField = document.getElementById("totalCost");
    const fixedRate = 22156;

    // Helper function to format numbers in Indonesian format
    const formatIndonesianNumber = (number) => {
        return new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0, // Eliminate decimals
        }).format(number);
    };

    // Function to calculate total cost
    const calculateTotalCost = (totalHours) => {
        if (!totalHours) return ""; // Return empty if total hours are not set

        // Convert total hours to a number and calculate the total cost
        const totalCost = Math.ceil(parseFloat(totalHours.replace(",", ".")) * fixedRate);
        return formatIndonesianNumber(totalCost); // Format with thousand separators
    };

    // Event listener to update Total Cost when Total Hours changes
    if (totalHoursField && totalCostField) {
        const updateTotalCost = () => {
            const totalHours = totalHoursField.value.trim();
            const totalCost = calculateTotalCost(totalHours);
            totalCostField.value = totalCost;
        };

        // Update Total Cost when Total Hours changes
        totalHoursField.addEventListener("change", updateTotalCost);
    }
});
