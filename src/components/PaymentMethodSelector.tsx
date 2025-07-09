
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Métodos de pago</h3>
      
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit-card" id="credit-card" />
          <Label htmlFor="credit-card">Tarjeta de crédito</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bank-transfer" id="bank-transfer" />
          <Label htmlFor="bank-transfer">Transferencia bancaria</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal">PayPal</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
