(function () {
    'use strict';
  })();

const req1 = new XMLHttpRequest();

const listElement = document.querySelector('.employees');
const empTemplate = document.getElementById('emp-card-single');

const addEmployeeModal = document.getElementById('add-modal');
const startAddEmpButton = document.getElementById('addEmpBtn');
const backdrop = document.getElementById('backdrop');
const cancelAddEmpButton = addEmployeeModal.querySelector('.btn--passive');
const confirmAddEmpButton = cancelAddEmpButton.nextElementSibling;
const userInputs = addEmployeeModal.querySelectorAll('input');

const toggleBackdrop = () => {
    backdrop.classList.toggle('visible');
};

const closeEmpModal = () => {
    addEmployeeModal.classList.remove('visible');
};

const showEmpModal = () => {
    addEmployeeModal.classList.add('visible');
    toggleBackdrop();
};

const clearEmpInputs = () => {
    for(const usrInput of userInputs){
        usrInput.value = '';
    }
};

const cancelAddEmployee = () => {
    closeEmpModal();
    toggleBackdrop();
    clearEmpInputs();
};


req1.open('GET', 'http://localhost:3000/employs');

req1.responseType = 'json';

req1.onload = function() {
    const listOfEmployees = req1.response;

    for(const emp of listOfEmployees) {
        
        const req2 = new XMLHttpRequest();
        req2.open('GET', 'http://localhost:3000/type'); 
        req2.onload = function() {
            const listOfPosts = JSON.parse(req2.response);
            const empEl2 = document.importNode(empTemplate.content, true);

            for(pos of listOfPosts) {
                empEl2.getElementById('idEmp').textContent = 'ID zaposlenog: ' + emp.id;
                empEl2.getElementById('name').textContent = 'Ime: ' + emp.first_name;
                empEl2.getElementById('surname').textContent = 'Prezime: ' + emp.last_name;
                empEl2.getElementById('birth').textContent = 'Datum rođenja: ' + emp.date_of_birth;
                if(emp.id_type_position === pos.id) {
                    empEl2.getElementById('typeEmp').textContent = 'Pozicija: ' + pos.type_name;
                }
                empEl2.getElementById('imgEmp').setAttribute('src', emp.image);
            }
            listElement.append(empEl2);
        };
        req2.send();
    }
};

req1.send();

startAddEmpButton.addEventListener('click', showEmpModal);
cancelAddEmpButton.addEventListener('click', cancelAddEmployee);
confirmAddEmpButton.addEventListener('click', () => {
    const imeInput = document.getElementById('ime');
    const prezimeInput = document.getElementById('prezime');
    const datRodjInput = document.getElementById('datRodj');
    const idPozInput = document.getElementById('idPozicije2');
    const slikaInput = document.getElementById('slikaZap');

    const imeVr = imeInput.value;
    const prezVr = prezimeInput.value;
    const datRodjVr = datRodjInput.value.toString();
    const idVr = idPozInput.value;
    const slVr = slikaInput.value;

    const podaci = {
        first_name: imeVr,
        last_name: prezVr,
        date_of_birth: datRodjVr,
        id_type_position: parseInt(idVr),
        image: slVr
    };

    const j = JSON.stringify(podaci);

    console.log(j);

    const sendPodatke = new XMLHttpRequest();
    sendPodatke.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        console.log("Sve ok");
    }
    };
    sendPodatke.open('POST', 'http://localhost:3000/employs', true);
    sendPodatke.setRequestHeader('Content-Type', 'application/json');
    sendPodatke.send(j);
    
    clearEmpInputs();
    toggleBackdrop();
    closeEmpModal();
});

