export function mixin(derived: Function, bases: Function[]) {
  bases.forEach(base => {
    Object.getOwnPropertyNames(base.prototype).forEach(name => {
      if ('constructor' !== name)
        derived.prototype[name] = base.prototype[name];
    })
  })
}
