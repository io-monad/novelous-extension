import _ from "lodash";
import React from "react";
import Sites from "../../sites";
import { MessageBox, Str, SiteIcon } from "../common";

const LoginRequiredMessage = () => (
  <MessageBox message="loginRequired" icon="user-times">
    <div className="sites">
      {_.map(_.keys(Sites).sort(), (name) =>
        <a key={name} href={Sites[name].url} target="_blank" className="btn btn-link">
          <SiteIcon site={name} />
          {" "}
          <Str name={name} />
        </a>
      )}
    </div>
  </MessageBox>
);

export default LoginRequiredMessage;
