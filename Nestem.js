/* eslint-disable no-undef */
const Max = require('max-api');
const nearley = require('nearley');
const grammar = require('./NestGrammar');

let unparsedData;
const variables = {};
let patterns = [];

function separateVariables(parsedData) {
    for (let i = 0; i < parsedData.length; i += 1) {
        if ('variable' in parsedData[i][0]) {
            variables[parsedData[i][0].variable] = parsedData[i][0].data;
        } else {
            [patterns] = parsedData[i];
        }
    }
}

function resolveVariables(pats) {
    const { pattern, weights } = pats;

    const replacedPattern = {
        pattern: [],
        weights,
    };

    for (let i = 0; i < pattern.length; i += 1) {
        if (typeof pattern[i] === 'string' && pattern[i].startsWith('$')) {
            replacedPattern.pattern.push(...variables[pattern[i]]);
        } else if (typeof pattern[i] === 'object' && 'pattern' in pattern[i]) {
            replacedPattern.pattern.push(resolveVariables(pattern[i]));
        } else {
            replacedPattern.pattern.push(pattern[i]);
        }
    }

    return replacedPattern;
}

const handlers = {
    [Max.MESSAGE_TYPES.BANG]: () => {
        Max.outlet('pattern', generate());
    },
    add: (item) => {
        unparsedData = item;
    },
    compile: () => {
        Max.outlet('busy', 1);
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        try {
            parser.feed(unparsedData);

            parser.finish();

            const parsedData = parser.results[0];

            separateVariables(parsedData);

            const data = resolveVariables(patterns);

            Max.outlet('dict', data);
        } catch (err) {
            const errMsg = `${err}`;
            Max.post(errMsg, Max.POST_LEVELS.ERROR);
        }

        parser.finish();
        Max.outlet('busy', 0);
    },
};

Max.addHandlers(handlers);
