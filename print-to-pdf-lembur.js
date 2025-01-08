document.getElementById('download123').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const element = document.getElementById('laporan');

  // High-resolution PDF settings
  const canvas = await html2canvas(element, {
    scale: 2, // High DPI for better quality
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'pt', 'legal'); // Landscape mode, legal size paper
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let yPosition = 0;

  while (yPosition < imgProps.height) {
    pdf.addImage(imgData, 'PNG', 0, yPosition * -1, pdfWidth, pdfHeight);
    yPosition += pdf.internal.pageSize.getHeight();
    if (yPosition < imgProps.height) {
      pdf.addPage();
    }
  }

  pdf.save('Rekap_Lembur_PLN.pdf');
});
