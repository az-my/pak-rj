// lembur-lembar.js

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('http://localhost:8080/api/google-sheets/lembur-lembar/');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const rawData = await response.json();
    console.log('Raw Data received:', rawData);

    // Transform raw data to extract only necessary fields with date formatting
    const transformedData = rawData.data.slice(1).map((item) => ({
      namaDriver: item[2],
      tanggalMulai: new Date(item[5]).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      hariMulai: item[6],
      jamMulai: item[10],
      tanggalSelesai: new Date(item[7]).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      hariSelesai: item[8],
      jamSelesai: item[11],
      durasiLembur: item[12],
      kegiatanLembur: item[4],
      bulanLembur: new Date(item[5]).toLocaleString('id-ID', { month: 'long' }),
    }));

    console.log('Transformed Data:', transformedData);

    // Render the transformed data into Form 1 and Form 2 layout
    const container = document.getElementById('form-container');
    container.innerHTML = '';

    transformedData.forEach((record) => {
      const formElement1 = `
            <div class="border-2 border-black bg-white rounded-lg shadow-lg p-8 mb-8">
                <div class="border-b border-black pb-4 mb-4 flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium">PT PLN (PERSERO)</p>
                        <p class="text-sm text-gray-500">UPT Banda Aceh</p>
                    </div>
                    <div class="text-sm font-medium border border-black px-4 py-2">Form FPPT-01</div>
                </div>
                <h1 class="text-lg font-bold text-center mb-6">FORMULIR PERMOHONAN PEKERJAAN TAMBAH</h1>
                <p class="text-sm mb-1 leading-relaxed">Kepada Yth.</p>
                <p class="text-sm mb-4 italic leading-relaxed">Direksi Lapangan</p>
                <p class="text-sm mb-6 leading-relaxed">
                    Sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka diharapkan kerjasamanya dapat menugaskan perusahaan dibawah ini:
                </p>
                <div class="space-y-2 text-sm">
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">1. Perusahaan</p>
                        <p class="text-center">:</p>
                        <p class="font-semibold italic">KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">2. Hari, Tgl. Mulai</p>
                        <p class="text-center">:</p>
                        <p>${record.hariMulai}, ${record.tanggalMulai}</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">&nbsp;&nbsp;&nbsp;s/d Hari, Tgl. Akhir</p>
                        <p class="text-center">:</p>
                        <p>${record.hariSelesai}, ${record.tanggalSelesai}</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">3. Waktu mulai s/d</p>
                        <p class="text-center">:</p>
                        <p>${record.jamMulai} s/d ${record.jamSelesai}</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">4. Durasi</p>
                        <p class="text-center">:</p>
                        <p>${record.durasiLembur} Jam</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">5. Untuk Kegiatan</p>
                        <p class="text-center">:</p>
                        <p>${record.kegiatanLembur}</p>
                    </div>
                </div>
                <p class="text-sm mt-6">Demikian dan terima kasih atas kerjasamanya.</p>
                <div class="flex justify-center text-center text-sm mt-8">
                    <div class="pl-96">
                        <p>Banda Aceh, 14 Desember 2024</p>
                        <p>Yang Menugaskan,</p>
                        <p>Manager</p>
                        <p>UPT BANDA ACEH</p>
                        <p class="font-bold mt-16">INDRA KURNIAWAN</p>
                    </div>
                </div>
            </div>`;

      const formElement2 = `
            <div class="border-2 border-black bg-white rounded-lg shadow-lg p-8 mb-8">
                <div class="border-b border-black pb-4 mb-4 flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium">PT PLN (PERSERO)</p>
                        <p class="text-sm text-gray-500">UPT Banda Aceh</p>
                    </div>
                    <div class="text-sm font-medium border border-black px-4 py-2">Form FPPT-02</div>
                </div>
                <h1 class="text-lg font-bold text-center mb-6">FORMULIR PERINTAH PEKERJAAN TAMBAH</h1>
                <p class="text-sm mb-1 leading-relaxed">Kepada Yth.</p>
                <p class="text-sm mb-4 italic leading-relaxed">Pimpinan/ Koordinator/ Penanggungjawab</p>
                <p class="text-sm mb-6 leading-relaxed">
                    Menunjuk Perjanjian Nomor: <span class="font-medium">0001.PJ/DAN.02.07/UPTBAC/2020</span> dan sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka diharapkan kerjasamanya untuk menyediakan layanan untuk kegiatan dimaksud pada:
                </p>
                ${formElement1.slice(formElement1.indexOf('<div class="space-y-2 text-sm">'))}
            </div>`;

      const formElement3 = `
        <div class="border-2 border-black bg-white rounded-lg shadow-lg p-8 mb-8">
            <div class="border-b border-black pb-4 mb-4 flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium">PT PLN (PERSERO)</p>
                    <p class="text-sm text-gray-500">UPT Banda Aceh</p>
                </div>
                <div class="text-sm font-medium border border-black px-4 py-2">Form FPPT-03</div>
            </div>
            <h1 class="text-lg font-bold text-center mb-6">FORMULIR PERINTAH PEKERJAAN TAMBAH</h1>
            <p class="text-sm mb-4"><span class="font-medium">Kepada Yth.</span></p>
            <p class="text-sm mb-4 italic leading-relaxed">Sdr. ${record.namaDriver}</p>
            <p class="text-sm mb-6 leading-relaxed">
                Menunjuk Perjanjian Nomor : <span class="font-medium">0001.PJ/DAN.02.07/UPTBAC/2020</span> dan
                sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka Saudara ditugaskan
                untuk melakukan kegiatan/pekerjaan dimaksud pada:
            </p>
                <div class="space-y-2 text-sm">
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">1. Perusahaan</p>
                        <p class="text-center">:</p>
                        <p class="font-semibold italic">KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">2. Hari, Tgl. Mulai</p>
                        <p class="text-center">:</p>
                        <p>${record.hariMulai}, ${record.tanggalMulai}</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">&nbsp;&nbsp;&nbsp;s/d Hari, Tgl. Akhir</p>
                        <p class="text-center">:</p>
                        <p>${record.hariSelesai}, ${record.tanggalSelesai}</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">3. Waktu mulai s/d</p>
                        <p class="text-center">:</p>
                        <p>${record.jamMulai} s/d ${record.jamSelesai}</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">4. Durasi</p>
                        <p class="text-center">:</p>
                        <p>${record.durasiLembur} Jam</p>
                    </div>
                    <div class="grid grid-cols-[1fr_auto_2fr] gap-x-1">
                        <p class="font-medium">5. Untuk Kegiatan</p>
                        <p class="text-center">:</p>
                        <p>${record.kegiatanLembur}</p>
                    </div>
                </div>
            <p class="text-sm mt-6">Demikian dan terima kasih atas kerjasamanya.</p>
            <div class="flex justify-between text-sm mt-8">
                <div class="text-center">
                    <p>Mengetahui,</p>
                    <p>MAN ULTG MEULABOH</p>
                    <p class="font-bold mt-16">ARIS DWI SANTOSO</p>
                </div>
                <div class="text-center">
                    <p>Banda Aceh, 14 Desember 2024</p>
                    <p>Yang Menugaskan/Memerintahkan,</p>
                    <p>LEADER KSO</p>
                    <p>KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</p>
                    <p class="font-bold mt-16">RIZKY NAHARDI</p>
                </div>
            </div>
        </div>`;

      container.innerHTML += formElement1;
      container.innerHTML += formElement2;
      container.innerHTML += formElement3;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
