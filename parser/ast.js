var ast = (function() {
  var ast = {
    Token: function(value) {
      this.value = value;
    },

    Var: function(token) {
      this.token = token;

      this.accept = function(visitor, args) {
        return visitor.visit_var(this, args);
      }
    },

    ComparisonOp: function(token, left, right) {
      this.token = token;
      this.left = left;
      this.right = right;

      this.accept = function(visitor, args) {
        return visitor.visit_comparison_op(this, args);
      }
    },

    Bool: function(token, left, right) {
      this.token = token;
      this.left = left;
      this.right = right;

      this.accept = function(visitor, args) {
        return visitor.visit_bool(this, args);
      }
    },

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
