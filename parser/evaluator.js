function Evaluator() {
  "use strict";
  var self = this;

  this.visit_var = function(node, vars) {
    return vars.indexOf(node.token.value) != -1;
  };

  this.visit_comparison_op = function(node, vars) {
    return self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
  };

  this.visit_bool = function(node, vars) {
    var ret = false;
    if(node.token.value === 'AND') {
      ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
    }
    else if(node.token.value === 'OR') {
      ret = self.evaluate(node.left, vars) || self.evaluate(node.right, vars);
    }
    return ret;
  };

  this.visit_not = function(node, vars) {
    return !self.evaluate(node.operand, vars);
  };

  this.evaluate = function(node, vars) {
    return node.accept(self, vars);
  }
};
