define([
  'backbone',
  'jquery',
  'views/generate',
  'views/list'
], function(bb, $, GenerateView, ListView) {
    
  /**
   * Main view used as container for other specific views
   */
  var AppView = bb.View.extend({
    
    el: $('body'),
    template: false,
        
    initialize: function() {
      this.$mainContainer = this.$('.main-container');
    },
        
    renderGenerateView: function() {
      var generateView = new GenerateView();
      this.renderChildView(generateView);
    },
    
    renderListView: function(books) {
      var list = new ListView({ books: books });
      this.renderChildView(list);
    },
    
    renderChildView: function(view) {
      this.clearContainer();
      this.$mainContainer.append(view.$el);
      view.render();
      this.childView = view;
    },
    
    clearContainer: function() {
      if (this.childView) {
        this.childView.remove();
      }
      this.$mainContainer.html('');
    }
    
  });
  
  return AppView;
  
});