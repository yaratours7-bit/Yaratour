const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');
const twilio = require('twilio');

const envPath = path.join(process.cwd(), '.env.local');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const idx = trimmed.indexOf('=');
    if (idx === -1) {
      continue;
    }

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1);
    env[key] = value;
  }

  return env;
}

function upsertEnvValue(filePath, key, value) {
  const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const re = new RegExp(`^${key}=.*$`, 'm');

  if (re.test(content)) {
    fs.writeFileSync(filePath, content.replace(re, `${key}=${value}`), 'utf8');
    return;
  }

  const suffix = content.endsWith('\n') || content.length === 0 ? '' : '\n';
  fs.writeFileSync(filePath, `${content}${suffix}${key}=${value}\n`, 'utf8');
}

async function main() {
  const env = {
    ...parseEnvFile(envPath),
    ...process.env,
  };

  const required = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'];
  const missing = required.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  const port = Number(env.VOICE_TUNNEL_PORT || 3003);
  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

  console.log(`[voice:tunnel] Starting localtunnel on port ${port}...`);
  const tunnel = await localtunnel({ port });
  const voiceUrl = `${tunnel.url}/api/voice`;

  let appSid = env.TWILIO_APP_SID;

  if (appSid) {
    await client.applications(appSid).update({
      voiceUrl,
      voiceMethod: 'POST',
    });
    console.log(`[voice:tunnel] Updated TwiML App ${appSid}`);
  } else {
    const app = await client.applications.create({
      friendlyName: 'Yara CRM Voice App',
      voiceUrl,
      voiceMethod: 'POST',
    });
    appSid = app.sid;
    upsertEnvValue(envPath, 'TWILIO_APP_SID', appSid);
    console.log(`[voice:tunnel] Created TwiML App ${appSid}`);
  }

  console.log(`[voice:tunnel] Public URL: ${tunnel.url}`);
  console.log(`[voice:tunnel] Voice webhook: ${voiceUrl}`);
  console.log('[voice:tunnel] Keep this process running while making calls.');

  tunnel.on('close', () => {
    console.error('[voice:tunnel] Tunnel closed. Calls may disconnect.');
  });

  const shutdown = async () => {
    try {
      await tunnel.close();
    } catch (_) {
      // Ignore shutdown errors.
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error(`[voice:tunnel] ${error.message}`);
  process.exit(1);
});
