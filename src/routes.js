const apiPath = "/api/v1";

export const apiRoutes = {
  login: () => [apiPath, "login"].join("/"),
  signup: () => [apiPath, "signup"].join("/"),
  channels: () => [apiPath, "channels"].join("/"),
  channel: (id) => [apiPath, "channels", id].join("/"),
  messages: () => [apiPath, "messages"].join("/"),
};

export const appRoutes = {
  chat: () => "/",
  login: () => "/login",
  signup: () => "/signup",
};
