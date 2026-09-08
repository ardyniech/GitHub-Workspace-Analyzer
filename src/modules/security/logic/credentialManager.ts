export const saveCredential = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`secure_vault_${key}`, btoa(value));
  }
};

export const getCredential = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem(`secure_vault_${key}`);
    return val ? atob(val) : null;
  }
  return null;
};
