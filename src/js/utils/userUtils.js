import axios from 'axios';
import { handleError } from './errorHandler.js';

export async function getUserInfo() {
  try {
    const response = await axios.get('/api/user/info.php');
    return response.data;
  } catch (error) {
    console.error('Failed to get user info:', handleError(error));
    return null;
  }
}