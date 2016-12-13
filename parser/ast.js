/**
 * Originally copied from javascript part of https://github.com/cucumber/bool
 * and modified for this project's needs.
 * 
 * Abstract Syntax Tree (AST)
 * Each node has accept method to facilitate a visitor to traverse the tree.
 * 
 * Returns AST containing classes for each token type.
 */

if(typeof LForms === 'undefined') {
  window.LForms = {};
}

(function (LForms) {
  "use strict";


  /**
   * Ast implements all node classes. Every node should implement accept(nodeVisitor, data).
   *
   * The nodeVisitor is expected to implement visit(node, data) with the following signature.
   * 
   * nodeVisitor.visit(node, data):
   *   @param node - The node it is visiting.
   *   @param data - An array of user data passed by the caller.
   *   @returns {boolean}   
   */
  LForms.Ast = {


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
    Var: function(value, tokenType) {
      
      this.token = new LForms.Ast.Token(value, tokenType);

      /**
       * Mandatory method of node class
       */
      this.accept = function(visitor, data) {
        return visitor.visit(this, data);
      }
    },


    /**
     * Node representing comparison operators
     *
     * @param token - Token representing this node
     * @param left - Left expression
     * @param right - Right expression
     */
    ComparisonOp: function(value, tokenType, left, right) {
      this.token = new LForms.Ast.Token(value, tokenType);
      this.left = left;
      this.right = right;

      /**
       * Mandatory method of node class
       */
      this.accept = function(visitor, data) {
        return visitor.visit(this, data);
      }
    },


    /**
     * Node representing boolean operator.
     *
     * @param token - Token representing this node
     * @param left - Left expression
     * @param right - Right expression
     */
    Bool: function(value, tokenType, left, right) {
      this.token = new LForms.Ast.Token(value, tokenType);
      this.left = left;
      this.right = right;

      /**
       * Mandatory method of node class
       */
      this.accept = function(visitor, data) {
        return visitor.visit(this, data);
      }
    },


    /**
     * Node representing NOT operator.
     *
     * @param token - Token representing this node
     * @param operand - Operand of NOT
     */
    Not: function(value, tokenType, operand) {
      this.token = new LForms.Ast.Token(value, tokenType);
      this.operand = operand;

      /**
       * Mandatory method of node class
       */
      this.accept = function(visitor, data) {
        return visitor.visit(this, data);
      }
    }
  };
})(LForms);

  
