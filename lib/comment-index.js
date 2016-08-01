'use babel';

import CommentIndexView from './comment-index-view';
import { CompositeDisposable } from 'atom';

export default {
  commentIndexView: null,
  subscriptions: null,

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
    } else {
      this.refreshIndex(element);
      panel.show();

      // Toggle auto-refresh of comment index pane
      this.editor.onDidSave(() => {
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

    // MARK:
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
