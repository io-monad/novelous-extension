import Subscriber from "../subscriptions/subscriber";
import Publisher from "../publications/publisher";
import AppData from "../app/app-data";
import ExternalMessageReceiver from "./external-message-receiver";
import UpdateTimer from "./update-timer";
import Badge from "./badge";
const logger = debug("background");

/**
 * Background controller
 */
export default class BackgroundController {
  constructor() {
    this.externalMessageReceiver = new ExternalMessageReceiver(this);
    this.badge = new Badge();
    this.appData = null;
    this.subscriber = null;
    this.publisher = null;
    this.updateTimer = null;
    this.initializePromise = null;
  }

  /**
   * Start controller to handle messages and events
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

  /**
   * Called when AppData is loaded first time.
   */
  _setupWithAppData(appData) {
    this.appData = appData;
    this.appData.on("update", () => { this._handleAppDataUpdate(); });

    this._setupPublisher();
    this._setupSubscriber();
    this._setupUpdateTimer();
  }

  _setupPublisher() {
    this.publisher = new Publisher(this.appData.siteSettings);
    logger("Initialized Publisher", this.publisher);
  }

  _setupSubscriber() {
    this.subscriber = new Subscriber(this.appData.subscriptionSettings);
    this.subscriber.on("update", () => {
      logger("Updated Subscriber", this.subscriber);
      this.badge.setCount(this.subscriber.getNewItemsCount());
      this.appData.subscriptionSettings = this.subscriber.subscriptionSettings;
      this.appData.save();
    });
    this.badge.setCount(this.subscriber.getNewItemsCount());
    logger("Initialized Subscriber", this.subscriber);
  }

  _setupUpdateTimer() {
    this.updateTimer = new UpdateTimer(
      this.appData.updatePeriodMinutes,
      this.appData.lastUpdatedAt
    );
    this.updateTimer.on("timer", () => {
      this._updateSubscriptions();
      this.appData.lastUpdatedAt = this.updateTimer.lastUpdatedAt;
      this.appData.save();
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

  /**
   * Called when AppData is updated by chrome.storage.
   */
  _handleAppDataUpdate(appData, keys) {
    const updated = _.keyBy(keys);
    if (updated.siteSettings) {
      this.publisher.siteSettings = this.appData.siteSettings;
    }
    if (updated.subscriptionSettings) {
      this.subscriber.subscriptionSettings = this.appData.subscriptionSettings;
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
    return this.initialized().then(() => this.publisher);
  }

  /**
   * Clear notification on the badge.
   *
   * @return {Promise}
   */
  markBadgeAsSeen() {
    return this.getSubscriber().then(subscriber => {
      logger("Clearing new items");
      subscriber.clearNewItems();
    });
  }

  /**
   * Start to update all subscriptions immediately.
   *
   * @return {Promise}
   */
  updateSubscriptions() {
    this.updateTimer.reset();
    return this._updateSubscriptions();
  }
  _updateSubscriptions() {
    return this.getSubscriber().then(subscriber => {
      return subscriber.updateAll().catch((e) => {
        console.error("Error in subscriber.updateAll:", e);
        throw e;
      });
    });
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
