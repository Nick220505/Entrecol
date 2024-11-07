export const environment = {
  production: false,
  apiUrl: typeof window !== 'undefined' && window.location.hostname.includes('github.dev')
    ? `https://${window.location.hostname.replace('-4200', '-8080')}/api`
    : 'http://localhost:8080/api',
};
