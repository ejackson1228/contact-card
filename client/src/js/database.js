import { openDB } from 'idb';
import 'regenerator-runtime/runtime';

export const initdb = async () => {
    // We are creating a new database named 'contact_db' which will be using version 1 of the database.
    openDB('contact_db', 1, {
      // Add our database schema if it has not already been initialized.
      upgrade(db) {
        if (db.objectStoreNames.contains('contacts')) {
          console.log('contacts store already exists');
          return;
        }
        // Create a new object store for the data and give it a key name of 'id' which will increment automatically
        db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
        console.log('contacts store created');
      }
    })
  }

export const getdb = async () => {
    console.log('GET from the indexed DB');
    
    // Create a connection to the indexedDB database and the version we want to use 
    const contactDb = await openDB('contact_db', 1);

    //create a new transaction and specify the store and data priveleges 
    const tx = contactDb.transaction('contacts', 'readonly');

    //open up the desired object store
    const store = tx.objectStore('contacts');

    // use the .getAll() method to get all data in the db
    const request = store.getAll();

    // get confirmation of the request 
    const result = await request;
    console.log('result.value', result);
    return result;
}

export const postdb = async(name, email, phone, profile) => {
    console.log('POST to the indexed DB');

    //create connection to the db and specify the version 
    const contactDb = await openDB('contact_db', 1);

    // create a new transaction and specify the store and data priveleges
    const tx = contactDb.transaction('contacts', 'readwrite');

    //open up desired object store 
    const store = tx.objectStore('contacts');

    // use the .add() method on the store and pass in the content
    const request = store.add({ name: name, email: email, phone: phone, profile: profile });

    // confirmation of request 
    const result = await request;
    console.log('data saved to the indexed db', result);
}

export const  deletedb = async (id) => {
    console.log('DELETE from the database', id);

    const contactDb = await openDB('contact_db', 1);

    const tx = contactDb.transaction('contacts', 'readwrite');

    const store = tx.objectStore('contacts');

    const request = store.delete(id);

    const result = await request;
    console.log('result.value', result);
    return result?.value
};

export const editdb = async (id, name, email, phone, profile) => {
    console.log('PUT to the database');

    const contactDb = await openDB('contact_db', 1);

    const tx = contactDb.transaction('contacts', 'readwrite');

    const store = tx.objectStore('contacts');

    const request = store.put({ id: id, name: name, email: email, phone: phone, profile: profile});

    const result = await request;

    console.log('data saved to the database', result);
}
