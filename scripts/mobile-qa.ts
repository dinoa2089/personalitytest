/**
 * Mobile QA Automation Script
 * 
 * Captures screenshots of all sitemap pages at multiple viewports
 * and generates an HTML report for visual review.
 * 
 * Usage: npm run qa:mobile
 */

import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'qa-screenshots');
const CONCURRENCY = 3; // Number of parallel browser contexts

// Viewport configurations
const VIEWPORTS = {
  mobile: { width: 375, height: 812, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1280, height: 800, name: 'desktop' },
};

// URL generation (mirrors sitemap.ts logic)
const prismTypes = [
  'innovator', 'architect', 'catalyst', 'strategist',
  'connector', 'guardian', 'explorer', 'stabilizer',
  'visionary', 'harmonizer', 'achiever', 'analyst',
];

const mbtiTypes = [
  'intj', 'intp', 'entj', 'entp',
  'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj',
  'istp', 'isfp', 'estp', 'esfp',
];

const enneagramTypes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const contentTopics = [
  'learning', 'careers', 'relationships', 'communication',
  'stress', 'leadership', 'growth', 'workplace', 'compatibility',
];

function generateAllUrls(): string[] {
  const urls: string[] = [];

  // Static pages
  const staticPaths = [
    '/',
    '/assessment',
    '/assessment/intro',
    '/science',
    '/pricing',
    '/blog',
    '/blog/why-most-personality-tests-fall-short',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/compare',
  ];
  urls.push(...staticPaths);

  // PRISM-7 type pages
  prismTypes.forEach(type => {
    urls.push(`/type/${type}`);
    contentTopics.forEach(topic => {
      urls.push(`/type/${type}/${topic}`);
    });
  });

  // MBTI type pages
  mbtiTypes.forEach(type => {
    urls.push(`/type/mbti/${type}`);
    contentTopics.forEach(topic => {
      urls.push(`/type/mbti/${type}/${topic}`);
    });
  });

  // Enneagram type pages
  enneagramTypes.forEach(type => {
    urls.push(`/type/enneagram/${type}`);
    contentTopics.forEach(topic => {
      urls.push(`/type/enneagram/${type}/${topic}`);
    });
  });

  return urls;
}

function sanitizeFilename(urlPath: string): string {
  return urlPath
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '') || 'home';
}

async function captureScreenshot(
  page: Page,
  urlPath: string,
  viewport: typeof VIEWPORTS.mobile
): Promise<{ success: boolean; error?: string }> {
  const filename = `${sanitizeFilename(urlPath)}.png`;
  const viewportDir = path.join(OUTPUT_DIR, viewport.name);
  const filepath = path.join(viewportDir, filename);

  try {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${BASE_URL}${urlPath}`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit for any animations to settle
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: filepath, 
      fullPage: true 
    });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

interface ScreenshotResult {
  url: string;
  viewport: string;
  success: boolean;
  error?: string;
}

async function processUrlBatch(
  browser: Browser,
  urls: string[],
  onProgress: (completed: number, total: number, current: string) => void
): Promise<ScreenshotResult[]> {
  const results: ScreenshotResult[] = [];
  const totalScreenshots = urls.length * Object.keys(VIEWPORTS).length;
  let completed = 0;

  // Process URLs in batches with concurrency
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    
    await Promise.all(batch.map(async (urlPath) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      for (const [, viewport] of Object.entries(VIEWPORTS)) {
        const result = await captureScreenshot(page, urlPath, viewport);
        results.push({
          url: urlPath,
          viewport: viewport.name,
          success: result.success,
          error: result.error,
        });
        completed++;
        onProgress(completed, totalScreenshots, `${viewport.name}: ${urlPath}`);
      }

      await context.close();
    }));
  }

  return results;
}

function generateHtmlReport(results: ScreenshotResult[], urls: string[]): void {
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  
  // Group results by URL
  const urlGroups = new Map<string, ScreenshotResult[]>();
  results.forEach(r => {
    if (!urlGroups.has(r.url)) {
      urlGroups.set(r.url, []);
    }
    urlGroups.get(r.url)!.push(r);
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile QA Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      color: #e0e0e0;
      padding: 2rem;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #333;
    }
    .header h1 { color: #fff; margin-bottom: 0.5rem; }
    .stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
    }
    .stat {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: #1a1a1a;
    }
    .stat.success { border-left: 4px solid #22c55e; }
    .stat.failure { border-left: 4px solid #ef4444; }
    .filters {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #444;
      background: #1a1a1a;
      color: #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover, .filter-btn.active {
      background: #2563eb;
      border-color: #2563eb;
    }
    .search {
      width: 100%;
      max-width: 400px;
      padding: 0.75rem 1rem;
      border: 1px solid #444;
      background: #1a1a1a;
      color: #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
    }
    .page-card {
      background: #1a1a1a;
      border-radius: 12px;
      margin-bottom: 2rem;
      overflow: hidden;
      border: 1px solid #333;
    }
    .page-header {
      padding: 1rem 1.5rem;
      background: #222;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-header h3 { 
      font-size: 0.9rem;
      font-family: monospace;
      color: #60a5fa;
    }
    .screenshots {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: #333;
    }
    .screenshot {
      background: #1a1a1a;
      text-align: center;
    }
    .screenshot-label {
      padding: 0.5rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #888;
      background: #222;
    }
    .screenshot img {
      width: 100%;
      max-height: 400px;
      object-fit: contain;
      object-position: top;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .screenshot img:hover { opacity: 0.8; }
    .screenshot.error {
      padding: 2rem;
      color: #ef4444;
    }
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.95);
      z-index: 1000;
      padding: 2rem;
      overflow: auto;
    }
    .modal.active { display: flex; align-items: flex-start; justify-content: center; }
    .modal img {
      max-width: 100%;
      max-height: none;
    }
    .modal-close {
      position: fixed;
      top: 1rem;
      right: 1rem;
      background: #ef4444;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
    }
    @media (max-width: 768px) {
      .screenshots { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📱 Mobile QA Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <div class="stats">
      <div class="stat success">✓ ${successCount} Captured</div>
      <div class="stat failure">✗ ${failureCount} Failed</div>
    </div>
  </div>

  <div class="filters">
    <input type="text" class="search" placeholder="Search pages..." id="search">
    <button class="filter-btn active" data-filter="all">All Pages</button>
    <button class="filter-btn" data-filter="static">Static</button>
    <button class="filter-btn" data-filter="prism">PRISM-7</button>
    <button class="filter-btn" data-filter="mbti">MBTI</button>
    <button class="filter-btn" data-filter="enneagram">Enneagram</button>
    <button class="filter-btn" data-filter="errors">Errors Only</button>
  </div>

  <div id="pages">
    ${Array.from(urlGroups.entries()).map(([url, viewportResults]) => {
      const hasError = viewportResults.some(r => !r.success);
      const category = url.includes('/type/mbti/') ? 'mbti' 
        : url.includes('/type/enneagram/') ? 'enneagram'
        : url.includes('/type/') ? 'prism'
        : 'static';
      
      return `
    <div class="page-card" data-url="${url}" data-category="${category}" data-error="${hasError}">
      <div class="page-header">
        <h3>${url}</h3>
        ${hasError ? '<span style="color:#ef4444">⚠ Error</span>' : ''}
      </div>
      <div class="screenshots">
        ${Object.values(VIEWPORTS).map(vp => {
          const result = viewportResults.find(r => r.viewport === vp.name);
          const filename = sanitizeFilename(url) + '.png';
          if (result?.success) {
            return `
        <div class="screenshot">
          <div class="screenshot-label">${vp.name} (${vp.width}×${vp.height})</div>
          <img src="${vp.name}/${filename}" alt="${url} - ${vp.name}" onclick="openModal(this.src)">
        </div>`;
          } else {
            return `
        <div class="screenshot error">
          <div class="screenshot-label">${vp.name}</div>
          <p>Failed: ${result?.error || 'Unknown error'}</p>
        </div>`;
          }
        }).join('')}
      </div>
    </div>`;
    }).join('')}
  </div>

  <div class="modal" id="modal">
    <button class="modal-close" onclick="closeModal()">×</button>
    <img src="" alt="Full size screenshot" id="modal-img">
  </div>

  <script>
    // Search functionality
    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.page-card').forEach(card => {
        const url = card.dataset.url.toLowerCase();
        card.style.display = url.includes(query) ? '' : 'none';
      });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        document.querySelectorAll('.page-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = '';
          } else if (filter === 'errors') {
            card.style.display = card.dataset.error === 'true' ? '' : 'none';
          } else {
            card.style.display = card.dataset.category === filter ? '' : 'none';
          }
        });
      });
    });

    // Modal
    function openModal(src) {
      document.getElementById('modal-img').src = src;
      document.getElementById('modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      document.getElementById('modal').classList.remove('active');
      document.body.style.overflow = '';
    }
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'report.html'), html);
}

async function main() {
  console.log('\n🔍 Mobile QA Automation\n');
  console.log('━'.repeat(50));

  // Generate URLs
  const urls = generateAllUrls();
  console.log(`📋 Found ${urls.length} pages to test`);
  console.log(`📱 Testing ${Object.keys(VIEWPORTS).length} viewports per page`);
  console.log(`📸 Total screenshots: ${urls.length * Object.keys(VIEWPORTS).length}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('━'.repeat(50));

  // Create output directories
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  Object.values(VIEWPORTS).forEach(vp => {
    fs.mkdirSync(path.join(OUTPUT_DIR, vp.name), { recursive: true });
  });

  // Launch browser
  console.log('\n🚀 Launching browser...\n');
  const browser = await chromium.launch({ headless: true });

  const startTime = Date.now();

  // Capture screenshots
  const results = await processUrlBatch(browser, urls, (completed, total, current) => {
    const percent = Math.round((completed / total) * 100);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    process.stdout.write(`\r📸 Progress: ${completed}/${total} (${percent}%) | ⏱ ${elapsed}s | ${current.padEnd(50).slice(0, 50)}`);
  });

  await browser.close();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Generate report
  console.log('\n\n📝 Generating HTML report...');
  generateHtmlReport(results, urls);

  // Summary
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log('\n' + '━'.repeat(50));
  console.log('✅ QA Complete!');
  console.log('━'.repeat(50));
  console.log(`📸 Screenshots captured: ${successCount}`);
  if (failureCount > 0) {
    console.log(`❌ Failed: ${failureCount}`);
    console.log('\nFailed URLs:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.viewport}: ${r.url}`);
      console.log(`    Error: ${r.error}`);
    });
  }
  console.log(`⏱  Duration: ${duration}s`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🌐 Report: ${path.join(OUTPUT_DIR, 'report.html')}`);
  console.log('\n💡 Open report.html in your browser to review all screenshots!\n');
}

main().catch(console.error);



