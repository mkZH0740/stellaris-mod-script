export namespace Modules {
  export interface Modules { }

  export type Module<ModuleName extends keyof Modules> = Modules[ModuleName]
  export type ModuleKeys<ModuleName extends keyof Modules> = keyof Module<ModuleName>
  export type ModuleValue<ModuleName extends keyof Modules, ModuleKey extends ModuleKeys<ModuleName>> = Module<ModuleName>[ModuleKey]

  const modules: Modules = {} as Modules

  export const $register = <
    RegisterModuleName extends keyof Modules,
    RegisterModuleKey extends ModuleKeys<RegisterModuleName>,
    RegisterModuleValue extends ModuleValue<RegisterModuleName, RegisterModuleKey>,
  >(moduleName: RegisterModuleName, key: RegisterModuleKey, value: RegisterModuleValue) => {
    modules[moduleName][key] = value
  }

  export const $get = <
    RegisterModuleName extends keyof Modules,
    RegisterModuleKey extends ModuleKeys<RegisterModuleName>,
  >(moduleName: RegisterModuleName, key: RegisterModuleKey): ModuleValue<RegisterModuleName, RegisterModuleKey> => {
    return modules[moduleName][key] as any
  }
}
