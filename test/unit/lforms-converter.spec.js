/**
 * Created by akanduru on 9/16/15.
 */
'use strict';

describe('Test lforms-converter', function() {
  var converter = null;

  it('should fetch and convert test/bJ5Sm82g8.json', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/bJ5Sm82g8.json', function(lfData) {
      expect(lfData.items.length).toEqual(2);
      expect(lfData.items[0].items.length).toEqual(10);
      expect(lfData.items[1].items.length).toEqual(2);
      expect(lfData.type).toEqual('CDE'); // Default

      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    });
  });

  it('should do the same with caller supplied fields', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/bJ5Sm82g8.json', function(lfData) {
      expect(lfData.type).toEqual('XXXXX');
      expect(lfData.template).toEqual('form-view-b');

      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    }, {type: 'XXXXX', template: 'form-view-b'});
  });


  it('should convert instructions', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/bJ5Sm82g8.json', function(lfData) {
      expect(lfData.items[0].items[0].codingInstructions).toEqual(
        decodeURIComponent('<p>Sample <b>rich text</b>%C2%A0instructions</p>'));
      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    });
  });


  it('should convert restrictions', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/bJ5Sm82g8.json', function(lfData) {
      expect(lfData.items[0].items[9].restrictions[0].name).toEqual('minInclusive');
      expect(lfData.items[0].items[9].restrictions[0].value).toEqual(0);
      expect(lfData.items[0].items[9].restrictions[1].name).toEqual('maxInclusive');
      expect(lfData.items[0].items[9].restrictions[1].value).toEqual(100);
      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    });
  });


  it('should regard elementType "form" as a section', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/X1WzZIqZBf.json', function(lfData) {
      expect(lfData.items[0].items[0].question).toEqual(
        'Congenital adrenal hyperplasia newborn screening panel');
      expect(lfData.items[0].items[0].header).toBe(true);
      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    });
  });


  it('should convert "required" to min cardinality', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/my8_b85WHM.json', function(lfData) {
      var questionList = lfData.items[0].items;
      var codeToQuestion = {};
      for (var i=0, len=questionList.length; i<len; ++i)
        codeToQuestion[questionList[i].questionCode] = questionList[i];
      var nonReqQ = codeToQuestion['57716-3'];
      expect(nonReqQ.answerCardinality.min).toBe('0');
      var requiredQ = codeToQuestion['57713-0'];
      expect(requiredQ.answerCardinality.min).toBe('1');
      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    });
  });


  it('should convert "multiselect" to max cardinality', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/my8_b85WHM.json', function(lfData) {
      var questionList = lfData.items[0].items;
      var codeToQuestion = {};
      for (var i=0, len=questionList.length; i<len; ++i)
        codeToQuestion[questionList[i].questionCode] = questionList[i];
      var nonMultiQ = codeToQuestion['57716-3'];
      expect(nonMultiQ.answerCardinality.max).toBe('1');
      var multiQ = codeToQuestion['57713-0'];
      expect(multiQ.answerCardinality.max).toBe('*');
      done();
    }, function(err) {
      done.fail(JSON.stringify(err));
    });
  });

  it('should convert displayProfiles (matrix display for answer lists)', function(done) {
    converter = new LFormsConverter();
    converter.convert('test/Q1S9NhOK8e.json', function(lfData) {
      expect(lfData.items[0].displayControl).toEqual({questionLayout: 'matrix'});
      expect(lfData.items[1].displayControl).toEqual({questionLayout: 'matrix'});
      expect(lfData.template).toEqual('list');
      done();
    }, function(err) {
      done(err);
    });
  });
  
  it('should test traverseItems() ', function() {
    var visit = [];

    traverseItems(lformsConverterItemTraversalTree, function(x, ancestors) {
      visit.push(x.visit);
      expect(x.expectedPath).toEqual(_.pluck(ancestors, 'thisIndex'));
    }, []);

    expect(visit).toEqual([1,2,3,4,5,6]);

  });

  describe('should test traverseItemsUpside() ', function() {

    it('should pass with valid input', function() {
      var visit = [];
      traverseItemsUpside(testNodeForUpsideTraversal6.startingNode, function(x) {
        visit.push(x.visit);
      }, testNodeForUpsideTraversal6.ancestors);

      expect(visit).toEqual([6,5,4,2,1]);
    });

    it('should throw error with invalid starting node', function() {
      expect(function () {traverseItemsUpside(testNodeForUpsideTraversalFail.startingNode, function(x) {
      }, testNodeForUpsideTraversalFail.ancestors)}).toThrow(new TypeError('Invalid ancestral path'));
    });
  });
});
