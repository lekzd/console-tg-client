import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import { Application } from './Application';
import { IUpdateEvent } from './tg/tgInterfaces';
import { tgClientInit } from './tg/tgClient';

export const updates$ = new ReplaySubject<IUpdateEvent>();
export const error$ = new Subject<any>();
export const render$ = new BehaviorSubject<void>(null);

console.log('loading...');

tgClientInit().then(client => {
  client.bind('td:update', updates$);
  client.bind('td:error', error$);

  client.getCurrentState().then(({updates}) => {
    updates.forEach(update => {
      updates$.next(update);
    });
  }, () => {});

  const app = new Application(client);
}, () => {
  console.error('something went wrong!');
});
