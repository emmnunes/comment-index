'use babel';

import CommentIndexView from './comment-index-view';
import { CompositeDisposable } from 'atom';

export default {
  commentIndexView: null,
  subscriptions: null,

  activate(state) {
    this.commentIndexView = new CommentIndexView(state.commentIndexViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'comment-index:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.commentIndexView.destroy();
  },

  serialize() {
    return {
      commentIndexViewState: this.commentIndexView.serialize()
    };
  },

  toggle() {
    const element = this.commentIndexView.getElement();
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    let listElement = document.createElement('ul');
    element.appendChild(listElement);

    editor = atom.workspace.getActiveTextEditor();
    buffer = editor.getBuffer();
    text = editor.getText();
    origIdx = null;

    var r = [];

    buffer.scan(new RegExp('// MARK: ', 'gi'), function(res) {
      r.push(res);
    });

    r.forEach(function (value, i) {
      console.log(value);

      let node = document.createElement("LI");
      let number = document.createElement("SPAN");
      let numbernode = document.createTextNode(value.computedRange.start.row+1);
      number.appendChild(numbernode);
      let comment = value.lineText.replace('// MARK: ','');
      let textnode = document.createTextNode(comment);
      node.appendChild(number);
      node.appendChild(textnode);
      element.querySelector('ul').appendChild(node);
    });
  }

};
