// @flow

import * as React from 'react';
import notifier from 'simple-react-notifications';
import "simple-react-notifications/dist/index.css";

notifier.configure({
  position: 'top-center'
});

export default class Notifier {
  static notifs: number[] = [];

  static error(msg: string) {
    this.notifs.push(notifier.error(msg));
  }

  static info(msg: string) {
    this.notifs.push(notifier.info(msg));
  }

  static success(msg: string) {
    this.notifs.push(notifier.success(msg));
  }
}
