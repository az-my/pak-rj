document.addEventListener('DOMContentLoaded', () => {
  const driverData = [
    { nama: 'NASRULLAH', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'ERDIANSYAH', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'SUNARYO', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'SYAMAUN', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'EDI DARMAWAN', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'JUNAIDI', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'AKMALUL BASYAR', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager UPT Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'YANI MULIA', unit: 'ULTG Banda Aceh', pemberiTugas: 'Manager ULTG Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'MUHAMMAD ICHSAN', unit: 'ULTG Banda Aceh', pemberiTugas: 'Manager ULTG Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'RIZAL SAPUTRA', unit: 'ULTG Meulaboh', pemberiTugas: 'Manager ULTG Meulaboh', asal: 'MEULABOH' },
    { nama: 'ROMI SAFRUDDIN', unit: 'ULTG Meulaboh', pemberiTugas: 'Manager ULTG Meulaboh', asal: 'MEULABOH' },
    { nama: 'FAISAL ANWAR', unit: 'ULTG Langsa', pemberiTugas: 'Manager ULTG Langsa', asal: 'LANGSA' },
    { nama: 'VANI AL WAHABY', unit: 'ULTG Langsa', pemberiTugas: 'Manager ULTG Langsa', asal: 'LANGSA' },
    { nama: 'UWIS KARNI', unit: 'UPT Banda Aceh', pemberiTugas: 'Manager ULTG Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'SYAHRIL', unit: 'ULTG Banda Aceh', pemberiTugas: 'Manager ULTG Banda Aceh', asal: 'BANDA ACEH' },
    { nama: 'HENDRA', unit: 'ULTG Meulaboh', pemberiTugas: 'Manager ULTG Meulaboh', asal: 'MEULABOH' },
    { nama: 'NUGRAHA RAMADHAN', unit: 'ULTG Langsa', pemberiTugas: 'Manager ULTG Langsa', asal: 'LANGSA' },
  ];

  // Sort driver data by nama alphabetically
  driverData.sort((a, b) => a.nama.localeCompare(b.nama));

  const namaDriverSelect = document.getElementById('namaDriver');
  const asalBerangkatInput = document.getElementById('asalBerangkat2');
  const unitInput = document.getElementById('unit2');
  const pemberiTugasInput = document.getElementById('pemberiTugas2');

  // Populate the Nama Driver select dropdown
  driverData.forEach((driver) => {
    const option = document.createElement('option');
    option.value = driver.nama;
    option.textContent = driver.nama;
    namaDriverSelect.appendChild(option);
  });

  // Update fields based on the selected Nama Driver
  namaDriverSelect.addEventListener('change', () => {
    const selectedDriver = namaDriverSelect.value;
    const driverInfo = driverData.find((driver) => driver.nama === selectedDriver);

    if (driverInfo) {
      asalBerangkatInput.value = driverInfo.asal;
      unitInput.value = driverInfo.unit;
      pemberiTugasInput.value = driverInfo.pemberiTugas;
    } else {
      asalBerangkatInput.value = '';
      unitInput.value = '';
      pemberiTugasInput.value = '';
    }
  });
});
