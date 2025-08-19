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

export function mapMatching<T>(
  array: T[],
  matchFn: (item: T) => boolean,
  mapFn: (item: T) => T
): T[] {
  return array.map((item) => (matchFn(item) ? mapFn(item) : item));
}

export function removeMatching<T>(array: T[], matchFn: (item: T) => boolean): T[] {
  return array.filter((item) => !matchFn(item));
}

export function moveTo<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
    return array; // Return the original array if any index is out of bounds
  }
  const newArray = [...array]; // Create a shallow copy of the array
  const [movedItem] = newArray.splice(fromIndex, 1); // Remove the item from the original position
  newArray.splice(toIndex, 0, movedItem); // Insert the item at the new position
  return newArray;
}
