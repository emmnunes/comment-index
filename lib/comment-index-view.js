'use babel';
// MARK:
export default class CommentIndexView {

  // MARK: constructor()
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('comment-tree-panel');
    this.element.classList.add('comment-index');
    this.element.tabIndex = '-1';

    this.panel = atom.workspace.addRightPanel({item: this.element, visible: true, priority: 500});
  }

  // MARK: serialize()
  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // MARK: destroy()
  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  // MARK: getElement()
  getElement() {
    return this.element;
  }

}
