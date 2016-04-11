import _ from "lodash";
import React from "react";
import MessageBox from "../common/message-box";
import Sites from "../../sites/sites";

const LoginRequiredMessage = () => (
  <MessageBox message="loginRequired" icon="user-times">
    <div className="sites">
      {_.map(Sites, (site, name) =>
        <a key={name} href={site.meta.url} target="_blank" className="btn btn-link">
          <img src={`/images/sites/${name}.png`} height="16" />
          {" "}
          {site.meta.displayName}
        </a>
      )}
    </div>
  </MessageBox>
);

export default LoginRequiredMessage;
