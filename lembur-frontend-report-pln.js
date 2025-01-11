// Function to format numbers with Indonesian locale, rounded, no decimals
const formatIDR = (number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0, // No decimal places
    minimumFractionDigits: 0,
    useGrouping: true, // Add thousand separators
  }).format(Math.round(number)); // Round the number
};

const formatIDRWithDecimal = (number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2, // No decimal places
    minimumFractionDigits: 2,
    useGrouping: true, // Add thousand separators
  }).format(Math.round(number)); // Round the number
};

const formatKoma = (number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1, // No decimal places
    minimumFractionDigits: 1,
    useGrouping: true, // Add thousand separators
  }).format(Math.round(number)); // Round the number
};

const formatKoma2 = (number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1, // No decimal places
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

    const driverSewaList = ['UWIS KARNI', 'SYAHRIL', 'HENDRA', 'NUGRAHA RAMADHAN'];
    const pejabatOrder = ['UPT BANDA ACEH', 'ULTG BANDA ACEH', 'ULTG MEULABOH', 'ULTG LANGSA'];

    const publicHolidays = ['25/12/2024', '26/12/2024']; // Public holidays list
    const weekendDays = ['Saturday', 'Sunday']; // Weekend days

    const getDayOfWeek = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()]; // Return day name (e.g., "Monday")
    };

    if (result.data && Array.isArray(result.data) && result.data.length > 1) {
      const dataRows = result.data.slice(1);
      let currentMonth, nextMonth;

      try {
        const firstDate = dataRows[0][5];
        ({ bulanTransaksi: currentMonth, bulanMasukTagihan: nextMonth } = getMonthNames(firstDate));
      } catch (error) {
        console.error('Date validation error:', error.message);
        throw error;
      }

      const processedData = dataRows.map((row, index) => {
        const { bulanTransaksi, bulanMasukTagihan, date } = getMonthNames(row[5]);
        const namaDriver = row[2];
        const pejabatPemberiTugas = row[3];
        console.log(pejabatPemberiTugas);
        const driverType = driverSewaList.includes(namaDriver) ? 'DRIVER-SEWA' : 'DRIVER-TETAP';

        // Extract the overtime end date (index 14) and format it in Indonesian format
        const overtimeEndDate = row[14];
        // const formattedOvertimeEndDate = dayjs(overtimeEndDate, 'YYYY-MM-DD').format('DD/MM/YYYY'); // Format the overtime end date

        // Check if the Tanggal Lembur and Overtime End Date are different
        const isPastMidnight = row[5] !== overtimeEndDate;

        const record = {
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
          TotalJamLembur: cleanAndConvert(row[10]),
          TotalJamBayar: cleanAndConvert(row[11]),
          UpahPerJam: cleanAndConvert(row[12]),
          TotalBiayaBayar: cleanAndConvert(row[13]),
          BulanTransaksi: bulanTransaksi,
          BulanMasukTagihan: bulanMasukTagihan,
          DriverType: driverType,
          statusHari: row[7],
          OvertimeEndDate: overtimeEndDate, // Add formatted overtime end date
          PastMidnight: isPastMidnight, // Mark as Past Midnight if the dates are different
        };

        // If it passed midnight, split into two records and determine day type (HK or HL)
        if (isPastMidnight) {
          // Determine if Tanggal Lembur is a public holiday or weekend
          const dayOfWeek = getDayOfWeek(row[5]);
          const isPublicHoliday = publicHolidays.includes(row[5]);
          const dayStatus = isPublicHoliday || weekendDays.includes(dayOfWeek) ? 'HL' : 'HK';

          // First record: Use Tanggal Lembur as Tanggal Transaksi and set Jam Selesai to 24:00
          const firstRecord = {
            ...record,
            TanggalLembur: row[5], // Same as Tanggal Lembur
            JamMulai: row[8], // Same as Jam Mulai
            JamSelesai: '24:00', // Set to the last hour of the day
            DayStatus: dayStatus, // Set the day status for the first record
          };

          // Calculate duration for the first record (from JamMulai to 24:00)
          const firstDuration = calculateDuration(firstRecord.JamMulai, '24:00');
          firstRecord.TotalJamLembur = firstDuration;

          // Update TotalJamBayar for the first record based on the day status and duration
          firstRecord.TotalJamBayar = calculateTotalJamBayar(firstDuration, dayStatus);

          // Update TotalBiayaBayar for the first record (TotalJamBayar * UpahPerJam)
          firstRecord.TotalBiayaBayar = firstRecord.TotalJamBayar * firstRecord.UpahPerJam;

          // Second record: Use Overtime End Date as Tanggal Transaksi and set Jam Mulai to 00:00
          const secondRecord = {
            ...record,
            TanggalLembur: overtimeEndDate, // Use Overtime End Date
            JamMulai: '00:00', // Set Jam Mulai to 00:00
            JamSelesai: row[9], // Same as Jam Selesai from the API
            DayStatus: dayStatus, // Set the day status for the second record
          };

          // Calculate duration for the second record (from 00:00 to JamSelesai)
          const secondDuration = calculateDuration('00:00', secondRecord.JamSelesai);
          secondRecord.TotalJamLembur = secondDuration;

          // Update TotalJamBayar for the second record based on the day status and duration
          secondRecord.TotalJamBayar = calculateTotalJamBayar(secondDuration, dayStatus);
          // Update TotalBiayaBayar for the second record (TotalJamBayar * UpahPerJam)
          secondRecord.TotalBiayaBayar = secondRecord.TotalJamBayar * secondRecord.UpahPerJam;
          // Log both records for now
          console.log('First Record (Past Midnight):', firstRecord);
          console.log('Second Record (Past Midnight):', secondRecord);

          return [firstRecord, secondRecord]; // Return both records
        }

        // If no past midnight, just return the original record
        console.log('Original Record (No Past Midnight):', record);
        return [record]; // Return the single record
      });

      // Flatten the array to combine all records
      const finalData = processedData.flat();

      console.log('Processed Data (including split records):', finalData);

      // First, group by PejabatPemberiTugas and sort within that group
      const groupedByPejabat = finalData
        .sort((a, b) => {
          const pejabatIndexA = pejabatOrder.indexOf(a.PejabatPemberiTugas);
          const pejabatIndexB = pejabatOrder.indexOf(b.PejabatPemberiTugas);
          return pejabatIndexA - pejabatIndexB;
        })
        .reduce((acc, item) => {
          acc[item.PejabatPemberiTugas] = acc[item.PejabatPemberiTugas] || [];
          acc[item.PejabatPemberiTugas].push(item);
          return acc;
        }, {});

      // Now, within each group of PejabatPemberiTugas, group by NamaDriver and sort by TanggalLembur
      const groupedData = Object.values(groupedByPejabat).map((group) => {
        return group.reduce((acc, item) => {
          acc[item.NamaDriver] = acc[item.NamaDriver] || [];
          acc[item.NamaDriver].push(item);
          return acc;
        }, {});
      });

      // Convert grouped data back to array and sort by TanggalLembur within each group of NamaDriver
      const sortedData = groupedData
        .flatMap((driverGroup) => {
          return Object.values(driverGroup).map((driverItems) => {
            return driverItems.sort((a, b) => {
              return new Date(a.TanggalLemburDate) - new Date(b.TanggalLemburDate);
            });
          });
        })
        .flat();

      console.log('Sorted Data:', sortedData);

      // ✅ Separate DRIVER-TETAP and DRIVER-SEWA and sort by their order
      const driverTetap = sortedData.filter((item) => item.DriverType === 'DRIVER-TETAP');
      const driverSewa = sortedData.filter((item) => item.DriverType === 'DRIVER-SEWA');

      console.log('DRIVER-TETAP:', driverTetap);
      console.log('DRIVER-SEWA:', driverSewa);

      const finalSortedData = [...driverTetap, ...driverSewa];

      // ✅ Calculate Totals
      const totalAmount = Math.ceil(finalSortedData.reduce((sum, row) => sum + row.TotalBiayaBayar, 0));
      const totalBiayaAdmin = Math.ceil(totalAmount * 0.05);
      const totalInvoiceWithoutTax = Math.ceil(totalAmount + totalBiayaAdmin);
      const totalTagihanWithoutTax = totalInvoiceWithoutTax;
      const totalPPN = Math.ceil(totalInvoiceWithoutTax * 0.11);
      const totalFinalInvoice = Math.ceil(totalInvoiceWithoutTax + totalPPN);

      document.getElementById('total-amount').textContent = totalAmount.toLocaleString('id-ID');
      document.getElementById('total-biaya-admin').textContent = totalBiayaAdmin.toLocaleString('id-ID');
      document.getElementById('total-invoice-without-tax').textContent = totalInvoiceWithoutTax.toLocaleString('id-ID');
      document.getElementById('total-tagihan-without-tax').textContent = totalInvoiceWithoutTax.toLocaleString('id-ID');
      document.getElementById('total-ppn').textContent = totalPPN.toLocaleString('id-ID');
      document.getElementById('total-final-invoice').textContent = totalFinalInvoice.toLocaleString('id-ID');
      document.getElementById('terbilang').textContent += ' ' + terbilang(totalFinalInvoice) + ' Rupiah';

      document.querySelectorAll('#transaction-month').forEach((element) => {
        element.textContent = currentMonth;
      });
      document.querySelectorAll('#bulan-masuk-tagihan').forEach((element) => {
        element.textContent = nextMonth;
      });

      // ✅ Render sorted data to the table
      renderTable(finalSortedData, totalAmount);
    } else {
      console.error('Invalid or empty data received from API.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

// Helper function to calculate the duration between two times
const calculateDuration = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startDate = new Date(1970, 0, 1, startHour, startMinute);
  const endDate = new Date(1970, 0, 1, endHour, endMinute);

  const durationInMilliseconds = endDate - startDate;

  // Return the duration in hours (including minutes as a decimal)
  return durationInMilliseconds / (1000 * 60 * 60);
};

// Helper function to calculate total jam bayar
const calculateTotalJamBayar = (totalDuration, dayStatus) => {
  let totalHours = 0;

  if (dayStatus === 'HL') {
    // Holiday Calculation
    if (totalDuration <= 8) {
      totalHours = totalDuration * 2;
    } else if (totalDuration <= 9) {
      totalHours = 8 * 2 + (totalDuration - 8) * 3;
    } else {
      totalHours = 8 * 2 + 1 * 3 + (totalDuration - 9) * 4;
    }
  } else if (dayStatus === 'HK') {
    // Working Day Calculation
    if (totalDuration <= 1) {
      totalHours = totalDuration * 1.5;
    } else {
      totalHours = 1 * 1.5 + (totalDuration - 1) * 2;
    }
  }

  return totalHours;
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
            <td class="border border-gray-500 px-2 py-1  w-auto text-center break-words">${row.UraianPekerjaan}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.JamMulai}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.JamSelesai}</td>
           

            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${formatKoma(row.TotalJamLembur)}</td>
             <td class="border border-gray-500 w-auto text-center">${String(row.TotalJamBayar).replace('.', ',')}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${formatIDRWithDecimal(
              row.UpahPerJam
            )}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-right">${formatIDR(row.TotalBiayaBayar)}</td>
            
            ${
              row.statusHari === 'HL'
                ? `<td class="border border-gray-500 px-2 py-1 w-auto text-center">${row.statusHari}</td>`
                : '<td class="border border-gray-500 px-2 py-1 w-auto text-center"></td>'
            }

            
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
