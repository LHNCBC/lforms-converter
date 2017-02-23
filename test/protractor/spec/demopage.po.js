

var DemoPage = function() {
  return {
    skipLogicSource: element(by.id('/Your_Health_Information/pWj94_qVzz_/1/1Yes')),
    skipLogicTarget1: element(by.cssContainingText('span.lf-question > label', 'Alcohol use frequency')),
    skipLogicTarget2: element(by.id('/Your_Health_Information/Alcohol_Use/vfSZy6m4c7o/1/1/1')),
    panelTitle: element(by.css('lf-form-title span')),
    formSelector: element(by.id('formSelector')),
    helpButton: element.all(by.css('button.lf-help-button')).first(),
    instructions: element(by.css('div.popover-inner')),
    displayCodeCheckbox: element.all(by.css('div.lf-form-control label input[type="checkbox"]')).first(),
    loincCodeLabel: element(by.cssContainingText('div.lf-de-label > span.lf-item-code > a', '[66773-3]')),
    itemIntType: element(by.id('/Your_Disease_History/-dZecSUoNVD/1/1')),
    itemNumberType: element(by.id('/Your_Health_Information/z93OErjdWOh/1/1')),
    itemRequired: element(by.id('/Your_Health_Information/tXwaaWzu1Od/1/1')),
    itemRequiredPopup: element(by.cssContainingText('div.validation-error', 'requires a value')),
    matrixRadioButtons: element.all(by.css('div.lf-form-body input[type="radio"]')),
    genderTypeDefaultAnswer: element(by.id("/Your_Health_Information/9dPqtbFSpZU/1/1Unknown")),
    /**
     * Wait until an element is displayed. 
     * 
     * Used to wait for error popup messages. Copied from lforms test scripts.
     * 
     * @param ele
     */
    waitForDisplayed: function (ele) {
      browser.wait(function() {
        return ele.isDisplayed();
      }, 5000);
    }

  };
};
module.exports = DemoPage();
