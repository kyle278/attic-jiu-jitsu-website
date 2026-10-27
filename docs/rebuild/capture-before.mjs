import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json'));
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
await fs.mkdir('docs/rebuild/screenshots',{recursive:true});
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:960},serviceWorkers:'block'});
  await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
  await page.screenshot({path:`docs/rebuild/screenshots/before-${width}.png`,fullPage:true});
  await page.goto('http://localhost:3000/members',{waitUntil:'networkidle'});
  await page.screenshot({path:`docs/rebuild/screenshots/members-before-${width}.png`});
  console.log(JSON.stringify({width,memberTitle:await page.title()}));
  await page.close();
 }
} finally {await browser.close();}
