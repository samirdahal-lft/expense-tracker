/** Format an integer amount of whole Nepalese Rupees for display, e.g. 2500 → "Rs 2,500". */
export function formatNpr(amount: number): string {
  return `Rs ${amount.toLocaleString("en-IN")}`;
}
