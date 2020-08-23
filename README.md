# Tabletop Browser App

Frontend made with [Create React App](https://github.com/facebook/create-react-app).<br/>
Backend made with NodeJS, supported with MongoDB.

![screenshot](https://github.com/tanmayband/tabletop/blob/master/frontend_screenshot.png?raw=true)

## Ports
The application uses following ports (can be changed).<br/>
Frontend: `3000`<br/>
Backend: `3001`<br/>
MongoDB: `27017`

## Basic setup
Make sure you have installed and setup [NodeJS](https://nodejs.org) and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) and followed all the steps outlined.

## Startup
(Make sure MongoDB is running)

```
cd backend
npm start
```
```
cd frontend
npm start
```

## Customizing
`Players` can be added from the browser app.
However, `Items` and `Materials` need to be added directly into MongoDB. All these datatypes need to follow schemas found in `backend/models`.

## Upcoming
- Add `Crafting Table` for bigger recipes
- Turn-based battle support and visualization
    - Affect health and armour of participants
    - Affect health of weapons and tools
- Add mechanism to unlock new recipes


<br/>
Have fun DnD-ing!
