export const toastStore = $state<{
  messages: { message: string; timeout: number; id: number }[];
  counter: number;
}>({
  messages: [],
  counter: 0
});

export function addToast(message: string, timeout: number = 3000) {
  toastStore.messages.push({ message, timeout, id: toastStore.counter });
  toastStore.counter += 1;
}

export function removeToast(id: number) {
  toastStore.messages = toastStore.messages.filter((msg) => msg.id !== id);
}
