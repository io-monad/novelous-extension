import requestAuthed from "../../util/request-authed";

/**
 * Send a request for the user's content in Narou
 * with checking the user is logged in.
 *
 * If not logged in, it rejects request with `LoginRequiredError`.
 */
export default requestAuthed({
  cookie: ["autologin", "userl"],
  loginUrl: /login/,
});
