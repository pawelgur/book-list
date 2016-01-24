define([
  'backbone',
  'jquery',
  'handlebars',
  'underscore',
  'vlist',
  'bookService'
], function(bb, $, hb, _, VirtualList, bookService) {
  
  var genreItems = getGenreItems();
    
  /**
   * Shows list of books with possibility to filter and sort.
   * 
   * Simple VirtualList library is used (there might be better ones, didn't invest much time in search)
   */
  var ListView = bb.View.extend({
    
    className: 'books-list',
    template: hb.compile($('#list-template').html()),
    rowTemplate: hb.compile($('#row-template').html()),
    selectTemplate: hb.compile($('#select-template').html()),
    
    books: [],
    
    events: {
      'change .list-footer select': 'onFilterChange'
    },
    
    initialize: function(options) {
      this.books = options.books || [];
      
      this.listenTo(bb, 'app:gettingBooks', this.renderOverlay.bind(this));
      this.listenTo(bb, 'app:booksGot', this.onBooksGot.bind(this));
    },
    
    render: function() {
      this.$el.html(this.template());
      
      this.renderFooter();
                  
      return this;
    },
    
    renderOverlay: function() {
      var $listBody = this.$('.list-body'); 
      var $overlay = $(document.createElement('div'))
        .addClass('loading-overlay')
        .html('List is reloading...');
      
      $listBody.html($overlay);
    },
    
    renderList: function() {
      var that = this;
      var $listBody = that.$('.list-body'); 
      
      var list = new VirtualList({
        h: 500,
        itemHeight: 30,
        totalRows: this.books.length,
        generatorFn: function(row) {
          var book = that.books[row];
          var $el = $(document.createElement("div"));
          $el.toggleClass('horror-on-halloween', bookService.isHorrorPublishedOnHalloween(book));
          $el.toggleClass('finance-on-friday', bookService.isFinancePublishedOnLastFriday(book));
          $el.html(that.rowTemplate(book));
          return $el[0];
        }
      });
      
      that.$('.item-count').text(this.books.length);
      
      $listBody.html(list.container);
    },
    
    renderFooter: function() {
      var $footer = this.$('.list-footer');
      
      var sort = this.selectTemplate({
        name: 'sortBy',
        label: 'Sort by',
        items: [
          { value: '', label: '' },
          { value: 'name', label: 'Name' },
          { value: 'authorName', label: 'Author name' }
        ]
      });
      $footer.append(sort);
            
      var filterGenre = this.selectTemplate({
        name: 'filterGenre',
        label: 'Filter by genre',
        items: genreItems
      });
      $footer.append(filterGenre);
      
      var filterGender = this.selectTemplate({
        name: 'filterGender',
        label: 'Filter by author gender',
        items: [
          { value: '', label: 'all' },
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' }
        ],
      });
      $footer.append(filterGender);     
    },
    
    getFilterModel: function() {
      return {
        sortBy: this.$('#sortBy').val(),
        genreFilter: this.$('#filterGenre').val(),
        genderFilter: this.$('#filterGender').val()
      };
    },
    
    onFilterChange: function() {
      bb.trigger('list:filterChanged', this.getFilterModel());
    },
    
    onBooksGot: function(books) {
      this.books = books;
      this.renderList();
    },    
    
  });
  
  return ListView;
  
  //////////////////
  
  function getGenreItems() {
    var items = _.map(bookService.getGenres(), function(genre) {
      return { value: genre, label: genre };
    });
    items.unshift({ value: '', label: 'all' });
    
    return items;
  }
  
});