import connect from "@vkontakte/vkui-connect-promise";

const VK_API_VERSION = "5.95";

let access_token = "";
let store = [];
const subscribers = [];

const init = (params) => new Promise(async (resolve, reject) => {
    if (!params.access_token) return reject("access_token not found in init params");
    access_token = params.access_token;
    const keys = await __getAllKeys();
    store = await __loadByKeys(keys);
    await __updateSubscribers();
    return resolve();
});

const subscribe = (f) => {
    const id = subscribers.push(f);
    return () => delete subscribers[id];
};

const get = (field) => store[field];

const set = (field, value) => new Promise((resolve, reject) => {
    __updateByKey(field, value)
        .then(() => {
            if (value === "") delete store[field];
            else store[field] = value;
            __updateSubscribers();
            return resolve();
        })
        .catch(() => reject("can't update value"));
});


// Helpers
const __getAllKeys = () => new Promise((resolve, reject) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "storage.getKeys",
        "params": {
            "v": VK_API_VERSION,
            "access_token": access_token
        }
    })
        .then((result) => resolve(result.data.response))
        .catch(() => reject("can't get all keys"))
});

const __loadByKeys = (keys) => new Promise((resolve, reject) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "storage.get",
        "params": {
            "v": VK_API_VERSION,
            "keys": keys.join(','),
            "access_token": access_token
        }
    })
        .then((result) => resolve(result.data.response.reduce((a, x) => { a[x.key] = x.value; return a }, {})))
        .catch(() => reject("can't load by keys"))
});

const __updateByKey = (key, value) => new Promise((resolve, reject) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "storage.set",
        "params": {
            "v": VK_API_VERSION,
            "key": key,
            "value": value,
            "access_token": access_token
        }
    })
        .then(() => resolve())
        .catch(() => reject("can't update value"));
});

const __updateSubscribers = () => new Promise((resolve) => {
    subscribers.forEach((sub) => sub(store));
    return resolve();
});

export default { init, get, set, subscribe };