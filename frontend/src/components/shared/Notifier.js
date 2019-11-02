// @flow

import * as React from 'react';
import notifier from 'simple-react-notifications';
import "simple-react-notifications/dist/index.css";
import "./Notifier.css";

notifier.configure({
  position: 'top-center',
  closeOnClick: true,
  width: '30rem',
  animation: {
    in: "fadeIn",
    out: "fadeOut",
    duration: 200
  }
});

export default class Notifier {
  static notifs: number[] = [];

  static error(msg: string) {
    this.notifs.push(notifier.error(msg, {
      autoClose: 4000
    }));
  }

  static info(msg: string) {
    this.notifs.push(notifier.info(msg));
  }

  static success(msg: string) {
    this.notifs.push(notifier.success(msg));
  }
}
