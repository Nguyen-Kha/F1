const puppeteer = require("puppeteer");
const scraper = require('./scraperModules.js');
const mongo = require('mongodb');
require('dotenv').config();

async function scrape(){
    // Initialize MongoDB
    const MongoClient = mongo.MongoClient;
    const uri = process.env.ATLAS_URI;

    // Initialize puppeteer
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    // Initialize variables
    const closeBracket = ')'
    let allDriversList = [];

    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://www.f1-fansite.com/f1-results/");

    // Find navigation table and amount of rows in navigation table
    let navTableSelector = '.motor-sport-results > tbody';
    let navTableRows = await scraper.getchildElementCount(page, navTableSelector);

    // Remove the share to socials div at the bottom of the page
    try{
        let bottomSocialSelector = '.st-sticky-share-buttons';
        await scraper.removeElement(page, bottomSocialSelector);
    }
    catch(e){}

    for(let a = 1; a <= navTableRows; a++){
        // Find the individual rows
        let navRowSelector = ''
        const navRowSelectorMiddle = ' > tr:nth-child(';
        navRowSelector = navRowSelector.concat(navTableSelector, navRowSelectorMiddle, a, closeBracket);

        // Get amount of columns in row 
        let navTableColumns = await scraper.getchildElementCount(page, navRowSelector);

        // Check if there is innerText. If there is, open the link
        for(let b = 1; b <= navTableColumns; b++){
            let navYearSelector = '';
            const navYearSelectorMiddle = ' > td:nth-child(';
            navYearSelector = navYearSelector.concat(navRowSelector, navYearSelectorMiddle, b, closeBracket);

            // Get innerText
            let year = await scraper.getinnerText(page, navYearSelector);
            yearCharLength = year.length;
            console.log('Current year: ' + year);

            // Check if navYearSelector has an href in it
            let selectorHas_href = false;
            if(yearCharLength == 4){
                selectorHas_href = await scraper.selectorChildHasAttribute(page, navYearSelector, 0, 'href');
            }
            else{
                selectorHas_href = false;
            }
            
            // Check if there is any inner text, if there is, work with it
            // if(yearCharLength == 4){
            if(selectorHas_href){
                year = parseInt(year);

                // Add target="_blank" to open in new tab
                navYearLinkSelector = '';
                const navYearLinkSelectorMiddle = ' > a';
                navYearLinkSelector = navYearLinkSelector.concat(navYearSelector, navYearLinkSelectorMiddle);
                await scraper.setAttributeValue(page, navYearLinkSelector, 'target', '_blank');

                // Open link in new tab
                const newPagePromise = new Promise(x => page.once('popup', x));
                await page.click(navYearLinkSelector);
                const newPage = await newPagePromise;   
                await newPage.waitFor(300); 
                await newPage.setDefaultNavigationTimeout(0);

                 // Find the header and intialize it
                let headerRowSelector = '.msr_season_driver_results > thead > tr';
                let headerColumns = await scraper.getchildElementCount(newPage, headerRowSelector);

                try{
                    // Remove the share to socials div at the bottom of the page
                    await scraper.removeElement(newPage, bottomSocialSelector);
                }
                catch(e){}
                
                //  Find the element thead tr, then iterate through all the <th>s innerText to get Race names
                let headerKeyList = [];
                for(let i = 1; i <= parseInt(headerColumns); i++){
                    let tempHeaderRowSelector = ''
                    const headerRowSelectorMiddle = ' > th:nth-child(';
                    tempHeaderRowSelector = tempHeaderRowSelector.concat(headerRowSelector, headerRowSelectorMiddle, i, closeBracket);

                    let headerValue = await scraper.getinnerText(newPage, tempHeaderRowSelector);  // added let
                    headerKeyList.push(headerValue);
                }

                // Getting Race data for each driver in the year
                let bodyRowSelector = '.msr_season_driver_results > tbody';
                let bodyRows = await scraper.getchildElementCount(newPage, bodyRowSelector);
                
                // Go through all the driver rows
                for(let i = 1; i <= parseInt(bodyRows); i++){
                    let driverYearObject = {};
                    let driverResultsList = [];

                    driverYearObject.year = year;

                    let tempRowSelector = '';
                    const tempRowSelectorMiddle = ' > tr:nth-child(';
                    tempRowSelector = tempRowSelector.concat(bodyRowSelector, tempRowSelectorMiddle, i, closeBracket);

                    // Go through each driver's races (columns)
                    for(let j = 2; j <= parseInt(headerColumns); j++){
                        let driverRaceObject = {};

                        let driverStandSelector = '';
                        const driverStandSelectorMiddle = ' > td:nth-child(';
                        driverStandSelector = driverStandSelector.concat(tempRowSelector, driverStandSelectorMiddle, j, closeBracket);
                        
                        // Some pages are messed up, try statement is to account for that
                        try{
                            // Name column on the site
                            if(j == 2){
                                let nameSelector = '';
                                nameSelector = nameSelector.concat(driverStandSelector, ' > a:nth-child(2)');
                                let nameValue = await scraper.getinnerText(newPage, nameSelector);
                                driverYearObject.name = nameValue;
                            }
                            // Total Points Column on the site
                            else if(j == parseInt(headerColumns)){
                                let totalPointsValue = await scraper.getinnerText(newPage, driverStandSelector);
                                // Check if total points contains bracket (ex: 24 (28))
                                if(totalPointsValue.includes('(')){
                                    // Get number before bracket
                                    let realTotalPoints = totalPointsValue.slice(0, totalPointsValue.indexOf('('));
                                    realTotalPoints = realTotalPoints.trim();
                                    driverYearObject.totalPoints = parseFloat(realTotalPoints);

                                    // Get number between brackets
                                    let extraTotalPointsValue = totalPointsValue.match(/\((.*)\)/).pop();
                                    driverYearObject.extraTotalPoints = parseFloat(extraTotalPointsValue);
                                }
                                else{
                                    driverYearObject.totalPoints = parseFloat(totalPointsValue);
                                    driverYearObject.extraTotalPoints = null;
                                }
                                
                            }
                            // Standings on the site
                            else{ 
                                driverRaceObject.race = headerKeyList[j-1];

                                // Get place and store to driverPlaceObject 
                                let placeValue = await scraper.getinnerText(newPage, driverStandSelector);
                                // Check if star
                                if(placeValue.includes('*')){
                                    driverRaceObject.fastestLap = true;
                                    placeValue = placeValue.replace('*', '');
                                    driverRaceObject.place = placeValue;
                                }
                                else{
                                    driverRaceObject.place = placeValue;
                                    driverRaceObject.fastestLap = false;
                                }
    
                                // Get points
                                let pointValue = await scraper.getAttributeValue(newPage, driverStandSelector, 'title');

                                // Check if points is null or empty statement
                                if(pointValue == null || pointValue.length <= 1){ 
                                    driverRaceObject.points = 0;
                                    driverRaceObject.status = null;
                                    driverRaceObject.reason = null;
                                }
                                // handle statuses that's not Pts
                                else if(!(pointValue.includes('Pts'))){
                                    // Set points to 0
                                    driverRaceObject.points = 0;

                                    // Set status = whatever point value is
                                    driverRaceObject.status = placeValue 

                                    // Set reason - regex to get after the dash
                                    let tempList = pointValue.split('-');
                                    let reason = tempList[1].trim();
                                    driverRaceObject.reason = reason;
                                }
                                // Handle regular Pts
                                else{
                                    // Change # Pts to an integer
                                    let pointNumber = pointValue.replace(' Pts', '');
                                    driverRaceObject.points = parseFloat(pointNumber);
                                    driverRaceObject.status = null;
                                    driverRaceObject.reason = null;
                                }
                                driverResultsList.push(driverRaceObject);
                            }
                        }
                        catch(e){
                            console.log('year: ' + year + ', i: ' + i + ' j: ' + j);
                            console.log('error: ' + e + '\n');
                        }
                        
                    } 
                    driverYearObject.results = driverResultsList;
                    allDriversList.push(driverYearObject);
                }

                // Close the new page
                await newPage.close();
                await page.bringToFront();
                await page.waitFor(100);
            }
            
        }
    }

    browser.close();

    // Export to JSON
    testArrayJSON = JSON.stringify(allDriversList);
    var fs = require('fs');
    fs.writeFile("../data/Drivers.json", testArrayJSON, function(err) {
        if (err) {
            console.log(err);
        }
    });

    // Add to Mongo
    const client = new MongoClient(uri);
    try{
        await client.connect();
        const result = await client.db("F1").collection("Drivers").insertMany(allDriversList);
        console.log(result.insertedIds);
    }
    catch(e){
        console.log("Error: " + e);
    }
    finally{
        await client.close();
    }
}

scrape().catch(console.error);