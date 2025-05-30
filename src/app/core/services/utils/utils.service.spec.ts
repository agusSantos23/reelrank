import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('areArraysEqual', () => {
    it('should return true for two empty arrays', () => {
      const arr1: any[] = [];
      const arr2: any[] = [];
      expect(service.areArraysEqual(arr1, arr2)).toBeTrue();
    });

    it('should return true for two identical arrays of numbers', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      expect(service.areArraysEqual(arr1, arr2)).toBeTrue();
    });

    it('should return true for two identical arrays of strings', () => {
      const arr1 = ['a', 'b', 'c'];
      const arr2 = ['a', 'b', 'c'];
      expect(service.areArraysEqual(arr1, arr2)).toBeTrue();
    });

    it('should return true for two identical arrays with mixed types', () => {
      const arr1 = [1, 'b', true, null];
      const arr2 = [1, 'b', true, null];
      expect(service.areArraysEqual(arr1, arr2)).toBeTrue();
    });

    it('should return false for arrays of different lengths', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2];
      expect(service.areArraysEqual(arr1, arr2)).toBeFalse();
    });

    it('should return false for arrays with same length but different elements', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];
      expect(service.areArraysEqual(arr1, arr2)).toBeFalse();
    });

    it('should return false for arrays with same elements but different order', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [3, 2, 1];
      expect(service.areArraysEqual(arr1, arr2)).toBeFalse();
    });

    it('should handle arrays with undefined values correctly', () => {
      const arr1 = [1, undefined, 3];
      const arr2 = [1, undefined, 3];
      const arr3 = [1, null, 3];
      expect(service.areArraysEqual(arr1, arr2)).toBeTrue();
      expect(service.areArraysEqual(arr1, arr3)).toBeFalse();
    });

    it('should return false if one array is empty and the other is not', () => {
      const arr1: any[] = [];
      const arr2 = [1, 2, 3];
      expect(service.areArraysEqual(arr1, arr2)).toBeFalse();
    });
  });
});