import type Rule from "@/Rule";
import type { MessagesStore } from "@/Rule";
import type { _Rules } from "@/Rules";
type G = {
    [K in keyof _Rules]: _Rules[K] extends Rule<
        infer Path,
        infer ErrorsType,
        infer Type
    >
        ? {
              path: Path;
              errors: ErrorsType;
              type: Type;
          }
        : never;
};
type _Errors = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof _Rules]: _Rules[K] extends Rule<any, infer ErrorsType, any>
        ? ErrorsType
        : never;
};
declare global {
    namespace Validator {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface AvailableRules extends G {}
        interface Errors extends _Errors {
            invalidPath: MessagesStore<{ obj: unknown }>;
            unMatchedType: MessagesStore<{ obj: unknown }>;
        }
    }
}
