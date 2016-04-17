import _ from "lodash";
import React, { PropTypes } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link } from "../common";
import { Stat, getLabelDisplay } from "./stat";

export default class StatsItem extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    link: PropTypes.string,
    timestamps: PropTypes.arrayOf(PropTypes.number).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  render() {
    const { label, link, values } = this.props;
    return (
      <div
        className={`stats-item stats-item--stat-${_.kebabCase(label)}`}
        data-tip={getLabelDisplay(label)}
        data-for="stats-tooltip"
      >
        <div className="stats-item__current">
          <Link href={link}>
            <Stat label={label} value={_.last(values)} />
          </Link>
        </div>
        {values.length > 1 &&
          <div className="stats-item__sparkline">
            <Sparklines data={values} width={80} height={30}>
              <SparklinesLine color="rgb(24, 143, 201)" />
            </Sparklines>
          </div>
        }
      </div>
    );
  }
}
