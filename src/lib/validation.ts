export function validateName(name: string): boolean {
  const regex = /^[a-zA-Z\s.'-]{2,}$/;
  return regex.test(name);
}

export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
}

export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 8) return false;
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return regex.test(phone);
}
