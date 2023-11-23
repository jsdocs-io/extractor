/**
 * Namespace1.
 */
export namespace Namespace1 {}

export namespace Namespace2 {
  /** Var1 */
  export const var1 = 1;

  export namespace Namespace21 {
    export const var2 = "";

    export namespace Namespace22 {}
  }
}

namespace Namespace3 {
  export const var1 = 1;
}

namespace Namespace3 {
  export const var2 = "";
}

export { Namespace3 };

/** @internal */
export namespace Namespace4 {}
