// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAn2tyceuNvIBOGmkDvpM88lj-6VVTSGD8",
    authDomain: "wedlist-3b55e.firebaseapp.com",
    databaseURL: "https://wedlist-3b55e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wedlist-3b55e",
    storageBucket: "wedlist-3b55e.firebasestorage.app",
    messagingSenderId: "291825291448",
    appId: "1:291825291448:web:b47e3ebc1440bf2506a44d"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let gifts = [];

const giftListDiv = document.getElementById('giftList');
const modal = document.getElementById('reserveModal');
const closeSpan = document.getElementsByClassName('close')[0];
let currentReserveIndex = -1;

// Fetch gift list from Firebase
firebase.database().ref('giftList').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        gifts = data;
    } else {
        gifts = [
            { name: "Set Pinggan", reserved: false, reserver: "" },
            { name: "Rice Cooker", reserved: false, reserver: "" },
            { name: "Towel Set", reserved: false, reserver: "" },
        ];
    }
    renderGiftList();
});

function renderGiftList() {
    giftListDiv.innerHTML = '';
    gifts.forEach((gift, index) => {
        const giftItemDiv = document.createElement('div');
        giftItemDiv.classList.add('gift-item');

        giftItemDiv.innerHTML = `
            <div>
                <span>${gift.name}</span>
                ${gift.reserved && gift.reserver ? `<div class="reserved-by">(Reserved by ${gift.reserver})</div>` : ''}
            </div>
            <button class="${gift.reserved ? 'unreserve-btn' : 'reserve-btn'}" onclick="toggleReserve(${index})">
                ${gift.reserved ? 'Unreserved' : 'Reserved'}
            </button>
        `;

        giftListDiv.appendChild(giftItemDiv);
    });
}

function toggleReserve(index) {
    if (gifts[index].reserved) {
        gifts[index].reserved = false;
        gifts[index].reserver = "";
    } else {
        currentReserveIndex = index;
        modal.style.display = "block";
    }
    saveToFirebase();
}

function saveToFirebase() {
    firebase.database().ref('giftList').set(gifts);
}

// Handle modal
closeSpan.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function confirmReserve() {
    const reserverName = document.getElementById('reserverNameInput').value.trim();
    gifts[currentReserveIndex].reserved = true;
    gifts[currentReserveIndex].reserver = reserverName || "Anonymous";
    modal.style.display = "none";
    saveToFirebase();
}
