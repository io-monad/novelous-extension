import _ from "lodash";
import React from "react";
import Sites from "../../sites";
import { MessageBox, Str, SiteIcon } from "../common";

const LoginRequiredMessage = () => (
  <MessageBox message="loginRequired" icon="user-times">
    <div className="sites">
      {_.map(Sites, (site) =>
        <a key={site.name} href={site.url} target="_blank" className="btn btn-link">
          <SiteIcon site={site.name} />
          {" "}
          <Str name={site.name} />
        </a>
      )}
    </div>
  </MessageBox>
);

export default LoginRequiredMessage;
