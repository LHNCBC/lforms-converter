/**
 * A node visitor to traverse AST.It builds the lforms skip logic conditions
 * as it traverses AST.
 */
function SkipLogicConditionParser() {
  "use strict";
  var self = this;
  this.skipLogic = null;
  this.error = null;
  this.warnings = null;


  /**
   * Process variable
   * @param node - Node in context
   * @param vars - Array of possible variables under this node.
   *               Mainly for testing the extracted variables.
   * @returns {boolean}
   */
  this.visit_var = function(node, vars) {
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
  
  this.visit_comparison_op = function(node, vars) {
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
  this.visit_bool = function(node, vars) {
    var ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
    if(ret) {
      if(!self.skipLogic.logic) {
        self.skipLogic.logic = node.token.value;
      }
      else if(self.skipLogic.logic !== node.token.value) {
        ret = false;
        if(!self.warnings) {
          self.warnings = [];
        }
        self.warnings.push('Mixed boolean logic encountered. Only either all "AND" or all "OR" logic is supported.');
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
  this.visit_not = function(node, vars) {
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
      var expr = sklParser.parse(input);
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
  
}
