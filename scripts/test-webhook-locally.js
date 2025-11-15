/**
 * Test webhook handler locally
 * Simulates a Clerk webhook event
 */

require('dotenv').config({ path: '.env.local' });

const webhookSecret = process.env.WEBHOOK_SECRET;
const webhookUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

if (!webhookSecret) {
  console.error('❌ WEBHOOK_SECRET not found in .env.local');
  process.exit(1);
}

// Sample user.created event (based on actual Clerk payload)
const testEvent = {
  data: {
    id: "user_35Uc91pwrW1oDquwuc9JI41jo3G",
    email_addresses: [{
      email_address: "dean@gamedayplace.com",
      id: "idn_35Uc7Da9U84pSEfdkwZ4ufzZIP3",
    }],
  },
  type: "user.created",
};

async function testWebhook() {
  console.log('🧪 Testing webhook endpoint...\n');
  console.log(`URL: ${webhookUrl}/api/webhooks/clerk`);
  console.log(`Event: ${testEvent.type}`);
  console.log(`User ID: ${testEvent.data.id}`);
  console.log(`Email: ${testEvent.data.email_addresses[0].email_address}\n`);

  try {
    const response = await fetch(`${webhookUrl}/api/webhooks/clerk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEvent),
    });

    const text = await response.text();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${text}`);

    if (response.ok) {
      console.log('\n✅ Webhook test successful!');
    } else {
      console.log('\n❌ Webhook test failed');
      try {
        const json = JSON.parse(text);
        console.log('Error details:', json);
      } catch (e) {
        console.log('Response:', text);
      }
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    console.log('\nMake sure your dev server is running on', webhookUrl);
  }
}

testWebhook();

