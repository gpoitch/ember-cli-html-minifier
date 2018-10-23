var Funnel     = require('broccoli-funnel');
var Filter     = require('broccoli-filter');
var mergeTrees = require('broccoli-merge-trees');
var minify     = require('html-minifier').minify;
var extend     = require('util-extend');


function HtmlMinifierFilter(inputTree, options) {
  if (!(this instanceof HtmlMinifierFilter)) {
    return new HtmlMinifierFilter(inputTree, options);
  }
  this.inputTree = inputTree;
  this.minifierOptions = extend(defaultMinifierOptions, options);
  Filter.call(this, inputTree);
}

HtmlMinifierFilter.prototype = Object.create(Filter.prototype);
HtmlMinifierFilter.prototype.constructor = HtmlMinifierFilter;
HtmlMinifierFilter.prototype.extensions = ['html'];
HtmlMinifierFilter.prototype.targetExtension = 'html';
HtmlMinifierFilter.prototype.processString = function(string) {
  return minify(string, this.minifierOptions);
};


var defaultMinifierOptions = {
  collapseWhitespace : true,
  removeComments     : true,
  minifyJS           : true,
  minifyCSS          : true,
  ignoreCustomComments: [ /^\s*EMBER_CLI_FASTBOOT_BODY|EMBER_CLI_FASTBOOT_HEAD/ ]
};

function EmberCliHtmlMinifier(project) {
  this.name = 'ember-cli-html-minifier';
}

EmberCliHtmlMinifier.prototype.included = function(app) {
  this.app = app;
  this.options = app.options.minifyHTML || {};
  this.enabled = typeof this.options.enabled !== 'undefined' ? this.options.enabled : app.env === 'production';
};

EmberCliHtmlMinifier.prototype.postprocessTree = function(type, tree) {
  if (type === 'all' && this.enabled) {
    var htmlFiles = this.options.htmlFiles;
    if(!htmlFiles || !Array.isArray(htmlFiles)){
        var htmlFilePath = this.app.options.outputPaths.app.html || 'index.html';
        htmlFiles = [htmlFilePath];
    }
    var htmlFileTree = new Funnel( tree, {
      files: htmlFiles
    });

    var minifiedHtml = HtmlMinifierFilter(htmlFileTree, this.options.minifierOptions);
    return mergeTrees([tree, minifiedHtml], { overwrite: true });
  }

  return tree;
};

module.exports = EmberCliHtmlMinifier;
