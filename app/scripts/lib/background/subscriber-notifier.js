import _ from "lodash";
import AppVars from "../app/app-vars";

/**
 * Notification for Subscriber
 */
export default class SubscriberNotifier {
  constructor(subscriber) {
    this.subscriber = subscriber;
    this.notifiedItemIds = {};
    this.clickHandlers = {};
    this.sound = typeof Audio !== "undefined" ? new Audio(AppVars.notificationSoundUrl) : null;
    this._bindEvents();
  }

  notifyItem(subscription, item) {
    if (this.notifiedItemIds[item.id]) return Promise.resolve(false);
    this.notifiedItemIds[item.id] = true;
    return new Promise(resolve => {
      const notificationId = this._registerClickHandler(subscription, item);
      const options = {
        type: "basic",
        iconUrl: AppVars.iconUrl[128],
        title: subscription.title,
        message: item.title,
        contextMessage: item.body || undefined,
        isClickable: true,
      };
      chrome.notifications.create(notificationId, options, () => {
        resolve(true);
      });
      if (this.sound) this.sound.play();
    });
  }

  _bindEvents() {
    this.subscriber.on("update", () => {
      this._handleSubscriberUpdate();
    });
    chrome.notifications.onClicked.addListener(notificationId => {
      this._handleNotificationClicked(notificationId);
    });
    chrome.notifications.onClosed.addListener(notificationId => {
      this._handleNotificationClosed(notificationId);
    });
  }
  _handleSubscriberUpdate() {
    _.each(this.subscriber.subscriptions, sub => {
      _.each(sub.lastFoundItems, item => this.notifyItem(sub, item));
    });
  }
  _handleNotificationClicked(notificationId) {
    const handler = this.clickHandlers[notificationId];
    if (handler) handler.call(this);
    chrome.notifications.clear(notificationId);
  }
  _handleNotificationClosed(notificationId) {
    delete this.clickHandlers[notificationId];
  }

  _registerClickHandler(subscription, item) {
    const notificationId = `${subscription.id}::${item.id}`;
    const itemUrl = item.url || subscription.feed.url;
    const subId = subscription.id;
    const itemId = item.id;
    this.clickHandlers[notificationId] = () => {
      this._openPage(itemUrl);
      this._markItemAsRead(subId, itemId);
    };
    return notificationId;
  }

  _openPage(url) {
    chrome.tabs.create({
      url,
      active: true,
    });
  }

  _markItemAsRead(subscriptionId, itemId) {
    this.subscriber.clearUnreadItem(subscriptionId, itemId);
  }
}
