import _ from "lodash";
import AppVars from "../app/app-vars";
import AppData from "../app/app-data";
const logger = debug("notifier");

const DEFAULTS = AppData.defaults.notificationSettings;

/**
 * Notification for Subscriber
 */
export default class SubscriberNotifier {
  constructor(subscriber, options) {
    this.options = _.defaultsDeep({}, options, DEFAULTS);
    this.subscriber = subscriber;
    this.notifiedItemIds = {};
    this.clickHandlers = {};
    this.sound = typeof Audio !== "undefined" ? new Audio(AppVars.notificationSoundUrl) : null;
    this._bindEvents();
  }

  get alertEnabled() {
    return this.options.alertEnabled;
  }
  get soundEnabled() {
    return this.options.soundEnabled;
  }
  get enabled() {
    return this.alertEnabled || this.soundEnabled;
  }

  isEnabledSubscription(sub) {
    const enabled = this.options.enabledSubscriptionIds[sub.id];
    if (_.isUndefined(enabled)) return true;  // Enabled by default
    return !!enabled;
  }

  notifyItem(subscription, item) {
    if (!this.enabled) {
      logger("Skipped: Both alert and sound disabled", item);
      return Promise.resolve(false);
    }
    if (!this.isEnabledSubscription(subscription)) {
      logger(`Skipped: Subscription ${subscription.id} disabled`, item);
      return Promise.resolve(false);
    }
    if (this.notifiedItemIds[item.id]) {
      logger("Skipped: Already notified", item);
      return Promise.resolve(false);
    }
    this.notifiedItemIds[item.id] = true;

    return new Promise(resolve => {
      logger("Notifying item", item);
      if (this.soundEnabled && this.sound) {
        this.sound.play();
      }
      if (this.alertEnabled) {
        const notificationId = this._registerClickHandler(subscription, item);
        const options = {
          type: "basic",
          iconUrl: AppVars.iconUrl[128],
          title: _.compact([subscription.siteName, subscription.title]).join(": "),
          message: item.title +
            (item.authorName ? `\n${item.authorName}` : "") +
            (item.sourceTitle ? `\n${item.sourceTitle}` : ""),
          contextMessage: item.body || undefined,
          isClickable: true,
        };
        chrome.notifications.create(notificationId, options, () => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
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
    _.each(this.subscriber.itemsSubscriptions, sub => {
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
      logger("Notification clicked", item);
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
