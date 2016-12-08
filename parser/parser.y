%left TOKEN_AND TOKEN_OR
%left TOKEN_LTE TOKEN_GTE TOKEN_LT TOKEN_GT TOKEN_EQ
%left UNOT

%start expressions

%%

expressions
    : expr EOF      { return $1; }
    ;

expr
    : conditionExpr                  { $$ = $1; }
    | expr TOKEN_AND expr             { $$ = new ast.Bool(new ast.Token($2, 'TOKEN_AND'), $1, $3); }
    | expr TOKEN_OR expr              { $$ = new ast.Bool(new ast.Token($2, 'TOKEN_OR'), $1, $3); }
    | TOKEN_NOT expr %prec UNOT       { $$ = new ast.Not(new ast.Token($1, 'TOKEN_NOT'), $2); }
    | TOKEN_LPAREN expr TOKEN_RPAREN  { $$ = $2; }
    ;

conditionExpr
    : conditionStr                            { $$ = $1; }
    | conditionStr comparisonOp conditionStr { $$ = new ast.ComparisonOp(new ast.Token($2, 'comparisonOp'), $1, $3); }
    ;

conditionStr
    : TOKEN_STR                                       { $$ = new ast.Var(new ast.Token($1, 'TOKEN_STR')); }
    | TOKEN_DOUBLE_QUOTE TOKEN_STR TOKEN_DOUBLE_QUOTE { $$ = new ast.Var(new ast.Token($2, 'TOKEN_STR')); }
    | TOKEN_SINGLE_QUOTE TOKEN_STR TOKEN_SINGLE_QUOTE { $$ = new ast.Var(new ast.Token($2, 'TOKEN_STR')); }
    ;

comparisonOp
    : TOKEN_LTE { $$ = $1; }
    | TOKEN_GTE { $$ = $1; }
    | TOKEN_LT  { $$ = $1; }
    | TOKEN_GT  { $$ = $1; }
    | TOKEN_EQ  { $$ = $1; }
    ;
%%

// Install more detailed error reporting
function SyntaxError(message, hash) {
    this.name = "SyntaxError";
    this.message = message;
    this.hash = hash;
}
SyntaxError.prototype = Error.prototype;

parser.parseError = function(message, hash) {
    throw new SyntaxError(message, hash);
};

// Hook up our lexer
parser.lexer = lexer;
