/*keep record of all widgets in a list to keep a check on
 them widgets like(start,calender,modal)*/
const widgets = document.querySelectorAll(".widget");
//add hover effect on footer img icons only
let footer_icons_img;
setInterval(() => {
  footer_icons_img=document.querySelectorAll(".taskbar-icon");
  footer_icons_img.forEach(icon=>{
    $(`li.${icon.classList[1]}`).hover(function(){
      $(this).css("background-color", "rgb(75, 75, 86)");
      }, function(){
      $(this).css("background-color", "rgb(33, 33, 41)");
    });
  })
}, 700);

//counts the number of panels open at a once and it basically used to control the position of each panel opened one after the other on screen just to seperate them from each other they are not placed on each other
let panelcount = 0;

//this array is used to store alla the panels in it it will be easy for us to trigger each panel in this way
let panelArray = [];

//this array below stores all the clicked icons just to keep check on them that always one panel get opened when ever the user click on these icons
let iconArray = [];

//initializing the user profile window so that every time client opens it it opens once at a time not multiple
iconArray['<i class="fas fa-user" style="padding:8px"></i>'] = 1;

/*keeep record of all icons on the overlay to tackle 
the events on them and dblClick event is implemented in the 
keepcheckondesktopicons function below*/
const allIcons = document.querySelectorAll(".modal-icon");

//below logic just keep check on the taskbar icons that if an icon is clicked its corresponding panel is took from the panel array and it is brought to front in th panel stack after every second
var taskbarIcons;
//check taskbar icon activity every second
//keep check on taskbar icons
function checkTaskbarIconActive() {
  taskbarIcons = document.querySelectorAll(".taskbar-icon");
  taskbarIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
    maximize_icon(icon.classList[0]);
     bringPanelToFront(icon);
    });
  });
}


//the panel which was clicked by client bring it to front of all panels
function bringPanelToFront(icon) {
  for (let i = 0; i < panelArray.length; i++) {
    if (icon.classList[0] == panelArray[i].id) {
      panelArray[i].window.front();
      hideWidget();
      break;
    }
  }
  return;
}

//this fucntion basically hide everything present on the overlay i.e screen of client for eaxample suppose the client clicks on this pc then everythign else open will be hidden or closed
function hideWidget() {
  widgets.forEach((widget) => {
    $(widget).css("z-index", "0");
    $(widget).hide();
    $(widget).removeClass("active");
  });
}

/*i am assigning eacy icon in the overlay container a integer value one because it will keep limit of each panel to one it will not alooow to open multiple panels for one icon double click event 
for each click only one panel will be opened and will be visible */
allIcons.forEach((icon) => {
  iconArray[icon.src] = 1;
});

//wait until the whole document is loaded then execute the logic inside it
$(document).ready(function () {
  //keep check on the icons in overlay container that if they are double clicked or not
  keepCheckOnDesktopIcons();
  //update date and time every second
  setInterval(setTheDate, 1000);
  //if the overlay copntainer is clicked then close every thing
  $("#overlay").click(function () {
    hideWidget();
  });
});
//change css of icon in taskbar to look minimize
function minimize_icon(icon)
{
  $(`li.${icon}`).css("border-bottom","solid rgb(194, 188, 188) 2.7px");
  $(`li.${icon}`).css("background","none");
  $(`li.${icon}`).css("background-color", "rgb(33, 33, 41)");
}

//change css of icon to look maximized
function maximize_icon(icon){
  $(`li.${icon}`).css("border-bottom","solid #fff 4px");
  $(`li.${icon}`).css("background-color","rgb(33, 33, 41)");
}
//return the current time
function fetchTime() {
  let time = new Date();
  return time.toLocaleString("en-PK", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
//minimizez all the panels
function movePanelsBack(panels)
{
  //if the panel array is empty then below logic will work 
  for(let i=0; i<panels.length; i++)
  {
    if(panels[i]=="")
    return;
  }
  //if there is panel in array then this logic will
  for(let i=0; i<panels.length; i++)
  {
      panels[i].window.minimize();
  }
}
//return the  todays date
function fetchDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getFullYear();
  return month + "/" + day + "/" + year;
}

//fetch time with second for the calender container
function fetchTimeWithSeconds() {
  let time = new Date();
  return time.toLocaleString("en-PK", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}

//set the date in date/time container
function setTheDate() {
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  date.innerHTML = fetchDate();
  time.innerHTML = fetchTime().toUpperCase();
}

//show calender if the date/time container is clicked
function showCalender() {
  const time = document.getElementById("calendar-time");
  setInterval(() => {
    time.innerHTML = fetchTimeWithSeconds().toUpperCase();
  }, 1000);
  reloadCalenderContent();
  $("div.calender-container").css("z-index", "500");
  $("div.calender-container").css("opacity", "1");
  $("div.calender-container").toggle();
}

/*if the calender container is opened and the calender month OR year is changed by the user 
then when the user close and again open the calender container the below logic will reload the calnder
 content again so that the default moth and year is visible to user*/
function reloadCalenderContent() {
  const updateCalenderToDefault = document.getElementById("caleandar");
  updateCalenderToDefault.innerHTML = "";
  const script1 = document.getElementById("reload1");
  const script2 = document.getElementById("reload2");
  let newscript1 = document.createElement("script");
  newscript1.type = "text/javascript";
  newscript1.src = "plugins/taskbar_calender/js/caleandar.min.js";
  newscript1.id = "reload1";
  let newscript2 = document.createElement("script");
  newscript2.type = "text/javascript";
  newscript2.id = "reload2";
  newscript2.src = "plugins/taskbar_calender/js/demo.js";
  document.body.removeChild(script1);
  document.body.removeChild(script2);
  document.body.appendChild(newscript1);
  document.body.appendChild(newscript2);
}

//if start button is clicked then open start container
function showStartContainer() {
  const start = document.getElementById("start");
  $("div.start-container").show();
  start.classList.toggle("active");
  $("div.start-container").css("z-index", "10000");
  $("div.start-container").css("display", "");
}

//create a window for every icon on the desktop window and show that window to client corresponding to the icon whcih was clicked
function CreateModal(icon, src) {
  let iconName = icon[0];
  let leftheightpanel = 60 + panelcount * 15;
  let topheightpanel = 20 + panelcount * 15;
  if (
    topheightpanel < window.screen.height &&
    leftheightpanel < window.screen.width
  ) {
    let panel = jsPanel
      .create({
        headerTitle: iconName,
        closeOnEscape: true,
        panelSize: "850 550",
        position: `left-top ${leftheightpanel} ${topheightpanel}`,
        id: iconName,
        theme: "dark",
        resizeit: {
          minWidth: 700,
          minHeight: 550,
        },
        boxShadow: 5,
        content: create_file_manager(iconName),
        callback: function () {
          this.content.style.padding = "0px";
        },
        onclosed: function () {
         removeIconFromTaskBar(iconName, src);
        },
        onminimized: function(){
          minimize_icon(iconName);
        }
      })
      .setHeaderLogo(
        '<img src="resources/images/icons/' +
          iconName +
          "." +
          icon[1] +
          '" height="45" width="22" style="margin:6px;">'
      );
    let panelObj = {
      id: panel.id,
      window: panel,
    };
    addPanelToPanelArray(panelObj);
    hideWidget();
    enable_file_manager(panel.id,panelArray);
  }
}

//take the argument panel and add it to the panelArray
function addPanelToPanelArray(panelObj) {
  let check = 0;
    /*this if is used if the array has some panel but the panel was closed by the client so logically there is no need of that panel so below
   logic just place the next panel opened on the index where it is a panel placed already*/
  if (panelArray.length > 0) {
    for (let i = 0; i < panelArray.length; i++) {
      if (panelArray[i] == 0) {
        panelArray[i] = panelObj;
        check = 1;
        break;
      }
    }
  }
  //this if runs if their is already an panel made and it is present in the array then the next panel will be simply added to the next index in a stack manner
  if (check == 0) {
    panelArray[panelArray.length] = panelObj;
  }
}

//it basically remove the icon from the taskbar paenl when the window is closed
function removeIconFromTaskBar(icon, src) {
  panelcount--;
  for (let i = 0; i < panelArray.length; i++) {
    if (panelArray[i].id == icon) {
      panelArray[i] = 0;
    }
  }
if(src){
  iconArray[src] = 1;
}
   $("li." + icon).remove();
}

//this functionn is called in the doument.ready function
function keepCheckOnDesktopIcons() {
  allIcons.forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      let src = null;
      let split = null;
      let idg = null;
      for (let i = 0; i < allIcons.length; i++) {
        if (icon.src == allIcons[i].src) {
          src = allIcons[i].src;
          split = src.split("/");
          let source = split.pop();
          idg = source.split(".");
        }
      }
      if (icon.src == src && iconArray[icon.src] >= 1) {
        let icon_name = idg[0];
        let icon_extension = idg[1];
        let tagType = "img";
        addIconToTaskbar(icon_name, icon_extension, tagType);
        panelcount++;
        iconArray[icon.src]--;
        CreateModal(idg, icon.src);
        hideWidget();
        return;
      }
      return;
    });
  });
}

function addIconToTaskbar(fileName, fileExtension, tagType) {
  checkTaskbarIconActive();
  const ul = document.getElementById("taskbar");
  let li = document.createElement("li");
  let classli = document.createAttribute("class");
  let span = document.createElement("span");
  if (tagType == "img") {
    classli.value = fileName + " line-item" + " active"+" taskbar-icon";
    li.setAttributeNode(classli);
    let img = document.createElement("img");
    img.src = "resources/images/icons/" + fileName + "." + fileExtension;
    img.height = "32";
    img.width = "32";
    span.appendChild(img);
  } else {
    classli.value = fileName+" active" +" taskbar-icon";
    li.setAttributeNode(classli);
    span.innerHTML = fileExtension;
  }
  li.appendChild(span);
  ul.appendChild(li);
  checkTaskbarIconActive();
}
//this variable is for cropmodal window so that it could be opened just once in the user profile window everytime
let cropModalCount = 0;
//shows the profile info to the user if the user icon is clicked in the start container header
function showProfile() {
  let icon = '<i class="fas fa-user" style="padding:8px"></i>';
  let iconName = "user-profile";
  let iconType = "i";
  let iconfortaskbar = '<i class="fas fa-user" style="padding: 7px 13px 8px 11.7px;"></i>';
  if (iconArray[icon] == 1) {
    movePanelsBack(panelArray);
    addIconToTaskbar(iconName, iconfortaskbar, iconType);
    iconArray[icon]--;
    let _content = `
    <div class="profile-container">
    <div class="left">
      <div class="image">
        <img src="resources/images/dummy_images/profile.jpg"  id="image-profile" alt="" />
        <div class="overlay-profile">
          <button id="change-profile" class="profile-btn">Change</button>
        </div>
      </div>
      <input type="file" id="choose-profile">
    </div>
    <div class="right">
      <h2 class="heading">Personal information</h2>
      <div class="info">
        <form action="#">
          <div>
            <h4 class="heading">Username</h4>
            <input
              type="text"
              id="username"
              value="_iamubaid"
              placeholder="Username"
            />
          </div>
          <div>
            <h4 class="heading">First name</h4>
            <input
              type="text"
              id="first-name"
              placeholder="First name"
              value="Ubaid"
            />
          </div>
          <div>
            <h4 class="heading">Last name</h4>
            <input
              type="text"
              id="last-name"
              value="Mahmood"
              placeholder="Last name"
            />
          </div>
          <div>
            <h4 class="heading">Company</h4>
            <input
              type="text"
              id="company-name"
              placeholder="Company name"
              value="tech."
            />
          </div>
          <div>
            <h4 class="heading">Start Date</h4>
            <input type="text" id="start-date" placeholder="Start date" value="19/12/19" />
          </div>
          <div>
            <h4 class="heading">End date</h4>
            <input type="text" id="end-date" placeholder="End date" value="20/12/20"/>
          </div>
          <div>
            <h4 class="heading">No. of employees</h4>
            <input
              type="number"
              value="12"
              id="emp_no"
              placeholder="Number of employees"
            />
          </div>
         
          <button class="profile-btn" id="save-profile" type="submit">Save</button>
          
        </form>
        <button class="profile-btn"  id="edit-profile">Edit</button>
      </div>
     
    </div>
  </div>
  `;
    let panel = jsPanel
      .create({
        headerTitle: "User profile",
        closeOnEscape: true,
        resizeit: false,
        panelSize: "820 550",
        position: "center-top 10 0",
        id:iconName,
        theme: "dark",
        boxShadow: 5,
        content: _content,
        onminimized: function(){
          minimize_icon(iconName);
        },
        headerControls: {
          maximize: "remove",
        },
        callback: function () {
          this.content.style.padding = "10px";
          this.content.style.fontSize = "17px";
        },
        onclosed: function () {
           iconArray[icon]++;
           removeIconFromTaskBar(iconName, "");
        },
        callback: function (panel) {
          setTimeout(function () {
            jsPanel.setStyles(panel.content, {
              padding: 0,
            });
          }, 1000);
        },
      })
      .setHeaderLogo(icon);
    let panelObj = {
      id: panel.id,
      window: panel,
    };
    addPanelToPanelArray(panelObj);
    disableForminputs();
    hideWidget();
    createCropModal();
    editProfileInfo();
  }
  return;
}

function createCropModal() {
  if (cropModalCount == 0) {
    cropModalCount++;
    const change = document.getElementById("change-profile");
    change.addEventListener("click", () => {
      cropModalCount++;
      $("#choose-profile").show();
    });
    const inputImage = document.getElementById("choose-profile");
    inputImage.addEventListener("change", () => {
      let __content = `
  <canvas id="crop-canvas" height="500" width="500"
   style="border:1px solid #111;">your browser doesn't support canvas </canvas>
   <input type="button" onclick="cropper.startCropping()" value="Crop" />
   <input type="button" onclick="setProfilePhoto()" value="Save" />
   <input type="button" onclick="cropper.restore()" value="Restore" />
  `;
      let panel = jsPanel.create({
        headerTitle: "Crop image",
        closeOnEscape: true,
        resizeit: false,
        panelSize: "550 600",
        position: "center-top 10 0",
        id: `profile-crop`,
        theme: "dark",
        boxShadow: 5,
        content: __content,
        headerControls: "closeonly xs",
        animateIn: "jsPanelFadeIn",
        onclosed: function () {
          return cropModalCount--;
        },
      });
      let panelObj = {
        id: panel.id,
        window: panel,
      };
      addPanelToPanelArray(panelObj);
      cropper.start(document.getElementById("crop-canvas"), 1);
      cropper.startCropping();
      handleFileSelect();
    });
  }
  return;
}

function handleFileSelect() {
  var file = document.getElementById("choose-profile").files[0];
  var reader = new FileReader();
  reader.onload = function (event) {
    var data = event.target.result;
    cropper.showImage(data);
  };
  reader.readAsDataURL(file);
}

function setProfilePhoto() {
  const profileImage = document.getElementById("image-profile");
  profileImage.src = cropper.getCroppedImageSrc();
  panel_profile = getPanel("profile-crop");
  panel_profile.close();
  $("#choose-profile").hide();
}

function getPanel(id) {
  let panel_ = null;
  panelArray.forEach((panel) => {
    if (id == panel.id) {
      panel_ = panel.window;
    }
  });
  if (panel_ == null) {
    return false;
  } else {
    return panel_;
  }
}

function editProfileInfo() {
  let error_msgs = [];
  const edit_btn = document.getElementById("edit-profile");
  edit_btn.addEventListener("click", () => {
    enableFormInputs();
    $("#save-profile").show();
    $("#edit-profile").hide();
  });
  const form = document.querySelector(".profile-container .right .info form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputforProfile(error_msgs);
  });
}

function disableForminputs() {
  const formInputs = document.querySelectorAll(
    ".profile-container .right .info form div input"
  );
  formInputs.forEach((input) => {
    input.disabled = true;
  });
}

function enableFormInputs() {
  const formInputs = document.querySelectorAll(
    ".profile-container .right .info form div input"
  );
  formInputs.forEach((input) => {
    input.disabled = false;
  });
  formInputs[0].focus();
}

function checkInputforProfile(error_msgs) {
  const username = document.getElementById("username");
  const first_name = document.getElementById("first-name");
  const last_name = document.getElementById("last-name");
  const company_name = document.getElementById("company-name");
  const start_date = document.getElementById("start-date");
  const end_date = document.getElementById("end-date");
  const emp_no = document.getElementById("emp_no");
  if (username.value.trim() === "" || username.value.trim() == null) {
    let msg = {
      id: "Username field is empty",
      _input: username.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (first_name.value.trim() === "" || first_name.value.trim() == null) {
    let msg = {
      id: "First name field is empty",
      _input: first_name.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (last_name.value.trim() === "" || last_name.value.trim() == null) {
    let msg = {
      id: "Last name field is empty",
      _input: last_name.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (company_name.value.trim() === "" || company_name.value.trim() == null) {
    let msg = {
      id: "Company name field is empty",
      _input: company_name.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (start_date.value.trim() === "" || start_date.value.trim() == null) {
    let msg = {
      id: "Start date field is empty",
      _input: start_date.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (end_date.value.trim() === "" || end_date.value.trim() == null) {
    let msg = {
      msg: "End date field is empty",
      _input: end_date.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (emp_no.value.trim() === "" || emp_no.value.trim() == null) {
    let msg = {
      id: "Employees field is empty",
      _input: emp_no.id,
    };
    error_msgs[error_msgs.length] = msg;
  }
  if (error_msgs.length > 0) {
    if (error_msgs.length > 1) {
      Metro.dialog.create({
        title: "Warning",
        content: "Some fields are empty",
        closeButton: true,
      });
    } else if (error_msgs.length == 1) {
      Metro.dialog.create({
        title: "Warning",
        content: `${error_msgs[0].id}`,
        closeButton: true,
      });
    }
  }
  if (error_msgs.length === 0) {
    disableForminputs();
    $("#save-profile").hide();
    $("#edit-profile").show();
    return;
  } else {
    error_msgs.forEach((error) => {
      error_msgs.pop();
    });
    return;
  }
}
