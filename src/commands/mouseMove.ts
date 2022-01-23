import { fireCdpCommand } from "../fireCdpCommand";
import {
  getCypressElementCoordinates,
  ScrollBehaviorOptions,
  Position,
} from "../getCypressElementCoordinates";
import { mouseButtonNumbers } from "../mouseButtonNumbers";

export interface realMouseMoveOptions {
  /** Pointer type for realMouseUp, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Pixels to move the element on the X axis.
   * @example cy.realMouseMove({ x: 55 });
   */
  x?: number;
  /**
  * Pixels to move the element on the Y axis.
  * @example cy.realMouseMove({ y: -44 });
  */
  y?: number;
  /**
  * Controls how the page is scrolled to bring the subject into view, if needed.
  * @example cy.realClick({ scrollBehavior: "top" });
  */
  scrollBehavior?: ScrollBehaviorOptions;
  /**
   * Position of the realMouseUp event relative to the element
   * @example cy.realMouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * @default "left"
   */
  button?: keyof typeof mouseButtonNumbers;
}

/** @ignore this, update documentation for this function at index.d.ts */
export async function realMouseMove(
  subject: JQuery,
  options: realMouseMoveOptions = {}
) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realMouseMove",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: x + (options.x ?? 0),
    y: y + (options.y ?? 0),
    buttons: mouseButtonNumbers[options.button ?? "left"],
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
  });

  log.snapshot("after").end();

  return subject;
}
