import { SectionValue } from '../models/permission.interface';
import { canShowSections, findAndReplaceIfValueIsMoreImportant } from './permission';

const ID_REG_EXP_PATTERN = '\\d+';

describe('Permission helpers', () => {
  it('#canShowSections. Should assume regular expression pattern as SectionValue object key', () => {
    const fragments = ['contracts', '123', 'info'];

    expect(canShowSections([{ contracts: [{ [ID_REG_EXP_PATTERN]: ['info', 'asset-info'] }] }], fragments)).toBe(true);
  });

  it('#canShowSections. Should assume plain string as SectionValue object key', () => {
    const fragments = ['contracts', '123', 'info'];

    expect(canShowSections([{ contracts: [{ 123: ['info', 'asset-info'] }] }], fragments)).toBe(true);
  });

  it("#findAndReplaceIfValueIsMoreImportant. Shouldn't replace section as it's less valuable", () => {
    const first: SectionValue<string>[] = ['service'];
    const second: SectionValue<string>[] = [{ service: ['orders'] }];

    findAndReplaceIfValueIsMoreImportant(first, second);

    expect(first.length).toBe(1);
    expect(first[0]).toBe('service');
  });
  it("#findAndReplaceIfValueIsMoreImportant. Should replace section value if it's more valuable", () => {
    const first: SectionValue<string>[] = [{ contracts: [{ [ID_REG_EXP_PATTERN]: ['info', 'asset-info', 'fines'] }] }];
    const result: SectionValue<string>[] = ['contracts'];

    findAndReplaceIfValueIsMoreImportant(first, result);

    expect(result[0]).toBe('contracts');
  });
  it('#findAndReplaceIfValueIsMoreImportant. Should join section values properly', () => {
    const result: any = [{ contracts: [{ [ID_REG_EXP_PATTERN]: ['notification'] }] }];
    const second: SectionValue<string>[] = [{ contracts: [{ [ID_REG_EXP_PATTERN]: ['info', 'asset-info', 'fines'] }] }];

    findAndReplaceIfValueIsMoreImportant(result, second);

    const subsections: string[] = result[0].contracts[0][ID_REG_EXP_PATTERN];

    ['info', 'asset-info', 'fines', 'notification'].forEach(subsection => {
      expect(subsections.includes(subsection)).toBe(true);
    });
  });
  it('#findAndReplaceIfValueIsMoreImportant. Should deduplicate section values after merge', () => {
    const result: any = [{ contracts: [{ [ID_REG_EXP_PATTERN]: ['notification', 'info'] }] }];
    const second: SectionValue<string>[] = [{ contracts: [{ [ID_REG_EXP_PATTERN]: ['info', 'asset-info', 'fines'] }] }];

    findAndReplaceIfValueIsMoreImportant(result, second);

    const subsections: string[] = result[0].contracts[0][ID_REG_EXP_PATTERN];

    expect(subsections.length).toBe(4);
  });
});
