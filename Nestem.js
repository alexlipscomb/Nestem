/* eslint-disable no-undef */
const Max = require('max-api');
const nearley = require('nearley');
const grammar = require('./NestGrammar');

let unparsedData;
let variables = {};
let patterns = [];
let data = {};

function chooseRandom(arr) {
    let maxNum = 0;
    let maxNumIndex = 0;

    for (let i = 0; i < arr.length; i += 1) {
        currentWeight = arr[i] * Math.random();

        if (currentWeight > maxNum) {
            maxNum = currentWeight;
            maxNumIndex = i;
        }
    }

    return maxNumIndex;
}

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

function generate(d) {
    const { pattern } = d;

    const generatedPattern = [];

    for (let i = 0; i < pattern.length; i += 1) {
        if (typeof pattern[i] === 'string' || typeof pattern[i] === 'number') {
            generatedPattern.push(pattern[i]);
        } else if (typeof pattern[i] === 'object' && 'pattern' in pattern[i]) {
            const chosenPatternIndex = chooseRandom(pattern[i].weights);
            generatedPattern.push(generate(pattern[i].pattern[chosenPatternIndex]));
        }
    }

    return generatedPattern.flat(Infinity);
}

const handlers = {
    [Max.MESSAGE_TYPES.BANG]: () => {
        const generatedData = generate(data).toString().replaceAll(',', ' ');

        Max.outlet('pattern', generatedData);
    },
    add: (item) => {
        unparsedData = item;
        variables = {};
        patterns = [];
        data = {};
    },
    compile: () => {
        Max.outlet('busy', 1);
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        try {
            parser.feed(unparsedData);

            parser.finish();

            const parsedData = parser.results[0];

            separateVariables(parsedData);

            data = resolveVariables(patterns);

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
