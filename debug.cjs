const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    console.log("Browser launched. Opening page...");
    const page = await browser.newPage();
    
    // Listen for console logs in the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:4173/team', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log("Page loaded.");

    // Take a screenshot
    await page.screenshot({ path: 'test_screenshot.png' });
    console.log("Saved test_screenshot.png");

    const data = await page.evaluate(() => {
      const results = {};
      const logoSlot = document.getElementById('nav-logo-slot');
      if (logoSlot) {
        const rect = logoSlot.getBoundingClientRect();
        results.logo = {
          rect: {x: rect.x, y: rect.y, w: rect.width, h: rect.height},
          src: logoSlot.src,
          style: logoSlot.style.cssText,
          computedDisplay: window.getComputedStyle(logoSlot).display,
          computedOpacity: window.getComputedStyle(logoSlot).opacity,
          computedVisibility: window.getComputedStyle(logoSlot).visibility
        };
        
        const parent = logoSlot.parentElement;
        if (parent) {
          const pRect = parent.getBoundingClientRect();
          results.parent = {
            tag: parent.tagName,
            rect: {x: pRect.x, y: pRect.y, w: pRect.width, h: pRect.height},
            classes: parent.className,
            computedDisplay: window.getComputedStyle(parent).display,
            computedOpacity: window.getComputedStyle(parent).opacity,
            computedVisibility: window.getComputedStyle(parent).visibility
          };
          
          const grandParent = parent.parentElement;
          if (grandParent) {
             const gpRect = grandParent.getBoundingClientRect();
             results.grandParent = {
               tag: grandParent.tagName,
               classes: grandParent.className,
               rect: {x: gpRect.x, y: gpRect.y, w: gpRect.width, h: gpRect.height}
             }
          }
        }
      } else {
        results.logo = 'Not found';
      }
      
      const spans = document.querySelectorAll('span');
      let hackText = null;
      spans.forEach(s => {
        if (s.innerText && s.innerText.includes('HACKTRONIX')) {
           const rect = s.getBoundingClientRect();
           hackText = {
             rect: {x: rect.x, y: rect.y, w: rect.width, h: rect.height},
             classes: s.className,
             computedDisplay: window.getComputedStyle(s).display,
             computedOpacity: window.getComputedStyle(s).opacity,
             computedVisibility: window.getComputedStyle(s).visibility
           };
        }
      });
      results.hackText = hackText;
      return results;
    });
    
    console.log(JSON.stringify(data, null, 2));
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
