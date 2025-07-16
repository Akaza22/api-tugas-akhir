import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Gantilah URL ini dengan URL backend kamu
const CHECK_URL = `${process.env.APP_URL}/api/approval/check-expiry`;

cron.schedule('*/10 * * * *', async () => {
  try {
    const response = await axios.get(CHECK_URL);
    console.log('✅ Approval check success:', response.data);
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Approval check failed:', err.message);
    } else {
      console.error('❌ Approval check failed:', err);
    }
  }
});
