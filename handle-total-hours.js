function calculateTotalBiaya() {
  const durationInput = document.getElementById('duration'); // Get the duration input element
  const startTimeInput = document.getElementById('startTime'); // Get the startTime input element
  const endTimeInput = document.getElementById('endTime'); // Get the endTime input element
  const dayStatusInput = document.getElementById('dayStatus'); // Get the dayStatus input element
  const totalHoursInput = document.getElementById('totalHours'); // Get the totalHours input element
  const totalCostInput = document.getElementById('totalCost'); // Get the totalCost input element

  const totalDuration = parseFloat(durationInput.value); // Get and parse total duration as a float
  const startTime = startTimeInput.value; // Get the selected start time value
  const endTime = endTimeInput.value; // Get the selected end time value
  const dayStatus = dayStatusInput.value; // Get day status (HL or HK)

  let totalHours = 0;
  let totalBiaya = 0;

  try {
    console.log(`Start Time: ${startTime}`);
    console.log(`End Time: ${endTime}`);
    console.log(`Day Status: ${dayStatus}`);
    console.log(`Duration: ${totalDuration} hours`);

    // Check if the duration is valid
    if (isNaN(totalDuration) || totalDuration <= 0) {
      console.error('Invalid duration input');
      return 0;
    }

    // Calculate total hours based on day status and total duration
    if (dayStatus === 'HL') {
      // Holiday Calculation
      if (totalDuration <= 8) {
        totalHours = totalDuration * 2;
      } else if (totalDuration <= 9) {
        totalHours = 8 * 2 + (totalDuration - 8) * 3;
      } else {
        totalHours = 8 * 2 + 1 * 3 + (totalDuration - 9) * 4;
      }
    } else if (dayStatus === 'HK') {
      // Working Day Calculation
      if (totalDuration <= 1) {
        totalHours = totalDuration * 1.5;
      } else {
        totalHours = 1 * 1.5 + (totalDuration - 1) * 2;
      }
    }

    console.log(`Total Hours: ${totalHours}`);

    // Calculate the total biaya (cost) by multiplying total hours with 22,156
    totalBiaya = totalHours * 22156;
    console.log(`Total Biaya: ${totalBiaya}`);

    // Render the total hours and total biaya to the input fields
    totalHoursInput.value = totalHours.toFixed(2); // Render total hours (fixed to 2 decimal places)
    totalCostInput.value = totalBiaya.toFixed(2); // Render total biaya (fixed to 2 decimal places)

    return totalBiaya;
  } catch (error) {
    console.error('Error in calculating total hours:', error);
    totalHoursInput.value = 0; // Set to 0 in case of error
    totalCostInput.value = 0; // Set to 0 in case of error
    return 0;
  }
}

// Initialize the function when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const initialTotalBiaya = calculateTotalBiaya();
  console.log(`Initial Total Biaya: ${initialTotalBiaya}`);

  // Add event listeners to recalculate when start time or end time change
  document.getElementById('startTime').addEventListener('change', calculateTotalBiaya);
  document.getElementById('endTime').addEventListener('change', calculateTotalBiaya);
  document.getElementById('duration').addEventListener('input', calculateTotalBiaya);
  document.getElementById('dayStatus').addEventListener('change', calculateTotalBiaya);
});
