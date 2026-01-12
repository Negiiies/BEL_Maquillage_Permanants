// Configuration centralisée de l'API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Tu peux ajouter d'autres configs ici plus tard
export const config = {
  apiUrl: API_URL,
  tokenExpiry: '30d',
  appName: 'BEL Institut de Beauté'
};
