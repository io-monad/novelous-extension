import EventEmitter from "eventemitter3";
import ValueTypes from "./value-types";
import objectGetGlob from "../util/object-get-glob";
const logger = debug("watcher");

/**
 * @typedef {Object} WatchSetting
 * @property {string}  id - ID of the target.
 * @property {string}  [valueType="any"] - Type of values for comparing.
 *     - `any` uses a value as is. Matched values should be comparable.
 *     - `set` collects values of `key` and builds a set of the unique values.
 *     - `number` collects values of `key` and uses a sum of the values.
 *     - `count` collects values of `key` and uses a count of values.
 * @property {string}  [valueKey] - Key of values in item to watch.
 *     It can be a deep path using `.` (dots) to separate keys.
 *     If a key in the path is `*`, then iterates over its value and collects
 *     all of values in the following path.
 * @property seenValue - Old value that is seen by user.
 *     It is used to determine whether update should be notified to user.
 * @property lastValue - Last value of target.
 *     It is stored to set to seenValue when user has checked notification.
 */

/**
 * Watcher watches on target object to find updates.
 */
export default class Watcher extends EventEmitter {
  /**
   * @param {WatchSetting[]} settings - Watch settings.
   */
  constructor(settings) {
    super();
    this.settings = settings;
  }

  /**
   * @return {WatchSetting[]}
   */
  get settings() {
    return this._settings;
  }

  /**
   * @param {WatchSetting[]} settings
   */
  set settings(settings) {
    this._settings = settings || [];
    this._settingsMap = _.keyBy(settings, "id");
  }

  /**
   * @param {string} id
   * @return {WatchSetting|undefined}
   */
  getSettingById(id) {
    return this._settingsMap[id];
  }

  /**
   * Get current counts of new updates in the settings.
   *
   * @return {Map.<string, number>}  Map of counts. Keys are `setting.id`.
   */
  getCounts() {
    return _.transform(this.settings, (counts, setting) => {
      const valueType = this._getValueType(setting.valueType);
      counts[setting.id] = valueType.diffCount(setting.lastValue, setting.seenValue);
    }, {});
  }

  /**
   * Notify update of target to find updates.
   *
   * @param {string} id - ID of the target.
   * @param target - Updated target.
   * @return {boolean} `true` if updated.
   */
  notifyUpdate(id, target) {
    logger(`Update notified for ${id}`, target);

    const setting = this.getSettingById(id);
    if (!setting) {
      logger(`Skipping update: No setting for ${id}`, target);
      return false;
    }

    const valueType = this._getValueType(setting.valueType);
    const rawValue = setting.valueKey ? objectGetGlob(target, setting.valueKey) : target;
    const newValue = valueType.filter(rawValue);
    const oldValue = setting.seenValue;
    setting.lastValue = newValue;

    if (_.isUndefined(setting.seenValue)) {
      // Never seen update must be initialization.
      // So we set seenValue here and just ignore update.
      setting.seenValue = _.clone(newValue);
      logger(`Set initial value for ${id}`, target, setting);
      this.emit("seen", { id, seenValue: newValue });
      return false;
    }

    const diffCount = valueType.diffCount(newValue, oldValue);
    if (diffCount !== 0) {
      logger(`Found ${diffCount} updates for ${id}`, target, setting);
      this.emit("update", {
        id,
        target,
        setting,
        rawValue,
        newValue,
        oldValue,
        count: diffCount,
      });
      return true;
    }

    logger(`No update found for ${id}`, target, setting);
    return false;
  }

  /**
   * Mark all watching targets as seen by user.
   *
   * `notifyUpdate` will not notify user until new update is coming.
   */
  markAsSeen() {
    logger("Marking all targets as seen");
    _.each(this._settings, (setting) => {
      setting.seenValue = _.clone(setting.lastValue);
    });
    this.emit("seenAll");
  }

  _applyValueType(target, setting) {
    const valueType = this._getValueType(setting.valueType);
    const rawValue = setting.valueKey ? objectGetGlob(target, setting.valueKey) : target;
    const value = valueType.filter(rawValue);
    const count = valueType.count(value);
    return { value, count };
  }

  _getValueType(valueTypeName) {
    let valueType = ValueTypes[valueTypeName];
    if (!valueType) {
      console.error(`[Watcher] No such valueType: "${valueTypeName}". Using "any" instead.`);
      valueType = ValueTypes.any;
    }
    return valueType;
  }
}
