How to Run:

Scraper:

CD into the scraper folder and run node scraper.js

API

To start REST API:
navigate into root project foler and run heroku local web

To add new route/mongo collection

1. Create the interface and model. export
2. import the the model into index.ts
3. create a new route in the REST API logic area
4. Do a POST to the route you created (use Postman)
5. This will create collection in the database. Take note of what the collection name is
6. use the collection name in the scraper (db.collection("NAME-CREATED-BY-POST")) so the scraper inserts the data in the correct place
7. check in mLab that the data is inserted into the correct collection after running the scraper.
8. then check with a get request with Postman


TODO:

1.Figure out how express or mongo or mongoose assigns the route to a collection so you can create your own collection in mongo and connect the route to that collection
