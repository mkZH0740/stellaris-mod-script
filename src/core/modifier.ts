import { Modules } from "./module.js";

declare module "./module.js" {
  namespace Modules {
    interface Modules {
      Modifiers: Modifiers.Modifiers
    }
  }
}

export namespace Modifiers {
  export interface Modifiers { }
  const compile = <ResultType extends string>(
    templateString: string,
    arg1?: string,
    arg2?: string,
    arg3?: string
  ): ResultType => {
    if (arg1 === undefined) return templateString as ResultType
    const firstPass = templateString.replace(/(_x(?=_))|(_x$)/gm, `_${arg1}`)

    if (arg2 === undefined) return firstPass as ResultType
    const secondPass = firstPass.replace(/(_y(?=_))|(_y$)/gm, `_${arg2}`)

    if (arg3 === undefined) return secondPass as ResultType
    return secondPass.replace(/(_z(?=_))|(_z$)/gm, `_${arg3}`) as ResultType
  }
  export const noArgModifier = <
    ModifierName extends keyof Modules.Modules["Modifiers"]
  >(name: ModifierName) => {
    return {
      $compile: () => compile<ModifierName>(name)
    }
  }
  export type NoArgModifier<
    ModifierName extends keyof Modules.Modules["Modifiers"]
  > = {
    $compile: () => ModifierName
  }
  export const oneArgModifier = <
    ModifierName extends keyof Modules.Modules["Modifiers"],
    Args1 extends readonly string[]
  >(name: ModifierName) => {
    return {
      $compile: <Arg1 extends Args1[number]>(arg: Arg1) =>
        compile<CompileArg<ModifierName, Arg1, "x">>(name, arg)
    }
  }
  export type OneArgModifier<
    ModifierName extends keyof Modules.Modules["Modifiers"],
    Args1 extends readonly string[]
  > = {
    $compile: <Arg1 extends Args1[number]>(arg: Arg1) =>
      CompileArg<ModifierName, Arg1, "x">
  }
  export const twoArgModifier = <
    ModifierName extends keyof Modules.Modules["Modifiers"],
    Args1 extends readonly string[],
    Args2 extends readonly string[]
  >(name: ModifierName) => {
    return {
      $compile: <
        Arg1 extends Args1[number],
        Arg2 extends Args2[number]
      >(arg1: Arg1, arg2: Arg2) =>
        compile<CompileArg<CompileArg<ModifierName, Arg1, "x">, Arg2, "y">>(name, arg1, arg2)
    }
  }
  export type TwoArgModifier<
    ModifierName extends keyof Modules.Modules["Modifiers"],
    Args1 extends readonly string[],
    Args2 extends readonly string[]
  > = {
    $compile: <
      Arg1 extends Args1[number],
      Arg2 extends Args2[number]
    >(arg1: Arg1, arg2: Arg2) =>
      CompileArg<CompileArg<ModifierName, Arg1, "x">, Arg2, "y">
  }
  export const threeArgModifier = <
    ModifierName extends keyof Modules.Modules["Modifiers"],
    Args1 extends readonly string[],
    Args2 extends readonly string[],
    Args3 extends readonly string[]
  >(name: ModifierName) => {
    return {
      $compile: <
        Arg1 extends Args1[number],
        Arg2 extends Args2[number],
        Arg3 extends Args3[number]
      >(arg1: Arg1, arg2: Arg2, arg3: Arg3) =>
        compile<CompileArg<CompileArg<CompileArg<ModifierName, Arg1, "x">, Arg2, "y">, Arg3, "z">>(name, arg1, arg2, arg3)
    }
  }
  export type ThreeArgModifier<
    ModifierName extends keyof Modules.Modules["Modifiers"],
    Args1 extends readonly string[],
    Args2 extends readonly string[],
    Args3 extends readonly string[]
  > = {
    $compile: <
      Arg1 extends Args1[number],
      Arg2 extends Args2[number],
      Arg3 extends Args3[number]
    >(arg1: Arg1, arg2: Arg2, arg3: Arg3) =>
      CompileArg<CompileArg<CompileArg<ModifierName, Arg1, "x">, Arg2, "y">, Arg3, "z">
  }
  type CompileArg<
    TemplateString extends string,
    Arg extends string,
    PlaceHolder extends "x" | "y" | "z",
    Deliminator extends string = "_"
  > = TemplateString extends `${infer Head}${Deliminator}${PlaceHolder}${infer Tail}`
    ? `${Head}${Deliminator}${Arg}${Tail}`
    : never
}
