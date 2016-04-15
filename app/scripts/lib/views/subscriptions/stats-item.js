import _ from "lodash";
import React, { PropTypes } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link, Icon, Num } from "../common";
import { translate } from "../../util/chrome-util";

const StatsItem = ({ label, link, icon, unit, values }) => {
  return (
    <div
      className={`stats-item stats-item--stat-${_.kebabCase(label)}`}
      data-tip={translate(`label-${label}`, _.startCase(label))}
      data-for="stats-tooltip"
    >
      <div className="stats-item__current">
        <Link href={link}>
          <Icon name={icon} />
          <span className="stats-item__value"><Num>{_.last(values)}</Num></span>
          {unit &&
            <span className="stats-item__unit">{translate(unit)}</span>
          }
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
};

StatsItem.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string,
  icon: PropTypes.string.isRequired,
  unit: PropTypes.string,
  timestamps: PropTypes.arrayOf(PropTypes.number).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default StatsItem;
