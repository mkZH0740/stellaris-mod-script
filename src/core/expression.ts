import { array } from "typescript-lodash"

export namespace Expression {
  export type KeyType = string
  export type OperationType = "=" | ">" | "<" | ">=" | "<="
  export type ValueType = string | number | readonly Expression[] | Expression
  export type Expression = {
    key: KeyType,
    operation: OperationType,
    value: ValueType,
  }
  export type CompileList<
    List extends readonly Expression[],
    Result extends string = ""
  > = List extends readonly [...infer Head extends readonly Expression[], infer Tail extends Expression]
    ? `${CompileList<Head>}${CompileRecursive<Tail>} ${Result}` : ``
  export type CompileRecursive<
    ExpressionObject, DepthController extends unknown[] = array.GetTuple<16>
  > =
    DepthController["length"] extends 0
    ? "..."
    :
    ExpressionObject extends {
      key: infer Key extends KeyType,
      operation: infer Operation extends OperationType,
      value: infer Value extends ValueType
    }
    ? `${Key} ${Operation} ${Value extends readonly Expression[]
    ? `{ ${CompileList<Value>} }`
    : Value extends Expression
    ? `{ ${CompileRecursive<Value, array.Pop<DepthController>>} }`
    : Value extends string | number
    ? `${Value}`
    : never
    }`
    : never

  export class Builder<ExpressionObject extends Partial<Expression>> {
    constructor(private expression: ExpressionObject) { }

    $key<Key extends KeyType>(key: Key): Builder<ExpressionObject & { key: Key }> {
      this.expression.key = key
      return this as any
    }

    $operation<Operation extends OperationType>(operation: Operation): Builder<ExpressionObject & { operation: Operation }> {
      this.expression.operation = operation
      return this as any
    }

    $value<Value extends ValueType>(value: Value): Builder<ExpressionObject & { value: Value }> {
      this.expression.value = value
      return this as any
    }

    $compile(): CompileRecursive<ExpressionObject> {
      // TODO: impl compile expression
      return "" as any
    }
  }

  export const $new = () => {
    return new Builder({})
  }
}
