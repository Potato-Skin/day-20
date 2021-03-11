// First we require the mongoose package
// in order to use it later
const mongoose = require('mongoose');

// We then create a mongoose Schema,
// that is a blueprint of what the documents
// we'll write to our database will look like
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages: Number,
  releaseDate: Date, // yyyy-mm-dd
  isAvailable: Boolean,
  genre: String
});

// Why do we create a Schema?
// A Schema prevents us from :
// -> adding fields that shouldn't otherwise exist (because we define the fields ourselves);
// -> forgetting fields that are required;
// -> using the wrong type in a field

// A more complex schema below
/*
const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    maxLength: 50
  },
  pages: {
    type: Number,
    min: 80,
    max: 2000
  },
  releaseDate: {
    type: Date,
    default: Date.now()
  },
  available: Boolean,
  genre: {
    type: String,
    enum: ['Programming', 'Web Development', 'UI/UX']
  }
});
*/
const Book = mongoose.model('Book', bookSchema); // Creates a book collection; Tells Mongoose to use the bookSchema

// Below we use mongoose to perform CRUD Operations:
// C: Create
// R: Read
// U: Update
// D: Delete

// first we connect mongoose to our database
mongoose
  .connect('mongodb://localhost:27017/book-factory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Mongoose successfully connected to our database! 📚');
    // Erases everything we have in our database so far
    mongoose.connection.dropDatabase();

    //? Inserting multiple books in our DB
    return Book.insertMany([
      {
        title: 'HTML for Aspiring Developers',
        author: 'Ironhack',
        pages: 600,
        releaseDate: '2021-03-03',
        available: true,
        genre: 'Web Development'
      },
      {
        title: 'CSS for Aspiring Developers',
        author: 'Ironhack',
        pages: 800,
        releaseDate: new Date(),
        available: false,
        genre: 'UI/UX'
      },
      {
        title: 'JS for Aspiring Developers',
        author: 'Ironhack',
        pages: 1000,
        releaseDate: new Date(),
        available: true,
        genre: 'Web Development'
      }
    ]);
    //? If we wanted to create just one book in our DB
    // return Book.create({
    //   title: 'React for Aspiring Developers',
    //   author: 'Ironhack',
    //   pages: 1000,
    //   releaseDate: new Date(),
    //   available: false,
    //   genre: 'Programming'
    // });
  })
  .then(dataReturnedFromPreviousThen => {
    console.log('🔥 Heres our newly stored books: ', dataReturnedFromPreviousThen);

    //? Find all books in our DB
    return Book.find({});

    // Could also pass a MongoDB query like the $gt
    // The query below gets all books in which the pages number are bigger than 800
    // return Book.find({pages: {$gt: 800}})
  })
  .then(allBooks => {
    console.log('🔍 I searched the DB and found these books: ', allBooks);

    // return Book.findByIdAndUpdate("document id here", {key: updatedValue}, {new: true})
    return Book.findOneAndUpdate(
      { pages: 800 },
      { title: 'CSS for Advanced & Genius Developers' },
      { new: true } // makes sure to return the updated document. By default, the original one is returned
    );
  })
  .then(updatedBook => {
    console.log(updatedBook);

    return Book.findByIdAndRemove('60477b2c5fba0113b2fcd707'); // removes a certain document by the passed ID
  })
  .then(deletedBook => {
    console.log('We just deleted: ', deletedBook);

    return mongoose.disconnect(); // disconnects mongoose from the server
  })
  .then(() => {
    console.log('Successfully disconnected from the DB. ✌');
  })
  // the .catch() get's called whenever a one of the operations above fails to run correctly
  .catch(error => {
    console.log('There was an error performing one of the operations above');
    console.log(error);
  });
