define([
  'backbone'
], function(bb) {
  
  /**
   * Shows generate button and loading label
   */
  var GenerateView = bb.View.extend({
    
    template: $('#generate-template').html(),
    
    events: {
      'click .generate-books': 'onGenerateBooksClick'
    },
    
    initialize: function() {
      this.listenTo(bb, 'bookService:booksGenerated', this.render.bind(this));
    },
    
    render: function() {
      this.$el.html(this.template);
    },  
    
    renderGenerating: function() {
      this.$el.html('generating books...'); 
    },
    
    onGenerateBooksClick: function() {
      bb.trigger('generateView:generateBooks');
      this.renderGenerating();
    },
    
  });
  
  return GenerateView;
  
});