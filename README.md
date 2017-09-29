
Manuals:
===========

  * [Browser](./docs/BROWSER.md)
  * [NodeJS](./docs/NODEJS.md)
  * [HTML](./docs/HTML.md)
  * [Design](./docs/DESIGN.md)


Dependencies for the dum\_dum\_boom\_boom binary:
=================

* Bower
* NodeJS and NPM
* [zsh](https://www.mirbsd.org/mksh.htm) shell and [mksh_setup](https://github.com/da99/mksh_setup)
* [js\_setup](https://github.com/da99/js_setup)
* [my_jsps](https://github.com/da99/my_jspp)


Development:
=================

  1. Build and run specs: `da_standard.jspp build`
  2. Adding a new function: add `exports.name =func_name;` for use in node.
  3. Directory layout:
     | lib/
       | browser/
         | dom/
       | node/
       | html/

