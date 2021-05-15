
const logout = document.getElementById("out");
if(logout){
logout.addEventListener("click", (e)=>{
 
   e.preventDefault();
   auth.signOut().then(() =>{

       
       window.location = "index.html";
   });
});
}


const guideList = document.querySelector('.RTBoxes');
//setUp guides 
const setUpGuides = (data) => {
if(data.length){
 let html = ''
 data.forEach(doc => {
      const guide = doc.data();
      console.log(guide);
      const li = `
      <li style="padding:20px; list-style: none;">
        <div class="collapsible-header grey lighten-4 ">${guide.title}</div>
        <div class="collapsible-body white">${guide.content}</div>
      </li>
      `;
      html += li 
   });
   guideList.innerHTML = html;
 }
}
