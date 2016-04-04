import ExternalMessageReceiver from "./external-message-receiver";
import Subscriber from "../subscriptions/subscriber";
import Watcher from "../watchers/watcher";
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
    this.watcher = null;
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
    this._setupWatcher();
    this._startAlarm();
  }

  _setupPublisher() {
    this.publisher = new Publisher(this.appData.sites);
    logger("Initialized Publisher", this.publisher);
  }

  _setupSubscriber() {
    this.subscriber = new Subscriber(this.appData.sites, this.appData.subscriptions);

    this.subscriber.on("updateSubscription", (subscription) => {
      this.watcher.notifyUpdate(subscription.id, subscription.item);
    });
    logger("Initialized Subscriber", this.subscriber);
  }

  _setupWatcher() {
    this.watcher = new Watcher(this.appData.watchSettings);
    this._updateBadge();

    const appDataSave = _.debounce(() => this.appData.save(["watchSettings"]), 3000);
    const h = (fn) => (...args) => {
      this.appData.watchSettings = this.watcher.settings;
      appDataSave();
      return fn.apply(this, args);
    };
    this.watcher.on("update", h(({ id, count }) => this.badge.setCount(id, count)));
    this.watcher.on("seen", h(({ id }) => this.badge.setCount(id, 0)));
    this.watcher.on("seenAll", h(() => this.badge.clear()));
    logger("Initialized Watcher", this.watcher);
  }

  /**
   * Called when AppData is loaded or updated by chrome.storage.
   */
  _handleAppDataUpdate(appData, keys) {
    const updated = _.keyBy(keys);
    if (updated.sites) {
      this.publisher.sites = this.appData.sites;
      logger("Updated Publisher", this.publisher);
    }
    if (updated.subscriptions) {
      this.subscriber.subscriptions = this.appData.subscriptions;
      logger("Updated Subscriber", this.subscriber);
    }
    if (updated.watchSettings) {
      this.watcher.settings = this.appData.watchSettings;
      logger("Updated Watcher", this.watcher);
    }
    if (updated.lastUpdatedAt) {
      this._startAlarm();
    }
  }

  _updateBadge() {
    this.badge.clear();
    _.each(this.watcher.getCounts(), (count, id) => {
      this.badge.setCount(id, count);
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
   * @return {Promise.<Watcher>}
   */
  getWatcher() {
    return this.initialized().then(() => this.watcher);
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
    return this.getWatcher().then(watcher => {
      watcher.markAsSeen();
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
      subscriber.updateAll().then(() => {
        logger("Updated all subscriptions successfully");
        this.appData.lastUpdatedAt = _.now();
        this.appData.subscriptions = subscriber.subscriptions;
        this.appData.save(["lastUpdatedAt", "subscriptions"]);
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
