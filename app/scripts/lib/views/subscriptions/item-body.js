import _ from "lodash";
import React, { PropTypes } from "react";
import { Icon, CollapsedText } from "../common";

const TitleIcons = {
  "良い点": "thumbs-o-up",
  "悪い点": "thumbs-o-down",
  "一言": "commenting-o",
  "other": "asterisk",
};

export default class ItemBody extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    expanded: PropTypes.bool.isRequired,
  };

  getDecoratedBody(item) {
    if (item.type === "comment" && item.sourceType === "novel" && item.body) {
      const output = [];
      const re = /^▼(\S+)$/mg;
      let lastIndex = 0;
      let matched = re.exec(item.body);
      while (matched) {
        if (lastIndex !== matched.index) {
          const text = _.trim(item.body.slice(lastIndex, matched.index));
          output.push(<p key={output.length}>{text}</p>);
        }
        output.push(
          <h2 key={output.length}>
            <Icon name={TitleIcons[matched[1]] || TitleIcons.other} />
            {matched[1]}
          </h2>
        );
        lastIndex = matched.index + matched[0].length;
        matched = re.exec(item.body);
      }
      output.push(<p key={output.length}>{_.trim(item.body.slice(lastIndex))}</p>);
      return output;
    } else {
      return <p>{item.body}</p>;
    }
  }

  getSummary(item) {
    if (item.summary) {
      return item.summary.slice(0, 100);
    } else if (item.body) {
      return item.body.slice(0, 100);
    } else {
      return "";
    }
  }

  render() {
    const { item, expanded } = this.props;
    return (
      <CollapsedText expanded={expanded}>
        {expanded ? this.getDecoratedBody(item) : this.getSummary(item)}
      </CollapsedText>
    );
  }
}
