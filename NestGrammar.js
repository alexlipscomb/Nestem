// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require('moo')

let lexer = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    string: /'(?:\\['bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*'/,
	variable: /\$[a-zA-Z0-9_]+/,
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    ',': ',',
    ':': ':',
	"=": "=",
	";": ";",
	"$": "$",
    true: 'true',
    false: 'false',
    null: 'null',
})




function parseMain(d) {
	const output = [];

	for (let i in d[1]) {
		output.push(d[1][i][0]);
	}

	return output;
}

function parseExpression(d) {
	const output = {
		variable: d[0],
		data: [],
	};
	
	if ('pattern' in d[4][0]) {
		output.data = d[4];
	} else {
		for (let i in d[4][0]) {
			output.data.push(d[4][0][i][1][0]);	
		}
	}

	return output;
}

function parseNest(d) {
	const output = {
		pattern: [],
		weights: [],
	}

	for (let i in d[3]) {
		if (typeof d[3][i][1][0] === 'string' || typeof d[3][i][1][0] === 'number') {
			output.pattern.push(d[3][i][1][0]);
		} else {
			output.pattern.push(d[3][i][0]);
		}
	}

	if (d[7]) {
		output.weights = d[7][0];
	}

	return output;
}

function parseWeight(d) {
	const output = [];

	output.push(d[2]);

	for (let i in d[3]) {
		output.push(d[3][i][1]);
	}

	return output;
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nest"]},
    {"name": "main$ebnf$1$subexpression$1$subexpression$1", "symbols": ["expression"]},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["main$ebnf$1$subexpression$1$subexpression$1", "_", {"literal":";"}, "_"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"]},
    {"name": "main$ebnf$1$subexpression$2$subexpression$1", "symbols": ["nest"]},
    {"name": "main$ebnf$1$subexpression$2$subexpression$1", "symbols": ["expression"]},
    {"name": "main$ebnf$1$subexpression$2", "symbols": ["main$ebnf$1$subexpression$2$subexpression$1", "_", {"literal":";"}, "_"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["_", "main$ebnf$1"], "postprocess": parseMain},
    {"name": "expression$subexpression$1", "symbols": ["nest"]},
    {"name": "expression$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", "nestContent"]},
    {"name": "expression$subexpression$1$ebnf$1", "symbols": ["expression$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "expression$subexpression$1$ebnf$1$subexpression$2", "symbols": ["_", "nestContent"]},
    {"name": "expression$subexpression$1$ebnf$1", "symbols": ["expression$subexpression$1$ebnf$1", "expression$subexpression$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expression$subexpression$1", "symbols": ["expression$subexpression$1$ebnf$1"]},
    {"name": "expression", "symbols": ["variable", "_", {"literal":"="}, "_", "expression$subexpression$1"], "postprocess": parseExpression},
    {"name": "nest$ebnf$1$subexpression$1", "symbols": ["_", "nestContent"]},
    {"name": "nest$ebnf$1$subexpression$1", "symbols": ["nest", "_"]},
    {"name": "nest$ebnf$1", "symbols": ["nest$ebnf$1$subexpression$1"]},
    {"name": "nest$ebnf$1$subexpression$2", "symbols": ["_", "nestContent"]},
    {"name": "nest$ebnf$1$subexpression$2", "symbols": ["nest", "_"]},
    {"name": "nest$ebnf$1", "symbols": ["nest$ebnf$1", "nest$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nest$ebnf$2$subexpression$1", "symbols": ["weight"]},
    {"name": "nest$ebnf$2", "symbols": ["nest$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "nest$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nest", "symbols": ["_", {"literal":"["}, "_", "nest$ebnf$1", "_", {"literal":"]"}, "_", "nest$ebnf$2", "_"], "postprocess": parseNest},
    {"name": "nestContent", "symbols": ["variable"]},
    {"name": "nestContent", "symbols": ["number"]},
    {"name": "nestContent", "symbols": ["string"]},
    {"name": "weight$ebnf$1", "symbols": []},
    {"name": "weight$ebnf$1$subexpression$1", "symbols": [{"literal":" "}, "number"]},
    {"name": "weight$ebnf$1", "symbols": ["weight$ebnf$1", "weight$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "weight", "symbols": [{"literal":"{"}, "_", "number", "weight$ebnf$1", "_", {"literal":"}"}], "postprocess": parseWeight},
    {"name": "variable", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": d => d[0].value},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => parseFloat(d[0].value)},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d => d[0].value},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
