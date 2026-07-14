const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:4173/team', { waitUntil: 'networkidle0' });
    
    const data = await page.evaluate(() => {
      const a = document.querySelector('a[href="/"]');
      if (!a) return 'No a tag';
      
      const span = a.querySelector('span');
      if (!span) return 'No span inside a tag';

      return {
        html: span.outerHTML,
        style: span.style.cssText,
        opacity: window.getComputedStyle(span).opacity,
        display: window.getComputedStyle(span).display,
        visibility: window.getComputedStyle(span).visibility,
        rect: span.getBoundingClientRect()
      };
    });
    
    console.log(JSON.stringify(data, null, 2));
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
