//get data.....
//state change......
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
let displayPicture = document.getElementById("DP");
let smalldisplayPicture = document.getElementById("dp");
var highl = document.getElementById("signInPassword");
let profileImage;


let center ;
auth.onAuthStateChanged(user => {

   if(user){
     FullName(user);
    storage.ref('users/' + user.uid + '/profile.jpg').getDownloadURL().then(imgUrl => {
        displayPicture.src = imgUrl;
        smalldisplayPicture.src = imgUrl;
        profileImage = imgUrl;
    })
    db.collection('guides').orderBy("createdAt", "desc").onSnapshot(snapshot => {
      console.log(snapshot.docs);
      setUpGuides(snapshot.docs);
      setupUI(user); 

        // subColl(user);
      }, err => {
        console.log(err.message);
      });

      db.collection('users').doc(user.uid).get().then(doc => {
          center = doc.data().displayName + doc.data().sName;
          console.log(center);
          
      })
      db.collection('users').onSnapshot(snap => {
        setUpFriends(snap.docs);
      })
   }else{
       console.log("user logged out: ", user);
       setUpGuides([]);
       setupUI(user);
   }
  
});

let file = {};
function chooseFile(e){
    file = e.target.files[0];
}
//this is signup method 
const signup = document.getElementById('signUpForm');
if(signup){
    signup.addEventListener('submit', (e) => {
   
        e.preventDefault();

        //get user info...
        const email = signup['signUpEmail'].value;
        const pass = signup['signUpPassword'].value;

        console.log("SignedUp!! "+email+" "+pass);

    //create a user
    auth.createUserWithEmailAndPassword(email, pass).then(cred => {

      storage.ref('users/' + cred.user.uid + '/profile.jpg').put(file).then(function () {
          console.log("uploaded");
      }).catch(e => {
        console.log(e);
      })
      return db.collection('users').doc(cred.user.uid).set({
         displayName: signup["firstName"].value,
         sName: signup["surname"].value,
      });
    }).then(() => {
      const modal = document.querySelector('#ck78');
      signup.reset();
      window.location = "second.html";
      
     });
  });
}

// login method
const login = document.getElementById("loginForm");
if(login){
    login.addEventListener('submit', (e) => {

        e.preventDefault();

        //get login credentials....

        const user = login["signInEmail"].value;
        const password = login['signInPassword'].value;


        //SignIn User......

        auth.signInWithEmailAndPassword(user, password).then(cred => {
            console.log(cred);
            login.reset();
            window.location = "second.html"
        }).catch(error => {
          window.alert("password is incorrect! " + error);
          highlight();

        })
    });
}

function highlight(){
   highl.style.border = "1px solid red";
}

//logout method...
const logout = document.getElementById("out");
if(logout){
logout.addEventListener("click", (e)=>{
 
   e.preventDefault();
   auth.signOut().then(() =>{
      window.location = "index.html";
   });
});
}


// creates users real time input data 



const creatForm = document.querySelector("#cForm");
if(creatForm){
  creatForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if(creatForm['userBlog'].value != ""){
    db.collection('guides').add({
      content: creatForm['userBlog'].value,
      person: center,
      createdAt: timestamp()
    }).then(()=>{
      const Fform = document.getElementById('cForm');
      Fform.reset()
    }).catch(err =>{
      console.log(err.message);
    })
  }else{
    console.log("Enter something!!")
  }

  })
}




//setUp guides

const guideList = document.querySelector('.centerConsole'); 
const setUpGuides = (data) => {
 
if(data.length){
  console.log(data.length);
 let html = ''
 data.forEach(doc => {
      const guide = doc.data();
      const pre = guide.createdAt.toDate();
      const div = `<div>
        <div class = "RTBoxes" style="background-color: rgb(36,37,38); color: white; font-family: Open Sans; word-wrap: break-word; font-size: 15px; color: rgb(170,171,172);" >@${guide.person} <br>
        <div style = "font-size: 10px;">${pre}</div> 
        <hr style = "width: 545px; border: 1px solid rgb(60,61,62);"><br>
        <div style = "font-size: 15px;">${guide.content} </div><br>
        <button id = "gre" class = "material-icons" >arrow_circle_up</button>
        <button id = "ree" class = "material-icons" >arrow_circle_down</button>
        </div>
        </div>
       `;
      html += div 
    });
    guideList.innerHTML = html;
 }
}

const accDetails = document.getElementById("userDetails");
const setupUI = (user) => {
  if(user){

    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
         <div style = "box-sizing: border-box; padding: 10px; text-align: center; font-family: 'Lucida Grande'; font-size: 33px; color: rgb(170,171,172); left: 2px;">  ${doc.data().displayName} ${doc.data().sName}</div> 
         <div style = "box-sizing: border-box;  margin-left: 20px; margin-right: 20px; border-radius: 10px; padding: -10px; color: rgb(170,171,172);">
         <div class = "material-icons" style = " float: left; margin: -40px 0 0 40px; color: rgb(170,171,172); font-size: 20px;"><br><br>email</div>
         <div style = "box-sizing: border-box; font-family: 'Lucida Grande';">  ${user.email} </div>
        </div>   
        <hr style = "border: 1px solid rgb(60,61,62);">    
          `;
       accDetails.innerHTML = html;
    })
    
  }else{
      accDetails.innerHTML = " ";
  }
}

const userName = document.getElementById("FGk5");
const FullName = (user) => {
  if(user){
    db.collection("users").doc(user.uid).get().then(doc => {
      const html = `
      <div style = "box-sizing: border-box; padding: 5px; text-align: center; font-family: 'Lucida Grande'; font-size: 15px; color: rgb(170,171,172); float: left; margin: -10px 0 0 8px;">${doc.data().displayName} ${doc.data().sName}</div>
     <br> <hr style = "border: 1px solid rgb(60,61,62);">
      `;
    userName.innerHTML = html;
    })
  }else{
     userName.innerHTML = " ";
  }
}

const friendsList = document.querySelector('.friendsConsole')
const setUpFriends = (data) =>{
    if(data.length){
      console.log(data.length);
      let html = '';
      data.forEach(docs => {
        const friends = docs.data();
        const div = `
          <br><div class = "myFriends">@${friends.displayName} ${friends.sName}</div>
        `;
        html += div;
      });
      friendsList.innerHTML = html;
    }
}


