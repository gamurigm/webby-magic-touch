
import { useState } from 'react';
import { Invoice } from "@/types/invoice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";

interface EmailInvoiceDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: (invoice: Invoice) => void;
}

const EmailInvoiceDialog = ({ invoice, isOpen, onClose, onEmailSent }: EmailInvoiceDialogProps) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setEmailData({ to: '', subject: '', message: '' });
  };

  const handleSendEmail = async () => {
    if (!invoice || !emailData.to.trim()) return;

    setIsLoading(true);
    console.log("Enviando factura por email:", {
      invoice: invoice.number,
      to: emailData.to,
      subject: emailData.subject
    });

    try {
      // Simular envío de email (aquí se integraría con un servicio real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar estado de la factura
      const updatedInvoice = {
        ...invoice,
        status: 'sent' as const,
        emailSentDate: new Date().toISOString(),
        emailRecipient: emailData.to
      };

      onEmailSent(updatedInvoice);
      
      toast({
        title: "Factura enviada",
        description: `Factura ${invoice.number} enviada a ${emailData.to}`,
      });
      
      handleClose();
    } catch (error) {
      console.error("Error enviando email:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la factura por email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!invoice) return null;

  // Pre-llenar datos si están disponibles
  if (isOpen && !emailData.to && invoice.clientEmail) {
    setEmailData({
      to: invoice.clientEmail,
      subject: `Factura ${invoice.number} - ${invoice.clientName}`,
      message: `Estimado/a ${invoice.clientName},\n\nAdjunto encontrará la factura ${invoice.number} por un total de $${invoice.total.toFixed(2)}.\n\nGracias por su compra.\n\nSaludos cordiales.`
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Factura por Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Factura a enviar:</h4>
            <p className="text-sm text-gray-600">
              #{invoice.number} - {invoice.clientName} - ${invoice.total.toFixed(2)}
            </p>
          </div>

          <div>
            <Label htmlFor="email-to">Destinatario *</Label>
            <Input
              id="email-to"
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData({...emailData, to: e.target.value})}
              placeholder="correo@cliente.com"
            />
          </div>

          <div>
            <Label htmlFor="email-subject">Asunto</Label>
            <Input
              id="email-subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              placeholder="Asunto del email"
            />
          </div>

          <div>
            <Label htmlFor="email-message">Mensaje</Label>
            <Textarea
              id="email-message"
              value={emailData.message}
              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
              placeholder="Mensaje del email"
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSendEmail}
            disabled={!emailData.to.trim() || isLoading}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isLoading ? "Enviando..." : "Enviar Factura"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailInvoiceDialog;
