const mongoose = require('mongoose');
const Procedure = require('../models/Procedure.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

const procedures = [
  {
    title: 'Lip augmentation',
    code: 'aug',
    description:
      'A type of procedure that aims to increase lip fullness through enlargement using fillers such as hyaluronic acid, fat or implants',
    duration: '1h',
    price: '300',
  },
  {
    title: 'Microneedling',
    code: 'needle',
    description:
      'A cosmetic procedure that uses tiny needles to prick the skin in order to encourage collagen production',
    duration: '1h 15min',
    price: '180',
  },
  {
    title: 'Aquafacial',
    code: 'af',
    description:
      'A resurfacing procedure that thoroughly cares for the skin by cleansing, exfoliating, extracting and hydrating',
    duration: '1h 15min',
    price: '180',
  },
  {
    title: 'Microdermabrasion',
    code: 'md',
    description:
      'A cosmetic procedure that uses fine crystals and a vacuum to remove dead skin cells and reduce fine lines, minor scars, wrinkles',
    duration: '1h 15min',
    price: '210',
  },
  {
    title: 'Wrinkle injection with hyaluronic acid',
    code: 'hyal',
    description:
      'A minimally invasive procedure for smoothing and filling face or neck wrinkles by injecting so-called dermal fillers.',
    duration: '1h 15min',
    price: 'On request',
  },
  {
    title: 'Nonsurgical Fat Reduction',
    code: 'lipo',
    description:
      'Nonsurgical or minimally invasive options for fat reduction include technology that uses heat, cooling or an injected medication',
    duration: '1h 15min',
    price: 'On request',
  },
  {
    title: 'Facial peeling',
    code: 'peel',
    description:
      'Removing layers of skin with chemical solutions to reveal the more youthful skin underneath. ',
    duration: '1h 15min',
    price: '90',
  },
];

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
    return Procedure.deleteMany();
  })
  .then(() => {
    return Procedure.create(procedures);
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
