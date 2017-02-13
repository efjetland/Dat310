var contacts = [new contact("Per","388623","email@mail.com")]

function init(){
  drawContacts();
  console.log("init");
}

function contact(name, tlf, email){
  this.name = name;
  this.tlf = tlf;
  this.email = email;
  console.log("Create contact");
}

function drawContacts(){
  var contactList = document.getElementById("contactWrapper");
  for(var i = 0;i<contacts.length;i++){
    console.log("asdaf");
    var contactName = document.createElement("P");
    contactName.appendChild(document.createTextNode(contacts[i].name));
    contactName.className = "contact-name";
    var contactTlf = document.createElement("P");
    contactTlf.appendChild(document.createTextNode(contacts[i].tlf));
    contactTlf.className = "contact-tlf";
    var contactEmail = document.createElement("P");
    contactEmail.appendChild(document.createTextNode(contacts[i].email));
    contactEmail.className = "contact-email";
    var newContact = document.createElement("div");
    newContact.className = "contact";
    newContact.appendChild(contactName);
    newContact.appendChild(contactTlf);
    newContact.appendChild(contactEmail);
    contactList.appendChild(newContact);
  }
}

function validate(name, tlf, email){
 console.log("valdifa");
}

window.onload = init;
