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

      const rect = span.getBoundingClientRect();
      const aRect = a.getBoundingClientRect();
      
      return {
        aRect: {x: aRect.x, y: aRect.y, w: aRect.width, h: aRect.height},
        spanRect: {x: rect.x, y: rect.y, w: rect.width, h: rect.height},
        spanHtml: span.outerHTML
      };
    });
    
    console.log(JSON.stringify(data, null, 2));
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
