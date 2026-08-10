export function isInteractiveElement(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest('button,a,input,textarea,select,[role="button"],[data-stop-row-click]')
  );
}
