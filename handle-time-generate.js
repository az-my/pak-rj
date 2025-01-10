// dayStatus.js

// Debugging, keeping it chill
console.log('Overtime Start Time Listener is ON 🔥');

// Wait for everything to load
document.addEventListener('DOMContentLoaded', () => {
  const overtimeDateInput = document.getElementById('overtimeDate');
  const dayStatusInput = document.getElementById('dayStatus');
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');

  if (overtimeDateInput && dayStatusInput && startTimeInput && endTimeInput) {
    overtimeDateInput.addEventListener('change', () => {
      const overtimeStartDate = overtimeDateInput.value;
      const dayStatus = dayStatusInput.value;

      if (!overtimeStartDate) {
        console.log('Pick a start date first! 🛑');
        alert('Pick a start date!');
      } else {
        console.log(`Start Date: ${overtimeStartDate} | Status: ${dayStatus}`);
        populateStartTimeDropdown(dayStatus);
      }
    });

    startTimeInput.addEventListener('change', () => {
      const startTime = startTimeInput.value;
      const dayStatus = dayStatusInput.value;
      console.log(`Start Time Set: ${startTime}`);
      if (startTime && dayStatus) {
        populateEndTimeDropdown(startTime, dayStatus);
      }
    });

    console.log('Ready to go!');
  } else {
    console.log('Missing some inputs 🤔');
  }
});

// Populating start time options
function populateStartTimeDropdown(dayStatus) {
  const startTimeInput = document.getElementById('startTime');
  startTimeInput.innerHTML = '';

  let startTimeOptions = [];

  if (dayStatus === 'HK') {
    startTimeOptions = generateTimeOptions('17:00', '24:00', 30, true);
  } else if (dayStatus === 'HL') {
    startTimeOptions = generateTimeOptions('00:00', '23:30', 30, false);
  }

  startTimeOptions.forEach((time) => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    startTimeInput.appendChild(option);
  });

  console.log('Start times:', startTimeOptions);
}

// Populating end time options
function populateEndTimeDropdown(startTime, dayStatus) {
  const endTimeInput = document.getElementById('endTime');
  endTimeInput.innerHTML = '';

  let endTimeOptions = [];
  const startHour = parseInt(startTime.split(':')[0]);
  const startMinute = parseInt(startTime.split(':')[1]);
  let start = new Date(`1970-01-01`); // Use JavaScript Date object
  start.setHours(startHour);
  start.setMinutes(startMinute);

  // Add 30 minutes to the start time to set the minimum end time
  start.setMinutes(start.getMinutes() + 30);

  let maxTime;
  let maxInterval = 30;

  // Correctly handle end time logic
  console.log(`Day Status: ${dayStatus}`);
  if (dayStatus === 'HL') {
    // HL: Max end time is 12 hours from the start
    maxTime = new Date(start.getTime() + 12 * 60 * 60 * 1000); // Add 12 hours
  } else if (dayStatus === 'HK') {
    // HK: Max end time is 4 hours from the start
    maxTime = new Date(start.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours
  }

  console.log(`Max Time for End Time: ${maxTime.getHours()}:${maxTime.getMinutes()}`);

  // Generate end time options from the updated start time (30 minutes after) to the max time
  endTimeOptions = generateTimeOptions(formatTime(start), formatTime(maxTime), maxInterval, false);

  endTimeOptions.forEach((time) => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    endTimeInput.appendChild(option);
  });

  console.log('End times:', endTimeOptions);
}

// Format time to hh:mm (ensures two-digit format)
function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Function to generate time options in 30-minute intervals using JavaScript Date
function generateTimeOptions(start, end, interval, isHK) {
  const options = [];
  const startHour = parseInt(start.split(':')[0]);
  const startMinute = parseInt(start.split(':')[1]);
  const endHour = parseInt(end.split(':')[0]);
  const endMinute = parseInt(end.split(':')[1]);

  let startTime = new Date('1970-01-01');
  startTime.setHours(startHour);
  startTime.setMinutes(startMinute);

  let endTime = new Date('1970-01-01');
  if (startHour >= 20) {
    endTime.setDate(endTime.getDate() + 1);
  }
  endTime.setHours(endHour);
  endTime.setMinutes(endMinute);

  console.log(`Generating times from ${startTime} to ${endTime}`);

  while (startTime <= endTime) {
    let time = formatTime(startTime);

    options.push(time);

    // Add interval in minutes
    startTime.setMinutes(startTime.getMinutes() + interval);
  }

  return options;
}

// Format the time as HH:mm using JavaScript's default formatting
function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  console.log(`Formatting time: ${date} ${hours}:${minutes}`);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
}
