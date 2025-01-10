document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://dayoffapi.vercel.app/api?year=2024'; // API for public holidays
  let publicHolidays = []; // Array to hold public holidays

  // Fetch public holidays from API
  const fetchPublicHolidays = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      publicHolidays = data.map((holiday) => holiday.tanggal); // Extract holiday dates
    } catch (error) {
      console.error('Failed to fetch public holidays:', error);
    }
  };

  // Check if the date is a weekend (Saturday or Sunday)
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 0 || date.getDay() === 6; // 0 = Sunday, 6 = Saturday
  };

  // Check if the date is a public holiday
  const isPublicHoliday = (dateString) => publicHolidays.includes(dateString);

  // Function to get the day name in Indonesian
  const getDayNameInIndonesian = (dateString) => {
    const date = new Date(dateString);
    // Get the full day name in Indonesian
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
    return dayName;
  };

  // Function to determine the type of day (Weekend or Public Holiday)
  const determineDayType = async (selectedDate) => {
    if (!selectedDate) return; // If no date is selected, return

    // Fetch public holidays if they are not already fetched
    if (publicHolidays.length === 0) {
      await fetchPublicHolidays();
    }

    const isWeekendDay = isWeekend(selectedDate);
    const isHoliday = isPublicHoliday(selectedDate);

    let dayType = 'HK'; // Default is 'HK' (Hari Kerja / Workday)

    // Check if the selected date is either a weekend or public holiday
    if (isWeekendDay || isHoliday) {
      dayType = 'HL'; // HL = Hari Libur (Holiday)
    }

    // Log the results (you can use these values to update the UI or for other logic)
    const dayNameIndonesian = getDayNameInIndonesian(selectedDate); // Get the day name in Indonesian
    console.log('Selected Date: ', selectedDate);
    console.log('Day Name in Indonesian: ', dayNameIndonesian);
    console.log('Is Weekend? ', isWeekendDay);
    console.log('Is Public Holiday? ', isHoliday);
    console.log('Determined Day Type: ', dayType); // 'HL' for holiday, 'HK' for workday

    return dayType; // Return the determined day type (HL or HK)
  };

  // Event listener for "Tanggal Mulai Lembur" (Start Date)
  const overtimeDateField = document.getElementById('overtimeDate');
  if (overtimeDateField) {
    overtimeDateField.addEventListener('change', async (event) => {
      const selectedDate = event.target.value; // Get the selected date (yyyy-mm-dd format)
      const dayType = await determineDayType(selectedDate); // Determine if it's a weekend or holiday

      // Optionally, you can update the UI based on the result
      const dayStatusField = document.getElementById('dayStatus');
      const dayNameField = document.getElementById('dayName'); // You can add a field to display the day name

      if (dayStatusField) {
        dayStatusField.value = dayType; // Set the value of the day status field (HL or HK)
      }

      if (dayNameField) {
        dayNameField.textContent = `Hari: ${getDayNameInIndonesian(selectedDate)}`; // Display the day name in Indonesian
      }
    });
  }

  // Fetch public holidays initially
  fetchPublicHolidays();
});
