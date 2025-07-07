
export const TAX_RATE = 0.12; // 12% IVA

export const calculateTaxes = (products: Array<{quantity: number, price: number}>) => {
  const subtotal = products.reduce((total, product) => total + (product.quantity * product.price), 0);
  const iva = subtotal * TAX_RATE;
  const total = subtotal + iva;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};
