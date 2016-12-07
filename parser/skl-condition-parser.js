function SkipLogicConditionParser() {
  "use strict";
  var self = this;
  this.skipLogic = null;
  this.error = null;
  this.warnings = null;

  this.visit_var = function(node, vars) {
    var ret = true;
    if(vars) {
      ret = vars.indexOf(node.token.value) != -1;
    }
    return ret;
  };

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

  this.visit_and = function(node, vars) {
    return self.visit_bool(node, vars);
  };

  this.visit_or = function(node, vars) {
    return self.visit_bool(node, vars);
  };

  this.visit_not = function(node, vars) {
    return !self.evaluate(node.operand, vars);
  };

  this.evaluate = function(node, vars) {
    return node.accept(self, vars);
  };

  this.getSkipLogic = function() {
    return self.skipLogic;
  };

  this.parse = function(input) {
    try {
      var expr = sklParser.parse(input);
      self.reset();
      expr.accept(self);
    }
    catch(ex) {
      self.error = ex.message;
    }
    finally {
      return self.getSkipLogic();
    }
  };
  
  this.reset = function() {
    self.skipLogic = null;
    self.error = null;
    self.warnings = null;
  };
  
}
