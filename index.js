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
  this.miniferOptions = extend(defaultMinifierOptions, options);
}

HtmlMinifierFilter.prototype = Object.create(Filter.prototype);
HtmlMinifierFilter.prototype.constructor = HtmlMinifierFilter;
HtmlMinifierFilter.prototype.extensions = ['html'];
HtmlMinifierFilter.prototype.targetExtension = 'html';
HtmlMinifierFilter.prototype.processString = function(string) {
  return minify(string, this.miniferOptions);
};


var defaultMinifierOptions = {
  collapseWhitespace : true,
  removeComments     : true,
  minifyJS           : true,
  minifyCSS          : true
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
    var htmlFilePath = this.app.options.outputPaths.app.html || 'index.html';
    var htmlFileTree = new Funnel( tree, {
      files: [ htmlFilePath ]
    });

    var minifiedHtml = HtmlMinifierFilter(htmlFileTree, this.options.miniferOptions);
    return mergeTrees([tree, minifiedHtml], { overwrite: true });
  }

  return tree;
};

module.exports = EmberCliHtmlMinifier;
