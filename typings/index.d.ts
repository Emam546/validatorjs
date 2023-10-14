import type Rule from "@/Rule";
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
declare global {
    namespace Validator {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface AvailableRules extends G {}
    }
}
