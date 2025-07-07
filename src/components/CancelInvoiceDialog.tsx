
import { useState } from 'react';
import { Invoice } from "@/types/invoice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CancelInvoiceDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (invoice: Invoice, reason: string) => void;
}

const CancelInvoiceDialog = ({ invoice, isOpen, onClose, onCancel }: CancelInvoiceDialogProps) => {
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = () => {
    if (invoice && cancelReason.trim()) {
      onCancel(invoice, cancelReason);
      setCancelReason('');
      onClose();
    }
  };

  const handleClose = () => {
    setCancelReason('');
    onClose();
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anular Factura #{invoice.number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción anulará permanentemente la factura. 
              No se podrá deshacer.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Motivo de la anulación *</Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Especifica el motivo de la anulación..."
              rows={3}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={!cancelReason.trim()}
          >
            Anular Factura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelInvoiceDialog;
