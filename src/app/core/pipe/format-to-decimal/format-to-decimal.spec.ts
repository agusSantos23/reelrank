import { ConvertToDecimalPipe } from './format-to-decimal.pipe';

describe('ConvertToDecimalPipe', () => {
  let pipe: ConvertToDecimalPipe;

  beforeEach(() => {
    pipe = new ConvertToDecimalPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null for null value', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return null for undefined value', () => {
    expect(pipe.transform(undefined)).toBeNull();
  });

  it('should convert single digit to "0.X"', () => {
    expect(pipe.transform(5)).toBe('0.5');
    expect(pipe.transform(0)).toBe('0.0');
  });

  it('should convert multi-digit number to "XX.X"', () => {
    expect(pipe.transform(12)).toBe('1.2');
    expect(pipe.transform(123)).toBe('12.3');
    expect(pipe.transform(98765)).toBe('9876.5');
  });

  it('should handle negative single digit correctly', () => {
    expect(pipe.transform(-5)).toBe('0.-5');
  });

  it('should handle negative multi-digit correctly', () => {
    expect(pipe.transform(-12)).toBe('-1.2'); 
    expect(pipe.transform(-123)).toBe('-12.3');
  });

  it('should handle string numbers if passed (though input is number)', () => {
    expect(pipe.transform('5' as any)).toBe('0.5');
    expect(pipe.transform('123' as any)).toBe('12.3');
  });
});