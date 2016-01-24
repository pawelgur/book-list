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
      this.listenTo(bb, 'app:booksGenerated', this.render.bind(this));
      this.listenTo(bb, 'bookService:generated', this.updateGeneratedCount.bind(this));      
    },
    
    render: function() {
      this.$el.html(this.template);
    },  
    
    renderGenerating: function() {
      this.$el.html('generating books... <span class="generated-count">0</span>'); 
      this.$count = this.$('.generated-count');
    },
    
    updateGeneratedCount: function(count) {
      this.$count.html(count);
    },
    
    onGenerateBooksClick: function() {
      bb.trigger('generateView:generateBooks');
      this.renderGenerating();
    },
    
  });
  
  return GenerateView;
  
});