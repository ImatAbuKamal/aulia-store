
export function validateName(name: string): boolean {
  const regex = /^[a-zA-Z\s.'-]{2,}$/;
  return regex.test(name);
}

export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Validates Indonesian phone numbers (e.g., 081234567890 or +6281234567890)
  // Allows spaces or hyphens which are removed before validation.
  // Total length 10-13 digits.
  const regex = /^(?:\+62|0)8[1-9][0-9]{7,10}$/;
  return regex.test(phone.replace(/[\s-]/g, ""));
}
