
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { Invoice } from "@/lib/constants";
import { Badge } from "./ui/badge";
import { Download } from "lucide-react";
import { generateInvoicePdf } from "@/lib/pdf-generator";

interface InvoiceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export function InvoiceDetailsDialog({ isOpen, onClose, invoice }: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  const handlePrintPdf = () => {
    generateInvoicePdf(invoice);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Details: {invoice.id}</DialogTitle>
          <DialogDescription>
            Detailed view of the invoice for {invoice.patientName}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Patient Name</TableCell>
                        <TableCell>{invoice.patientName}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Amount</TableCell>
                        <TableCell>₦{invoice.amount.toFixed(2)}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Due Date</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Status</TableCell>
                        <TableCell>
                            <Badge variant={
                                invoice.status === 'Pending' ? 'secondary' : invoice.status === 'Overdue' ? 'destructive' : 'default'
                            } className={invoice.status === 'Paid' ? 'bg-green-500' : ''}>{invoice.status}</Badge>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            
            {invoice.items && invoice.items.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">Billed Items</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell className="text-right">₦{item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handlePrintPdf}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
