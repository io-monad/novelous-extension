import _ from "lodash";
import Subscriber from "../subscriptions/subscriber";
import Publisher from "../publications/publisher";
import AppData from "../app/app-data";
import ExternalMessageReceiver from "./external-message-receiver";
import UpdateTimer from "./update-timer";
import Badge from "./badge";
import SubscriberNotifier from "./subscriber-notifier";
const logger = debug("background");

/**
 * Background controller
 */
export default class BackgroundController {
  constructor() {
    this.externalMessageReceiver = new ExternalMessageReceiver(this);
    this.badge = new Badge();
    this.publisher = new Publisher();
    this.appData = null;
    this.subscriber = null;
    this.updateTimer = null;
    this.notifier = null;
    this.initializePromise = null;
  }

  /**
   * Start controller to handle messages and events
   * @return {Promise}
   */
  start() {
    logger("Initializing");
    this.externalMessageReceiver.register();

    // Start initialization process by loading AppData.
    this.initializePromise = AppData.load().then(appData => {
      this._setupWithAppData(appData);
      return this;
    }).catch((e) => {
      console.error("Error while initialization in BackgroundController", e);
      throw e;
    });
    return this.initializePromise;
  }

  // Called when AppData is loaded first time.
  _setupWithAppData(appData) {
    this.appData = appData;
    this.appData.on("update", this._handleAppDataUpdate.bind(this));

    this._setupSubscriber();
    this._setupNotifier();
    this._setupUpdateTimer();
  }

  _setupSubscriber() {
    this.subscriber = new Subscriber(this.appData.subscriptionSettings);
    this.subscriber.on("update", () => {
      logger("Updated Subscriber", this.subscriber);
      this.badge.setCount(this.subscriber.getUnreadItemsCount());
      this.appData.subscriptionSettings = this.subscriber.subscriptionSettings;
      this.appData.save();
    });
    this.badge.setCount(this.subscriber.getUnreadItemsCount());
    logger("Initialized Subscriber", this.subscriber);
  }

  _setupNotifier() {
    this.notifier = new SubscriberNotifier(this.subscriber,
      this.appData.notificationSettings);
    logger("Initialized Notifier", this.notifier);
  }

  _setupUpdateTimer() {
    this.updateTimer = new UpdateTimer(
      this.appData.updatePeriodMinutes,
      this.appData.lastUpdatedAt
    );
    this.updateTimer.on("timer", () => {
      this.updateSubscriptions();
    });
    this.updateTimer.on("update", () => {
      logger("Updated UpdateTimer", this.updateTimer);
      this.appData.lastUpdatedAt = this.updateTimer.lastUpdatedAt;
      this.appData.updatePeriodMinutes = this.updateTimer.updatePeriodMinutes;
      this.appData.save();
    });
    this.updateTimer.start();
    logger("Initialized UpdateTimer", this.updateTimer);
  }

  // Called when AppData is updated by chrome.storage.
  _handleAppDataUpdate(appData, keys) {
    const updated = _.keyBy(keys);
    if (updated.subscriptionSettings) {
      this.subscriber.subscriptionSettings = this.appData.subscriptionSettings;
    }
    if (updated.notificationSettings) {
      this.notifier.options = this.appData.notificationSettings;
    }
    if (updated.lastUpdatedAt) {
      this.updateTimer.lastUpdatedAt = this.appData.lastUpdatedAt;
    }
    if (updated.updatePeriodMinutes) {
      this.updateTimer.updatePeriodMinutes = this.appData.updatePeriodMinutes;
    }
  }

  /**
   * @return {Promise} Promise that is resolved when initialization has done.
   */
  initialized() {
    return this.initializePromise || Promise.reject("Not started");
  }

  /**
   * @return {Promise.<AppData>}
   */
  getAppData() {
    return this.initialized().then(() => this.appData);
  }

  /**
   * @return {Promise.<Subscriber>}
   */
  getSubscriber() {
    return this.initialized().then(() => this.subscriber);
  }

  /**
   * @return {Promise.<Publisher>}
   */
  getPublisher() {
    return Promise.resolve(this.publisher);
  }

  /**
   * Clear notification on the badge.
   *
   * @return {Promise}
   */
  markBadgeAsSeen() {
    return this.getSubscriber().then(subscriber => {
      logger("Clearing unread items");
      subscriber.clearUnreadItems();
    });
  }

  /**
   * Start to update all subscriptions immediately.
   *
   * This returns the same Promise for parallel runs.
   *
   * @return {Promise.<Subscriber>}
   */
  updateSubscriptions() {
    if (this._updatePromise) return this._updatePromise;

    this.updateTimer.stop();
    this._updatePromise = this.getSubscriber().then(subscriber => {
      return subscriber.updateAll().then(resolved => {
        this.updateTimer.reset().start();
        this._updatePromise = null;
        return resolved;
      });
    })
    .catch((e) => {
      this.updateTimer.reset().start();
      this._updatePromise = null;
      throw e;
    });

    return this._updatePromise;
  }

  /**
   * Publish novels with given publication settings.
   *
   * @param {Publication[]} publications
   * @return {Promise}
   */
  publishNovel(publications) {
    return this.getPublisher().then(publisher => {
      logger("Publishing novel", publications);
      return publisher.publishAll(publications);
    });
  }
}
