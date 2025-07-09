
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClientFormProps {
  clientName: string;
  onClientNameChange: (name: string) => void;
  clientEmail: string;
  onClientEmailChange: (email: string) => void;
  clientAddress: string;
  onClientAddressChange: (address: string) => void;
}

const ClientForm = ({
  clientName,
  onClientNameChange,
  clientEmail,
  onClientEmailChange,
  clientAddress,
  onClientAddressChange
}: ClientFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Datos del cliente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client-name">Nombre *</Label>
          <Input
            id="client-name"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <Label htmlFor="client-email">Correo electrónico *</Label>
          <Input
            id="client-email"
            type="email"
            value={clientEmail}
            onChange={(e) => onClientEmailChange(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="client-address">Dirección</Label>
        <Textarea
          id="client-address"
          value={clientAddress}
          onChange={(e) => onClientAddressChange(e.target.value)}
          placeholder="Dirección completa"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ClientForm;
