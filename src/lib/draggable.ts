import type { Attachment } from 'svelte/attachments';

export function draggable(ondragstart: (event: Event) => void): Attachment {
  return (element: Element) => {
    const handle = element.querySelector('[data-draghandle]');
    const draggable = !handle ? 'true' : 'false';

    if (handle) {
      handle.addEventListener('pointerdown', () => element.setAttribute('draggable', 'true'));
      handle.addEventListener('pointerup', () => element.setAttribute('draggable', 'false'));
      element.addEventListener('dragend', () => element.setAttribute('draggable', 'false'));
    }

    element.setAttribute('draggable', draggable);
    element.addEventListener('dragstart', ondragstart);
  };
}

export function dropzone(
  ondrop: (event: Event) => void,
  ondragover: (event: Event) => void = (ev) => {
    ev.preventDefault();
  }
): Attachment {
  return (element: Element) => {
    element.addEventListener('drop', ondrop);
    element.addEventListener('dragover', ondragover);
  };
}

export const draghandle: Attachment = (element: Element) => {
  element.setAttribute('data-draghandle', 'true');
};
