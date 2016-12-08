/**
 * Originally copied from javascript part of https://github.com/cucumber/bool
 * and modified for this project's needs.
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
    Token: function(value, tokenType) {
      this.value = value;
      this.type = tokenType;
    },


    /**
     * VAR node.
     * 
     * @param value - Token representing this node
     */
    Var: function(token) {
      this.token = token;

      this.accept = function(visitor, args) {
        return visitor.visit(this, args);
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
        return visitor.visit(this, args);
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
        return visitor.visit(this, args);
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
        return visitor.visit(this, args);
      }
    }
  };
  
  return ast;
})();
