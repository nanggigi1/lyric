import { WordLists, MortarWords } from "./data.js";

class Main {
	constructor() {
        this.form = document.querySelector('form');
        this.article = document.querySelector('article');
        this.wordLists = WordLists.WORD_LISTS;
        this.mortarWords = MortarWords.MORTAR_WORDS;
        this.randomSequence = [1,2,3,4,5,2,3,7];
        this.results = this.getResults();
        this.manageLocalStorage();
        this.createLists();
        this.handleSubmit();
    };

    getResults() {
        let results = [];
        for (let i = 0; i < this.randomSequence.length; i++) {
            results.push(this.wordLists[this.randomSequence[i]-1]['list'])
        };
        return results
    };

    addMortarWords() {
        let plusMortar = [];
        this.results.forEach((result)=>{
            plusMortar.push(this.mortarWords);
            plusMortar.push(result);
        });
        this.results = plusMortar;
    };

    manageLocalStorage() {
        if (!localStorage.poemString) {
            localStorage.poemString = JSON.stringify('');
        }else{
            this.article.innerHTML = JSON.parse(localStorage.poemString);
        };
        if (!localStorage.wordLists) {
            localStorage.wordLists = JSON.stringify(this.wordLists);
        };
    };
    
    createLists(){
        this.results.forEach(optionsSet => {
            let index = this.results.indexOf(optionsSet);
            let selectlist = document.createElement('select');
            selectlist.classList.add('selectlist');
            selectlist.id = `list-${index}`
            selectlist.setAttribute('name', 'selectlist');
            this.form.appendChild(selectlist);
            this.createOptions(optionsSet, selectlist);
        });
        this.form.innerHTML += `<button>Go!</button>`
        let selectlists = document.querySelectorAll('select');
        selectlists.forEach(selectlist => {
            selectlist.addEventListener('change', (e) => {this.handleSelectlistChange(e)});
            selectlist.innerHTML += `
            <option value='' disabled></option>
            <option value='' disabled>Add a prefix</option>
            `;
            this.mortarWords.forEach((word)=>{
                selectlist.innerHTML += `<option class="option">${word}</option>`;
            });
        });
    };

    handleSelectlistChange(e) {
        if (this.mortarWords.includes(e.target.value)) {
            let selectlist = document.createElement('select');
            selectlist.classList.add('selectlist', 'mortar-words');
            selectlist.setAttribute('name', 'selectlist');
            this.createOptions(this.mortarWords, selectlist);
            selectlist.value = e.target.value;
            e.target.value = e.target.getAttribute('data-history') || '-';
            this.form.insertBefore(selectlist, e.target);
            if (e.target.previousElementSibling.previousElementSibling) {
                if (e.target.previousElementSibling.previousElementSibling.classList.contains('mortar-words')) {
                    this.createOptions(this.results[e.target.id.substr(5)], e.target);
                    e.target.value = e.target.getAttribute('data-history') || '-';
                };
            };
        }else{
            e.target.setAttribute('data-history', e.target.value)
        };
    };
    
    createOptions(optionsSet, selectlist){
        selectlist.innerHTML = `
        <option class="option">-</option>
        `
        optionsSet.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.classList.add('option');
            optionElement.innerHTML = option;
            selectlist.appendChild(optionElement);
        });
    };

    handleSubmit(){
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.article.innerHTML = '';
            let selectlist = document.querySelectorAll('select');
            let string = '';
            selectlist.forEach(val => {
                if (val.value !== '-') {
                    if (string == '') {
                        string = val.value.charAt(0).toUpperCase() + val.value.slice(1);
                    }else{
                        string += (' ' + val.value);
                    };
                };
            });
            if (string !== '') {
                string += '.';
                this.article.innerHTML = string;
                localStorage.poemString = JSON.stringify(string)
            };
        });
    };
};

export { Main }