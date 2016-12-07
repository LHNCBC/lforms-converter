/**
 * Originally copied from https://github.com/cucumber/bool/tree/master/javascript
 * and modified for this project needs.
 *
 * A node visitor to traverse and process AST. This is mainly used to test 
 * expressions.
 */
function Evaluator() {
  "use strict";
  var self = this;


  /**
   * Process Var node
   * @param node - Node in context
   * @param vars - Array of possible variables under this node.
   *               Mainly for testing the extracted variables.
   * @returns {boolean}
   */
  this.visit_var = function(node, vars) {
    return vars.indexOf(node.token.value) != -1;
  };


  /**
   * Process comparison node
   * @param node - Node in context
   * @param vars - Array of possible variables under this node.
   *               Mainly for testing the extracted variables.
   * @returns {boolean}
   */
  this.visit_comparison_op = function(node, vars) {
    return self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
  };


  /**
   * Process boolean node
   * @param node - Node in context
   * @param vars - Array of possible variables under this node.
   *               Mainly for testing the extracted variables.
   * @returns {boolean}
   */
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


  /**
   * Process NOT node
   * @param node - Node in context
   * @param vars - Array of possible variables under this node.
   *               Mainly for testing the extracted variables.
   * @returns {boolean}
   */
  this.visit_not = function(node, vars) {
    return !self.evaluate(node.operand, vars);
  };


  /**
   * Evaluate and traverse the node further down the tree
   * @param node - Node in context
   * @param vars - Array of possible variables under this node.
   *               Mainly for testing the extracted variables.
   * @returns {boolean}
   */
  this.evaluate = function(node, vars) {
    return node.accept(self, vars);
  };
}
