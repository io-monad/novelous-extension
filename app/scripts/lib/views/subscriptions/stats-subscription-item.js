import React, { PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import StatsSubscription from "../../subscriptions/subscription/stats";
import { Link, Icon, SiteIcon, Time } from "../common";
import StatsList from "./stats-list";
import StatsChartList from "./stats-chart-list";
import LinkList from "./link-list";

export default class StatsSubscriptionItem extends React.Component {
  static propTypes = {
    subscription: PropTypes.instanceOf(StatsSubscription).isRequired,
    item: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleExpand = this.handleExpand.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  handleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const { subscription, item } = this.props;
    const { expanded } = this.state;
    const statsLog = subscription.statsLogs[item.id];

    const cls = "stats-subscription-item";  // Prefix for className
    return (
      <article
        className={classNames({
          [cls]: true,
          [`${cls}--expandable`]: statsLog.timestamps.length > 1,
          [`${cls}--collapsed`]: !expanded,
          [`${cls}--expanded`]: expanded,
        })}
        onClick={this.handleExpand}
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
            {expanded &&
              <div className={`${cls}__chart`}>
                <StatsChartList stats={item.stats} statsLog={statsLog} />
              </div>
            }
            <StatsList stats={item.stats} statsLog={statsLog} />
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
          <div className={`${cls}__footer-left`}>
            {item.links &&
              <LinkList links={item.links} />
            }
          </div>
        </footer>
      </article>
    );
  }
}
