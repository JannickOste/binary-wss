import "reflect-metadata";
import { injectable, BindingScope } from "inversify";
import { container } from "../../di";

function provide(serviceIdentifier: symbol, scope?: BindingScope) {
    return function (target: any): void {
        injectable(scope)(target);

        container.bind(serviceIdentifier).to(target);
    };
}

export default provide;