@{%

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

%}

@lexer lexer

main -> _ ((nest | expression) _ ";" _):+ {% parseMain %}

expression -> variable _ "=" _ (nest | (_ nestContent):+) {% parseExpression %}

nest -> _ "[" _ (_ nestContent | nest _):+ _ "]" _ (weight):? _ {% parseNest %}

nestContent -> variable | number | string

weight -> "{" _ number (" " number):* _ "}" {% parseWeight %}

variable -> %variable {% d => d[0].value %}

number -> %number {% d => parseFloat(d[0].value) %}

string -> %string {% d => d[0].value %}

_ -> null | %space {% null %}

@{%

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
		children: [],
		weights: [],
	}

	for (let i in d[3]) {
		if (typeof d[3][i][1][0] === 'string' || typeof d[3][i][1][0] === 'number') {
			output.pattern.push(d[3][i][1][0]);
		} else {
			output.children.push(d[3][i][0]);
		}
	}

	if (d[7]) {
		output.weights = d[7][0];
	}

	return output;
}

function parseNestChild(d) {
	const output = {
		pattern: [],
		children: [],
		weights: [],
	}

	return d;
}

function parseWeight(d) {
	const output = [];

	output.push(d[2]);

	for (let i in d[3]) {
		output.push(d[3][i][1]);
	}

	return output;
}

%}
