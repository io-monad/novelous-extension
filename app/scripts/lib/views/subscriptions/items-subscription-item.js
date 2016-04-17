import React, { PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import Subscription from "../../subscriptions/subscription";
import { Link, Icon, SiteIcon, Time, CollapsedText } from "../common";
import TypeIcon from "./type-icon";

export default class ItemsSubscriptionItem extends React.Component {
  static propTypes = {
    subscription: PropTypes.instanceOf(Subscription),
    item: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    isHidden: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = { expanded: this.props.isUnread };
    this.handleExpand = this.handleExpand.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  handleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const { subscription, item, isUnread, isHidden } = this.props;
    const { expanded } = this.state;
    const cls = "items-subscription-item";
    return (
      <article
        className={classNames({
          [cls]: true,
          [`${cls}--single`]: subscription,
          [`${cls}--in-list`]: !subscription,
          [`${cls}--unread`]: isUnread,
          [`${cls}--expandable`]: !!item.body,
          [`${cls}--collapsed`]: !expanded,
          [`${cls}--expanded`]: expanded,
          hidden: isHidden,
        })}
        onClick={this.handleExpand}
      >
        <header className={`${cls}__header`}>
          <h1 className={`${cls}__title`}>
            <TypeIcon type={item.type} />
            <Link href={item.url} title={item.title} />
          </h1>
        </header>
        {item.body &&
          <div className={`${cls}__body`}>
            <CollapsedText expanded={expanded}>
              {expanded ? item.body : item.body.slice(0, 100)}
            </CollapsedText>
          </div>
        }
        <footer className={`${cls}__footer`}>
          <ul className={`${cls}__footer-right`}>
            {(item.createdAt || item.updatedAt) &&
              <li className={`${cls}__time`}>
                <Icon name="clock-o" />
                <Time value={item.updatedAt || item.createdAt} />
              </li>
            }
          </ul>
          <ul className={`${cls}__footer-left`}>
            {subscription &&
              <li className={`${cls}__subscription`}>
                <SiteIcon name={subscription.siteId} />
                <Link
                  href={subscription.feed && subscription.feed.url}
                  title={
                    subscription.siteName ? `${subscription.siteName}: ${subscription.title}`
                    : subscription.title
                  }
                >{subscription.title}</Link>
              </li>
            }
            {item.authorName &&
              <li className={`${cls}__author`}>
                <Icon name="user" />
                <Link href={item.authorUrl} title={item.authorName} />
              </li>
            }
            {item.sourceTitle &&
              <li className={`${cls}__source`}>
                <TypeIcon type={item.sourceType} />
                <Link href={item.sourceUrl} title={item.sourceTitle} />
              </li>
            }
          </ul>
        </footer>
      </article>
    );
  }
}
