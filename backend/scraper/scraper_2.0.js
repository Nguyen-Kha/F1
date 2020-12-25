const puppeteer = require("puppeteer");

async function scrape(){
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    // When clicking on a new page on a new tab, wait for the promise
    // const newPagePromise = new Promise(x => page.once('popup', x));

    // Testing on single page first
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://www.f1-fansite.com/f1-results/2019-f1-championship-standings/");

    // Find the header and intialize it
    let driversStandingsTabElement  = await page.$('.tabber > ul > li:nth-child(2)');
    let driversStandingsTabElementA  = await page.$('.tabber > ul > li:nth-child(2) > a');

    try{
        await page.click(driversStandingsTabElementA);
        console.log('try 2');
    }
    catch(e){

    }
    
    let headerRowSelector = '.msr_season_driver_results > thead > tr';
    let headerElement = await page.$(headerRowSelector);
    let headerColumns = await page.evaluate((el) => {
        return el.childElementCount;
    }, headerElement);

    let headerKeyList = [];
    //  Find the element thead tr, then iterate through all the <th>s innerText
    for(let i = 0; i < parseInt(headerColumns); i++){
        let a = i + 1;
        let tempHeaderRowSelector = ''
        const headerRowSelectorMiddle = ' > th:nth-child(';
        const headerRowSelectorEnd = ')'
        tempHeaderRowSelector = tempHeaderRowSelector.concat(headerRowSelector, headerRowSelectorMiddle, a, headerRowSelectorEnd);

        let tempHeaderRowElement = await page.waitForSelector(tempHeaderRowSelector);
        let headerValue = await page.evaluate(el => el.innerText, tempHeaderRowElement);
        headerValue = headerValue.trim();
        headerKeyList.push(headerValue);
    }

    for(let i = 0; i < headerKeyList.length; i++){
        console.log(headerKeyList[i]);
    }

    browser.close();
}

scrape().catch(console.error);