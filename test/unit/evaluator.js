/**
 * Originally copied from https://github.com/cucumber/bool/tree/master/javascript
 * and modified for this project needs.
 *
 * A node visitor to traverse and process AST. This is mainly used to test 
 * validity of expressions and TOKEN_VARs visited.
 */
if(typeof LForms === 'undefined') {
  window.LForms = {};
}

(function (LForms) {
  LForms.Evaluator = function () {
    "use strict";
    var self = this;

    /**
     * Process the node. Tests tree traversal with the list of valid nodes to visit, 
     *   and evaluates the expression. Any unlisted nodes visited evaluates to false.

     * @param node - Node in context
     * @param vars - Array of valid TOKEN_VARs to visit. Any unlisted nodes
     *               are invalid.
     * @returns {boolean}
     */
    this.visit = function (node, vars) {
      var ret = false;

      switch (node.token.type) {
        case 'TOKEN_STR':
          ret = vars.indexOf(node.token.value) != -1;
          break;

        case 'TOKEN_AND':
          ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
          break;

        case 'TOKEN_OR':
          ret = self.evaluate(node.left, vars) || self.evaluate(node.right, vars);
          break;

        case 'comparisonOp':
          ret = self.evaluate(node.left, vars) && self.evaluate(node.right, vars);
          switch (node.token.value) {
            case '=':
              ret = ret ? (node.left.token.value === node.right.token.value ? true : false) : ret;
              break;
            case '<':
              ret = ret ? (node.left.token.value < node.right.token.value ? true : false) : ret;
              break;
            case '>':
              ret = ret ? (node.left.token.value > node.right.token.value ? true : false) : ret;
              break;
            case '>=':
              ret = ret ? (node.left.token.value >= node.right.token.value ? true : false) : ret;
              break;
            case '<=':
              ret = ret ? (node.left.token.value <= node.right.token.value ? true : false) : ret;
              break;
          }
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
