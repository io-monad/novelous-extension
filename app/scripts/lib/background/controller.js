import ExternalMessageReceiver from "./external-message-receiver";
import Subscriber from "../subscriptions/subscriber";
import Publisher from "../publications/publisher";
import AppData from "../app/app-data";
import ChromeAlarm from "../util/chrome-alarm";
import Badge from "./badge";
const logger = debug("background");

/**
 * Background controller
 */
export default class BackgroundController {
  constructor() {
    this.externalMessageReceiver = new ExternalMessageReceiver(this);
    this.subscriberAlarm = new ChromeAlarm("subscriber");
    this.badge = new Badge();
    this.appData = null;
    this.subscriber = null;
    this.publisher = null;
    this.initializePromise = null;
  }

  /**
   * Start controller to handle messages and events
   */
  start() {
    logger("Initializing");
    this.externalMessageReceiver.register();
    this.subscriberAlarm.on("alarm", this.updateSubscriptions.bind(this));

    // Start initialization process by loading AppData.
    this.initializePromise = AppData.load().then(appData => {
      this.appData = appData;
      this.appData.on("update", this._handleAppDataUpdate.bind(this));
      this._setupWithAppData();
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
  _setupWithAppData() {
    this._setupPublisher();
    this._setupSubscriber();
    this._updateBadge();
    this._startAlarm();
  }

  _setupPublisher() {
    this.publisher = new Publisher(this.appData.sites);
    logger("Initialized Publisher", this.publisher);
  }

  _setupSubscriber() {
    this.subscriber = new Subscriber(this.appData.subscriptions);

    this.subscriber.on("updateSubscription", sub => {
      this.badge.setCount(sub.id, sub.updateCount);
    });
    this.subscriber.on("clear", () => {
      this.badge.clear();
    });
    logger("Initialized Subscriber", this.subscriber);
  }

  /**
   * Called when AppData is updated by chrome.storage.
   */
  _handleAppDataUpdate(appData, keys) {
    const updated = _.keyBy(keys);
    if (updated.sites) {
      this.publisher.sites = this.appData.sites;
      logger("Updated Publisher", this.publisher);
    }
    if (updated.subscriptions) {
      this.subscriber.subscriptions = this.appData.subscriptions;
      this._updateBadge();
      logger("Updated Subscriber", this.subscriber);
    }
    if (updated.lastUpdatedAt || updated.updatePeriodMinutes) {
      this._startAlarm();
    }
  }

  _updateBadge() {
    this.badge.clear();
    _.each(this.subscriber.subscriptions, sub => {
      this.badge.setCount(sub.id, sub.updateCount);
    });
  }

  _startAlarm() {
    this.subscriberAlarm.start({
      when: this.appData.nextWillUpdateAt,
      periodInMinutes: this.appData.updatePeriodMinutes,
    });
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
      logger("Clearing badge count");
      subscriber.clearNewItems();
      this.appData.subscriptions = subscriber.subscriptions;
      return this.appData.save(["subscriptions"]);
    });
  }

  /**
   * Start to update all subscriptions immediately.
   *
   * @return {Promise}
   */
  updateSubscriptions() {
    return this.getSubscriber().then(subscriber => {
      logger("Updating all subscriptions");
      return subscriber.updateAll().then(() => {
        logger("Updated all subscriptions successfully");
        this.appData.lastUpdatedAt = _.now();
        this.appData.subscriptions = subscriber.subscriptions;
        return this.appData.save(["lastUpdatedAt", "subscriptions"]);
      }).catch((e) => {
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
