/* eslint-disable no-undef */
const Max = require('max-api');
const nearley = require('nearley');
const grammar = require('./NestGrammar');

let unparsedData;
const variables = {};
const patterns = [];

function separateVariables(parsedData) {
    for (let i = 0; i < parsedData.length; i += 1) {
        if ('variable' in parsedData[i][0]) {
            variables[parsedData[i][0].variable] = parsedData[i][0].data;
        } else {
            patterns.push(parsedData[i][0]);
        }
    }
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

            Max.outlet('dict', patterns);
        } catch (err) {
            const errMsg = `${err}`;
            Max.post(errMsg, Max.POST_LEVELS.ERROR);
        }

        parser.finish();
        Max.outlet('busy', 0);
    },
};

Max.addHandlers(handlers);
