function Renderer() {
  var self = this;

  this.visit_var = function(node, vars) {
    return node.token.value;
  };

  this.visit_comparison_op = function(node, _) {
    return self.renderBoolean(node);
  };

  this.visit_and = function(node, _) {
    return "(" + self.renderBoolean(node) + ")";
  };

  this.visit_or = function(node, _) {
    return "(" + self.renderBoolean(node) + ")";
  };

  this.visit_not = function(node, _) {
    return node.token.value + ' ' + self.render(node.operand);
  };

  this.renderBoolean = function(node) {
    return self.render(node.left) + " " + node.token.value + " " + self.render(node.right);
  };

  this.render = function(node) {
    return node.accept(self, null);
  };
};
