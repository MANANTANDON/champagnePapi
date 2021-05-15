//get data.....
//state change......
auth.onAuthStateChanged(user => {

   if(user){
    db.collection('guides').get().then(snapshot => {
        setUpGuides(snapshot.docs);
      });
       
   }else{
       console.log("user logged out: ", user);
       setUpGuides([]);
   }
});


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
        const modal = document.querySelector('#ck78');
        signup.reset();
        window.location = "second.html";
     });
  });
}

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
            window.location = "second.html";
        });
    });
}


