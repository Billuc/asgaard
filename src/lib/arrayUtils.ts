export function removeAt<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }
  return array.filter((_, i) => i !== index); // Filter out the element at the specified index
}

export function updateAt<T>(array: T[], index: number, value: T): T[] {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }
  return array.map((item, i) => (i === index ? value : item)); // Replace the element at the specified index
}

export function mapAt<T>(array: T[], index: number, fn: (item: T) => T): T[] {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }
  return array.map((item, i) => (i === index ? fn(item) : item)); // Apply the function to the element at the specified index
}

export function swap<T>(array: T[], indexA: number, indexB: number): T[] {
  if (indexA < 0 || indexA >= array.length || indexB < 0 || indexB >= array.length) {
    return array; // Return the original array if any index is out of bounds
  }
  const newArray = [...array]; // Create a shallow copy of the array
  [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]]; // Swap the elements at the specified indices
  return newArray;
}
