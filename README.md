# SteepChat
The server for [SteepChat](https://github.com/KayOhhDee/react-redux-steepchat-client)

## Getting Started

* Clone the repository

```
https://github.com/KayOhhDee/react-redux-steepchat-server.git
```

### Prerequisites

* Make sure you have MongoDB [installed](https://www.mongodb.com/download-center/community) locally. Locate mongod.exe in the directory you installed MongoDB and run it.

* Make sure you have a [cloudinary](https://cloudinary.com) account. Go to your dashboard and grab your Cloud name, API Key and API Secret.

* Create a .env file in the root of the project and assign CLOUD_NAME, API_KEY and API_SECRET to the Cloud name, API Key and API Secret you grabbed from your dashboard respectively.

* Add SECRET_KEY to the .env file and assign it to any secret key of your choice.

### Installing

* Install dependencies

```
npm install
```

* Start the server

```
node index.js
```