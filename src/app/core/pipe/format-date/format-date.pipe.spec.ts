import { FormatDatePipe } from './format-date.pipe';

describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe;

  beforeEach(() => {
    pipe = new FormatDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null for undefined value', () => {
    expect(pipe.transform(undefined, 'complete')).toBeNull();
  });

  it('should return null for empty string value', () => {
    expect(pipe.transform('', 'complete')).toBeNull();
  });

  it('should format to day correctly', () => {
    expect(pipe.transform('2023-01-05T10:30:00Z', 'day')).toBe('05');
    expect(pipe.transform('2023-11-20T10:30:00Z', 'day')).toBe('20');
  });

  it('should format to month correctly', () => {
    expect(pipe.transform('2023-01-05T10:30:00Z', 'month')).toBe('01');
    expect(pipe.transform('2023-11-20T10:30:00Z', 'month')).toBe('11');
  });

  it('should format to year correctly', () => {
    expect(pipe.transform('2023-01-05T10:30:00Z', 'year')).toBe('2023');
    expect(pipe.transform('2024-11-20T10:30:00Z', 'year')).toBe('2024');
  });

  it('should format to complete date correctly', () => {
    expect(pipe.transform('2023-01-05T10:30:00Z', 'complete')).toBe('2023-01-05');
    expect(pipe.transform('2024-11-20T10:30:00Z', 'complete')).toBe('2024-11-20');
  });

  it('should format to default (full date and time) for unknown format', () => {

    const date = new Date('2023-01-05T10:30:00Z');
    const expectedHours = date.getHours().toString().padStart(2, '0');
    const expectedMinutes = date.getMinutes().toString().padStart(2, '0');
    const expectedSeconds = date.getSeconds().toString().padStart(2, '0');
    
    const result = pipe.transform('2023-01-05T10:30:00Z', 'unknown' as any);
    expect(result).toMatch(`2023-01-05 ${expectedHours}:${expectedMinutes}:${expectedSeconds}`);
  });
});