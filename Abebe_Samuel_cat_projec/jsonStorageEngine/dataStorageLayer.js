'use strict';

const { createStorageLayer } = require('./storageLayer');
const { CODES, TYPES, MESSAGES } = require('./statusCodes');

function createDataStorage(storagePath, storageConfig){

    const {
        getAllFromStorage,
        getFromStorage,
        addToStorage,
        removeFromStorage,
        getKeys,
        primary_key
    } = createStorageLayer(storagePath, storageConfig);

    class DataStorage {

        get CODES(){
            return CODES;
        }

        get TYPES(){
            return TYPES;
        }

        get PRIMARY_KEY(){
            return primary_key;
        }

        get KEYS(){
            return getKeys();
        }

        getAll(){
            return getAllFromStorage();
        }

        get(value, key=primary_key){
            return getFromStorage(value, key);
        }

        insert(item){
            return new Promise(async (resolve, reject) => {
                if(item){
                    if(!item[primary_key]){
                        reject(MESSAGES.NOT_INSERTED());
                    }
                    else if((await getFromStorage(item[primary_key])).length > 0){
                        reject(MESSAGES.ALREADY_IN_USE(item[primary_key]));
                    }
                    else if(await addToStorage(item)){
                        resolve(MESSAGES.INSERT_OK(primary_key, item[primary_key]));
                    }
                    else{
                        reject(MESSAGES.NOT_INSERTED());
                    }
                }
                else{
                    reject(MESSAGES.NOT_INSERTED());
                }
            });
        } //end of insert

        remove(value){
            return new Promise(async (resolve, reject) => {
                if(!value){
                    reject(MESSAGES.NOT_FOUND(primary_key, '--empty--'));
                }
                else if(await removeFromStorage(value)){
                    resolve(MESSAGES.REMOVE_OK(primary_key, value));
                }
                else {
                    reject(MESSAGES.NOT_REMOVED(primary_key, value));
                }
            });
        } //end of remove

        // Add update method to update an existing item
        update(id, updatedItem) {
            return new Promise(async (resolve, reject) => {
                if (!id || !updatedItem) {
                    reject(MESSAGES.NOT_UPDATED(primary_key, '--empty--'));
                } else {
                    try {
                        const existingItem = await getFromStorage(id);
                        if (!existingItem) {
                            reject(MESSAGES.NOT_FOUND(primary_key, id));
                        } else {
                            // Update only allowed properties
                            const keys = Object.keys(updatedItem);
                            keys.forEach(key => {
                                if (existingItem.hasOwnProperty(key)) {
                                    existingItem[key] = updatedItem[key];
                                }
                            });
                            if (await addToStorage(existingItem)) {
                                resolve(MESSAGES.UPDATE_OK(primary_key, id));
                            } else {
                                reject(MESSAGES.NOT_UPDATED(primary_key, id));
                            }
                        }
                    } catch (err) {
                        reject(MESSAGES.NOT_UPDATED(primary_key, id));
                    }
                }
            });
        } //end of update

    } //end of class

    return new DataStorage();

} //end of function createDataStorage

module.exports = { createDataStorage };
