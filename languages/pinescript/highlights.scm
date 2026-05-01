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

; Type identifiers (int, string, bool, color, etc.)
(type_identifier) @type.builtin

; Indicator/Strategy/Library declaration
(indicator_declaration
  (string) @string)

; Function definitions: name(params) =>
(function_definition
  name: (identifier) @function.definition)

; Method definitions: method name(params) =>
(method_definition
  name: (identifier) @function.definition)

; Typed parameters in function definitions
(typed_parameter
  name: (identifier) @variable.parameter)

; Function calls
(function_call
  name: (identifier) @function.call)

; Method calls: input.string(), color.new()
(method_call
  object: (identifier) @module
  method: (identifier) @function.method)

; Member access: color.purple, timeframe.period
(member_expression
  object: (identifier) @module
  property: (identifier) @property)

; Subscript access: time[1], array[i]
(subscript_expression
  "[" @punctuation.bracket
  "]" @punctuation.bracket)

; Ternary expression
(ternary_expression
  "?" @operator
  ":" @operator)

; Named arguments: overlay=true, group=GROUP_CONFIG
(named_argument
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

; Storage keywords
["var" "varip" "const"] @keyword.storage

; Control flow keywords
["if" "else" "for" "to" "by" "while" "switch" "return"] @keyword.control

; Declaration keywords
["indicator" "strategy" "study" "library"] @keyword.function

; Method keyword
"method" @keyword.function

; Logical operators
["and" "or" "not"] @keyword.operator

; Binary expression operators
(binary_expression
  operator: _ @operator)

; Unary expression operators
(unary_expression
  operator: _ @operator)

; Assignment operators
["=" ":="] @operator

; Arrow operator
"=>" @operator

; Punctuation brackets
["(" ")" "[" "]" "{" "}"] @punctuation.bracket

; Punctuation delimiter
["," "."] @punctuation.delimiter

; Identifiers (fallback)
(identifier) @variable