define([
  'backbone',
  'jquery',
  'underscore',
  'chance' 
], function(bb, $, _, Chance) {
  
  var chance = new Chance();
  
  var CHUNK_SIZE = 1000;
  var genders = ['male', 'female'];
  var genres = ['action', 'drama', 'novel', 'fantasy', 'horror', 'finance'];  
  
  var books = []; //ideally this should be saved/retrieved from local storage for not regenerating each time
  
  /**
   * Main service for book list related buisness logic
   * 
   * Webworkers could also be used as another solution for main methods.
   */
  var bookService = {
    
    generateBooks: function(count) {
      var generatingBooks = $.Deferred();
      var generatedCount = 0;
      
      // generate async in chunks, don't freeze app
      setTimeout(generateChunk, 1);   
      
      return generatingBooks.promise();
      
      function generateChunk() {
        for (var i = generatedCount; i < generatedCount + CHUNK_SIZE; i++) {
          books.push(bookService.generateBook(i));
        }
        generatedCount = books.length;
        bb.trigger('bookService:generated', generatedCount);
        if (generatedCount >= count) {
          generatingBooks.resolve(books);
          return;
        }
        setTimeout(generateChunk, 1);
      }
    },
    
    generateBook: function(index) {
      return {
        name: chance.word() + ' #' + index,
        genre: genres[getRandomInt(0, genres.length - 1)],
        date: getRandomDate(),
        author: getRandomAuthor()
      };
    },
    
    getBooks: function(filterModel) {
      var gettingBooks = $.Deferred();
      var filtering = $.Deferred();
            
      var filteredBooks = [];
      var filteredCount = 0;
      
      filtering.done(function() {
        // sort books after filtering is done
        gettingBooks.resolve(sortBooks(filteredBooks, filterModel));
      }); 
      
      if (filterModel) {
        // filter async in chunks, don't freeze app
        setTimeout(filterChunk, 1);
      } else {
        //no filtering, just return books
        gettingBooks.resolve(books);
      }
      
      return gettingBooks.promise();
      
      function filterChunk() {
        for (var i = filteredCount; i < filteredCount + CHUNK_SIZE; i++) {
          var book = books[i];
          if (book && passesFilters(book, filterModel)) {
            filteredBooks.push(book);
          }
        }
        filteredCount += CHUNK_SIZE;
        if (filteredCount >= books.length) {
          filtering.resolve(filteredBooks);
          return;
        }
        setTimeout(filterChunk, 1);
      }
    },
    
    getGenres: function() {
      return genres;
    },
    
    getGenders: function() {
      return genders;
    },   
    
    isHorrorPublishedOnHalloween: function(book) {
      if (book.genre !== 'horror') {
        return false;
      }
      
      return book.date.getMonth() === 9 && book.date.getDate() === 31;
    },
    
    isFinancePublishedOnLastFriday: function(book) {
      if (book.genre !== 'finance') {
        return false;
      }
      
      var year = book.date.getFullYear(),
          month = book.date.getMonth(),
          sameMonth = new Date(year, month),
          lastFridayOn = 0;
          
      for (var day = 1; day <= daysInMonth(year, month); day++) {
        var currentDate = new Date(year, month, day);
        if (currentDate.getDay() === 5) {
          lastFridayOn = currentDate.getDate();
        }
      }
      
      return book.date.getDate() === lastFridayOn;
      
      function daysInMonth(year, month) {
         return new Date(year, month + 1, 0).getDate();
      }
    },
    
  };
  
  return bookService;
  
  //////////////////////
  
  function passesFilters(book, filterModel) {
    if (filterModel.genreFilter && book.genre !== filterModel.genreFilter) {
      return false;
    }
    
    if (filterModel.genderFilter && book.author.gender !== filterModel.genderFilter) {
      return false;
    }
    
    return true;
  }
  
  function sortBooks(books, filterModel) {
    // this will still freeze the app for big number of books, 
    // custom sorting algorithm or web worker implementation is needed
    
    if (filterModel.sortBy) {
      books = _.sortBy(books, function(book) {
        if (filterModel.sortBy === 'authorName') {
          return book.author.name;
        }
        return book[filterModel.sortBy];
      });
    }
    
    return books;
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomDate() {
    return new Date(getRandomInt(1900, 2015), getRandomInt(0, 11), getRandomInt(0, 20));
  }
  
  function getRandomAuthor() {
    //in real app there would be separate author list, where one author could be assigned to multiple books
    var gender = genders[getRandomInt(0, 1)];
    return {
        name: chance.name({ gender: gender }),
        gender: gender
    };
  }
  
});