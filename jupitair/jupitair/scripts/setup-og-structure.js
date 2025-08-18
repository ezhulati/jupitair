#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setupOGStructure() {
  // Create necessary directories
  const dirs = [
    path.join(__dirname, '..', 'public', 'images'),
    path.join(__dirname, '..', 'public', 'og-images'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Create a simple HTML file that explains the setup
  const instructionsHTML = `<!DOCTYPE html>
<html>
<head>
  <title>OpenGraph Image Setup</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: linear-gradient(135deg, #0066CC 0%, #004499 100%);
      color: white;
      border-radius: 10px;
    }
    h1 { font-size: 2.5em; margin-bottom: 20px; }
    .step {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    code {
      background: rgba(0,0,0,0.3);
      padding: 2px 6px;
      border-radius: 3px;
    }
    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
      margin: 5px;
    }
  </style>
</head>
<body>
  <h1>🎨 Jupitair HVAC - OpenGraph Setup</h1>
  
  <div class="step">
    <h2>✅ Structure Created</h2>
    <p>The OpenGraph image directories have been set up:</p>
    <ul>
      <li><code>/public/images/</code> - Default images</li>
      <li><code>/public/og-images/</code> - Page-specific OG images</li>
    </ul>
  </div>
  
  <div class="step">
    <h2>🔑 To Enable AI Image Generation</h2>
    <ol>
      <li>Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" style="color: #87CEEB;">platform.openai.com</a></li>
      <li>Add to your <code>.env</code> file: <code>OPENAI_API_KEY=sk-your-key-here</code></li>
      <li>Run: <code>npm run generate-images</code></li>
    </ol>
  </div>
  
  <div class="step">
    <h2>📱 What This Enables</h2>
    <p>When you share any page from the website:</p>
    <div class="badge">Facebook</div>
    <div class="badge">Twitter/X</div>
    <div class="badge">LinkedIn</div>
    <div class="badge">iMessage</div>
    <div class="badge">WhatsApp</div>
    <p>A professional preview image will appear with your content!</p>
  </div>
  
  <div class="step">
    <h2>🚀 Services Covered</h2>
    <div class="badge">AC Repair</div>
    <div class="badge">Heating</div>
    <div class="badge">Installation</div>
    <div class="badge">Emergency 24/7</div>
    <div class="badge">Commercial</div>
    <div class="badge">Maintenance</div>
  </div>
  
  <div style="text-align: center; margin-top: 40px;">
    <h3>Jupitair HVAC</h3>
    <p>North Texas Premier HVAC Solutions</p>
    <p>📞 (940) 390-5676</p>
  </div>
</body>
</html>`;
  
  // Save the instructions file
  const instructionsPath = path.join(__dirname, '..', 'public', 'og-setup.html');
  fs.writeFileSync(instructionsPath, instructionsHTML);
  console.log(`📄 Created setup instructions at: ${instructionsPath}`);
  
  console.log('\n✨ OpenGraph structure is ready!');
  console.log('\n📝 Next steps:');
  console.log('1. Add your OpenAI API key to .env');
  console.log('2. Run: npm run generate-images');
  console.log('3. The site will use generated images for social sharing\n');
}

setupOGStructure();