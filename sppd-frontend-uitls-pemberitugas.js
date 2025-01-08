document.getElementById('unit').addEventListener('change', function () {
  const pemberiTugasField = document.getElementById('pemberiTugas');
  const asalBerangkatField = document.getElementById('asalBerangkat');

  // Single array combining all data but not rendering namaPemberiTugas yet
  const unitData = {
    'ULTG BANDA ACEH': {
      pemberiTugas: 'MANAGER ULTG BANDA ACEH',
      asalBerangkat: 'BANDA ACEH',
      namaPemberiTugas: 'MUHAMMAD ISA',
    },
    'ULTG LANGSA': {
      pemberiTugas: 'MANAGER ULTG LANGSA',
      asalBerangkat: 'LANGSA',
      namaPemberiTugas: 'FIZKI FIRDAUS',
    },
    'ULTG MEULABOH': {
      pemberiTugas: 'MANAGER ULTG MEULABOH',
      asalBerangkat: 'MEULABOH',
      namaPemberiTugas: 'ARIS DWI SANTOSO',
    },
    'UPT BANDA ACEH': {
      pemberiTugas: 'MANAGER UPT BANDA ACEH',
      asalBerangkat: 'BANDA ACEH',
      namaPemberiTugas: 'INDRA KURNIAWAN',
    },
  };

  // Get the selected unit
  const selectedUnit = this.value;

  // Update the fields if the unit exists in the array, otherwise clear the fields
  if (unitData[selectedUnit]) {
    pemberiTugasField.value = unitData[selectedUnit].pemberiTugas;
    asalBerangkatField.value = unitData[selectedUnit].asalBerangkat;

    // The namaPemberiTugas is stored but not rendered yet.
    console.log('Nama Pemberi Tugas:', unitData[selectedUnit].namaPemberiTugas);
  } else {
    pemberiTugasField.value = '';
    asalBerangkatField.value = '';
  }
});
