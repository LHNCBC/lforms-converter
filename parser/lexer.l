// 'Start conditions' for capturing quoted strings
%x singleQString
%x doubleQString

%%

// Start string capturing mode.
"'"                            { this.begin('singleQString'); }
"\""                           { this.begin('doubleQString'); }

// Everything within the quotes is a string. Allow escaping.
<singleQString>(\\.|[^\\'])+   { return 'TOKEN_STR'; }
<doubleQString>(\\.|[^\\"])+   { return 'TOKEN_STR'; }

// End string capturing
<singleQString>"'"             { this.begin('INITIAL'); }
<doubleQString>"\""            { this.begin('INITIAL'); }

\s+                            { /* skip whitespace */ }

// Terminal tokens.
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

// Non quoted string.
[^=<>()"'\s]+                  { return 'TOKEN_STR'; }
<<EOF>>                        { return 'EOF'; }

%%


