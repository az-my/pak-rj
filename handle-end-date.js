function onEndTimeChange() {
  const startTimeInput = document.getElementById('startTime'); // Get the startTime input element
  const startDateInput = document.getElementById('overtimeDate'); // Get the startDate input element
  const endTimeInput = document.getElementById('endTime'); // Get the endTime input element
  const overtimeEndDateInput = document.getElementById('overtimeEndDate'); // Get the overtimeEndDate input element

  // Add event listener for change event on the endTime input
  endTimeInput.addEventListener('change', () => {
    const startTime = startTimeInput.value; // Get the selected start time value
    const startDate = startDateInput.value; // Get the selected start date value
    let endTime = endTimeInput.value; // Get the selected end time value

    // Ensure the end time is in hh:mm format (fix if necessary)
    endTime = fixTimeFormat(endTime);

    console.log('Selected Start Time:', startTime);
    console.log('Selected Start Date:', startDate);
    console.log('Selected End Time:', endTime);

    try {
      // Use dayjs to handle the time conversion and calculation
      const startDateTime = dayjs(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
      const endDateTime = dayjs(`${startDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

      // Check if end time is larger than start time (same day) or not (next day)
      let dayType = '';
      if (endDateTime.isAfter(startDateTime)) {
        dayType = 'Same Day';
        overtimeEndDateInput.value = startDate; // Same day, set end date same as start date
      } else {
        dayType = 'Next Day';
        const nextDay = startDateTime.add(1, 'day'); // Add 1 day for next day
        overtimeEndDateInput.value = nextDay.format('YYYY-MM-DD'); // Format the next day to YYYY-MM-DD
      }

      console.log('Day Type:', dayType);
      console.log('Overtime End Date:', overtimeEndDateInput.value);
    } catch (error) {
      console.error('Invalid time format:', error);
      overtimeEndDateInput.value = ''; // Clear the end date input on error
    }
  });
}

// Function to fix the time format if it's in h:mm format
function fixTimeFormat(time) {
  // Check if time is in h:mm format (length 4, e.g., 3:30)
  if (time.length === 4) {
    // Add leading zero to hour part if needed (e.g., "3:30" -> "03:30")
    time = '0' + time; // Ensure it becomes "03:30"
  }

  // Ensure the format is correct (e.g., "03:30")
  return time;
}

// Initialize the function to watch for changes
onEndTimeChange();
