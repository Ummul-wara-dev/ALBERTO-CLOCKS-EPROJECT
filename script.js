// 1. Visitor Counter & Name
let visits = localStorage.getItem("siteVisits");
if (visits) { visits = Number(visits) + 1; } else { visits = 1; }
localStorage.setItem("siteVisits", visits);
if(document.getElementById("count")) { document.getElementById("count").innerText = visits; }

let vName = localStorage.getItem("visitorName");
if(!vName) {
    vName = "Guest_" + Math.floor(Math.random() * 1000);
    localStorage.setItem("visitorName", vName);
}
if(document.getElementById("vName")) { document.getElementById("vName").innerText = vName; }

// 2. Live Date/Time for Ticker
function updateTime() {
    let now = new Date();
    if(document.getElementById("datetime")) { document.getElementById("datetime").innerText = now.toLocaleString(); }
}
setInterval(updateTime, 1000);
updateTime();

// 3. Modal Popup Logic (Fixed Price)
function openModal(title, price, desc, img) {
    document.getElementById('mTitle').innerText = title;
    document.getElementById('mPrice').innerText = "Price: $" + price;
    document.getElementById('mDesc').innerText = desc;
    document.getElementById('mImg').src = img;
}

// 4. Filter Watches via URL Parameter
window.onload = function() {
    let urlParams = new URLSearchParams(window.location.search);
    let filter = urlParams.get('filter');
    if(filter) {
        filterData(filter);
    }
}

function filterData(category) {
    let cards = document.querySelectorAll(".watch-card");
    let btns = document.querySelectorAll(".filter-btn");
    
    // If buttons exist on page, manage their active state
    if(btns.length > 0) {
        btns.forEach(function(btn) { btn.classList.remove("active-btn", "bg-maroon", "text-white"); btn.classList.add("btn-outline-dark"); });
        if(event) { event.target.classList.remove("btn-outline-dark"); event.target.classList.add("active-btn", "bg-maroon", "text-white"); }
    }

    cards.forEach(function(card) {
        let cat = card.getAttribute("data-category");
        if (category === "all" || cat.includes(category)) { card.style.display = "block"; } 
        else { card.style.display = "none"; }
    });
}

// 5. Submit Order Form
function processOrder() {
    let name = document.getElementById('cName').value;
    let email = document.getElementById('cEmail').value;
    let phone = document.getElementById('cPhone').value;
    let watch = document.getElementById('cWatch').value;
    let address = document.getElementById('cAddress').value;

    let success = document.getElementById('successAlert');
    let error = document.getElementById('errorAlert');

    if (name === "" || email === "" || phone === "" || watch === "" || address === "") {
        error.classList.remove('d-none');
        success.classList.add('d-none');
        window.scrollTo(0, 0); // Scroll to top to show error
    } else {
        error.classList.add('d-none');
        success.classList.remove('d-none');

        let orders = JSON.parse(localStorage.getItem("bossOrders")) || [];
        orders.push({
            id: "ORD-" + Math.floor(Math.random() * 10000),
            name: name, email: email, phone: phone, watch: watch, address: address
        });
        localStorage.setItem("bossOrders", JSON.stringify(orders));
        document.getElementById('orderForm').reset();
        window.scrollTo(0, 0); // Scroll to top to show success     
        setTimeout(function() { success.classList.add('d-none'); }, 5000);
    }
}

// 6. FAQ Question Form
function sendQuestion() {
    let name = document.getElementById('fName').value;
    let email = document.getElementById('fEmail').value;
    let question = document.getElementById('fQuestion').value;
    let successMsg = document.getElementById('faqSuccess');

    if(name !== "" && email !== "" && question !== "") {
        let faqs = JSON.parse(localStorage.getItem("bossFaqs")) || [];
        faqs.push({ name: name, email: email, question: question });
        localStorage.setItem("bossFaqs", JSON.stringify(faqs));
        
        successMsg.classList.remove('d-none');
        document.getElementById('faqForm').reset();
        window.scrollTo(0, 0); // Scroll to top to show success

        setTimeout(function() { successMsg.classList.add('d-none'); }, 5000);
    }
}

// 7. Admin Data Loading
function loadAdminData() {
    let orders = JSON.parse(localStorage.getItem("bossOrders")) || [];
    let orderTable = document.getElementById("orderTableBody");
    if(orders.length === 0) {
        orderTable.innerHTML = "<tr><td colspan='6' class='text-muted fw-bold py-3'>No orders yet.</td></tr>";
    } else {
        orders.forEach(function(o) {
            orderTable.innerHTML += <tr><td class='fw-bold'>${o.id}</td><td>${o.name}</td><td>${o.phone}</td><td class='text-warning fw-bold'>${o.watch}</td><td>${o.address}</td><td><span class='badge bg-success'>Confirmed</span></td></tr>;
        });
    }
    let faqs = JSON.parse(localStorage.getItem("bossFaqs")) || [];
    let faqTable = document.getElementById("faqTableBody");
    if(faqs.length === 0) {
        faqTable.innerHTML = "<tr><td colspan='3' class='text-muted fw-bold py-3'>No questions yet.</td></tr>";
    } else {
        faqs.forEach(function(f) {
            faqTable.innerHTML += <tr><td>${f.name}</td><td>${f.email}</td><td class='text-start'>${f.question}</td></tr>;
        });
    }
}