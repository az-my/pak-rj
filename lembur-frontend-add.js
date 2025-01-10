const API_ADD = 'https://rj.up.railway.app/api/google-sheets/add';

const form = document.getElementById('overtimeForm');
const alertContainer = document.getElementById('alert-container');
const alert = document.getElementById('alert');
const alertTitle = document.getElementById('alert-title');
const alertMessage = document.getElementById('alert-message');
const closeAlert = document.getElementById('close-alert');

// Function to show alert
function showAlert(type, title, message) {
  alertTitle.textContent = title;
  alertMessage.textContent = message;

  // Apply color scheme based on alert type
  if (type === 'success') {
    alert.className = 'max-w-sm w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative';
  } else if (type === 'error') {
    alert.className = 'max-w-sm w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative';
  }

  // Show alert
  alertContainer.classList.remove('hidden');

  // Auto-hide alert after 3 seconds
  setTimeout(() => {
    alertContainer.classList.add('hidden');
  }, 3000);
}

// Close alert manually
closeAlert.addEventListener('click', () => {
  alertContainer.classList.add('hidden');
});

// Form submission event
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  // Retrieve form data
  const data = {
    name: formData.get('name'),
    unit: document.getElementById('unit').value,
    description: formData.get('jobDescription'),
    date: formData.get('overtimeDate'),
    day: document.getElementById('day').value,
    day_status: document.getElementById('dayStatus').value,
    start_time: formData.get('startTime'),
    end_time: formData.get('endTime'),
    duration_hours: document.getElementById('duration').value,
    total_hours: document.getElementById('totalHours').value,
    hourly_rate: document.getElementById('hourlyWage').value,
    total_cost: document.getElementById('totalCost').value,
    overtimeEndDate: document.getElementById('overtimeEndDate').value,
  };

  console.log('Submitted Data:', JSON.stringify(data, null, 2));

  try {
    const response = await fetch(API_ADD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(await response.text());

    const responseData = await response.json();
    console.log('Backend Response Data:', JSON.stringify(responseData, null, 2));

    // Clear form and show success alert
    form.reset();
    showAlert('success', 'Success', 'Entry added successfully!');

    // Optional: Refresh data if fetchData is defined
    if (typeof fetchData === 'function') {
      fetchData();
    }
  } catch (error) {
    console.error('Submission Error:', error.message);

    // Show error alert
    showAlert('error', 'Error', error.message);
  }
});
