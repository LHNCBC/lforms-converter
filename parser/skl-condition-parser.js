/**
 * A node visitor to traverse AST.It builds the lforms skip logic conditions
 * as it traverses AST.
 */
if (typeof LForms === 'undefined') {
  window.LForms = {};
}

(function (LForms) {
  "use strict";
  LForms.SkipLogicConditionParser = function () {
    "use strict";
    var self = this;
    this.skipLogic = null;
    this.error = null;
    this.warnings = null;


    this.visit = function (node, vars) {
      var ret = false;

      switch (node.token.type) {
        case 'TOKEN_STR':
          ret = self.visitVar(node, vars);
          break;

        case 'comparisonOp':
          ret = self.visitComparisonOp(node, vars);
          break;

        case 'TOKEN_AND':
        case 'TOKEN_OR':
          ret = self.visitBool(node, vars);
          break;

        case 'TOKEN_NOT':
          ret = self.visitNot(node, vars);
          break;

        default:
          ret = false;
          self.createWarning('Unknown token encountered at "' +
            node.value + '": '  + node.token.type);
          break;
      }

      return ret;
    };

    /**
     * Process variable
     * @param node - Node in context
     * @param vars - Array of possible variables under this node.
     *               Mainly for testing the extracted variables.
     * @returns {boolean}
     */
    this.visitVar = function(node, vars) {
      var ret = true;
      if(vars) {
        ret = vars.indexOf(node.token.value) != -1;
      }
      return ret;
    };


    /**
     * Process comparison operator
     * @param node - Node in context
     * @param vars - Array of possible variables under this node.
     *               Mainly for testing the extracted variables.
     * @returns {boolean}
     */

    this.visitComparisonOp = function(node, vars) {
      var ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
      if(ret) {
        var condition = {};
        var conditionSource = node.left.token.value;
        var conditionValue = node.right.token.value;
        var trigger = {};
        switch (node.token.value) {
          case "=":
            trigger.value = conditionValue;
            break;
          case "<":
            trigger.maxExclusive = conditionValue;
            break;
          case ">":
            trigger.minExclusive = conditionValue;
            break;
          case "<=":
            trigger.maxInclusive = conditionValue;
            break;
          case ">=":
            trigger.minInclusive = conditionValue;
            break;
        }
        if(Object.keys(trigger).length >= 0) {
          condition.source = conditionSource;
          condition.trigger = trigger;
          if(!self.skipLogic) {
            self.skipLogic = {conditions: []};
          }
          self.skipLogic.conditions.push(condition);
        }
      }
      return ret;
    };


    /**
     * Process boolean operator
     * @param node - Node in context
     * @param vars - Array of possible variables under this node.
     *               Mainly for testing the extracted variables.
     * @returns {boolean}
     */
    this.visitBool = function(node, vars) {
      var ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
      if(ret) {
        if(!self.skipLogic.logic) {
          self.skipLogic.logic = node.token.value;
        }
        else if(self.skipLogic.logic !== node.token.value) {
          ret = false;
          self.createWarning('Mixed boolean logic encountered. Only either all "AND" or all "OR" logic is supported.');
        }
      }

      return ret;
    };


    /**
     * Process NOT operator
     * @param node - Node in context
     * @param vars - Array of possible variables under this node.
     *               Mainly for testing the extracted variables.
     * @returns {boolean}
     */
    this.visitNot = function(node, vars) {
      return self.evaluate(node.operand, vars);
    };


    /**
     * Traverse and process the tree further.
     *
     * @param node - Node in context
     * @param vars - Array of possible variables under this node.
     *               Mainly for testing the extracted variables.
     * @returns {boolean}
     */
    this.evaluate = function(node, vars) {
      return node.accept(self, vars);
    };


    /**
     * Get the skip logic object
     *
     * @returns {null|*}
     */
    this.getSkipLogic = function() {
      return self.skipLogic;
    };


    /**
     * Parses the input expression and returns the skip logic object.
     *
     * @param input
     * @returns {null|*}
     */
    this.parse = function(input) {
      try {
        var expr = LForms.sklParser.parse(input);
        self.reset();
        expr.accept(self);
      }
      catch(ex) {
        // Record the error.
        self.error = ex.message;
      }
      finally {
        return self.getSkipLogic();
      }
    };


    /**
     * Reset for possible reuse.
     */
    this.reset = function() {
      self.skipLogic = null;
      self.error = null;
      self.warnings = null;
    };


    /**
     * Add a new warning
     *
     * @param warning - Warning string
     */
    this.createWarning = function (warning) {
      if(!self.warnings) {
        self.warnings = [];
      }
      self.warnings.push(warning);
    };
  }
    
})(LForms);

