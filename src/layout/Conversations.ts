import * as blessed from 'blessed';
import { updates$ } from '..';
import { Component } from './Component';
import { TgClient } from '../tg/tgClient';

export class Conversations extends Component {
  list: blessed.Widgets.ListElement;

  constructor(private client: TgClient) {
    super();

    this.create();

    updates$.subscribe(update => {
      this.list.addItem(update["@type"]);
      this.list.down(1);

      this.next();
    });
  }

  create() {
    this.list = blessed.list({
      label: 'conversations',
      border: 'line',
      top: 1,
      width: '50%',
      bottom: 2,
      fg: 'white',
    });

    return this.list;
  }

  getElement() {
    return this.list;
  }
}
