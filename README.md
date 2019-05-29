# VK Storage
Wrapper for VK Connect for simply use storage

## Install
```yarn add vk-storage``` or ```npm i vk-storage --save```

## Examples
### Quick start
```js
import VKStorage from "vk-storage";
import connect from "@vkontakte/vkui-connect-promise";

VKStorage.init({ access_token: "<TOKEN>", connect }).catch(console.error);
VKStorage.subscribe(console.log);
```

### Set value
```js
VKStorage.set("field", "value");
```

### Get value
```js
VKStorage.get("field");
```

### Subscribe for changes
```js
VKStorage.subscribe((store) => {
    // your code
});
```

## Author
*   [Stepan Novozhilov](https://vk.me/hit2hat)