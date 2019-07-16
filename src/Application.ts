import * as blessed from 'blessed';
import { Header } from './layout/Header';
import { Conversations } from './layout/Conversations';
import { Chat } from './layout/Chat';
import { render$ } from '.';
import { merge } from 'rxjs';
import { TgClient } from './tg/tgClient';
import { Input } from './layout/Input';

export class Application {
  constructor(private client: TgClient) {
    // Create a screen object.
    var screen = blessed.screen({
      smartCSR: true,
    });

    screen.title = 'Telegram';

    // Create components each of them pass client instance to operate with them
    const header = new Header(client);
    const conversations = new Conversations(client);
    const chat = new Chat(client);
    const input = new Input(client);

    // Subscribe to all component updates
    merge(
      header,
      conversations,
      chat,
      input,
    ).subscribe(render$);

    // Append our elements to the screen.
    screen.append(header.getElement());
    screen.append(conversations.getElement());
    screen.append(chat.getElement());
    screen.append(input.getElement());

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    // Render the screen on each event in render$ stream.
    render$.subscribe(() => {
      screen.render();
    })
  }
}
