import {
  IChatFullData, IMessage, IMessagesResponse, IOkResponse, IUpdateConnectionStateEvent, IUpdateEvent, IUpdatesResponse,
  IUser,
  IProxiesResponse,
  ISecondsResponse,
  IProxy
} from './tgInterfaces';
import {Structs} from 'tglib';
import {Subject, BehaviorSubject} from 'rxjs';
import path from 'path';
const { Client } = require('tglib/node');

interface IProxyConfig {
  type: string;
  server: string;
  port: number;
  data: any;
}

const env = require(path.join(process.cwd(), 'env.json'));
let client: typeof Client = null;

export async function tgClientInit() {
  client = new Client({
    apiId: env.APP_ID,
    apiHash: env.API_HASH,
    binaryPath: path.join(process.cwd(), 'bin', 'libtdjson'),
  });

  // Save tglib default handler which prompt input at console
  const defaultHandler = client.callbacks['td:getInput'];

  // Register own callback for returning auth details
  client.registerCallback('td:getInput', async (args) => {
    if (args.string === 'tglib.input.AuthorizationType') {
      return 'user';
    } else if (args.string === 'tglib.input.AuthorizationValue') {
      // return await makeReadLine('your phone:');
      return env.USER_PHONE;
    }

    return await defaultHandler(args);
  });

  await client.ready;

  return new TgClient();
}

export class TgClient {
  client = client;
  usedProxy$ = new BehaviorSubject<IProxy>(null);

  constructor() {
    this.setOption('online', true);

    this.tryProxiesFromConfig(env.proxies);
  }

  private async tryProxiesFromConfig(proxies: IProxyConfig[]) {
    const response = await this.getProxies().catch(() => ({proxies: []}));
    const activeProxy = response.proxies.find(({is_enabled}) => is_enabled);

    if (proxies.length === 0) {
      if (activeProxy) {
        await this.disableProxy(activeProxy.id);
      }

      return;
    }

    if (activeProxy) {
      this.usedProxy$.next(activeProxy);

      return;
    }

    const promises = proxies
      .filter(({server, port}) => {
        return !response.proxies.some(savedProxy =>
          savedProxy.server === server
          && savedProxy.port === port
        )
      })
      .map(({type, server, port, data}) => this.addProxy(server, port, type, data));

    await Promise.all(promises);

    const allProxies = await this.getProxies();

    for (let i = 0; i < allProxies.proxies.length; i++) {
      const proxyItem = allProxies.proxies[i];

      try {
        await this.pingProxy(proxyItem.id);
        await this.enableProxy(proxyItem.id);

        break;
      } catch (e) {
        continue;
      }
    }
  }

  bind(event: string, stream$: Subject<any>) {
    this.client.registerCallback(event, (update: IUpdateEvent) => {
      stream$.next(update);
    });
  }

  async getChats(): Promise<IChatFullData[]> {
    return await client.tg.getAllChats();
  }

  async sendTextMessage(text: string, chat_id: number): Promise<IChatFullData[]> {
    return await client.tg.sendTextMessage({
      $text: new Structs.TextStruct(text, 'textParseModeHTML'),
      chat_id,
    });
  }

  async getChatLastMessages(chat: IChatFullData): Promise<IMessage[]> {
    const chatId = chat.id;
    const limit = 25;
    const allMessages = new Map<number, IMessage>();
    let triesLeft = 9;

    // if chat is empty
    if (!chat.last_message) {
      return [];
    }

    let lastLoadedMessage = chat.last_message;

    // For optimal performance the number of returned messages is chosen by the library.
    while (allMessages.size < limit || triesLeft--) {
      const currentChunk = await client.fetch({
        '@type': 'getChatHistory',
        chat_id: chatId,
        from_message_id: lastLoadedMessage.id,
        limit,
      }) as IMessagesResponse;

      if (currentChunk.total_count === 0) {
        break;
      }

      currentChunk.messages.forEach(message => {
        allMessages.set(message.id, message);
      });

      lastLoadedMessage = currentChunk.messages.pop();
    }

    return [...allMessages.values(), lastLoadedMessage];
  }

  async openChat(chatId: number): Promise<IOkResponse> {
    return await client.fetch({
      '@type': 'openChat',
      chat_id: chatId,
    });
  }

  async readChatMessages(chatId: number, messagesIds: number[]): Promise<IOkResponse> {
    return await client.fetch({
      '@type': 'viewMessages',
      chat_id: chatId,
      message_ids: messagesIds,
      force_read: false,
    });
  }

  async readAllChatMentions(chatId: number): Promise<IOkResponse> {
    return await client.fetch({
      '@type': 'readAllChatMentions',
      chat_id: chatId,
    });
  }

  async setOption(name: string, value: number | string | boolean): Promise<IOkResponse> {
    let valueStructure = null;

    switch (typeof value) {
      case 'string':
        valueStructure = {
          '@type': 'optionValueString',
          value,
        };
        break;
      case 'number':
        valueStructure = {
          '@type': 'optionValueNumber',
          value,
        };
        break;
      case 'boolean':
        valueStructure = {
          '@type': 'optionValueBoolean',
          value,
        };
        break;
      default:
        throw new Error('setOption(): Unexpected value type');
    }

    return await client.fetch({
      '@type': 'setOption',
      name,
      value: valueStructure,
    });
  }

  async closeChat(chatId: number): Promise<IOkResponse> {
    return await client.fetch({
      '@type': 'closeChat',
      chat_id: chatId,
    });
  }

  async getCurrentState(): Promise<IUpdatesResponse> {
    return await client.fetch({
      '@type': 'getCurrentState',
    });
  }

  async getUser(userId: number): Promise<IUser> {
    return client.fetch({
      '@type': 'getUser',
      user_id: userId,
    });
  }

  async getMessage(chat_id: number, message_id: number): Promise<IUser> {
    return client.fetch({
      '@type': 'getMessage',
      chat_id,
      message_id,
    });
  }

  async getProxies(): Promise<IProxiesResponse> {
    return client.fetch({
      '@type': 'getProxies',
    });
  }

  async pingProxy(proxy_id: number): Promise<ISecondsResponse> {
    return client.fetch({
      '@type': 'pingProxy',
      proxy_id,
    });
  }

  async enableProxy(proxy_id: number): Promise<IOkResponse> {
    return client.fetch({
      '@type': 'enableProxy',
      proxy_id,
    });
  }

  async disableProxy(proxy_id: number): Promise<IOkResponse> {
    return client.fetch({
      '@type': 'disableProxy',
      proxy_id,
    });
  }

  async addProxy(server: string, port: number, type: string, data?: any): Promise<IOkResponse> {
    return client.fetch({
      '@type': 'addProxy',
      server,
      port,
      type: {
        '@type': type,
        ...data,
      },
    });
  }
}
