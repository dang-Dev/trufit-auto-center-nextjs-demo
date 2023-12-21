import PusherServer from "pusher";
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
    appId: "1711930",
    key: "b7542c005dde329f5044",
    secret: "9224f54a1fdec403e41f",
    cluster: "ap1",
    useTLS: true,
});

export const pusherClient = new PusherClient('b7542c005dde329f5044', {
    cluster: 'ap1',
})