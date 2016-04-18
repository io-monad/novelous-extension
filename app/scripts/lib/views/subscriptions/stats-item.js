import _ from "lodash";
import React, { PropTypes } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link, Icon, Num } from "../common";

export default class StatsItem extends React.Component {
  static propTypes = {
    stat: PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string,
      icon: PropTypes.string,
      unit: PropTypes.string,
      link: PropTypes.string,
    }).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  render() {
    const { stat, values } = this.props;
    return (
      <div
        className={`stats-item stats-item--stat-${_.kebabCase(stat.key)}`}
        data-tip={stat.label || _.startCase(stat.key)}
        data-for="stats-tooltip"
      >
        <div className="stats-item__current">
          <Link href={stat.link}>
            <span className="stat">
              <Icon name={stat.icon || "asterisk"} />
              <span className="stat__value"><Num>{stat.value}</Num></span>
              {stat.unit &&
                <span className="stat__unit">{stat.unit}</span>
              }
            </span>
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
