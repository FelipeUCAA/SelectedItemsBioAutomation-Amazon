const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.amazon.com/');

    //Make sure its the correct postal code
    await page.type('#twotabsearchtextbox', '11001');

    
    await page.type('#twotabsearchtextbox', 'garlic press');

    
    await Promise.all([
        page.waitForNavigation(), 
        page.click('input[type="submit"][value="Go"]')
    ]);


    await page.waitForLoadState('networkidle');

    //No sponsored product
    const product = await page.$('[data-component-type="s-search-result"]:not([data-component-type="s-sponsored-listings"])');

    if (product) {
        //Extract Informations
        const title = await product.$eval('h2 > a', element => element.textContent.trim());
        const about = await product.$eval('.a-size-base.a-link-normal.a-text-normal', element => element.textContent.trim());
        const price = await product.$eval('.a-offscreen', element => element.textContent.trim());
        const rating = await product.$eval('.a-icon-star-small > .a-icon-alt', element => element.textContent.trim());

        const faturamento = faturamentoElement ? await faturamentoElement.textContent() : 'N/A';
        const views = viewsElement ? await viewsElement.textContent() : 'N/A';

        //Print Informations
        console.log('Title:', title);
        console.log('About:', about);
        console.log('Price:', price);
        console.log('Billing:', faturamento.trim());
        console.log('Views:', views.trim());
        console.log('Rating:', rating);
    } else {
        console.log('None product was found.');
    }

    await browser.close();
})();
