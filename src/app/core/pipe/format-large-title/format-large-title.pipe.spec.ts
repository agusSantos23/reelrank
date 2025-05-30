import { FormatLargeTitlePipe } from './format-large-title.pipe';

describe('FormatLargeTitlePipe', () => {
  let pipe: FormatLargeTitlePipe;

  beforeEach(() => {
    pipe = new FormatLargeTitlePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string for null value', () => {
    expect(pipe.transform(null as any, 10)).toBe('');
  });

  it('should return an empty string for undefined value', () => {
    expect(pipe.transform(undefined as any, 10)).toBe('');
  });

  it('should return an empty string for an empty string value', () => {
    expect(pipe.transform('', 10)).toBe('');
  });

  it('should return the original string if its length is less than or equal to the limit', () => {
    expect(pipe.transform('short text', 15)).toBe('short text');
    expect(pipe.transform('exact', 5)).toBe('exact');
  });

  it('should truncate the string and add "..." if its length is greater than the limit', () => {
    expect(pipe.transform('this is a long text to truncate', 10)).toBe('this is a ...');
    expect(pipe.transform('hello world', 5)).toBe('hello...');
  });

  it('should handle limit of 0 correctly', () => {
    expect(pipe.transform('some text', 0)).toBe('...');
  });
});