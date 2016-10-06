'use strict';


  describe('Should test lforms-converter', function () {

    var page = require('./demopage.po');


    beforeAll(function() {
      setAngularSite(true);
      browser.get('/');
    });


    it('should display converted lforms widget', function() {
      expect(page.panelTitle.getText()).toBe('Test LForms');
    });


    it('should display LOINC code for LOINC item', function() {
      page.displayCodeCheckbox.click();
      expect(page.loincCodeLabel.isPresent()).toBeTruthy();
    });


    it('should display number input boxes', function() {
      var el = page.itemIntType.getWebElement();
      expect(el.getAttribute('ng-switch-when')).toBe('INT');
      expect(el.getAttribute('placeholder')).toBe('Type a number');
      el = page.itemNumberType.getWebElement();
      expect(el.getAttribute('ng-switch-when')).toBe('REAL');
      expect(el.getAttribute('placeholder')).toBe('Type a number');
    });


    it('should display required popup', function() {
      page.itemRequired.click();
      // Popup error message displays when the user enters empty string and leaves the field.
      page.itemRequired.sendKeys(' ');
      page.itemIntType.click(); // Click on something else to generate blur event.
      page.waitForDisplayed(page.itemRequiredPopup);
      expect(page.itemRequiredPopup.isDisplayed()).toBeTruthy();
    });


    describe('should test skip logic', function () {


      it('Should hide targets', function() {
        expect(page.skipLogicTarget1.isPresent()).toBeFalsy();
        expect(page.skipLogicTarget2.isPresent()).toBeFalsy();
      });


      it('Should display targets on setting source to Yes', function() {
        // Trigger with source
        page.skipLogicSource.sendKeys('Yes');
        page.skipLogicSource.sendKeys(protractor.Key.TAB);

        expect(page.skipLogicTarget1.isDisplayed()).toBeTruthy();
        expect(page.skipLogicTarget2.isDisplayed()).toBeTruthy();
      });
    });


    describe('should test help popover', function () {

      it('should display coding instructions', function() {
        expect(page.helpButton.isDisplayed()).toBeTruthy();
        page.helpButton.click();
        expect(page.instructions.isDisplayed()).toBeTruthy();
      });
    });

    describe('should test matrix display', function () {

      beforeAll(function() {
        page.formSelector.click();
        page.formSelector.$('[value="test/Q1S9NhOK8e.json"]').click();
      });

      it('should display matrix display for answer lists', function() {
        expect(page.matrixRadioButtons.count()).toBe(40);
      });
    });

  });
