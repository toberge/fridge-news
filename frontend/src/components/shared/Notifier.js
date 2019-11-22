// @flow

import notifier from 'simple-react-notifications';
import 'simple-react-notifications/dist/index.css';
import './Notifier.css';

notifier.configure({
  position: 'top-center',
  closeOnClick: true,
  animation: {
    in: 'fadeIn',
    out: 'fadeOut',
    duration: 200
  }
});

export default class Notifier {
  static notifs: number[] = [];

  static error(msg: string, error: ?Error) {
    if (error) {
      console.error(error, msg);
      msg = msg + ' ' + error.message;
    }
    this.notifs.push(
      notifier.error(msg, {
        autoClose: 4000
      })
    );
  }

  static info(msg: string) {
    this.notifs.push(notifier.info(msg));
  }

  static success(msg: string) {
    this.notifs.push(notifier.success(msg));
  }
}
