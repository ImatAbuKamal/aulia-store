
export function validateName(name: string): boolean {
  const regex = /^[a-zA-Z\s.'-]{2,}$/;
  return regex.test(name);
}

export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Validates international phone numbers in E.164 format
  // Starts with '+', followed by 9 to 15 digits.
  const regex = /^\+[1-9]\d{9,14}$/;
  return regex.test(phone);
}
