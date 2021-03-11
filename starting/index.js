const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {
    type: String
    // required: true,
    // unique: true
  },
  author: String,
  pages: Number,
  releaseDate: Date,
  isAvailable: Boolean,
  genre: {
    type: [String],
    enum: ['Programming', 'Web Development', 'UI/UX']
  }
});

const Book = mongoose.model('Book', bookSchema);

mongoose
  .connect('mongodb://localhost/potato-skins-bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connected to our DB! 📚');

    return Book.create({
      title: 'NPM for Begginer Developers'
      author: 'Brittney',
      pages: 300,
      releaseDate: Date.now(),
      isAvailable: true,
      genre: ['Web Development']
    });
  })
  .then(book => {
    console.log('This is our newly created Book! =>', book);
    // const createdBooks = Book.find({});

    // console.log('Testing!', createdBooks);
    return Book.find({});
  })

  .then(dataReturnedByThePreviousThen => {
    console.log('These are the books that I found: ', dataReturnedByThePreviousThen);

    // return Book.findOneAndUpdate({pages: 10000, author: "Aleksandra"},{title: 'CSS for Expert Developers'},{ new: true })

    return Book.findByIdAndUpdate(
      '604a5f3ff4d4de27e3d737e5',
      { title: 'CSS for Expert Developers' },
      { new: true }
    );
  })
  .then(book => {
    console.log('Updated book', book);

    return Book.findOneAndDelete({ author: 'John', pages: { $gt: 400 } });
    // return Book.findByIdAndDelete('604a5cc6bf90212689fe8e70');
  })

  .then(deletedBook => {
    console.log('I just deleted the following book: ', deletedBook);

    return mongoose.disconnect();
  })

  .catch(error => {
    console.log('Oops, something went sideways! 👀', error);
  });
