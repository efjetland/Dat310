var contacts = [new entry("Per","388623","email@mail.com"),new entry("Pål","3235515","Absold@mail.com"),new entry("Kine","8625511","epeen@gleeko.com")]

function init(){
  drawContacts();
  toggleInput();
  submitForm();
  var searchBox = document.getElementById("searchBox")
  searchBox.oninput = function(){
    search();
  }
  console.log("init");
}

function entry(name, tlf, email){
  this.name = name;
  this.tlf = tlf;
  this.email = email;
  this.visible = true;
  console.log("Create contact");
}

function createContact(){
  console.log("create");
  var name = document.getElementById("nameInput").value;
  var tlf = document.getElementById("tlfInput").value;
  var email = document.getElementById("emailInput").value;
  switch(validate(name,tlf,email)){
    case 1:
      contacts.push(new entry(name, tlf, email));
      drawContacts();
      break;
    case 2:
      alert("Please enter a valid name");
      break;
    case 3:
      alert("Please enter a valid number");
      break;
    case 4:
      alert("Please enter a valid email adress");
      break;
    default:
      alert("Something went wrong");
  }

}

function toggleInput(){
  var button = document.getElementById("toggleForm");
  var contactForm = document.getElementById("contactForm");
  contactForm.style.display = 'none';
  button.onclick = function() {
    console.log(contactForm.style.display);
    if(contactForm.style.display === 'none'){
      contactForm.style.display = 'block';
    } else contactForm.style.display = 'none';
  };
}

function submitForm(){
  var button = document.getElementById("addContact");
  button.onclick = function(){
    createContact();
  };
}

function drawContacts(){
  var contactList = document.getElementById("contactWrapper");
  contactList.innerHTML = "";
  for(var i = 0;i<contacts.length;i++){
    if(!contacts[i].visible){
      continue;
    }
    console.log("asdaf");
    var contactName = document.createElement("P");
    contactName.appendChild(document.createTextNode(contacts[i].name));
    contactName.className = "contact-name";
    var contactTlf = document.createElement("P");
    contactTlf.appendChild(document.createTextNode(contacts[i].tlf));
    contactTlf.className = "contact-tlf";
    var contactEmail = document.createElement("a");
    contactEmail.appendChild(document.createTextNode(contacts[i].email));
    contactEmail.className = "contact-email";
    contactEmail.setAttribute("href","mailto:"+contacts[i].email)
    var newContact = document.createElement("div");
    newContact.className = "contact";
    newContact.appendChild(contactName);
    newContact.appendChild(contactTlf);
    newContact.appendChild(contactEmail);
    contactList.appendChild(newContact);
  }
}

function validate(name, tlf, email){
  var namePattern = /[^abcdefghijklmnopqrstuvwxyzæøå]/ig;
  var tlfPattern = /[^0-9()+- ]/g;
  var emailLocalPattern = /[^a-z!#$%&'*+-/=?^_`{|}~]+[0-9]/ig;
  var emailDomainPattern = /[0-9a-z.-]/ig;
  if(namePattern.test(name)){
    return 2;
  }
  if(tlfPattern.test(tlf)){
    return 3;
  }
  var splitMail = email.split('@');
  if(splitMail.length !== 2){
    return 4;
  }

  if(emailLocalPattern.test(splitMail[0]) && emailDomainPattern.test(splitMail[1])){
    return 4;
  }
  return 1;
}

function search(){
  var search = document.getElementById("searchBox").value.trim();
  var searchExp = new RegExp(search,"i")
  if(search == ""){
    for(var i = 0;i<contacts.length;i++){
      contacts[i].visible = true;
    }
  } else {
    for(var i = 0;i<contacts.length;i++){
      var entry = contacts[i];
      if(searchExp.test(entry.name) || searchExp.test(entry.tlf) || searchExp.test(entry.email)){
        entry.visible = true;
        continue;
      } else {
        entry.visible = false;
      }
    }
  }
  drawContacts();

}


window.onload = init;
