import { Modules } from "./module.js"
import { Expression } from "./expression.js"

declare module "./module.js" {
  namespace Modules {
    interface Modules {
      Triggers: Triggers.Triggers
    }
  }
}

export namespace Triggers {
  export interface Triggers { }
  export type BasicTrigger<TriggerName extends keyof Modules.Modules["Triggers"]> = {
    $value: <TriggerValue extends Expression.ValueType>(value: TriggerValue) => Expression.Builder<{
      key: TriggerName, operation: "=", value: TriggerValue
    }>
  }
  export type NumericalTrigger<TriggerName extends keyof Modules.Modules["Triggers"]> = {
    $operation: <TriggerOperation extends Expression.OperationType>(operation: TriggerOperation) => Expression.Builder<{
      key: TriggerName, operation: TriggerOperation
    }>
  }
  export type BooleanTrigger<TriggerName extends keyof Modules.Modules["Triggers"]> = {
    $true: () => Expression.Builder<{
      key: TriggerName, operation: "=", value: "yes"
    }>
    $false: () => Expression.Builder<{
      key: TriggerName, operation: "=", value: "no"
    }>
  }
  export type PartialBooleanTrigger<TriggerName extends keyof Modules.Modules["Triggers"]> =
    BooleanTrigger<TriggerName> & BasicTrigger<TriggerName>
  export type TriggerTemplate<
    TriggerName extends keyof Modules.Modules["Triggers"],
    TriggerType = Modules.Modules["Triggers"][TriggerName]
  > = (name: TriggerName) => TriggerType

  export const basicTriggerTemplate = <
    TriggerName extends keyof Modules.Modules["Triggers"]
  >(name: TriggerName): BasicTrigger<TriggerName> => {
    return {
      $value: <TriggerValue extends Expression.ValueType>(value: TriggerValue) =>
        Expression.$new().$key(name).$operation("=").$value(value)
    }
  }
  export const numericalTriggerTemplate = <
    TriggerName extends keyof Modules.Modules["Triggers"]
  >(name: TriggerName): NumericalTrigger<TriggerName> => {
    return {
      $operation: <TriggerOperation extends Expression.OperationType>(operation: TriggerOperation) =>
        Expression.$new().$key(name).$operation(operation)
    }
  }
  export const booleanTriggerTemplate = <
    TriggerName extends keyof Modules.Modules["Triggers"]
  >(name: TriggerName): BooleanTrigger<TriggerName> => {
    return {
      $true: () => Expression.$new().$key(name).$operation("=").$value("yes"),
      $false: () => Expression.$new().$key(name).$operation("=").$value("no")
    }
  }
  export const partialBooleanTriggerTemplate = <
    TriggerName extends keyof Modules.Modules["Triggers"]
  >(name: TriggerName): PartialBooleanTrigger<TriggerName> => {
    return {
      $true: () => Expression.$new().$key(name).$operation("=").$value("yes"),
      $false: () => Expression.$new().$key(name).$operation("=").$value("no"),
      $value: <TriggerValue extends Expression.ValueType>(value: TriggerValue) =>
        Expression.$new().$key(name).$operation("=").$value(value)
    }
  }
}
