const PREC = {
  COMMENT: 1,
  ASSIGN: 2,
  OR: 3,
  AND: 4,
  PLUS: 5,
  TIMES: 6,
  UNARY: 7,
  CALL: 8,
  RETURN: -1
};

module.exports = grammar({
  name: 'pinescript',

  extras: $ => [
    $.comment,
    /\s/
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.return_statement, $.expression],
    [$.member_expression, $.method_call],
    [$.named_argument, $.assignment],
    [$.typed_parameter, $.expression],
    [$.typed_parameter, $.named_argument],
    [$.function_definition, $.function_call]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.version_declaration,
      $.indicator_declaration,
      $.function_definition,
      $.method_definition,
      $.variable_declaration,
      $.statement,
      $.comment
    ),

    // Version declaration
    version_declaration: $ => seq(
      '@version',
      $.string
    ),

    // Indicator declaration
    indicator_declaration: $ => seq(
      choice('indicator', 'strategy', 'study', 'library'),
      $.string,
      optional($.parameter_list)
    ),

    // Function definition: name(params) => expression or block
    function_definition: $ => seq(
      field('name', $.identifier),
      '(',
      optional($.typed_parameter_list),
      ')',
      '=>',
      choice($.expression, $.block)
    ),

    // Method definition (extends types)
    method_definition: $ => seq(
      'method',
      field('name', $.identifier),
      '(',
      optional($.typed_parameter_list),
      ')',
      '=>',
      choice($.expression, $.block)
    ),

    // Typed parameter list for function definitions
    typed_parameter_list: $ => sepBy1(',', $.typed_parameter),

    typed_parameter: $ => seq(
      optional($.type_identifier),
      field('name', $.identifier),
      optional(seq('=', $.expression))
    ),

    // Variable declaration with required storage keyword or type
    variable_declaration: $ => choice(
      // With storage keyword (var/varip/const)
      seq(
        choice('var', 'varip', 'const'),
        optional($.type_identifier),
        field('name', $.identifier),
        '=',
        $.expression
      ),
      // With just type (no storage keyword)
      seq(
        $.type_identifier,
        field('name', $.identifier),
        '=',
        $.expression
      )
    ),

    // Type identifiers
    type_identifier: $ => choice(
      'int', 'float', 'bool', 'string', 'color', 'label', 'line', 'box',
      'table', 'array', 'matrix', 'map', 'series', 'simple'
    ),

    // Parameter list
    parameter_list: $ => seq(
      '(',
      sepBy(',', $.parameter),
      ')'
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      optional(seq('=', $.expression))
    ),

    // Statements
    statement: $ => choice(
      $.if_statement,
      $.for_statement,
      $.while_statement,
      $.switch_statement,
      $.assignment,
      $.function_call,
      $.return_statement
    ),

    if_statement: $ => prec.right(seq(
      'if',
      $.expression,
      $.block,
      optional(seq(
        'else',
        choice($.block, $.if_statement)
      ))
    )),

    for_statement: $ => seq(
      'for',
      field('name', $.identifier),
      '=',
      $.expression,
      'to',
      $.expression,
      optional(seq('by', $.expression)),
      $.block
    ),

    while_statement: $ => seq(
      'while',
      $.expression,
      $.block
    ),

    switch_statement: $ => seq(
      'switch',
      optional($.expression),
      $.block
    ),

    assignment: $ => seq(
      field('left', $.identifier),
      choice('=', ':='),
      $.expression
    ),

    return_statement: $ => prec.right(PREC.RETURN, seq(
      'return',
      optional(field('value', $.expression))
    )),

    // Expressions
    expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.boolean,
      $.na,
      $.array,
      $.function_call,
      $.member_expression,
      $.method_call,
      $.subscript_expression,
      $.ternary_expression,
      $.binary_expression,
      $.unary_expression,
      $.parenthesized_expression
    ),

    // Subscript access: time[1], array[i]
    subscript_expression: $ => prec(PREC.CALL, seq(
      field('object', $.expression),
      '[',
      field('index', $.expression),
      ']'
    )),

    // Ternary expression: condition ? trueExpr : falseExpr
    ternary_expression: $ => prec.right(PREC.ASSIGN, seq(
      field('condition', $.expression),
      '?',
      field('consequence', $.expression),
      ':',
      field('alternative', $.expression)
    )),

    // Member access: color.purple, ta.sma
    member_expression: $ => prec(PREC.CALL, seq(
      field('object', $.identifier),
      '.',
      field('property', $.identifier)
    )),

    // Method call: input.string(), color.new()
    method_call: $ => prec(PREC.CALL + 1, seq(
      field('object', $.identifier),
      '.',
      field('method', $.identifier),
      '(',
      optional($.argument_list),
      ')'
    )),

    binary_expression: $ => prec.left(seq(
      field('left', $.expression),
      field('operator', choice(
        '+', '-', '*', '/', '%',
        '>', '<', '>=', '<=',
        '==', '!=',
        'and', 'or'
      )),
      field('right', $.expression)
    )),

    unary_expression: $ => prec(PREC.UNARY, seq(
      field('operator', choice('-', 'not')),
      field('argument', $.expression)
    )),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    block: $ => seq(
      '{',
      repeat($._definition),
      '}'
    ),

    function_call: $ => prec(PREC.CALL, seq(
      field('name', $.identifier),
      '(',
      optional($.argument_list),
      ')'
    )),

    // Argument list with named arguments support
    argument_list: $ => sepBy1(',', $.argument),

    argument: $ => choice(
      $.named_argument,
      $.expression
    ),

    named_argument: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', $.expression)
    ),

    array: $ => seq(
      '[',
      optional(sepBy(',', $.expression)),
      ']'
    ),

    // Basic elements
    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: () => /\d+(\.\d+)?/,
    string: () => /"[^"]*"/,
    boolean: () => choice('true', 'false'),
    na: () => 'na',
    comment: () => token(choice(
      seq('//', /.*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    ))
  }
});

function sepBy(sep, rule) {
  return optional(seq(rule, repeat(seq(sep, rule))));
}

function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}