import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

const JIRA_WEBHOOK_URL = 'https://api-private.atlassian.com/automation/webhooks/jira/a/a1fb742f-fed4-4c3f-a25f-8ab7f3618290/01987917-d7cf-7854-80d8-5702f5f38641';
const JIRA_TOKEN = 'eefd108cd47baeb1b93a2911d154a434dce76bb0';

// ✅ JSON parser must come first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getTodayISODate() {
  return new Date().toISOString().split('T')[0];
}

app.post('/whohome', async (req, res) => {
  try {
    const rawText = req.body?.text || '';
    const text = rawText.trim();
    const date = /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : getTodayISODate();

    await axios.post(
      JIRA_WEBHOOK_URL,
      { date },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Automation-Webhook-Token': JIRA_TOKEN,
        },
      }
    );

    res.status(200).send(`✅ Jira automation triggered for date: ${date}`);
  } catch (error) {
    console.error('Jira webhook failed:', error?.response?.status, error?.response?.data);
    res.status(500).send('❌ Failed to trigger Jira automation.');
  }
});

app.get('/', (req, res) => {
  res.send('Slack-Jira trigger bridge is online.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
