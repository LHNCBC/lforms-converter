
describe('Using Evaluator()', function() {
  "use strict";
  var parser = sklParser;
  it('Does it all boolean operators', function() {
    var expr = parser.parse('@a AND @b OR' +
      ' NOT @c');
    expect(expr.accept(new Evaluator(), ['@a', '@b'])).toBeTruthy();
    expect(expr.accept(new Evaluator(), ['@c'])).toBeFalsy();
    expect(expr.accept(new Evaluator(), [])).toBeTruthy();
  });

  it('Does it all boolean operators with all comparison operators', function() {
    var expr = parser.parse('(@a = @c) AND (@b > @c) OR' +
      ' NOT (@c = @b)');
    expect(expr.accept(new Evaluator(), ['@a', '@b', '@c'])).toBeTruthy();
    expect(expr.accept(new Evaluator(), ['@c', '@b'])).toBeFalsy();
    expect(expr.accept(new Evaluator(), [])).toBeTruthy();
  });

  it('double negation', function() {
    var expr = parser.parse('NOT NOT @a');
    expect(expr.accept(new Evaluator(), ['@a'])).toBeTruthy();
    expect(expr.accept(new Evaluator(), ['@b'])).toBeFalsy();
  });

  it('tag syntax', function() {
    var expr = parser.parse('NOT @a1A');
    expect(expr.accept(new Evaluator(), ['@a1A'])).toBeFalsy();
  });

  it('throws exception on parse error', function() {
    var exceptionFunc = function() {
      parser.parse(
        // line,token_start_col
        "          \n" + // 1
        "          \n" + // 2
        "  a       \n" + // 3,3
        "    OR    \n" + // 4,5
        "      c   \n" + // 5,7
        "         AND"     // 6,9
        ///0123456789
      );
    };
    expect(exceptionFunc).toThrowError(
      "Parse error on line 6:\n" +
      "...   c            AND\n" +
      "----------------------^\n" +
      "Expecting 'TOKEN_NOT', 'TOKEN_LPAREN', 'TOKEN_STR', 'TOKEN_DOUBLE_QUOTE', 'TOKEN_SINGLE_QUOTE', got 'EOF'");
    try {
      exceptionFunc();
      throw new Error('Should fail');
    }
    catch (error) {
      expect(error.hash).toEqual({
        text: '',
        token: 'EOF',
        line: 5,
        loc: { first_line: 6, last_line: 6, first_column: 9, last_column: 12 },
        expected: [ '\'TOKEN_NOT\'', '\'TOKEN_LPAREN\'', '\'TOKEN_STR\'', '\'TOKEN_DOUBLE_QUOTE\'', '\'TOKEN_SINGLE_QUOTE\'' ]
      });
    }
  });
});

describe('Using testData with SkipLogicConditionParser()', function() {
  "use strict";
  for(var test in testData) {
    // it() is async. Passing 'test' variable in multiple invocations result in 
    // referring to unpredictable values in the variable. Hence this indirection.
    (function(input) {
      it(input, function() {
        var sklParser = new SkipLogicConditionParser();
        expect(testData[input].expected).toEqual(sklParser.parse(input));
        if(testData[input].warnings) {
          expect(testData[input].warnings).toEqual(sklParser.warnings);
        }
        if(testData[input].error) {
          expect(testData[input].error).toEqual(sklParser.error);
        }
      });
    })(test);
  }
});

   