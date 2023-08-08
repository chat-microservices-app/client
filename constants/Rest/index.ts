const REST = {
  BASE_URL: "http://192.168.1.99:5555",
  BASE_ENDPOINT: "/api/v1",
  ROOMS: {
    ROOT: "/rooms",
    JOIN: "/join",
    PUBLIC: "/public",
  },
  AUTH: {
    ROOT: "/auth",
    REGISTER: "/register",
    LOGIN: "/login",
    REFRESH_TOKEN: "/refresh-token",
  },
  SESSION: {
    ROOT: "/users",
  },
  MESSAGING: {
    WS: {
      ROOT: "/chats/ws-chatapp/",
      CHANNEL_GET_MESSAGES: "/topic/rooms",
    },
    ROOT: "/messages",
  },
} as const;

export default REST;
