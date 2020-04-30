export type ArrayType<T> = T extends Array<any> ? T : T[];
export function toArray<T>(value: T, nullCheck: boolean = true): ArrayType<T> {
  return (value == null && nullCheck ? [] : Array.isArray(value) ? value : [value]) as ArrayType<T>;
}

export function flat<C>(arrayOfArrays: C[]): C {
  return [].concat.apply([], arrayOfArrays);
}

export function intersect<T>(a: T[], b: T[]): T[] {
  let temp: T[] = [];

  if (b.length > a.length) {
    temp = b;
    b = a;
    a = temp;
  }

  return a.filter(item => b.indexOf(item) > -1);
}
