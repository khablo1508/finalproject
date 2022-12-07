const mongoose = require('mongoose');
const Procedure = require('../models/Procedure.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

const books = [
  {
    title: 'Lip augmentation',
    description:
      'A type of procedure that aims to increase lip fullness through enlargement using fillers such as hyaluronic acid, fat or implants',
    duration: '1h',
    price: '300',
  },
  {
    title: 'Microneedling',
    description:
      'A cosmetic procedure that uses small, sterilized needles to prick the skin in order to encourage collagen production by taking advantage of the body’s natural healing response',
    duration: '1h 15min',
    price: '180',
  },
  {
    title: 'Aquafacial',
    description:
      'A resurfacing procedure that thoroughly cares for the skin by cleansing, exfoliating, extracting and hydrating. This non-invasive, non-surgical procedure is perfect for individuals that want instant results without discomfort or downtime',
    duration: '1h 15min',
    price: '180',
  },
  {
    title: 'Microdermabrasion',
    description:
      'A cosmetic procedure that uses fine crystals and a vacuum to remove dead skin cells. It can be used on the face, neck, chest, back and hands. The aim is to reduce fine lines, minor scars, wrinkles and age spots, and make the skin smoother and younger looking',
    duration: '1h 15min',
    price: '210',
  },
  {
    title: 'Wrinkle injection with hyaluronic acid',
    description:
      'A minimally invasive procedure for plastic and cosmetic surgery. This method is used for smoothing and filling face or neck wrinkles by injecting so-called dermal fillers.',
    duration: '1h 15min',
    price: 'On request',
  },
  {
    title: 'Nonsurgical Fat Reduction',
    description:
      'Nonsurgical or minimally invasive options for fat reduction include technology that uses heat, cooling or an injected medication to reduce fat cells',
    duration: '1h 15min',
    price: 'On request',
  },
];

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);

    return Procedure.create(books);
  })
  .then((proceduresFromDB) => {
    console.log(`Created ${proceduresFromDB.length} procedures`);

    return mongoose.connection.close();
  })
  .then(() => {
    console.log('DB connection closed!');
  })
  .catch((err) => {
    console.log(
      `An error occurred while creating procedures from the DB: ${err}`
    );
  });
