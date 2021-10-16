import { WordLists } from "./data.js";

class Main {
	constructor() {
        this.form = document.querySelector('form');
        this.article = document.querySelector('article');
        this.formData = WordLists.WORD_LISTS;
        this.randomSequence = [1,2,3,4,5,2,3,7];
        this.results = this.getResults();
        this.manageLocalStorage();
        this.createLists();
        this.handleSubmit();
    };

    getResults() {
        let results = [];
        for (let i = 0; i < this.randomSequence.length; i++) {
            results.push(this.formData[this.randomSequence[i]-1]['list'])
        };
        return results
    }

    manageLocalStorage() {
        if (!localStorage.poemString) {
            localStorage.poemString = JSON.stringify('');
        }else{
            this.article.innerHTML = JSON.parse(localStorage.poemString);
        };
        if (!localStorage.formData) {
            localStorage.formData = JSON.stringify(this.formData);
        };
    };
    
    createLists(){
        console.log(this.results)
        this.results.forEach(optionsSet => {
            let selectlist = document.createElement('select');
            selectlist.classList.add('selectlist');
            selectlist.setAttribute('name', 'selectlist');
            this.form.appendChild(selectlist);
            // console.log(optionsSet)
            this.createOptions(optionsSet, selectlist);
        });
        this.form.innerHTML += `<button>Go!</button>`
    };
    
    createOptions(optionsSet, selectlist){
        selectlist.innerHTML = `
        <option value='' disabled selected>Pick one</option>
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
                        string += val.value.charAt(0).toUpperCase() + val.value.slice(1);
                    }else{
                        string += (' ' + val.value)
                    }
                }
            });
            if (string !== '') {
                string += '.';
                this.article.innerHTML = string;
                localStorage.poemString = JSON.stringify(string)
            };
        });
    };
}

export { Main }

