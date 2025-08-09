
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Invoice } from './constants';

export function generateInvoicePdf(invoice: Invoice) {
    const doc = new jsPDF();

    // Theme Colors
    const primaryColor = '#89B7E5';
    const headingColor = '#2d3748';
    const textColor = '#4a5568';
    const borderColor = '#CBD5E0';

    // Fonts
    doc.setFont('times', 'normal');

    // Ornate Border
    doc.setDrawColor(borderColor);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287); 
    doc.setLineWidth(0.5);
    doc.rect(8, 8, 194, 281);

    // Header
    doc.setFontSize(26);
    doc.setFont('times', 'bold');
    doc.setTextColor(headingColor);
    doc.text('Careflux Hospital', 105, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    doc.text('No 35 Lamido Cresent Kano State.', 105, 33, { align: 'center' });

    // Invoice Title & Details
    doc.setFontSize(22);
    doc.setFont('times', 'bold');
    doc.setTextColor(headingColor);
    doc.text('INVOICE', 14, 55);

    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    doc.text(`Invoice #: ${invoice.id}`, 200, 50, { align: 'right' });
    doc.text(`Date Issued: ${format(new Date(), 'yyyy-MM-dd')}`, 200, 56, { align: 'right' });

    // Patient Information
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.setTextColor(headingColor);
    doc.text('BILL TO:', 14, 70);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(textColor);
    doc.text(invoice.patientName, 14, 76);
    if (invoice.doctorName) {
        doc.text(`C/O ${invoice.doctorName}`, 14, 82);
    }

    // Billed Items Table
    const tableData = invoice.items.map(item => [
        item.name,
        item.type,
        `₦${item.price.toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 90,
        head: [['Item Description', 'Type', 'Price']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 12,
            font: 'times',
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: 3,
        },
        styles: {
            fontSize: 10,
            font: 'times',
            cellPadding: 3,
            lineColor: borderColor,
            lineWidth: 0.1
        },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'right' }
        },
        didDrawPage: (data) => {
            const tableEndY = (data.cursor as { y: number }).y;
            
            // Totals Section
            const summaryX = 130;
            const summaryY = tableEndY + 10;
            const summaryWidth = 70;
            
            doc.setFontSize(12);
            doc.setFont('times', 'bold');
            doc.setTextColor(headingColor);

            doc.text('Total Amount:', summaryX, summaryY + 8);
            doc.text(`₦${invoice.amount.toFixed(2)}`, summaryX + summaryWidth - 4, summaryY + 8, { align: 'right' });

            doc.setDrawColor(borderColor);
            doc.line(summaryX, summaryY + 12, summaryX + summaryWidth -4, summaryY + 12);

            // Due Date & Status
            doc.setFontSize(11);
            doc.setFont('times', 'bold');
            doc.text('Payment Details', 14, summaryY);
            
            doc.setFont('times', 'normal');
            doc.text(`Due Date: ${format(new Date(invoice.dueDate), "PPP")}`, 14, summaryY + 8);
            doc.text(`Status: ${invoice.status.toUpperCase()}`, 14, summaryY + 16);
            
            // Footer
            const finalPage = doc.getNumberOfPages();
            doc.setPage(finalPage);
            const footerY = 278;
            doc.setFontSize(9);
            doc.setTextColor(textColor);
            doc.setDrawColor(borderColor);
            doc.line(14, footerY - 10, 200, footerY - 10);
            doc.text('Thank you for choosing Careflux Hospital.', 105, footerY - 5, { align: 'center' });
            doc.setFont('times', 'bold');
            doc.text('For emergencies, please call +234 706 916 3505', 105, footerY, { align: 'center' });
        }
    });

    // Save PDF
    const fileName = `Invoice-${invoice.patientName.replace(/ /g, '_')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
}
