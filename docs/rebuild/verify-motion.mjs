import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json'));
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const results=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'no-preference',serviceWorkers:'block'});
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='localhost'?route.continue():route.abort());
 const page=await context.newPage();
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
 await page.mouse.move(1,1);
 await page.waitForFunction(()=>document.querySelector('.hero-carousel')?.dataset.running==='true');
 const initial=await page.locator('.carousel-dots [aria-pressed="true"]').innerText();
 await page.waitForFunction(initial=>document.querySelector('.carousel-dots [aria-pressed="true"]')?.textContent!==initial,initial,{timeout:10000});
 results.push('Autoplay changes the photograph with no user interaction');
 const before=await page.locator('.hero-parallax').evaluate(el=>getComputedStyle(el).transform);
 await page.evaluate(()=>window.scrollTo(0,350));
 await page.waitForTimeout(180);
 const after=await page.locator('.hero-parallax').evaluate(el=>getComputedStyle(el).transform);
 assert.notEqual(after,before);results.push('Scrolling changes the hero background transform independently of the carousel');
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 const frozen=await page.locator('.hero-slide.is-active img').evaluate(el=>getComputedStyle(el).transform);
 const index=await page.locator('.carousel-dots [aria-pressed="true"]').innerText();
 await page.mouse.move(1,1);await page.evaluate(()=>document.activeElement.blur());
 await page.waitForTimeout(900);
 assert.equal(await page.locator('.hero-slide.is-active img').evaluate(el=>getComputedStyle(el).transform),frozen);
 assert.equal(await page.locator('.carousel-dots [aria-pressed="true"]').innerText(),index);
 results.push('Pause freezes both photo zoom and slide selection');
 await context.close();
 await fs.writeFile('docs/rebuild/motion-verification.json',JSON.stringify({passed:true,results},null,2));
 console.log(JSON.stringify({passed:true,results}));
} catch(error) {
 await fs.writeFile('docs/rebuild/motion-verification.json',JSON.stringify({passed:false,results,error:error.message},null,2));
 console.log(JSON.stringify({passed:false,error:error.message}));process.exitCode=1;
} finally {await browser.close();}
