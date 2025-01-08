// Function to format numbers with Indonesian locale, rounded, no decimals
const formatIDR = (number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0, // No decimal places
    minimumFractionDigits: 0,
    useGrouping: true, // Add thousand separators
  }).format(Math.round(number)); // Round the number
};

const fetchData = async () => {
  try {
    const response = await fetch('https://rj.up.railway.app/api/google-sheets/list');
    const result = await response.json();

    console.log('API Response:', result.data); // Debugging

    const getMonthNames = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const bulanTransaksi = `${months[month - 1]} ${year}`;
      const bulanMasukTagihan = `${months[month % 12]} ${month === 12 ? year + 1 : year}`;
      return { bulanTransaksi, bulanMasukTagihan, date };
    };

    const cleanAndConvert = (value) => {
      if (typeof value === 'string') {
        value = value.replace(/\./g, '').replace(',', '.');
      }
      return parseFloat(value) || 0;
    };

    // ✅ List of DRIVER-SEWA
    const driverSewaList = ['UWIS KARNI', 'SYAHRIL', 'HENDRA', 'NUGRAHA RAMADHAN'];

    // ✅ PejabatPemberiTugas Sorting Order
    const pejabatOrder = [
      'Manager UPT Banda Aceh',
      'Manager ULTG Banda Aceh',
      'Manager ULTG Meulaboh',
      'Manager ULTG Langsa',
    ];

    if (result.data && Array.isArray(result.data) && result.data.length > 1) {
      const dataRows = result.data.slice(1); // Skip the header row
      let currentMonth, nextMonth;

      try {
        const firstDate = dataRows[0][5]; // TanggalLembur on index 5
        ({ bulanTransaksi: currentMonth, bulanMasukTagihan: nextMonth } = getMonthNames(firstDate));
      } catch (error) {
        console.error('Date validation error:', error.message);
        throw error;
      }

      // ✅ Process the data and classify into DRIVER-TETAP and DRIVER-SEWA
      const processedData = dataRows.map((row, index) => {
        const { bulanTransaksi, bulanMasukTagihan, date } = getMonthNames(row[5]);
        const namaDriver = row[2];
        const pejabatPemberiTugas = row[4]; // Assuming PejabatPemberiTugas at index 4
        const driverType = driverSewaList.includes(namaDriver) ? 'DRIVER-SEWA' : 'DRIVER-TETAP';

        return {
          No: index + 1,
          NamaDriver: namaDriver,
          NamaHari: row[6],
          TanggalLembur: row[5],
          TanggalLemburDate: date,
          PejabatPemberiTugas: pejabatPemberiTugas,
          Unit: row[3],
          UraianPekerjaan: row[4],
          JamMulai: row[8],
          JamSelesai: row[9],
          TotalJamLembur: cleanAndConvert(row[11]),
          TotalJamBayar: cleanAndConvert(row[10]),
          UpahPerJam: cleanAndConvert(row[12]),
          TotalBiayaBayar: cleanAndConvert(row[13]),
          BulanTransaksi: currentMonth,
          BulanMasukTagihan: nextMonth,
          DriverType: driverType,
        };
      });

      // ✅ Step 1: Split into DRIVER-TETAP and DRIVER-SEWA
      let driverTetap = processedData.filter((item) => item.DriverType === 'DRIVER-TETAP');
      const driverSewa = processedData.filter((item) => item.DriverType === 'DRIVER-SEWA');

      // ✅ Step 2: Sort DRIVER-TETAP by PejabatPemberiTugas and TanggalLembur
      driverTetap = driverTetap.sort((a, b) => {
        const pejabatIndexA = pejabatOrder.indexOf(a.PejabatPemberiTugas);
        const pejabatIndexB = pejabatOrder.indexOf(b.PejabatPemberiTugas);

        // Sort by PejabatPemberiTugas order, then by TanggalLembur
        if (pejabatIndexA !== -1 && pejabatIndexB !== -1) {
          return pejabatIndexA - pejabatIndexB || a.TanggalLemburDate - b.TanggalLemburDate;
        }
        if (pejabatIndexA === -1) return 1;
        if (pejabatIndexB === -1) return -1;
        return a.TanggalLemburDate - b.TanggalLemburDate;
      });

      // ✅ Step 3: Sort DRIVER-SEWA by TanggalLembur
      driverSewa.sort((a, b) => a.TanggalLemburDate - b.TanggalLemburDate);

      // ✅ Step 4: Combine sorted data (DRIVER-TETAP first, DRIVER-SEWA second)
      const sortedData = [...driverTetap, ...driverSewa];

      // ✅ Step 5: Calculate totals
      const totalAmount = Math.ceil(sortedData.reduce((sum, row) => sum + row.TotalBiayaBayar, 0));
      const totalBiayaAdmin = Math.ceil(totalAmount * 0.05);
      const totalInvoiceWithoutTax = Math.ceil(totalAmount + totalBiayaAdmin);
      const totalPPN = Math.ceil(totalInvoiceWithoutTax * 0.11);
      const totalFinalInvoice = Math.ceil(totalInvoiceWithoutTax + totalPPN);

      // ✅ Step 6: Render calculated totals
      document.getElementById('total-amount').textContent = totalAmount.toLocaleString('id-ID');
      document.getElementById('total-biaya-admin').textContent = totalBiayaAdmin.toLocaleString('id-ID');
      document.getElementById('total-invoice-without-tax').textContent = totalInvoiceWithoutTax.toLocaleString('id-ID');
      document.getElementById('total-ppn').textContent = totalPPN.toLocaleString('id-ID');
      document.getElementById('total-final-invoice').textContent = totalFinalInvoice.toLocaleString('id-ID');
      document.getElementById('terbilang').textContent += ' ' + terbilang(totalFinalInvoice) + ' Rupiah';

      // ✅ Step 7: Render BulanTransaksi and BulanMasukTagihan
      document.querySelectorAll('#transaction-month').forEach((element) => {
        element.textContent = currentMonth;
      });
      document.querySelectorAll('#bulan-masuk-tagihan').forEach((element) => {
        element.textContent = nextMonth;
      });

      // ✅ Step 8: Render the sorted data in the table
      renderTable(sortedData, totalAmount);
    } else {
      console.error('Invalid or empty data received from API.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

function renderTable(data, totalAmount) {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = ''; // Clear existing data

  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${index + 1}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.NamaHari}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.TanggalLembur}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.NamaDriver}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.Unit}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.UraianPekerjaan}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.JamMulai}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.JamSelesai}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.TotalJamBayar}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.TotalJamLembur}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${formatIDR(row.UpahPerJam)}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-right">${formatIDR(row.TotalBiayaBayar)}</td>
            
            
        `;
    tableBody.appendChild(tr);
  });
}

/*! Copyright (c) 2016 Naufal Rabbani (https://github.com/BosNaufal/terbilang-js)
 * Licensed Under MIT (http://opensource.org/licenses/MIT)
 *
 * Version 0.0.1
 *
 * Inspired By: http://notes.rioastamal.net/2012/03/membuat-fungsi-terbilang-pada-php.html
 */

function terbilang(nilai) {
  const huruf = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];
  let temp = '';
  if (nilai < 12) {
    temp = ' ' + huruf[nilai];
  } else if (nilai < 20) {
    temp = terbilang(nilai - 10) + ' Belas';
  } else if (nilai < 100) {
    temp = terbilang(Math.floor(nilai / 10)) + ' Puluh' + terbilang(nilai % 10);
  } else if (nilai < 200) {
    temp = ' Seratus' + terbilang(nilai - 100);
  } else if (nilai < 1000) {
    temp = terbilang(Math.floor(nilai / 100)) + ' Ratus' + terbilang(nilai % 100);
  } else if (nilai < 2000) {
    temp = ' Seribu' + terbilang(nilai - 1000);
  } else if (nilai < 1000000) {
    temp = terbilang(Math.floor(nilai / 1000)) + ' Ribu' + terbilang(nilai % 1000);
  } else if (nilai < 1000000000) {
    temp = terbilang(Math.floor(nilai / 1000000)) + ' Juta' + terbilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
    temp = terbilang(Math.floor(nilai / 1000000000)) + ' Milyar' + terbilang(Math.fmod(nilai, 1000000000));
  } else if (nilai < 1000000000000000) {
    temp = terbilang(Math.floor(nilai / 1000000000000)) + ' Trilyun' + terbilang(Math.fmod(nilai, 1000000000000));
  }
  return temp;
}

// Call fetchData function when the script is loaded
fetchData();
