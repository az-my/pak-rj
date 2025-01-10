document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const startTimeField = document.getElementById('startTime');
  const endTimeField = document.getElementById('endTime');
  const overtimeDateField = document.getElementById('overtimeDate');
  const dayStatusField = document.getElementById('dayStatus');
  const endDateField = document.getElementById('overtimeEndDate'); // "Tanggal Selesai Lembur"

  // API URL and public holidays data
  const apiUrl = 'https://dayoffapi.vercel.app/api?year=2024';
  let publicHolidays = [];

  // Fetch public holidays from API
  const fetchPublicHolidays = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      publicHolidays = data.map((holiday) => holiday.tanggal);
    } catch (error) {
      console.error('Failed to fetch public holidays:', error);
    }
  };

  // Check if the date is a weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  // Check if the date is a public holiday
  const isPublicHoliday = (dateString) => publicHolidays.includes(dateString);

  // Format date as dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    return `${day}/${month}/${date.getFullYear()}`;
  };

  // Generate time options in the format hh:mm for a given range
  const generateTimeOptions = (start, end, step = 30) => {
    const options = [];
    for (let minutes = start; minutes <= end; minutes += step) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      options.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }
    return options;
  };

  // Set start time options based on day status (HK or HL)
  const setStartTimeOptions = (dayStatus) => {
    if (!startTimeField) return;

    const minStartTime = dayStatus === 'HK' ? 17 * 60 : 0;
    const maxStartTime = 24 * 60;
    const startOptions = generateTimeOptions(minStartTime, maxStartTime);

    startTimeField.innerHTML = ''; // Clear previous options
    startOptions.forEach((time) => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      startTimeField.appendChild(option);
    });
  };

  // Set end time options based on start time and day status
  const setEndTimeOptions = (startTime, dayStatus) => {
    if (!endTimeField) return;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;

    let maxRange;
    if (dayStatus === 'HK') {
      maxRange = Math.min(4 * 60, 24 * 60 - startMinutes);
    } else if (dayStatus === 'HL') {
      maxRange = Math.min(12 * 60, 24 * 60 - startMinutes);
    } else {
      maxRange = 12 * 60;
    }

    const maxEndTime = Math.min(startMinutes + maxRange, 24 * 60);
    const endOptions = generateTimeOptions(startMinutes + 30, maxEndTime);

    endTimeField.innerHTML = ''; // Clear previous options
    endOptions.forEach((time) => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      endTimeField.appendChild(option);
    });
  };

  // Determine the day status (HL or HK) based on selected date
  const handleDayStatus = (selectedDate) => {
    const dayStatus = isWeekend(selectedDate) || isPublicHoliday(selectedDate) ? 'HL' : 'HK';
    if (dayStatusField) {
      dayStatusField.value = dayStatus;
    }
    return dayStatus;
  };

  // Event listener for "Tanggal Mulai Lembur" (Start Date)
  if (overtimeDateField && dayStatusField) {
    overtimeDateField.addEventListener('change', async (event) => {
      const selectedDate = event.target.value;

      if (selectedDate) {
        if (publicHolidays.length === 0) {
          await fetchPublicHolidays();
        }

        const dayStatus = handleDayStatus(selectedDate); // Set the day status
        setStartTimeOptions(dayStatus); // Set start time options based on day status
      } else {
        if (dayStatusField) dayStatusField.value = '';
        if (startTimeField) startTimeField.innerHTML = '';
        if (endTimeField) endTimeField.innerHTML = '';
      }
    });
  }

  // Event listener for start time change
  if (startTimeField && endTimeField) {
    startTimeField.addEventListener('change', (event) => {
      const selectedStartTime = event.target.value;
      const dayStatus = dayStatusField.value;

      if (selectedStartTime && dayStatus) {
        setEndTimeOptions(selectedStartTime, dayStatus); // Set end time options based on start time and day status
      }
    });
  }

  // Fetch public holidays initially
  fetchPublicHolidays();
});
