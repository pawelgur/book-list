module.exports = function(grunt) {
  
  grunt.initConfig({
    
    'http-server': {
      dev: {
        port: 8080,
        host: 'localhost',
        openBrowser: true
      }
    },
    
    less: {
      dev: {
        files: {
          'styles.css': 'less/*.less'
        }
      }
    },
    
    watch: {
      less: {
        files: 'less/*.less',
        tasks: ['less']
      }
    }
    
    

  });
  
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');


};