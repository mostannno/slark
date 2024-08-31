export function ctorSql(args: [string, any][]) {
  let col = '';
  let val = '';
  args.forEach((param, i) => {
    const [k, v] = param;
    if (typeof v !== 'undefined') {
      if (i !== 0) {
        col += ',';
        val += ',';
      }
      col += k;
      val += ctorValue(v);
    }
  });
  return [col, val];
}

export function ctorValue(value) {
  if (typeof value === 'string') return `'${value}'`;
  return `${value}`;
}

export function isValidField(value) {
  if (typeof value === 'undefined') return false;
  return true;
}
