import { Subject } from "rxjs";
import { Widgets } from "blessed";

export abstract class Component extends Subject<void> {
    abstract create(): Widgets.BlessedElement;
    abstract getElement(): Widgets.BlessedElement;
}