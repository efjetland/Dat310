var contacts = [new entry("Per","388623","email@mail.com"),new entry("Pål","3235515","Absold@mail.com"),new entry("Kine","8625511","epeen@gleeko.com")]

function init(){
  drawContacts();
  toggleInput();
  submitForm();
  var searchBox = document.getElementById("searchBox")
  searchBox.oninput = function(){
    search();
  }
}

function entry(name, tlf, email){
  this.name = name;
  this.tlf = tlf;
  this.email = email;
  this.visible = true;
}

function createContact(){
  var name = document.getElementById("nameInput").value.trim();
  var tlf = document.getElementById("tlfInput").value.trim();
  var email = document.getElementById("emailInput").value.trim();
  if(validate(name,tlf,email)){
      contacts.push(new entry(name, tlf, email));
      search();
  }
}

function editContact(contact){
  var form = document.getElementById("contactForm");
  var entry = contacts[parseInt(contact.id.match(/\d+/)[0])];
  var addButton = document.getElementById("toggleForm");
  addButton.classList.remove('fa-minus-square');
  addButton.classList.add('fa-plus-square');

  form.style.display = 'block';
  form.children[0].innerHTML = "Edit Contact";
  form.children[2].value = contact.children[0].innerHTML;
  form.children[4].value = contact.children[1].innerHTML;
  form.children[6].value = contact.children[2].text;
  form.children[7].onclick = function(){
    var name = form.children[2].value.trim();
    var tlf = form.children[4].value.trim();
    var email = form.children[6].value.trim();
    if(validate(name,tlf,email)){
      contact.children[0].innerHTML = name;
      entry.name = name;
      contact.children[1].innerHTML = tlf;
      entry.tlf = tlf;
      contact.children[2].text = email;
      contact.children[2].setAttribute("href","mailto:" + email);
      entry.email = email;
      search();
    }
  };
}
function deleteContact(contact){
  if(confirm("Are you sure you wish to delete "+contact.children[0].innerHTML+" from your contacts?")){
    var index = parseInt(contact.id.match(/\d+/)[0]);
    contacts.splice(index,1);
    search();
    toggleInput();
  }
}


function toggleInput(){
  var button = document.getElementById("toggleForm");
  var form = document.getElementById("contactForm");
  form.style.display = 'none';
  button.classList.remove('fa-minus-square');
  button.classList.add('fa-plus-square');
  button.onclick = function() {
    if(form.style.display === 'none' || form.children[0].innerHTML === "Edit Contact"){
      button.classList.add('fa-minus-square');
      button.classList.remove('fa-plus-square');
      form.children[0].innerHTML = "Add Contact"
      form.children[2].value = '';
      form.children[4].value = '';
      form.children[6].value = '';
      form.children[7].onclick = function(){
        createContact();
      }
      form.style.display = 'block';
    } else{
      button.classList.remove('fa-minus-square');
      button.classList.add('fa-plus-square');
      form.style.display = 'none';
    }
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
    var edit = document.createElement("a")
    edit.className = "fa fa-pencil clickable";
    edit.onclick = function(){
      editContact(this.parentElement);
    }
    var del = document.createElement("a");
    del.className = "fa fa-trash clickable";
    del.onclick = function(){
      deleteContact(this.parentElement);
    }
    var newContact = document.createElement("div");
    newContact.className = "contact";
    newContact.id = "contact-"+i;
    newContact.appendChild(contactName);
    newContact.appendChild(contactTlf);
    newContact.appendChild(contactEmail);
    newContact.appendChild(edit);
    newContact.appendChild(del);
    contactList.appendChild(newContact);
  }
}

function validate(name, tlf, email){
  var namePattern = /[^abcdefghijklmnopqrstuvwxyzæøå]/ig;
  var tlfPattern = /[^0-9()+-\s]/g;
  var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(namePattern.test(name)){
    alert("Please enter a valid name");
    return false;
  }
  if(tlfPattern.test(tlf) && email == ""){
    alert("Please enter a valid number");
    return false;
  }
    if(!emailPattern.test(email) && tlf == ""){
    alert("Please enter a valid email adress");
    return false;
  }
  return true;
}

function search(){
  var search = document.getElementById("searchBox").value.trim();
  search = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
