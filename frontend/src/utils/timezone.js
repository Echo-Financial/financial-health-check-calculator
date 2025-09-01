// frontend/src/utils/timezone.js
export const nzDateTime = (iso) =>
  new Date(iso).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });

