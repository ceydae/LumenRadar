export const EMAIL_PATTERN = String.raw`[^\s@]+@[^\s@]+\.[^\s@]+`;
const emailExpression = new RegExp(`^${EMAIL_PATTERN}$`);

export function isValidEmail(email: string) {
  return emailExpression.test(email);
}
