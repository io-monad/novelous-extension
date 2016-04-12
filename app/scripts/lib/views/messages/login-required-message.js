import _ from "lodash";
import React from "react";
import MessageBox from "../common/message-box";
import Str from "../common/str";
import Sites from "../../sites";

const LoginRequiredMessage = () => (
  <MessageBox message="loginRequired" icon="user-times">
    <div className="sites">
      {_.map(Sites, (site) =>
        <a key={site.name} href={site.url} target="_blank" className="btn btn-link">
          <img src={site.iconUrl} height="16" />
          {" "}
          <Str name={site.name} />
        </a>
      )}
    </div>
  </MessageBox>
);

export default LoginRequiredMessage;
