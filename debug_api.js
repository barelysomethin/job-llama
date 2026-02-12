import axios from 'axios';

async function verifyApi() {
  try {
    console.log('1. Fetching all jobs...');
    const listRes = await axios.get('http://localhost:3000/api/jobs');
    
    if (!listRes.data || listRes.data.length === 0) {
      console.log('No jobs found!');
      return;
    }

    const firstJob = listRes.data[0];
    console.log('First job found:', {
      _id: firstJob._id,
      title: firstJob.title
    });

    if (!firstJob._id) {
      console.error('ERROR: Job is missing _id field!');
      return;
    }

    console.log(`2. Fetching details for ID: ${firstJob._id}...`);
    const detailRes = await axios.get(`http://localhost:3000/api/jobs/${firstJob._id}`);
    
    if (detailRes.data) {
      console.log('SUCCESS: Fetched detailed job!');
      console.log('Title matches:', detailRes.data.title === firstJob.title);
    } else {
      console.log('ERROR: No data returned for detail fetch.');
    }

  } catch (error) {
    console.error('API Verification Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

verifyApi();
