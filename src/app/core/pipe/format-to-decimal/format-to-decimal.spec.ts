import { ConvertToDecimalPipe } from "./format-to-decimal";

describe('ConvertToDecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertToDecimalPipe()
    expect(pipe).toBeTruthy();
  });
});
