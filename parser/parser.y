%token TOKEN_VAR
%token TOKEN_AND
%token TOKEN_OR
%token TOKEN_NOT
%token TOKEN_LPAREN
%token TOKEN_RPAREN
%token TOKEN_LTE
%token TOKEN_GTE
%token TOKEN_LT
%token TOKEN_GT
%token TOKEN_EQ

%left TOKEN_OR
%left TOKEN_AND
%left TOKEN_LTE TOKEN_GTE TOKEN_LT TOKEN_GT TOKEN_EQ
%left UNOT

%start expressions

%%

expressions
    : expr EOF      { return $1; }
    ;

expr
    : condition_expr                  { $$ = $1; }
    | expr TOKEN_AND expr             { $$ = new ast.And(new ast.Token($2), $1, $3); }
    | expr TOKEN_OR expr              { $$ = new ast.Or(new ast.Token($2), $1, $3); }
    | TOKEN_NOT expr %prec UNOT       { $$ = new ast.Not(new ast.Token($1), $2); }
    | TOKEN_LPAREN expr TOKEN_RPAREN  { $$ = $2; }
    ;

condition_expr
    : condition_str                            { $$ = $1; }
    | condition_str condition_op condition_str { $$ = new ast.ComparisonOp(new ast.Token($2), $1, $3); }
    ;

condition_str
    : TOKEN_VAR                                       { $$ = new ast.Var(new ast.Token($1)); }
    | TOKEN_DOUBLE_QUOTE TOKEN_VAR TOKEN_DOUBLE_QUOTE { $$ = $2; }
    | TOKEN_SINGLE_QUOTE TOKEN_VAR TOKEN_SINGLE_QUOTE { $$ = $2; }
    ;

condition_op
    : TOKEN_LTE { $$ = $1; }
    | TOKEN_GTE { $$ = $1; }
    | TOKEN_LT  { $$ = $1; }
    | TOKEN_GT  { $$ = $1; }
    | TOKEN_EQ  { $$ = $1; }
    ;
%%

// Load our AST code
//var ast = require('./ast');

// Install more detailed error reporting
//var SyntaxError = require('./syntax_error');
parser.parseError = function parseError(message, hash) {
    throw new SyntaxError(message, hash);
};

// Hook up our lexer
//var lexer = require('./lexer');
parser.lexer = lexer;
