import { test, expect } from '@playwright/test';
import {mkdir} from 'node:fs/promises';

test('home, real content, WebGL, gallery and Swup navigation',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
  await mkdir('artifacts',{recursive:true});
  await page.goto('/');
  await expect(page.locator('.mark-canvas canvas')).toBeVisible({timeout:15000});
  await expect(page.getByRole('heading',{name:'Kannan',exact:true})).toBeVisible();
  await expect(page.locator('body')).toContainText('Tata Consultancy Services');
  await expect(page.locator('body')).toContainText('Azure AI Fundamentals');
  await expect(page.locator('body')).toContainText('V20 — VR Cricket');
  await expect(page.locator('body')).not.toContainText('LoanFlow AI');
  await expect(page.locator('body')).not.toContainText('Arvind Wealth Builder');
  await expect(page.locator('body')).not.toContainText('Arvind Portfolio App');
  await expect(page.locator('body')).not.toContainText('F&O Paper Trading Terminal');
  await expect(page.locator('body')).not.toContainText('GPTASTRA is a one-person');
  await page.waitForFunction(()=>document.fonts.status==='loaded');
  await page.waitForTimeout(1800);
  await page.screenshot({path:'artifacts/home-desktop.png'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.locator('.hero-baseline a').click();
  await page.waitForTimeout(1600);
  await expect(page.locator('[data-work-title]')).toHaveText('The Hooked Tales');
  await page.getByRole('button',{name:'Next project',exact:true}).click();
  await expect(page.locator('[data-work-title]')).toHaveText('Hokkaido');
  await page.waitForTimeout(1300);
  await page.screenshot({path:'artifacts/works-desktop.png'});
  await page.getByRole('link',{name:'Explore Hokkaido',exact:true}).click();
  await expect(page).toHaveURL(/\/work\/hokkaido\//);
  await expect(page.getByRole('heading',{name:'Hokkaido',exact:true})).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/is-changing/);
  await expect(page.locator('.mark-canvas')).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Visit live website'})).toHaveAttribute('href','https://hokkaidojapres.netlify.app/');
  await page.screenshot({path:'artifacts/hokkaido-desktop.png'});
  await page.getByRole('link',{name:'Kannan — home',exact:true}).click();
  await expect(page.locator('.mark-canvas')).toHaveCount(1);
  await page.getByRole('link',{name:'About',exact:true}).first().click();
  await page.locator('.profile-portrait').scrollIntoViewIfNeeded();
  await expect(page.locator('.profile-portrait img')).toBeVisible();
  await expect(page.locator('.profile-portrait img')).toHaveJSProperty('naturalWidth',560);
  await page.waitForTimeout(1300);
  await page.screenshot({path:'artifacts/about-desktop.png'});
  await page.getByRole('link',{name:'Experience',exact:true}).first().click();
  await page.waitForTimeout(1300);
  await page.screenshot({path:'artifacts/experience-desktop.png'});
  expect(errors).toEqual([]);
});

test('all project routes and assets resolve',async({page,request})=>{
  await page.goto('/works/');
  const cards=page.locator('.project-index-card');
  await expect(cards).toHaveCount(4);
  await page.screenshot({path:'artifacts/work-index-desktop.png',fullPage:true});
  const hrefs=await cards.evaluateAll(elements=>elements.map(el=>el.getAttribute('href')!));
  for(const href of hrefs){
    const response=await request.get(href);expect(response.status()).toBe(200);
    await page.goto(href);
    await expect(page.locator('h1')).toBeVisible();
    const cover=page.locator('.project-detail > figure img');
    await expect(cover).toBeVisible();
    await expect(cover).toHaveJSProperty('complete',true);
    expect(await cover.evaluate((img:HTMLImageElement)=>img.naturalWidth>0)).toBeTruthy();
    const screenshot=page.locator('.project-preview img');
    await screenshot.scrollIntoViewIfNeeded();
    await expect(screenshot).toBeVisible();
    await expect(screenshot).toHaveJSProperty('complete',true);
    expect(await screenshot.evaluate((img:HTMLImageElement)=>img.naturalWidth>1000)).toBeTruthy();
  }
  for(const slug of ['loanflow-ai','arvind-wealth-builder','arvind-portfolio-app','fo-paper-trading-terminal']) {
    expect((await request.get(`/work/${slug}/`)).status()).toBe(404);
  }
  await page.goto('/work/v20-vr-cricket/');
  await expect(page.getByRole('link',{name:'Visit live website'})).toHaveAttribute('href','https://v20vrcricket.vercel.app/');
  await page.goto('/work/porca-vaca/');
  await expect(page.getByRole('link',{name:'Visit live website'})).toHaveAttribute('href','https://pnv-kappa.vercel.app/');
  await expect(page.getByRole('link',{name:'Original case study'})).toHaveCount(0);
  await page.screenshot({path:'artifacts/porca-vaca-detail.png',fullPage:true});
  await page.goto('/work/v20-vr-cricket/');
  await page.screenshot({path:'artifacts/v20-detail-desktop.png',fullPage:true});
  expect((await request.get('/models/k-mark.glb')).status()).toBe(200);
});

test('mobile menu, content and overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.locator('.mark-canvas canvas')).toBeVisible({timeout:15000});
  await page.waitForTimeout(1800);
  await page.screenshot({path:'artifacts/home-mobile.png'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const menu=page.getByRole('button',{name:'Menu +',exact:true});
  await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');
  await page.locator('#mobile-menu').getByRole('link',{name:'About',exact:true}).click();
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await page.waitForTimeout(1400);
  await page.locator('.profile-portrait').scrollIntoViewIfNeeded();
  await expect(page.locator('.profile-portrait img')).toHaveJSProperty('naturalWidth',560);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:'artifacts/about-mobile.png'});
  await page.goto('/works/');
  await expect(page.locator('.project-index-card')).toHaveCount(4);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.setViewportSize({width:1024,height:640});
  await page.goto('/#works');
  const next=page.getByRole('button',{name:'Next project',exact:true});
  await expect(next).toBeInViewport();
  await next.click();
  await expect(page.locator('[data-work-title]')).toHaveText('Hokkaido');
  await expect(next).toBeInViewport();
  await page.screenshot({path:'artifacts/works-short-screen.png'});
});

test('reduced-motion has a readable unpinned gallery',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const cards=page.locator('.gallery-card');
  await expect(cards).toHaveCount(4);
  for(const card of await cards.all())await expect(card).toHaveCSS('opacity','1');
  expect(await page.locator('.works-stage').evaluate(el=>getComputedStyle(el).position)).toBe('relative');
  await expect(page.locator('.sound-button')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('.hero-portrait')).toHaveCSS('opacity','0.52');
  await expect(page.getByRole('heading',{name:'Kannan',exact:true})).toBeVisible();
});

test('identity converges through scroll and hands off to the four-project journey',async({page})=>{
  await page.goto('/');
  await expect(page.locator('#world')).toHaveAttribute('data-model','ready');
  await expect(page.locator('.hero-portrait')).toHaveCSS('opacity','0.52');
  const initialWidth=await page.locator('.hero-wordmark').evaluate(el=>el.getBoundingClientRect().width);
  const heroEnd=await page.locator('.hero').evaluate(el=>(el as HTMLElement).offsetHeight-(el.querySelector('.hero-stage') as HTMLElement).offsetHeight);
  await page.evaluate(top=>window.scrollTo(0,top),heroEnd*.34);
  await page.waitForTimeout(700);
  const pull=await page.locator('.hero-wordmark').evaluate(el=>({width:el.getBoundingClientRect().width,opacity:Number(getComputedStyle(el).opacity)}));
  expect(pull.width).toBeLessThan(initialWidth*.85);
  expect(pull.opacity).toBeGreaterThan(.8);
  await page.screenshot({path:'artifacts/identity-pull.png'});
  await page.evaluate(top=>window.scrollTo(0,top),heroEnd*.48);
  await page.waitForTimeout(700);
  expect(Number(await page.locator('.hero-absorption').evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.5);
  await page.screenshot({path:'artifacts/identity-absorption.png'});
  await page.evaluate(top=>window.scrollTo(0,top),heroEnd*.66);
  await page.waitForTimeout(700);
  expect(Number(await page.locator('.hero-portrait').evaluate(el=>getComputedStyle(el).opacity))).toBeLessThan(.05);
  expect(Number(await page.locator('.hero-wordmark').evaluate(el=>getComputedStyle(el).opacity))).toBeLessThan(.05);
  expect(Number(await page.locator('.mark-canvas').evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await page.screenshot({path:'artifacts/identity-collapse.png'});
  await page.evaluate(top=>window.scrollTo(0,top),heroEnd*.85);
  await page.waitForTimeout(700);
  await page.screenshot({path:'artifacts/project-entry.png'});
  await page.evaluate(top=>window.scrollTo(0,top),heroEnd);
  await page.waitForTimeout(700);
  await expect(page.locator('[data-work-title]')).toHaveText('The Hooked Tales');
  await expect(page.locator('[data-work-link]')).toHaveAttribute('href','/work/the-hooked-tales/');
  for(const title of ['Hokkaido','V20 — VR Cricket','Porca & Vaca']){
    await page.getByRole('button',{name:'Next project',exact:true}).click();
    await expect(page.locator('[data-work-title]')).toHaveText(title);
  }
  await expect(page.locator('[data-work-link]')).toHaveAttribute('href','/work/porca-vaca/');
  await expect(page.getByRole('button',{name:'Next project',exact:true})).toBeDisabled();
  await page.screenshot({path:'artifacts/porca-vaca-gallery.png'});
  await page.locator('[data-work-link]').click();
  await expect(page).toHaveURL(/\/work\/porca-vaca\//);
});

test('the premium wordmark stays below the K with a clear responsive gap',async({page,request})=>{
  expect((await request.get('/fonts/cormorant-garamond-semibold.woff2')).status()).toBe(200);
  await page.goto('/');
  await expect(page.locator('#world')).toHaveAttribute('data-model','ready',{timeout:15000});
  await page.waitForFunction(()=>document.fonts.status==='loaded');
  for(const viewport of [{width:1440,height:1000},{width:1024,height:640},{width:800,height:900},{width:390,height:844},{width:390,height:660},{width:360,height:740}]){
    await page.setViewportSize(viewport);
    await page.waitForTimeout(350);
    await expect(page.locator('.hero-wordmark')).toHaveCSS('font-family',/Kannan Display/);
    const geometry=await page.locator('.hero-wordmark').evaluate(el=>{
      const name=el.getBoundingClientRect();
      const mark=document.querySelector('.hero-mark-anchor')!.getBoundingClientRect();
      const intro=document.querySelector('.hero-intro')!.getBoundingClientRect();
      const introOverlaps=name.left<intro.right&&name.right>intro.left&&name.top<intro.bottom&&name.bottom>intro.top;
      return {gap:name.top-mark.bottom,left:name.left,right:name.right,introOverlaps};
    });
    expect(geometry.gap,`${viewport.width}×${viewport.height}: K/name gap`).toBeGreaterThanOrEqual(24);
    expect(geometry.left).toBeGreaterThan(0);
    expect(geometry.right).toBeLessThan(viewport.width);
    expect(geometry.introOverlaps,`${viewport.width}×${viewport.height}: name/tagline overlap`).toBeFalsy();
    if(viewport.width===390&&viewport.height===660)await page.screenshot({path:'artifacts/home-mobile-short.png'});
  }
});
