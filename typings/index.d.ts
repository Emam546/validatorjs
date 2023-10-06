/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import type Rule from "@/Rule";
declare global {
    namespace Validator {
        interface AvailableRules {}
        type ArrayRules = AvailableRules[keyof AvailableRules][];
        type RulesNames = {
            [K in keyof AvailableRules]: AvailableRules[K] extends Rule<
                infer Name
            >
                ? Name
                : unknown;
        }[keyof AvailableRules];
        type RulesGetter = Validator.RulesNames[] | null;
    }
}
