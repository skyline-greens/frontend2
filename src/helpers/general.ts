
export const MAX_LENGTH = 300;
export function appendWithMaxLength<T>(array: T[], value: T, maxLength: number = MAX_LENGTH): T[] {
  if (maxLength < 0) {
    throw new Error('maxLength must be non-negative');
  }
  
  const newArray = [...array, value];
  
  if (newArray.length > maxLength) {
    return newArray.slice(-maxLength);
  }
  
  return newArray;
}
