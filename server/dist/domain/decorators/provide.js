"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const di_1 = require("../../di");
function provide(serviceIdentifier, scope) {
    return function (target) {
        (0, inversify_1.injectable)(scope)(target);
        di_1.container.bind(serviceIdentifier).to(target);
    };
}
exports.default = provide;
