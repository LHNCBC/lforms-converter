// Start conditions for capturing quoted strings
%x singleQString
%x doubleQString

%%

"'"                            { this.begin('singleQString'); }
"\""                           { this.begin('doubleQString'); }

<singleQString>(\\.|[^\\'])+   { return 'TOKEN_VAR'; }
<doubleQString>(\\.|[^\\"])+   { return 'TOKEN_VAR'; }

<singleQString>"'"             { this.begin('INITIAL'); }
<doubleQString>"\""            { this.begin('INITIAL'); }
\s+                            { /* skip whitespace */ }
"AND"                          { return 'TOKEN_AND'; }
"OR"                           { return 'TOKEN_OR'; }
"NOT"                          { return 'TOKEN_NOT'; }
"("                            { return 'TOKEN_LPAREN'; }
")"                            { return 'TOKEN_RPAREN'; }
"\""                           { return 'TOKEN_DOUBLE_QUOTE'; }
"\'"                           { return 'TOKEN_SINGLE_QUOTE'; }
"<="                           { return 'TOKEN_LTE'; }
">="                           { return 'TOKEN_GTE'; }
"<"                            { return 'TOKEN_LT'; }
">"                            { return 'TOKEN_GT'; }
"="                            { return 'TOKEN_EQ'; }
[^=<>()"'\s]+                  { return 'TOKEN_VAR'; }
<<EOF>>                        { return 'EOF'; }

%%


