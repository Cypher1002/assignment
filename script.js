
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDTWhyBbvp9eeWhOZvkHuSBvgC3_0jJSTs",
  authDomain: "assignment-28d1e.firebaseapp.com",
  databaseURL: "https://assignment-28d1e-default-rtdb.firebaseio.com",
  projectId: "assignment-28d1e",
  storageBucket: "assignment-28d1e.appspot.com",
  messagingSenderId: "220234792462",
  appId: "1:220234792462:web:fa86ed119dbf0c2699065f",
  measurementId: "G-J778M8LG3X"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function populateTable() {
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
        data.forEach(row => {
          const tr = document.createElement('tr');
          Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
          });
          const actionsCell = document.createElement('td');
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => editRow(row, tr));
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => deleteRow(row, tr));
          const qrButton = document.createElement('button');
          qrButton.textContent = 'Generate QR Code';
          qrButton.addEventListener('click', () => generateQRCode(row));
          actionsCell.appendChild(editButton);
          actionsCell.appendChild(deleteButton);
          actionsCell.appendChild(qrButton);
          tr.appendChild(actionsCell);
          tableBody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  function editRow(row, tr) {
  
    tr.innerHTML = '';
    Object.keys(row).forEach(key => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.value = row[key];
      td.appendChild(input);
      tr.appendChild(td);
    });
    const actionsCell = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
    
      const updatedRow = {};
      const inputs = tr.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; i++) {
        updatedRow[Object.keys(row)[i]] = inputs[i].value;
      }
      
      fetch('/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRow)
      })
        .then(response => response.json())
        .then(data => {
    
          populateTable();
        })
        .catch(error => console.error('Error updating data:', error));
    });
    actionsCell.appendChild(updateButton);
    tr.appendChild(actionsCell);
  }
 
  function addRow() {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const tr = document.createElement('tr');
    const newRow = { heatCode: '', grade: '', millName: '', diameter: '', invoiceNo: '', date: '' };
    Object.values(newRow).forEach(value => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.value = value;
      td.appendChild(input);
      tr.appendChild(td);
    });
    const actionsCell = document.createElement('td');
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
  
      const newRowData = {};
      const inputs = tr.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; i++) {
        newRowData[Object.keys(newRow)[i]] = inputs[i].value;
      }
 
      fetch('/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRowData)
      })
        .then(response => response.json())
        .then(data => {
      
          populateTable();
        })
        .catch(error => console.error('Error adding new data:', error));
    });
    actionsCell.appendChild(saveButton);
    tr.appendChild(actionsCell);
    tableBody.appendChild(tr);
  }
 
  document.getElementById('add-row-button').addEventListener('click', addRow);