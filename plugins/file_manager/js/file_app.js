//count the number of image viewersopen to control the the no of icons appear in taskbar
let img_viewer = 1;
let video_viewer=1;
//enables the functionality of file-manager
function enable_file_manager(panel_id, panels) {
  enable_context_menu();
  manage_all_photos(panel_id, panels);
  enable_header_btnOptions();
  enable_video_player(panel_id,panels);
}
//enable the header nbuttons functionality
function enable_header_btnOptions() {
  newFile_btn_click();
  newFolder_btn_click();
}
function newFile_btn_click() {
  const newFilebtn = document.getElementById("file-plus");
  newFilebtn.addEventListener("click", () => {
    let fileName = prompt("Enter file name:", "");
  });
}
function newFolder_btn_click() {
  const newFolderbtn = document.getElementById("folder-plus");
  newFolderbtn.addEventListener("click", () => {
    let folderName = prompt("Enter folder name:", "");
  });
}
function enable_context_menu() {
  const fileManager = document.getElementById("file-manager");
  fileManager.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    folder_context_menu();
    tree_context_menu();
  });
}
function folder_context_menu() {
  const folderView = document.getElementById("folder-view");
  folderView.addEventListener("contextmenu", (e) => {
    //code for context menu coming soon
  });
}
function tree_context_menu() {
  const treeView = document.getElementById("tree-view");
  treeView.addEventListener("contextmenu", (e) => {
    //code for context menu coming soon
  });
}
//image-opener window logic starts

//main call function
function manage_all_photos(panel_id, panels) {
  //sets the title under each photo at runtime by fetching their src
  setPhotosTitle(panel_id);
  //adding click event to all photos to open them
  add_click_event_to_all_photos(panel_id, panels);
}

function add_click_event_to_all_photos(panel_id, panels) {
  //selecting all photos of the window which was open and the window in which the photo was clicked
  const all_photos = document.querySelectorAll(`#${panel_id} .photo`);
  all_photos.forEach((photo) => {
    photo.addEventListener("dblclick", () => {
      //change css of icon in taskbar
      maximize_icon("photo-viewer");
      let src_photo = photo.getAttribute("data-source");
      //fecthing gallery
      let gallery = fetchgallery(all_photos);
      //index is meant to display that picture onnly in the photo viewer whic was clicked index is taken and serached in tejh gallery todisplay the particular phooto
      let index_photo = fetchIndex(src_photo, all_photos);
      //all done now index and gallery is provided to the plugin and it displays the image
      showImage(++index_photo, gallery);
      //minimize all the windows open except image viewer
      movePanelsBack(panels);
      //just to make sure only one image viewer icon is presetn in the taskbar at one time
      if (img_viewer == 1) {
        img_viewer--;
        addIconToTaskbar(
          "photo-viewer",
          '<i class="far fa-image media" id="image-viewer" style="padding: 7px 13px 8px 11.7px;"></i>',
          "i"
        );
      }
      let close_btn = document.getElementById("close-image-viewer");
      //add minimze functionality to image opener
      let minmize_btn = document.getElementById(`minimize-img-btn`);
      minmize_btn.addEventListener("click", () => {
        $(`#spotlight`).hide();
        minimize_icon("photo-viewer");
      });
      //show the img viewer back if it was minimized
      let show_img_opener = document.querySelector(".footer .photo-viewer");
      show_img_opener.addEventListener("click", () => {
        $(`#spotlight`).show();
        maximize_icon("photo-viewer");
        movePanelsBack(panels);
      });
      //remove icon of image-viewer from taskbar when it is closed
      close_btn.addEventListener("click", () => {
        $("li.photo-viewer").remove();
        img_viewer++;
      });
    });
  });
}
//show the clicked image with the help of plugin
function showImage(index, gallery) {
  Spotlight.show(gallery, {
    index: index,
    theme: "white",
  });
  $("#spotlight").css("height", " calc(100% - 40px)");
  $("#spotlight").css("z-index", "100");
}
//makes a gallery
function fetchgallery(allphotos) {
  let gallery = [];
  allphotos.forEach((photo) => {
    let title = " ";
    let des = " ";
    let src_photo = photo.getAttribute("data-source");

    let photoObj = {
      title: title,
      description: des,
      src: src_photo,
    };
    gallery.push(photoObj);
  });
  return gallery;
}
//fetch the index of photo which was clicked
function fetchIndex(source_photo, allphotos) {
  for (let i = 0; i < allphotos.length; i++) {
    if (allphotos[i].getAttribute("data-source") == source_photo) {
      //return the index of image
      return i;
    }
  }
  return;
}
//sets titles under the photos icon in the file explorer
function setPhotosTitle(panel_id) {
  const photos_names = document.querySelectorAll(`#${panel_id} .photo`);
  const photo_titles = document.querySelectorAll(
    `#${panel_id} .folder-view .folders .photo p`
  );
  for (let i = 0; i < photos_names.length; i++) {
    let photo_src = photos_names[i].getAttribute("data-source").split("/");
    photo_titles[i].innerHTML = photo_src.pop();
  }
}
//code for music player in file-manager
function enable_video_player(panel_id,panels){
  setVideosTitle(panel_id);
 add_click_event_to_video_files(panel_id,panels); 
}
function setVideosTitle(panel_id)
{
  const video_names = document.querySelectorAll(`#${panel_id} .video`);
  const video_titles = document.querySelectorAll(
    `#${panel_id} .folder-view .folders .video p`
  );
  for (let i = 0; i < video_names.length; i++) {
    let video_src = video_names[i].getAttribute("data-source").split("/");
    video_titles[i].innerHTML = video_src.pop();
  }
}
function add_click_event_to_video_files(panel_id,panels){
  const all_videos = document.querySelectorAll(`#${panel_id} .video`);
  all_videos.forEach(video=>{
    video.addEventListener("dblclick",()=>{
      let src_video=video.getAttribute("data-source");
     
      let _content=`<video data-role="video" data-autoplay="true" data-controls-hide="0" data-src="${src_video}"></video>`;
      create_video_window(_content);
    })
  })
}
function create_video_window(content){
  if(video_viewer==1){
    let iconName="video-viewer";
  let icon= '<img src="plugins/file_manager/icons/file-video.png" height="37.1" width="47">';
  addIconToTaskbar(
    iconName,
   icon,
    "i"
  );
 
  video_viewer--;
  let panel = jsPanel
  .create({
    headerTitle: iconName,
    closeOnEscape: true,
    panelSize: "950 568",
    headerControls: {
      maximize: "remove",
    },
    id: iconName,
    theme: "dark",
    resizeit: false,
    boxShadow: 5,
    content:content,
    callback: function () {
      this.content.style.padding = "0px";
    },
    onclosed: function(){
      video_viewer++;
      removeIconFromTaskBar(iconName,"")
    },
    onminimized: function(){
      minimize_icon(iconName);
    },
  })
  .setHeaderLogo(
    '<img src="plugins/file_manager/icons/file-video.png" height="50" width="30" style="margin:5px;">'
  );
  let panelObj = {
    id: panel.id,
    window: panel,
  };
  addPanelToPanelArray(panelObj);
  console.log(panelArray);
  hideWidget();
  }
  return;
}
//creates the markup for file-manager
function create_file_manager(icon) {
  let markup = ` <div class="wrapper-file-explorer" id="file-manager">
    <div class="header-file-explorer">
        <div class="file-path">
            <form action="#">
                <input id="file-path" placeholder="Enter file path" type="text">
            </form>
        </div>
        <div class="options">
            <ul>
                <li>
                    <img src="plugins/file_manager/icons/back.png" alt="Back">
                    <p>Back</p>
                </li>
                <li>
                    <img src="plugins/file_manager/icons/forward.png" alt="Forward">
                    <p>Next</p>
                </li>
                <li id="file-plus">
                    <img src="plugins/file_manager/icons/file-plus.png" alt="New file">
                    <p>NewFile</p>
                </li>
                <li id="folder-plus">
                    <img src="plugins/file_manager/icons/folder-plus.png" alt="New folder">
                    <p>NewFolder</p>
                </li>
                <li>
                    <img src="plugins/file_manager/icons/file-copy.png" alt="Copy file">
                    <p>Copy</p>
                </li>
                <li>
                    <img src="plugins/file_manager/icons/file-cut.png" alt="Cut file">
                    <p>Cut</p>
                </li>
                <li>
                    <img src="plugins/file_manager/icons/file-paste.png" alt="Paste file">
                    <p>Paste</p>
                </li>
            </ul>
            <form action="#">
                <input type="text" id="search-bar" placeholder="Search files">
            </form>
        </div>
    </div>
    <div class="body-file">
        <div class="tree-view" id="tree-view">
            <ul data-role="treeview">
                <li data-icon="<img src='plugins/file_manager/icons/quick_access.png'>" data-caption="Quick access">
                    <ul>
                        <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Photos"></li>
                        <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Videos"></li>
                        <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Documents"></li>
                    </ul>
                </li>
                <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="js">
                    <ul>
                        <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Projects"></li>
                        <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Downloads"></li>

                    </ul>
                </li>
                <li data-icon="<img src='plugins/file_manager/icons/this_pc.png'>" data-caption="This pc">
                    <ul></ul>
                </li>
                <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Css">
                    <ul>
                        <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="practice"></li>
                        <li data-caption="Projects" data-icon="<img src='plugins/file_manager/icons/folder-close.png'>">
                            <ul>
                                <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Web"></li>
                                <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Android"></li>
                                <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="Windows"></li>
                                <li data-icon="<img src='plugins/file_manager/icons/folder-close.png'>" data-caption="iOS"></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>`;
  if (icon == "this_pc") {
    markup += ` <div class="folder-view" id="folder-view">
            <div class="folders">
                <div class="folder">
                    <img src='plugins/file_manager/icons/folder-open.png'>
                    <p>Documents</p>
                </div>
            </div>
        </div>
    </div>
</div>`;
  } else {
    markup += ` <div class="folder-view" id="folder-view">
    <div class="folders">
        <div class="folder">
            <img class="icon" src='plugins/file_manager/icons/folder-open.png'>
            <p>Photos</p>
        </div>
        <div class="folder">
            <img class="icon" src='plugins/file_manager/icons/folder-open.png'>
            <p>Videos</p>
        </div>
        <div class="file video" data-source="https://metroui.org.ua/res/oceans.mp4">
        <img src="plugins/file_manager/icons/file-video.png">
        <p></p>
        </div>
        <div class="folder">
            <img class="icon" src='plugins/file_manager/icons/folder-open.png'>
            <p>Documents</p>
        </div>
        <div class="file photo" data-source="resources/images/dummy_images/3.jpg">
           <img src="resources/images/dummy_images/3.jpg">
           <p></p>
        </div>
        <div class="file photo" data-source="resources/images/dummy_images/wallpaper1.jpg">
           <img src="resources/images/dummy_images/wallpaper.jpg">
           <p></p>
        </div>
        <div class="file photo" data-source="resources/images/dummy_images/wallpaper1.jpg">
           <img src="resources/images/dummy_images/wallpaper.jpg">
           <p></p>
        </div>
        <div class="file photo" data-source="resources/images/dummy_images/2.jpg">
           <img src="resources/images/dummy_images/2.jpg">
           <p></p>
        </div>
        <div class="file video" data-source="resources/videos_files/vid1.mp4">
        <img src="plugins/file_manager/icons/file-video.png">
        <p></p>
        </div>
        <div class="file photo" data-source="resources/images/dummy_images/1.jpg">
           <img src="resources/images/dummy_images/1.jpg">
           <p></p>
        </div>
    </div>
</div>
</div>
</div>`;
  }
  return markup;
}
