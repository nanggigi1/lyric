import { WordLists_Solved, Supplemental } from './data.js';

class Menus {
  constructor() {
    this.buildMenus();
    this.buildPoem();
    this.addMenuListeners();
    this.addCubeNavListeners();
    this.addSuppListeners();
  } //end of constructor

  buildMenus() {
    let wrapper = document.querySelector('.top-level-menu');
    let wordlists = this.setWordList();
    let itemTemplate = `<span>TEXT</span>`;
    let caretChevronRight = document.createElement('div');
    caretChevronRight.classList.add('caret-chevron', 'right');

    let cancelButton = document.createElement('div');
    cancelButton.classList.add('cancel-button');

    /* build top-level-menu */
    // wordlists.forEach((list, index) => {
    for (let i = 0; i < wordlists.length; i++) {
      let list = wordlists[i];
      if (Object.keys(list).includes('supplemental')) {
        let supp = this.buildSupplementalMenu().childNodes[0];
        wrapper.appendChild(supp);
        supp.firstChild.innerText = list['supplemental'];
        continue;
      }

      let li_1 = document.createElement('li');
      let ul_1 = document.createElement('ul');
      li_1.innerHTML = itemTemplate.replace('TEXT', list['top']);
      ul_1.classList.add('second-level-menu');
      /* add down chevron is top bar item has children */
      if (list['first'].length > 1) {
        li_1.classList.add('chevron-down');
      }
      li_1.classList.add('menu-bar-item');
      li_1.setAttribute('data-position', i);

      wrapper.appendChild(li_1);
      li_1.appendChild(ul_1);
      /* add chevron after final top bar item */

      // if (i == wordlists.length - 1) {
      //   let caret = document.createElement('div');
      //   caret.classList.add('selection-caret', 'insert-here');
      //   wrapper.appendChild(caret);
      //   wrapper.appendChild(caretChevronRight);
      //   wrapper.appendChild(cancelButton);
      // }

      /* add remaining words to top-level menu */
      list['first'].forEach((word, i) => {
        let li_2 = document.createElement('li');
        li_2.innerHTML = itemTemplate.replace('TEXT', word);
        li_2.querySelector('span').setAttribute('data-text', word);
        ul_1.appendChild(li_2);
      });
    }

    /* populate third-level menus  */
    wordlists.forEach(list => {
      if (!list['second']) {
        return;
      }
      list['second'].forEach((secondaryList, i) => {
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

    let caret = document.createElement('div');
    caret.classList.add('selection-caret', 'insert-here');
    wrapper.appendChild(caret);
    wrapper.appendChild(caretChevronRight);
    wrapper.appendChild(cancelButton);

    let SupplementalMenu = this.buildSupplementalMenu();

    /* make tweaks to supplemental list */
    let addIcon = document.createElement('div');
    addIcon.classList.add('add-icon');
    addIcon.setAttribute('data-isActive', false);
    let topMenu = SupplementalMenu.querySelector('.menu-bar-item');
    topMenu.classList.add('exclude-from-poem');
    topMenu.classList.add('supp-menu-master');
    topMenu.classList.remove('menu-bar-item');
    topMenu.firstChild.innerText = 'more';
    let remove = SupplementalMenu.querySelector("[data-text='remove']");
    remove.parentNode.remove();

    wrapper.appendChild(addIcon);
    wrapper.appendChild(SupplementalMenu.childNodes[0]);
  }

  buildSupplementalMenu() {
    let wordlists = Supplemental.SUPPLEMENTAL;
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
        let rootWord = secondaryList[0];

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

  setState(key, value) {
    const state = document.querySelector('.state');
    switch (key) {
      case 'cube-face-index':
        state.setAttribute('data-cube-face-index', value);
        break;
      case 'solved':
        state.setAttribute('data-solved', value);
        break;
      default:
        console.log("CAN'T SET STATE");
        break;
    }
  }

  setImage() {
    const cube = document.querySelector('.cube');
    const state = document.querySelector('.state');
    const index = state.getAttribute('data-cube-face-index');
    const solved = state.getAttribute('data-solved');
    if (solved == 'true') {
      if (index >= 0 && index <= 5) {
        cube.style.backgroundImage = `url(./images/solved-${index}.png)`;
      } else {
        cube.style.backgroundImage = 'url(./images/solved-0.png)';
      }
    } else {
      if (index >= 6 && index <= 11) {
        cube.style.backgroundImage = `url(./images/shuffled-${index - 6}.png)`;
      } else {
        cube.style.backgroundImage = 'url(./images/shuffled-0.png)';
      }
    }
  }

  setWordList() {
    const state = document.querySelector('.state');
    const index = state.getAttribute('data-cube-face-index');
    console.log(index);
    switch (index) {
      case '0':
        return WordLists_Solved.SOLVED_0;
      case '1':
        return WordLists_Solved.SOLVED_1;
      case '2':
        return WordLists_Solved.SOLVED_2;
      case '3':
        return WordLists_Solved.SOLVED_3;
      case '4':
        return WordLists_Solved.SOLVED_4;
      case '5':
        return WordLists_Solved.SOLVED_5;
      case '6':
        return WordLists_Solved.SHUFFLED_0;
      case '7':
        return WordLists_Solved.SHUFFLED_1;
      case '8':
        return WordLists_Solved.SHUFFLED_2;
      case '9':
        return WordLists_Solved.SHUFFLED_3;
      case '10':
        return WordLists_Solved.SHUFFLED_4;
      case '11':
        return WordLists_Solved.SHUFFLED_5;
      default:
        return WordLists_Solved.SOLVED_0;
    }
  }

  setSolvedIcons() {
    const state = document.querySelector('.state');
    const shuffled = document.querySelector('.cube-shuffled');
    const solved = document.querySelector('.cube-solved');
    if (state.getAttribute('data-solved') == 'false') {
      shuffled.style.backgroundImage = 'url(./images/swap_calls_red_24dp.svg)';
      solved.style.backgroundImage = 'url(./images/apps_black_24dp.svg)';
    } else {
      shuffled.style.backgroundImage =
        'url(./images/swap_calls_black_24dp.svg)';
      solved.style.backgroundImage = 'url(./images/apps_red_24dp.svg)';
    }
  }

  addSuppListeners() {
    let menuItems = document.querySelectorAll('.supplemental');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (item.innerText == 'remove' || !item) {
          item.parentNode.parentNode.parentNode.remove();
          return;
        }
        this.handleMenuClick(item);
      });
    });
  }

  addMenuListeners() {
    let wrapper = document.querySelector('.top-level-menu');

    /* add listener for all menu items */
    let menus = document.querySelector('.top-level-menu');
    let LIs = menus.querySelectorAll('li');
    LIs.forEach(li =>
      li.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.handleMenuClick(li);
      })
    );

    /* add listener for add button */
    // let wrapper = document.querySelector('.top-level-menu');
    let addButton = document.querySelector('.add-icon');
    let chevrons = document.querySelectorAll('.caret-chevron');
    let cancelButton = document.querySelector('.cancel-button');
    let refNode = document.querySelector('.insert-here');
    let caret = document.querySelector('.selection-caret');
    addButton.addEventListener('click', () => {
      let menuTop = this.insertList(refNode);
      this.handleMenuClick(menuTop);
      caret.style.display = 'block';
      chevrons[0].style.display = 'block';
      chevrons[1].style.display = 'block';
      cancelButton.style.display = 'block';

      /* add listeners for each menu special item */
      let menuItems = document.querySelectorAll('.supplemental');

      let LIs = menuTop.querySelectorAll('li');
      LIs.forEach(li =>
        li.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.handleMenuClick(li);
        })
      );

      /* add listener to 'remove' button */
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          if (item.innerText == 'remove' || !item) {
            item.parentNode.parentNode.parentNode.remove();
            return;
          }
          this.handleMenuClick(item);
        });
      });
    });
    cancelButton.addEventListener('click', () => {
      addButton.setAttribute('data-isActive', 'false');

      caret.style.display = 'none';
      chevrons[0].style.display = 'none';
      chevrons[1].style.display = 'none';
      cancelButton.style.display = 'none';
      wrapper.insertBefore(caret, chevrons[1]);
    });
    let caretChevronLeft = document.querySelector('.caret-chevron.left');
    let caretChevronRight = document.querySelector('.caret-chevron.right');
    caretChevronLeft.addEventListener('click', () => {
      this.handleCaretVisibility(-1);
    });
    caretChevronRight.addEventListener('click', () => {
      this.handleCaretVisibility(1);
    });
  }

  addCubeNavListeners() {
    let cubeLeft = document.querySelector('.cube-left');
    let cubeRight = document.querySelector('.cube-right');
    let solved = document.querySelector('.cube-solved');
    let shuffled = document.querySelector('.cube-shuffled');
    let state = document.querySelector('.state');
    // let cubeFaceIndex = parseInt(state.getAttribute('data-cube-face-index'));
    let wrapper = document.querySelector('.top-level-menu');

    cubeRight.addEventListener('click', () => {
      // cubeFaceIndex = (cubeFaceIndex + 1 + 6) % 6;
      // let indexAbsolute = Math.abs(cubeFaceIndex);
      // if (state.getAttribute('data-solved') == 'false') {
      //   indexAbsolute = indexAbsolute + 6;
      // }
      // this.setState('cube-face-index', indexAbsolute);
      let cubeFaceIndex = parseInt(state.getAttribute('data-cube-face-index'));

      cubeFaceIndex = (cubeFaceIndex + 1) % 6;
      if (state.getAttribute('data-solved') == 'false') {
        cubeFaceIndex = cubeFaceIndex + 6;
      }
      this.setState('cube-face-index', cubeFaceIndex);

      this.setImage();
      wrapper.innerHTML = `<div class='caret-chevron left'></div>`;
      this.buildMenus();
      this.buildPoem();
      this.addMenuListeners();
      this.addSuppListeners();
    });

    cubeLeft.addEventListener('click', () => {
      let cubeFaceIndex = parseInt(state.getAttribute('data-cube-face-index'));
      // console.log(foo, 'IN');

      cubeFaceIndex = (cubeFaceIndex - 1 + 6) % 6;
      if (state.getAttribute('data-solved') == 'false') {
        cubeFaceIndex = cubeFaceIndex + 6;
      }
      this.setState('cube-face-index', cubeFaceIndex);

      // let bar = parseInt(state.getAttribute('data-cube-face-index'));
      // console.log(bar, 'OUT');

      // cubeFaceIndex = (cubeFaceIndex + 1 - 6) % 6;
      // let indexAbsolute = Math.abs(cubeFaceIndex);
      // if (state.getAttribute('data-solved') == 'false') {
      //   indexAbsolute = indexAbsolute + 6;
      // }
      // this.setState('cube-face-index', indexAbsolute);

      this.setImage();
      wrapper.innerHTML = `<div class='caret-chevron left'></div>`;
      this.buildMenus();
      this.buildPoem();
      this.addMenuListeners();
      this.addSuppListeners();
    });
    shuffled.addEventListener('click', () => {
      if (state.getAttribute('data-solved') == 'false') {
        return;
      }
      this.setState('solved', 'false');
      this.setState(
        'cube-face-index',
        parseInt(state.getAttribute('data-cube-face-index')) + 6
      );
      this.setImage();
      this.setSolvedIcons(/* 'solved' */);
      wrapper.innerHTML = `<div class='caret-chevron left'></div>`;
      this.buildMenus();
      this.buildPoem();
      this.addMenuListeners();
      this.addSuppListeners();
    });
    solved.addEventListener('click', () => {
      if (state.getAttribute('data-solved') == 'true') {
        return;
      }
      this.setState('solved', 'true');
      this.setState(
        'cube-face-index',
        parseInt(state.getAttribute('data-cube-face-index')) - 6
      );
      this.setImage();
      this.setSolvedIcons(/* 'solved' */);
      wrapper.innerHTML = `<div class='caret-chevron left'></div>`;
      this.buildMenus();
      this.buildPoem();
      this.addMenuListeners();
      this.addSuppListeners();
    });
  }

  insertList(refNode) {
    let button = document.querySelector('.add-icon');
    let isAddButtonActive = button.getAttribute('data-isActive');
    let parentNode = document.querySelector('.top-level-menu');
    let insertedNode = this.buildSupplementalMenu().firstChild;
    let supMenuMaster = document.querySelector('.supp-menu-master');

    if (supMenuMaster.firstChild.innerText != 'more') {
      insertedNode.querySelector('.supplemental').innerHTML =
        supMenuMaster.firstChild.innerText;
    }
    insertedNode.classList.add('inserted-list');
    if (isAddButtonActive == 'false') {
      button.setAttribute('data-isActive', 'true');
      return insertedNode;
    }
    parentNode.insertBefore(insertedNode, refNode);
    return insertedNode;
  }

  handleMenuClick(menuItem) {
    /* copy text to menu bar items */
    try {
      let top = this.getParent(menuItem);
      let topSpan = top.querySelector('span');
      let span = menuItem.querySelector('span');
      if (span.innerHTML != 'punctuation' && span.innerHTML != 'mortar words') {
        topSpan.innerText = span.innerHTML;
      }
    } catch {}

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
    let spacer = ' ';
    let punctuation = Supplemental.SUPPLEMENTAL[0].second[0].slice(1);
    LIs.forEach(li => {
      // console.log(li.classList.contains('exclude-from-poem'))
      let span = li.querySelector('span');
      if (!li.classList.contains('exclude-from-poem')) {
        if (
          span.innerHTML != 'punctuation' &&
          span.innerHTML != 'mortar words'
        ) {
          if (punctuation.includes(span.innerHTML)) {
            spacer = '';
          } else {
            spacer = ' ';
          }
        }
        string += spacer + span.innerHTML;
      }
    });
    poem.innerHTML = string;
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

  handleCaretVisibility(increment = 0) {
    let caret = document.querySelector('.selection-caret');
    let previousSib = caret.previousSibling;
    let nextSib = caret.nextSibling.nextSibling; // add 2nd 'nextSibling' to offet caret itself
    let targetSib = increment == 1 ? nextSib : previousSib;
    let wrapper = document.querySelector('.top-level-menu');
    let items = wrapper.querySelectorAll('.menu-bar-item');
    let index = Array.prototype.indexOf.call(wrapper.children, targetSib);
    let indexClamped = Math.max(1, Math.min(items.length + 2, index)); // add +2 because???
    wrapper.insertBefore(caret, wrapper.children[indexClamped]);
    return indexClamped;
  }
} //end of Menus

export { Menus };
