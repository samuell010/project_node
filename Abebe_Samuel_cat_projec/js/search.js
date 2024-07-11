'use strict';

(function(){

    let keylist;
    let resultarea;
    let searchvalue;

    document.addEventListener('DOMContentLoaded', init);

    async function init(){
        keylist = document.getElementById('keylist');
        resultarea = document.getElementById('resultarea');
        searchvalue = document.getElementById('searchvalue');

        try{
            const data = await fetch('/keys');
            if(data.ok){
                const keys = await data.json();
                if(keys.length > 0){
                    populateList(keys);
                }
                else{
                    showErrorMessage('Search options not available');
                }
            }
            else{
                showErrorMessage('Failed communication!');
            }
        }
        catch(err){
            showErrorMessage(err.message);
        }
    } //end of init

    function populateList(keynames){
        for(const field of keynames){
            const option = document.createElement('option');
            option.value = field;
            option.textContent = field;

            keylist.appendChild(option);
        }

        keylist.value = keynames[0];

        document.getElementById('submit').addEventListener('click', send);
        document.getElementById('getOne').addEventListener('click', getOne); // New event listener for "Get One" button
    } //end of populateList

    async function send(){
        const keyName = keylist.value;
        const value = searchvalue.value;

        try{
            const fetchOptions = {
                method: 'POST',
                body: JSON.stringify({ value, key: keyName }),
                headers: { 'Content-Type': 'application/json' }
            };
            const data = await fetch('/search', fetchOptions);
            const result = await data.json();

            updatePage(result);
        }
        catch(err){
            showErrorMessage(err.message);
        }
    }

    async function getOne() {
        const id = prompt("Enter the ID of the cat you want to retrieve:");

        if (!id) {
            return; // User canceled prompt or entered an empty ID
        }

        try {
            const fetchOptions = {
                method: 'POST',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' }
            };
            const data = await fetch('/getOne', fetchOptions); // Assuming '/getOne' is your endpoint to fetch a single cat
            const result = await data.json();

            if (result.error) {
                showErrorMessage(result.error);
            } else {
                updatePage([result]); // Wrap the result in an array to use the same updatePage function
            }
        } catch(err) {
            showErrorMessage(err.message);
        }
    }

    function updatePage(data){
        if(!data){
            showErrorMessage('Programming error!');
        }
        else if(data.length === 0){
            showErrorMessage('Nothing found');
        }
        else{
            const htmlString = data.map(item => createCat(item)).join(' ');
            resultarea.innerHTML = htmlString;
        }
    }

    function createCat(cat){
        return `<div class="cat">
        <p>Number: ${cat.number}</p>
        <p>Name: ${cat.name}</p>
        <p>Breed: ${cat.breed}</p>
        <p>Length: ${cat.length}</p>
        <p>Year of Birth: ${cat.yearOfBirth}</p>
    </div>`;
    }

    function showErrorMessage(message){
        resultarea.innerHTML = `<p>${message}</p>`;
    }

})();
