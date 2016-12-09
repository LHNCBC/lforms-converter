/**
 * Originally copied from https://github.com/cucumber/bool/tree/master/javascript
 * and modified for this project needs.
 *
 * A node visitor to traverse and process AST. This is mainly used to test 
 * expressions.
 */
if(typeof LForms === 'undefined') {
  window.LForms = {};
}

(function (LForms) {
  LForms.Evaluator = function () {
    "use strict";
    var self = this;

    /**
     * Process the node
     * @param node - Node in context
     * @param vars - Array of possible variables under this node.
     *               Mainly for testing the extracted variables.
     * @returns {boolean}
     */
    this.visit = function (node, vars) {
      var ret = false;

      switch (node.token.type) {
        case 'TOKEN_STR':
          ret = vars.indexOf(node.token.value) != -1;
          break;

        case 'TOKEN_AND':
        case 'comparisonOp':
          ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
          break;

        case 'TOKEN_OR':
          ret = self.evaluate(node.left, vars) || self.evaluate(node.right, vars);
          break;

        case 'TOKEN_NOT':
          ret = !self.evaluate(node.operand, vars);
          break;
      }

      return ret;
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
})(LForms);
