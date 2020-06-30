import { SectionValue } from '../models/permission.interface';

export function cloneDeep<T extends {}>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

export function canShowSections<V extends SectionValue<string>>(allowed: V | V[], fragments: string[]): boolean {
  const sectionValues = Array.isArray(allowed) && Array.isArray(allowed[0]) ? allowed : ([allowed] as V[]);
  const path = fragments[0]!;

  return sectionValues.some(sectionValue => {
    if (Array.isArray(sectionValue)) {
      return sectionValue.some(data =>
        typeof data === 'string' ? testRegExpPattern(data, path) : canShowSections(data, fragments)
      );
    }

    const passedSectionStringValue = Object.keys(sectionValue).find(data => testRegExpPattern(data, path)) as
      | keyof V
      | null;

    if (typeof sectionValue === 'object' && passedSectionStringValue != null) {
      if (fragments.length > 1) {
        return canShowSections(sectionValue[passedSectionStringValue], fragments.slice(1));
      }

      return true;
    }

    return false;
  });
}

export function findAndReplaceIfValueIsMoreImportant<V extends SectionValue<string>>(
  existedValues: V[],
  newValues: V[]
) {
  newValuesLoop: for (let n = 0; n < newValues.length; n++) {
    const newValue = newValues[n];

    if (typeof newValue === 'string') {
      const indexOfExistedSectionValue = existedValues.findIndex(v =>
        typeof v === 'object' ? Array.isArray(v[newValue as keyof V]) : v === newValue
      );

      if (indexOfExistedSectionValue === -1) {
        existedValues.push(newValue);
      } else {
        existedValues.splice(indexOfExistedSectionValue, 1, newValue);
      }

      continue;
    }

    for (const existedValue of existedValues) {
      if (typeof existedValue === 'object' && Object.keys(newValue)[0] === Object.keys(existedValue)[0]) {
        findAndReplaceIfValueIsMoreImportant(Object.values(existedValue)[0], Object.values(newValue)[0]);

        break newValuesLoop;
      }

      if (typeof existedValue === 'string' && newValue[existedValue as keyof V] != null) {
        findAndReplaceIfValueIsMoreImportant([existedValue], Object.values(newValue)[0]);

        break newValuesLoop;
      }
    }

    existedValues.push(newValue);
  }
}

function testRegExpPattern(pattern: string, path: string) {
  return new RegExp(pattern).test(path) ? path : false;
}

export function hasRoutePathParameter(path: string) {
  return path.includes(':');
}
