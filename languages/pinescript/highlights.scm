; Comments
(comment) @comment

; Strings
(string) @string

; Numbers
(number) @number

; Booleans and na
(boolean) @constant.builtin
(na) @constant.builtin

; Version declaration
(version_declaration) @keyword.directive

; Indicator/Strategy declaration
(indicator_declaration) @keyword.function

; Function definitions
(function_definition
  name: (identifier) @function.definition)

; Function calls
(function_call
  name: (identifier) @function)

; Parameters
(parameter
  name: (identifier) @variable.parameter)

; Variable declarations
(variable_declaration
  name: (identifier) @variable)

; Assignments
(assignment
  left: (identifier) @variable)

; For loop variable
(for_statement
  name: (identifier) @variable)

; Keywords
[
  "if"
  "else"
  "for"
  "to"
  "by"
  "return"
  "var"
  "varip"
  "const"
  "while"
  "switch"
  "library"
  "and"
  "or"
  "not"
] @keyword

; Operators
[
  "="
  ":="
  "+"
  "-"
  "*"
  "/"
  "<"
  ">"
  "<="
  ">="
  "=="
  "!="
  "=>"
] @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

[
  ","
] @punctuation.delimiter

; Fallback - identifiers
(identifier) @variable
