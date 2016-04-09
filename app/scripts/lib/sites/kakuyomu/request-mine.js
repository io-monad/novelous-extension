import requestAuthed from "../../util/request-authed";

/**
 * Send a request for the user's content in Kakuyomu
 * with checking the user is logged in.
 *
 * If not logged in, it rejects request with `LoginRequiredError`.
 */
export default requestAuthed({
  cookie: "dlsc",
  loginUrl: /login/,
});
