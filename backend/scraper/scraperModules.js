async function getinnerText(context, selector){
    /*
    Gets the innerText value of the selector given
    INPUTS:
    context: the page that it is on
    selector: (str) - selector used in document.querySelector()

    RETURNS:
    value: (str)
    */

   let element = await context.waitForSelector(selector);
   let value = await context.evaluate(el => el.innerText, element);
   value = value.trim();
   return value;
}

async function getchildElementCount(context, selector){
    /*
    Gets the amount of child elements in the selector given
    INPUTS:
    context: the page that it is on
    selector: (str) - selector used in document.querySelector()

    RETURNS:
    count: (int)
    */

//    let element = await context.$(selector);
    let element = await context.waitForSelector(selector);
    let count = await context.evaluate(el => el.childElementCount, element);
    count = parseInt(count);
    return count;
}

async function getAttributeValue(context, selector, attribute){
    /*
    Gets the specified attribute value of the selector
    INPUTS:
    context: the page that it is on
    selector: (str) - selector used in document.querySelector()
    attribute: (str) - attribute value that you are trying to find

    RETURNS:
    value: (str)
    */

//    let element = await context.$(selector);
    let element = await context.waitForSelector(selector);
    let value = await context.evaluate((el, attr) => {
        return el.getAttribute(attr);
    }, element, attribute);
    return value;
}

async function setAttributeValue(context, selector, attribute, attributeValue){
    /*
    Changes an HTML thing's attribute
    INPUTS:
    context: the page that it is on
    selector: (str) - selector used in document.querySelector()
    attribute: (str) - attribute that you are trying to set
    attributeValue: (str) - attribute value

    RETURNS:
    null
    */

   let element = await context.waitForSelector(selector);
   await context.evaluate((el, attr, attrValue) => {
       el.setAttribute(attr, attrValue);
   }, element, attribute, attributeValue);
}

module.exports = {
    getinnerText,
    getchildElementCount,
    getAttributeValue,
    setAttributeValue
}