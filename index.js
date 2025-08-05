import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

// Environment variables from Railway
const JIRA_WEBHOOK_URL = process.env.JIRA_WEBHOOK_URL;
const JIRA_WEBHOOK_TOKEN = process.env.JIRA_WEBHOOK_TOKEN;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/whohome', (req, res) => {
  res.status(200).send('✅ Jira automation triggered.');

  axios.post(
    JIRA_WEBHOOK_URL,
    {
      trigger: 'slack',
      source: 'whohome'
    },
    {
      headers: {
        'X-Automation-Webhook-Token': JIRA_WEBHOOK_TOKEN,
        'Content-Type': 'application/json'
      }
    }
  ).catch(error => {
    console.error('Webhook error:', error?.response?.status, error?.response?.data);
  });
});

app.get('/', (req, res) => {
  res.send('Slack-Jira bridge is running.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
