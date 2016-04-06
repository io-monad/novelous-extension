/**
 * Base class of watch strategy that detects new items in a feed.
 */
export default class WatchStrategy {
  /**
   * @param session - Session data. It can be anything.
   */
  constructor(session) {
    this._session = session || null;
  }

  get session() {
    return this._session;
  }

  set session(session) {
    this._session = session;
  }

  getNewItems(items) {  // eslint-disable-line
    throw new Error("getNewItems must be overridden");
  }

  clearNewItems(items) {  // eslint-disable-line
    throw new Error("clearNewItems must be overridden");
  }
}
