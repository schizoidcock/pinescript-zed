; Comments
(comment) @comment

; Strings
(string) @string

; Numbers  
(number) @number

; Booleans
(boolean) @constant.builtin

; NA value
(na) @constant.builtin

; Version declaration
(version_declaration) @keyword.directive

; Indicator/Strategy/Library declaration
(indicator_declaration) @keyword.function

; Function definitions
(function_definition
  name: (identifier) @function.definition)

; Function calls
(function_call
  name: (identifier) @function.call)

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

; Declaration keywords
[
  "var"
  "varip" 
  "const"
] @keyword.storage

; Control flow keywords
[
  "if"
  "else"
  "for"
  "to"
  "by"
  "while"
  "switch"
  "return"
] @keyword.control

; Declaration keywords
[
  "indicator"
  "strategy"
  "study"
  "library"
  "method"
] @keyword.function

; Logical operators (these are keywords)
["and" "or" "not"] @keyword.operator

; Binary expression operators - capture via field
(binary_expression
  operator: _ @operator)

; Unary expression operators
(unary_expression
  operator: _ @operator)

; Assignment operators
(assignment) @operator

; Arrow in function definitions
"=>" @operator

; Punctuation brackets
["(" ")" "[" "]" "{" "}"] @punctuation.bracket

; Punctuation delimiter
[","] @punctuation.delimiter

; Fallback - identifiers
(identifier) @variable