import * as blessed from 'blessed';
import { Component } from './Component';
import { TgClient } from '../tg/tgClient';
import { updates$ } from '..';
import {filter, map} from 'rxjs/operators';
import { IUpdateConnectionStateEvent } from '../tg/tgInterfaces';

export class Header extends Component {
  line: blessed.Widgets.BoxElement;

  connectionState$ = updates$
    .pipe(
      filter<IUpdateConnectionStateEvent>(event => event['@type'] === 'updateConnectionState'),
      map(event => event.state["@type"]),
    );

  constructor(private client: TgClient) {
    super();

    this.connectionState$.subscribe(connectionType => {
      this.line.setContent(connectionType);

      this.next();
    });

    this.create();
  }

  create() {
    this.line = blessed.box({
      height: 1,
      bg: 'grey',
      fg: 'white',
      content: 'hi!',
    });

    return this.line;
  }

  getElement() {
    return this.line;
  }
}
