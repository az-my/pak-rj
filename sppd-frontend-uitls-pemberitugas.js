document.getElementById('unit').addEventListener('change', function () {
  const pemberiTugasField = document.getElementById('pemberiTugas');

  // Define the mapping for unit and pemberiTugas values
  const pemberiTugasMapping = {
    'ULTG BANDA ACEH': 'MANAGER UTLG BANDA ACEH',
    'ULTG LANGSA': 'MANAGER UTLG LANGSA',
    'ULTG MEULABOH': 'MANAGER UTLG MEULABOH',
    'UPT BANDA ACEH': 'MANAGER UPT BANDA ACEH',
  };

  // Get the selected unit
  const selectedUnit = this.value;

  // Set the corresponding pemberiTugas value or clear the field if no match
  pemberiTugasField.value = pemberiTugasMapping[selectedUnit] || '';
});
