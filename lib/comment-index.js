'use babel';

import CommentIndexView from './comment-index-view';
import { CompositeDisposable } from 'atom';

module.exports = {
  config: {
    onlyHighlightWholeWords: {
      type: 'boolean',
      "default": true
    },
    hideHighlightOnSelectedWord: {
      type: 'boolean',
      "default": false
    },
    ignoreCase: {
      type: 'boolean',
      "default": false
    },
    lightTheme: {
      type: 'boolean',
      "default": false
    },
    highlightBackground: {
      type: 'boolean',
      "default": false
    },
    minimumLength: {
      type: 'integer',
      "default": 0
    },
    timeout: {
      type: 'integer',
      "default": 20,
      description: 'Defers searching for matching strings for X ms'
    },
    showInStatusBar: {
      type: 'boolean',
      "default": true,
      description: 'Show how many matches there are'
    }
  },
  areaView: null
};

export default {
  commentIndexView: null,
  subscriptions: null,
  refreshListener: null,

  // MARK: 1. activate()
  activate(state) {
    this.commentIndexView = new CommentIndexView(state.commentIndexViewState);

    this.editor = atom.workspace.getActiveTextEditor();
    this.buffer = this.editor.getBuffer();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'comment-index:toggle': () => this.toggle(),
      'comment-index:refresh': () => this.refresh()
    }));
  },

  // MARK: 2. deactivate()
  deactivate() {
    this.subscriptions.dispose();
    this.commentIndexView.destroy();
  },

  // MARK: 3. serialize()
  serialize() {
    return {
      commentIndexViewState: this.commentIndexView.serialize()
    };
  },

  // MARK: 4. toggle()
  toggle() {
    const element = this.commentIndexView.getElement();
    const panel = this.commentIndexView.getPanel();

    if(panel.visible) {
      panel.hide();

      // Get rid of the auto-refresh save listener
      refreshListener.dispose();

    } else {

      // Refresh the comment index
      this.refreshIndex(element);

      // Show the pane
      panel.show();

      // Toggle auto-refresh of comment index pane on save
      refreshListener = this.editor.onDidSave(() => {
        this.refresh();
      });
    }
  },

  // MARK: 5. refresh()
  refresh() {
    const element = this.commentIndexView.getElement();
    console.log(element);
    this.refreshIndex(element);
  },

  // MARK: 6. refreshIndex()
  refreshIndex(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    let listElement = document.createElement('ul');
    element.appendChild(listElement);

    text = this.editor.getText();

    var r = [];

    this.buffer.scan(new RegExp('// MARK: ', 'gi'), function(res) {
      r.push(res);
    });

    r.forEach(function (value, i) {
      console.log(value);

      let number = document.createElement("SPAN");
      number.classList.add('comment__number');
      let numbernode = document.createTextNode(`${value.computedRange.start.row+1}`);
      number.appendChild(numbernode);

      let comment = value.lineText.replace('// MARK: ','');
      let text = document.createElement("SPAN");
      text.classList.add('comment__content');
      let textnode = document.createTextNode(comment);
      text.appendChild(textnode);

      let node = document.createElement("LI");
      node.appendChild(text);
      node.appendChild(number);
      element.querySelector('ul').appendChild(node);
    });
  }
};
