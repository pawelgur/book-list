
requirejs.config({
  baseUrl: 'scripts',
  paths: {
    backbone: '../bower_components/backbone/backbone',
    jquery: '../bower_components/jquery/dist/jquery',
    underscore: '../bower_components/underscore/underscore',
    handlebars: '../bower_components/handlebars/handlebars',
    chance: '../bower_components/chance/chance',
    vlist: '../bower_components/virtual-list/vlist' 
  },
  shim: {
    vlist: {
      exports: 'VirtualList'
    }
  } 
});

requirejs(['app']);