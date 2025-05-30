import { FormatLargeNumberPipe } from './format-large-number.pipe';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('FormatLargeNumberPipe', () => {
  let pipe: FormatLargeNumberPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: 'en-US' } 
      ]
    });
    pipe = new FormatLargeNumberPipe(TestBed.inject(LOCALE_ID));
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "-" for null value', () => {
    expect(pipe.transform(null)).toBe('-');
  });

  it('should return "-" for undefined value', () => {
    expect(pipe.transform(undefined)).toBe('-');
  });

  it('should return "-" for non-numeric string value', () => {
    expect(pipe.transform('abc')).toBe('-');
  });

  it('should return "-" for NaN value', () => {
    expect(pipe.transform(NaN)).toBe('-');
  });

  it('should format integer numbers correctly', () => {
    expect(pipe.transform(123)).toBe('123');
    expect(pipe.transform(1234)).toBe('1,234');
    expect(pipe.transform(1234567)).toBe('1,234,567');
  });

  it('should format string numbers correctly', () => {
    expect(pipe.transform('123')).toBe('123');
    expect(pipe.transform('1234')).toBe('1,234');
    expect(pipe.transform('1234567')).toBe('1,234,567');
  });

  it('should round decimal numbers to integers', () => {
    expect(pipe.transform(123.45)).toBe('123');
    expect(pipe.transform(123.50)).toBe('124');
    expect(pipe.transform(123.99)).toBe('124');
  });

  it('should handle negative numbers correctly', () => {
    expect(pipe.transform(-123)).toBe('-123');
    expect(pipe.transform(-1234)).toBe('-1,234');
  });

  it('should handle zero correctly', () => {
    expect(pipe.transform(0)).toBe('0');
  });
});