document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const overtimeDateField = document.getElementById('overtimeDate');
  const endDateField = document.getElementById('overtimeEndDate'); // "Tanggal Selesai Lembur"

  // Function to format date as yyyy-mm-dd (correct format for date input)
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, adding 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Ensure yyyy-mm-dd format
  };

  // Function to handle the population of date restrictions (previous month)
  const handleDatePopulation = () => {
    const today = new Date();
    const previousMonth = new Date(today);
    previousMonth.setMonth(previousMonth.getMonth() - 1); // Move to previous month

    // First day of the previous month
    const minStartDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);

    // Last day of the previous month
    const maxStartDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);

    // Set the min and max attributes for the date input field
    overtimeDateField.min = formatDateForInput(minStartDate);
    overtimeDateField.max = formatDateForInput(maxStartDate);

    // Optionally, set the selected date to the last day of the previous month (if needed)
    overtimeDateField.value = formatDateForInput(maxStartDate); // raw date in yyyy-mm-dd format
  };

  // Event listener to log both current date and raw selected date (yyyy-mm-dd format)
  if (overtimeDateField) {
    overtimeDateField.addEventListener('change', (event) => {
      const selectedDate = event.target.value; // Raw value of the date selected
      const currentDate = new Date(); // Get current date

      // Log the raw current date in yyyy-mm-dd format
      console.log('Raw Current Date: ', formatDateForInput(currentDate)); // Raw date format

      // Log the raw selected date
      console.log('Raw Selected Date: ', selectedDate); // Raw value from the date picker (yyyy-mm-dd)

      // Set the min value of the end date to be the same as the selected start date
      if (selectedDate && endDateField) {
        endDateField.min = selectedDate; // Same as start date (min end date)

        // Get the selected start date as a Date object
        const startDate = new Date(selectedDate);

        // Calculate the next day for max end date
        startDate.setDate(startDate.getDate() + 1); // Increment by 1 day to get the next day

        // Set the max value of the end date to the next day of the selected start date
        endDateField.max = formatDateForInput(startDate);

        // Log the min and max end date for debugging
        console.log('Min End Date: ', selectedDate); // Log the min end date for debugging
        console.log('Max End Date: ', endDateField.max); // Log the max end date for debugging
      }
    });
  }

  // Event listener to log the selected end date
  if (endDateField) {
    endDateField.addEventListener('change', (event) => {
      const selectedEndDate = event.target.value; // Raw value of the selected end date
      console.log('Selected End Date: ', selectedEndDate); // Log the selected end date (yyyy-mm-dd format)
    });
  }

  // Initialize the date picker to restrict to the previous month
  handleDatePopulation();
});
