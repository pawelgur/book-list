define([
  'backbone',
  'handlebars',
  'config',
  'views/app',
  'bookService',
], function(bb, hb, config, AppView, bookService) {
  
  var appView = new AppView();
    
  setupListeners();
  configureUtilities();
  init();
  
  /**
   * NOTE: in real life app most of listeners and init code would be implemented
   *       in controller object, which would be triggered by router routes (which are missing here)
   */
  
  /**
   * Different app components are wired together with events
   */
  function setupListeners() {
    bb.on('generateView:generateBooks', function() {
      bookService.generateBooks(config.bookCount).done(function() {
        bb.trigger('app:booksGenerated');
      });      
    });
    bb.on('app:booksGenerated', function() {
      appView.renderListView();
      getBooks();     
    });
    bb.on('list:filterChanged', function(filterModel) {
      getBooks(filterModel);
    });
    
    function getBooks(filterModel) {
      bb.trigger('app:gettingBooks');
      bookService.getBooks(filterModel).done(function(books) {
        bb.trigger('app:booksGot', books);
      }); 
    }
  }
  
  function init() {
    bookService.getBooks()
      .done(function(books) {
        if (books.length) {
          appView.renderListView(books);
        } else {          
          appView.renderGenerateView();
        }
      })
      .fail(function() {
        appView.renderGenerateView();
      });   
  } 
  
  function configureUtilities() {
    hb.registerHelper('prettyDate', function(date) {
      //in real app moment.js would be used with localized date format
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    });
  }
  
});