#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing blog MDX files
const blogDir = path.join(__dirname, 'src/content/blog');

// Process all MDX files
function processFiles() {
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains the old icon
    if (content.includes('path d="M2 3a1 1 0 011-1h2.153')) {
      // Replace the old icon with the new one - better outline design
      content = content.replace(
        /<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">\s*<path d="M2 3a1 1 0 011-1h2\.153[^"]*"\/>\s*<\/svg>/g,
        `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>`
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${file}`);
      updatedCount++;
    }
  });

  console.log(`\n✨ Updated ${updatedCount} files with improved phone icon`);
}

processFiles();