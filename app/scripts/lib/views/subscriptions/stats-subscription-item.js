import _ from "lodash";
import React, { PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import StatsSubscription from "../../subscriptions/subscription/stats";
import { Link, Icon, SiteIcon, Str, Time } from "../common";
import StatsList from "./stats-list";

const LINK_ORDERS = ["manage", "newEpisode"];
const LINK_ICONS = {
  manage: "cog",
  newEpisode: "pencil-square-o",
  other: "link",
};

export default class StatsSubscriptionItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  render() {
    const { subscription, item } = this.props;
    const statsLog = subscription.statsLogs[item.id];
    const statsLinks = _.get(item, "links.stats");

    let links;
    if (item.links) {
      const filtered = _.pickBy(item.links, _.isString);
      links = _.sortBy(_.entries(filtered), ([k]) => LINK_ORDERS[k] || Infinity);
    }

    const cls = "stats-subscription-item";  // Prefix for className
    return (
      <article
        className={classNames({
          [cls]: true,
          [`${cls}--collapsed`]: true,
        })}
      >
        <header className={`${cls}__header`}>
          <h1 className={`${cls}__title`}>
            <SiteIcon name={subscription.siteId} />
            {" "}
            <Link href={item.url} title={item.title} />
          </h1>
        </header>
        {statsLog &&
          <div className={`${cls}__body`}>
            <StatsList
              statsLog={statsLog}
              links={statsLinks}
            />
          </div>
        }
        <footer className={`${cls}__footer`}>
          <ul className={`${cls}__footer-right`}>
            {subscription.lastUpdatedAt &&
              <li className={`${cls}__time`}>
                <Icon name="clock-o" />
                <Time value={subscription.lastUpdatedAt} />
              </li>
            }
          </ul>
          <ul className={`${cls}__footer-left`}>
            {links && links.map(([label, url]) => (
              <li key={label} className={`${cls}__link`}>
                <Link key={label} href={url}>
                  <Icon name={LINK_ICONS[label] || LINK_ICONS.other} />
                  <Str name={`link-${label}`} defaults={_.startCase(label)} />
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      </article>
    );
  }
}

StatsSubscriptionItem.propTypes = {
  subscription: PropTypes.instanceOf(StatsSubscription).isRequired,
  item: PropTypes.object.isRequired,
};
