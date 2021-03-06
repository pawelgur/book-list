# book-list
Simple app showing list of 1 000 000 books with sort and filter possibilities

## Installation

In order to run this project you need to install `node.js` (npm) and `bower` on your system.

After doing that in project directory run these commands in your terminal:

` npm install `

and

` bower install `

## Running

` grunt http-server `

After doing so app should be available at http://localhost:8080/

## Notes

Some ECMA Script 5 features are used, so app will not work on old IE.

Due to time constraints, lots of things which would be required for production app were not implemented in project:

* multiple browser support - autprefixer and ECMA Script 5 shim
* unit tests
* javascript minification, concatenation and revisioning
* putting view templates in separate files, precompiling them
* aesthetics, animations, UX
* url routing
* modularity (currently no modules are implemented, only one monolithic app)
