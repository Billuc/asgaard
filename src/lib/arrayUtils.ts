/// Generate a function that takes an array and a number as inputs
/// The function should return a new array containing all element except the one at the specified index
/// If the index is out of bounds, return the original array
export function removeAt<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }
  return array.filter((_, i) => i !== index); // Filter out the element at the specified index
}

/// Generate a function that takes an array, a number and a value as inputs
/// The function should return a new array containing all elements with the one at the specified index replaced by the given value
/// If the index is out of bounds, return the original array
export function updateAt<T>(array: T[], index: number, value: T): T[] {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }
  return array.map((item, i) => (i === index ? value : item)); // Replace the element at the specified index
}

export function swap<T>(array: T[], indexA: number, indexB: number): T[] {
  if (indexA < 0 || indexA >= array.length || indexB < 0 || indexB >= array.length) {
    return array; // Return the original array if any index is out of bounds
  }
  const newArray = [...array]; // Create a shallow copy of the array
  [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]]; // Swap the elements at the specified indices
  return newArray;
}
