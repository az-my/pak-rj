// Function to handle the start time and end time change, and log the duration
function onTimeChange() {
  const startTimeInput = document.getElementById('startTime'); // Get the startTime input element
  const endTimeInput = document.getElementById('endTime'); // Get the endTime input element

  // Add event listener for change event on the endTime input
  endTimeInput.addEventListener('change', () => {
    const startTime = startTimeInput.value; // Get the selected start time value
    const endTime = endTimeInput.value; // Get the selected end time value

    // Log the selected start time and end time
    console.log('Selected Start Time:', startTime);
    console.log('Selected End Time:', endTime);

    // Calculate the time difference
    const duration = calculateTimeDifference(startTime, endTime);
    const durationElement = document.getElementById('duration'); // Get the duration element
    durationElement.value = duration; // Set the value of the duration element
    console.log('Time Difference (in hours):', duration);
  });
}

// Function to calculate the time difference in hours, accounting for midnight
function calculateTimeDifference(startTime, endTime) {
  // Create Date objects for both start and end times
  const startHour = parseInt(startTime.split(':')[0], 10);
  const startMinute = parseInt(startTime.split(':')[1], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  const endMinute = parseInt(endTime.split(':')[1], 10);

  // Create Date objects for both start and end times
  const startDateTime = new Date('1970-01-01');
  startDateTime.setHours(startHour);
  startDateTime.setMinutes(startMinute);

  const endDateTime = new Date('1970-01-01');
  if (endHour < startHour) {
    // If the end time is before the start time, it means it's past midnight
    endDateTime.setDate(2); // Increment
  }
  endDateTime.setHours(endHour);
  endDateTime.setMinutes(endMinute);

  const diffInHours = dayjs(endDateTime).diff(dayjs(startDateTime), 'hour', true);
  return diffInHours;
}

// Initialize the function
onTimeChange();
