import Cookies from "js-cookie";

interface SessionData {
  user_id?: number;
  slack_id?: string;
  slack_access_token?: string;
  spotify_id?: string;
  spotify_expires_at?: string;
  spotify_access_token?: string;
  spotify_refresh_token?: string;
}

export const getSessionData = () => {
  const sessionCookie = Cookies.get("session");
  if (sessionCookie === undefined) {
    return null;
  }
  try {
    return JSON.parse(atob(sessionCookie.split(".")[0])) as SessionData;
  } catch (err) {
    console.error(`Session cookie could not be decoded: ${err}`);
    return null;
  }
};

export const isAuthenticated = () => {
  const session = getSessionData();
  return session?.user_id ? true : false;
};
