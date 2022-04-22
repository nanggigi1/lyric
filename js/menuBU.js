import { WordLists, Supplemental } from './data.js';

class Menus {
  constructor() {
    this.buildMenus();
    // this.buildSupplementalMenu()
    this.buildPoem();
    this.addListeners();
    this.App = (function () {
      const State = {
        counter: 0,
      };

      function render() {
        app.innerHTML = view();
        return this.App;
      }

      function incer() {
        State.counter += 1;
        App.render().setupEvents();
      }

      function view() {
        return `
      <div>Counter ${State.counter}</div>
      <button class="counter">INC</button>
    `;
      }

      function setupEvents() {
        let button = document
          .querySelector('.counter')
          .addEventListener('click', App.incer);
      }

      return { render, incer, setupEvents };
    })();

    this.App.render().setupEvents();
    // this.caretPosition = 0;
  } //end of constructor

  buildMenus() {
s    let wordlists = WordLists.WORD_LISTS;
    let wrapper = document.querySelector('.top-level-menu');
    let itemTemplate = `<span>TEXT</span>`;
    let caretChevronRight = new Image();
    caretChevronRight.src = 'images/chevron_right_black_24dp.svg';
    caretChevronRight.classList.add('caret-chevron', 'right');

    /* build top-level-menu */
    wordlists.forEach((list, index) => {
      let li_1 = document.createElement('li');
      let ul_1 = document.createElement('ul');
      // let caret = document.createElement("div");
      // caret.classList.add("selection-caret");
      // caret.setAttribute("data-index", index + 1);
      li_1.innerHTML = itemTemplate.replace('TEXT', list['first'][0]);
      /* temporary insertion point test */
      // if (index == 2) {
      //   li_1.classList.add('insert-here');
      // }
      ul_1.classList.add('second-level-menu');
      /* add down chevron is top bar item has children */
      if (list['first'].length > 1) {
        li_1.classList.add('chevron-down');
      }
      li_1.classList.add('menu-bar-item');
      li_1.setAttribute('data-position', index);

      wrapper.appendChild(li_1);
      // wrapper.appendChild(caret);
      li_1.appendChild(ul_1);
      /* add chevron after final top bar item */

      if (index == wordlists.length - 1) {
        let caret = document.createElement('div');
        caret.classList.add('selection-caret', 'insert-here');
        wrapper.appendChild(caret);
        wrapper.appendChild(caretChevronRight);
      }

      /* add remaining words to top-level menu */
      list['first'].forEach(word => {
        let li_2 = document.createElement('li');
        li_2.innerHTML = itemTemplate.replace('TEXT', word);
        li_2.querySelector('span').setAttribute('data-text', word);
        ul_1.appendChild(li_2);
      });
    });
    /* populate third-level menus  */
    wordlists.forEach(list => {
      if (!list['second']) {
        return;
      }
      list['second'].forEach(secondaryList => {
        let rootWord = secondaryList[0];
        let ul_3 = document.createElement('ul');
        ul_3.classList.add('third-level-menu');
        let span = document.querySelector(`[data-text='${rootWord}']`);
        let li_3 = span.parentElement;
        li_3.classList.add('chevron-right');
        li_3.appendChild(ul_3);
        secondaryList.slice(1).forEach(word => {
          ul_3.innerHTML += `<li><span>${word}</span></li>`;
        });
      });
    });
    let SupplementalMenu = this.buildSupplementalMenu();

    /* make tweaks to supplemental list */
    let addIcon = document.createElement('div');
    addIcon.classList.add('add-icon');
    let topMenu = SupplementalMenu.querySelector('.menu-bar-item');
    topMenu.classList.add('exclude-from-poem');
    topMenu.classList.remove('menu-bar-item');
    topMenu.firstChild.innerText = 'more';
    let remove = SupplementalMenu.querySelector("[data-text='remove']");
    remove.parentNode.remove();

    wrapper.appendChild(addIcon);
    wrapper.appendChild(SupplementalMenu.childNodes[0]);

    // let caret = document.querySelector('.selection-caret');
    // let menuBarItems = document.querySelectorAll('.menu-bar-item');
    // let numItems = menuBarItems.length;
    // this.setCaretState(numItems + 1);
    // console.log(this.getCaretState());
  }

  buildSupplementalMenu() {
    let wordlists = Supplemental.SUPPLEMENTAL;
    // console.log(wordlists)
    let wrapper = document.createElement('div');
    let itemTemplate = `<span class="supplemental">TEXT</span>`;

    /* build top-level-menu */
    wordlists.forEach((list, index) => {
      let li_1 = document.createElement('li');
      let ul_1 = document.createElement('ul');
      li_1.innerHTML = itemTemplate.replace('TEXT', '');
      ul_1.classList.add('second-level-menu');
      /* add down chevron if top bar item has children */
      if (list['first'].length > 1) {
        li_1.classList.add('chevron-down');
      }
      li_1.classList.add('menu-bar-item');
      wrapper.appendChild(li_1);
      // wrapper.appendChild(caret);
      li_1.appendChild(ul_1);
      /* add remaining words to top-level menu */
      list['first'].forEach(word => {
        let li_2 = document.createElement('li');
        li_2.innerHTML = itemTemplate.replace('TEXT', word);
        li_2.querySelector('span').setAttribute('data-text', word);
        ul_1.appendChild(li_2);
      });
    });
    /* populate third-level menus  */
    wordlists.forEach(list => {
      if (!list['second']) {
        return;
      }
      list['second'].forEach(secondaryList => {
        // console.log(secondaryList)
        let rootWord = secondaryList[0];
        // console.log(rootWord);

        let ul_3 = document.createElement('ul');
        // console.log(ul_3);
        ul_3.classList.add('third-level-menu');
        let span = wrapper.querySelector(`[data-text='${rootWord}']`);
        // console.log(span);
        let li_3 = span.parentElement;

        li_3.classList.add('chevron-right');
        li_3.appendChild(ul_3);

        secondaryList.slice(1).forEach(word => {
          ul_3.innerHTML += `<li><span>${word}</span></li>`;
        });
      });
    });
    return wrapper;
  }

  addListeners() {
    /* add listener for all menu items */
    let menus = document.querySelector('.top-level-menu');
    let LIs = menus.querySelectorAll('li');
    // console.log(LIs)
    LIs.forEach(li =>
      li.addEventListener('click', e => {
        console.log(li);
        e.preventDefault();
        e.stopPropagation();
        this.handleMenuClick(li);
      })
    );
    /* add listener for add button */
    let button = document.querySelector('.add-icon');
    let refNode = document.querySelector('.insert-here');
    button.addEventListener('click', () => {
      let menuTop = this.insertList(refNode);
      this.handleMenuClick(menuTop);
      let caret = document.querySelector('.selection-caret');
      // console.log(caret);
      caret.style.display = 'block';

      /* add listeners for each menu special item */
      let menuItems = document.querySelectorAll('.supplemental');

      let LIs = menuTop.querySelectorAll('li');
      // console.log(LIs)
      LIs.forEach(li =>
        li.addEventListener('click', e => {
          // console.log(li);
          e.preventDefault();
          e.stopPropagation();
          this.handleMenuClick(li);
        })
      );

      /* add listener to 'remove' button */
      // console.log(menuItems[0].parentNode);
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          if (item.innerText == 'remove' || !item) {
            item.parentNode.remove();
            return;
          }
          this.handleMenuClick(item);
        });
      });
    });
    let caretChevronLeft = document.querySelector('.caret-chevron.left');
    let caretChevronRight = document.querySelector('.caret-chevron.right');
    // let maxPos = document.querySelectorAll('.selection-caret').length - 1;
    // let currentPos = maxPos;
    caretChevronLeft.addEventListener('click', () => {
      // currentPos = Math.max(0, Math.min(maxPos, (currentPos -= 1)));
      // this.handleCaretVisibility(currentPos);
      this.handleCaretVisibility(1);
    });
    caretChevronRight.addEventListener('click', () => {
      // currentPos = Math.max(0, Math.min(maxPos, (currentPos += 1)));
      // this.handleCaretVisibility(currentPos);
      this.handleCaretVisibility(-1);
    });
  }

  insertList(refNode) {
    let parentNode = document.querySelector('.top-level-menu');
    let insertedNode = this.buildSupplementalMenu().firstChild;
    insertedNode.classList.add('inserted-list');
    parentNode.insertBefore(insertedNode, refNode);
    return insertedNode;
  }

  handleMenuClick(menuItem) {
    /* copy text to menu bar items */
    try {
      let top = this.getParent(menuItem);
      let topSpan = top.querySelector('span');
      let span = menuItem.querySelector('span');
      topSpan.innerText = span.innerHTML;
    } catch {}
    // let top = this.getParent(menuItem);
    // let topSpan = top.querySelector("span");
    // let span = menuItem.querySelector("span");
    // topSpan.innerText = span.innerHTML;

    /* display current poem text */
    this.buildPoem();
    /* remove hover menus on click */
    let submenus = document.querySelectorAll('.second-level-menu');
    submenus.forEach(submenu => {
      submenu.style.display = 'none';
      setTimeout(function () {
        submenu.style = null;
      }, 1);
    });
  }

  buildPoem() {
    let poem = document.querySelector('.poem-string');
    let LIs = document.querySelectorAll('.menu-bar-item');
    poem.innerHTML = '';
    let string = '';
    LIs.forEach(li => {
      // console.log(li.classList.contains('exclude-from-poem'))
      let span = li.querySelector('span');
      if (!li.classList.contains('exclude-from-poem')) {
        if (
          span.innerHTML != 'punctuation' &&
          span.innerHTML != 'mortar words'
        ) {
          string += span.innerHTML + ' ';
        }
      }
    });
    poem.innerHTML = this.capitalizeAndHandlePunctuation(
      string.slice(0, string.length - 1)
    );
  }

  getParent(node) {
    /* get list of this node and above */
    var els = [];
    while (node) {
      els.unshift(node);
      node = node.parentNode;
    }

    /* remove Body and above */
    let IndexesToBeRemoved = [0, 1, 2, 3, 4];
    while (IndexesToBeRemoved.length) {
      els.splice(IndexesToBeRemoved.pop(), 1);
    }
    /* find top-level-menu node */
    let index = els.findIndex(e =>
      e.classList.value.includes('top-level-menu')
    );
    /* return top list item for the given node*/
    return els[0];
  }

  // handleCaretVisibility(id) {
  //   let carets = document.querySelectorAll('.selection-caret');
  //   let caretActive = document.querySelectorAll(`[data-index='${id}']`);
  //   carets.forEach(caret => {
  //     caret.style.display = 'none';
  //   });
  //   caretActive[0].style.display = 'block';
  // }

  handleCaretVisibility(increment) {
    let caret = document.querySelector('.selection-caret');
    let wrapper = document.querySelector('.top-level-menu');
    let menuBarItems = document.querySelectorAll('.menu-bar-item');
    let numItems = menuBarItems.length;

    // this.caretPosition = numItems
    // wrapper.insertBefore(caret, wrapper.children[currentPos]);
  }

  capitalizeAndHandlePunctuation(string) {
    // return string.charAt(0).toUpperCase() + string.slice(1) + ".";
    // let punctuation = string.slice(string.length - 1);
    // let punctuation = "";
    // let sentence = string.slice(0, string.length - 1);
    // let sPlusP = sentence + punctuation;
    // return sPlusP.charAt(0).toUpperCase() + sPlusP.slice(1);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
} //end of Initialize

export { Menus };

// parentElement.insertBefore(newElement, parentElement.children[2]);
