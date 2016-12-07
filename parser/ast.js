/**
 * Originally copied from https://github.com/cucumber/bool/tree/master/javascript 
 * and modified for this project needs.
 * 
 * Abstract Syntax Tree (AST)
 * Each node has accept method to facilitate a visitor to traverse the tree.
 * 
 * Returns AST containing classes for each token type.
 */
var ast = (function() {
  var ast = {


    /**
     * Token
     * 
     * @param value - Value of the token 
     */
    Token: function(value) {
      this.value = value;
    },


    /**
     * VAR node.
     * 
     * @param value - Token representing this node
     */
    Var: function(token) {
      this.token = token;

      this.accept = function(visitor, args) {
        return visitor.visit_var(this, args);
      }
    },


    /**
     * Node representing comparison operators
     *
     * @param token - Token representing this node
     * @param left - Left expression
     * @param right - Right expression
     */
    ComparisonOp: function(token, left, right) {
      this.token = token;
      this.left = left;
      this.right = right;

      this.accept = function(visitor, args) {
        return visitor.visit_comparison_op(this, args);
      }
    },


    /**
     * Node representing boolean operator.
     *
     * @param token - Token representing this node
     * @param left - Left expression
     * @param right - Right expression
     */
    Bool: function(token, left, right) {
      this.token = token;
      this.left = left;
      this.right = right;

      this.accept = function(visitor, args) {
        return visitor.visit_bool(this, args);
      }
    },


    /**
     * Node representing NOT operator.
     *
     * @param token - Token representing this node
     * @param operand - Operand of NOT
     */
    Not: function(token, operand) {
      this.token = token;
      this.operand = operand;

      this.accept = function(visitor, args) {
        return visitor.visit_not(this, args);
      }
    }
  };
  
  return ast;
})();
