export function catchAndLog(
  target: any,
  name: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  const value = async function (...args) {
    const prefix = `${target.name || ''}.${name}`;
    console.log(`[Catch&Log]::${prefix} executed`);
    try {
      let result = original.call(this, ...args);
      if (result instanceof Promise) {
        result = await result;
      }
      console.log(`[Catch&Log]::${prefix}result, `, result);
      return result;
    } catch (e) {
      console.log(`[Catch&Log] ${prefix} failed`, e);
      return null;
    }
  };
  descriptor.value = value;
}
