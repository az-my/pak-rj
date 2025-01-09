// handle-lembar-lembur.js

export async function generatePDF() {
  const container = document.getElementById('form-container');
  const recordWrappers = container.querySelectorAll('.record-wrapper');
  const tempPDFs = []; // Store PDFs before merging

  for (let index = 0; index < recordWrappers.length; index++) {
    const element = recordWrappers[index];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.outerHTML;
    document.body.appendChild(tempDiv);

    if (index === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      console.log(`Generating PDF for record ${index + 1}`);
      const pdfBlob = await html2pdf()
        .from(tempDiv)
        .set({
          margin: [10, 10, 10, 10],
          filename: `record-${index + 1}.pdf`,
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'legal', orientation: 'portrait' },
        })
        .toPdf()
        .outputPdf('blob');

      tempPDFs.push(pdfBlob);
    } catch (pdfError) {
      console.error(`Error generating PDF for record ${index + 1}:`, pdfError);
    }

    document.body.removeChild(tempDiv);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const mergedPDF = await combinePDFs(tempPDFs);

  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(mergedPDF);
  downloadLink.download = 'combined-records.pdf';
  downloadLink.click();
}

export async function combinePDFs(pdfBlobs) {
  const pdfLib = PDFLib.PDFDocument;
  const mergedPdf = await pdfLib.create();

  for (const pdfBlob of pdfBlobs) {
    const pdf = await pdfLib.load(await pdfBlob.arrayBuffer());
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}
