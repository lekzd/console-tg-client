import * as blessed from 'blessed';
import { Component } from './Component';
import { TgClient } from '../tg/tgClient';

export class Chat extends Component {
  list: blessed.Widgets.ListElement;

  constructor(private client: TgClient) {
    super();

    this.create();
  }

  create() {
    this.list = blessed.list({
      label: 'chat',
      border: 'line',
      left: '50%',
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
