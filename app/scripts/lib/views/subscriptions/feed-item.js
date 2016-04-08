import React, { PropTypes } from "react";
import classNames from "classnames";
import Time from "../common/time";
import CollapsedText from "../common/collapsed-text";

export default class FeedItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(ev) {
    let el = ev.target;
    while (el) {
      if (/^a$/i.test(el.tagName)) return;
      el = el.parentNode;
    }
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const { item, isNewItem } = this.props;
    const { expanded } = this.state;
    const link = (url, text) => (url ? <a href={url} target="_blank">{text}</a> : text);
    return (
      <article
        className={classNames({
          "feed-item": true,
          "feed-item--new-item": isNewItem,
          "feed-item--expandable": !!item.body,
          "feed-item--collapsed": !expanded,
          "feed-item--expanded": expanded,
        })}
        onClick={this.handleClick}
      >
        <header className="feed-item__header">
          <h1 className="feed-item__title">
            {link(item.url, item.title)}
          </h1>
        </header>
        {item.body &&
          <div className="feed-item__body">
            <CollapsedText expanded={expanded}>
              {expanded ? item.body : item.body.slice(0, 100)}
            </CollapsedText>
          </div>
        }
        <footer className="feed-item__footer">
          {item.authorName &&
            <div className="feed-item__footer-item feed-item__author">
              <i className="fa fa-user"></i>
              {link(item.authorUrl, item.authorName)}
            </div>
          }
          {item.sourceTitle &&
            <div className="feed-item__footer-item feed-item__source">
              <i className="fa fa-book"></i>
              {link(item.sourceUrl, item.sourceTitle)}
            </div>
          }
          {(item.createdAt || item.updatedAt) &&
            <div className="feed-item__footer-item feed-item__time">
              <i className="fa fa-clock-o"></i>
              <Time value={item.updatedAt || item.createdAt} />
            </div>
          }
        </footer>
      </article>
    );
  }
}

FeedItem.propTypes = {
  item: PropTypes.object.isRequired,
  isNewItem: PropTypes.bool,
};

export default FeedItem;
