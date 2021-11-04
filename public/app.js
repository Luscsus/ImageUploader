var MaxLength = 12;
var image = ""
var FinalImageSwitch = true

function dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          ReadFileDrop(file)
          
          // Set file image opacity to 1:
          var fileimage = document.getElementById("FileImage")
          fileimage.style.opacity = 1
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        //console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
}
function dragOverHandler(ev) {
    // Set file image to 0.5:
    var fileimage = document.getElementById("FileImage")
    fileimage.style.opacity = 0.5

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function DragOverEnd(ev) {
    // Set file image opacity to 1:
    var fileimage = document.getElementById("FileImage")
    fileimage.style.opacity = 1

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}


async function Upload()
{
    var InputValue = document.getElementById("SearchField").value; // Get the input value
    var WarningText = document.getElementById("warningText") // Get the text that displays the warning for the text
    
    WarningText.innerHTML = "" // Remove the file warning
    // Check if Input value is empty
    if (InputValue.length == 0)
    {
        WarningText.innerHTML = "Missing text"
    }

    // Check if Input value is longer than the max lenght
    else if (InputValue.length > MaxLength)
    {
        WarningText.innerHTML = "Text is to long (maximum 12 characters)"
    }
    else {
        WarningText.innerHTML = "" // Remove the text warning

        // Check if files is present and is in image format:
        var fileInput = document.getElementById('upload');
        var filePath = fileInput.value;

        if (filePath ==  "")
        {
            WarningText.innerHTML = "Missing file"
        }

        else {
            WarningText.innerHTML = "" // Remove the file warning

            // Send the POST request to the server asking for the variables:
            var data = {image, InputValue}
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            const response = await fetch('/api/upload', options)
            const json = await response.json()
            if (json.ErrorMessage == "Name already exists")
            {
                WarningText.innerHTML = json.ErrorMessage
            }
            else {
                FinishedUpload()
            }
        }
    }
}

function FinishedUpload() {
    var Title = document.getElementById("Header")
    Title.innerHTML = "Upload successful"
}

$(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        Search()
        return false;
      }
    });
  });

async function Search()
{
    var InputValue = document.getElementById("SearchField").value; // Get the input value
    var WarningText = document.getElementById("warningText") // Get the text that displays the warning for the text

    // Check if Input value is empty
    if (InputValue.length == 0)
    {
        WarningText.innerHTML = "Missing text"
    }

    // Check if Input value is longer than the max lenght
    else if (InputValue.length > MaxLength)
    {
        WarningText.innerHTML = "Text is to long (maximum 12 characters)"
    }
    else {
        WarningText.innerHTML = "" // Remove the text warning

        // Send the POST request to the server asking for the image:
        var data = {InputValue}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }
        const response = await fetch('/api/search', options)
        const json = await response.json()

        if (json.ErrorMessage == "Image not found")
        {
            WarningText.innerHTML = json.ErrorMessage
        }
        else {
            HideElements() 
            DisplayFinalImage(json.image)
        }
    }
}

function HideElements() {
    // Get and hide the upload box
    var UploadBox = document.getElementById("UploadBox")
    UploadBox.style.display = "none"

    // Get and hide search field:
    var SearchFieldBox = document.getElementById("SearchFieldBox")
    SearchFieldBox.style.display = "none"
}

function DisplayFinalImage(image) {

    // Get and change the header and explanation:
    var Header = document.getElementById("Header")
    var Explanation = document.getElementById("Explanation")

    Header.innerText = "This is the image you looked for:"
    Explanation.innerText = "You can download it or return to the previous page"

    // Get and change the formsbox:
    var button1 = document.getElementById("Button1")
    var button2 = document.getElementById("Button2")

    // change the buttons onlick function:
    button1.onclick = function() {ReturnToMain()} // Cant assign directly to the function as it will run automatically
    button2.onclick = function() {DownloadImage(image)}

    // Now change the buttons text:
    button1.innerHTML = "Return"
    button2.innerHTML = "Download"

    // Get the image and change it
    var FinalImage = document.getElementById("FinalImage")
    var FinalImageOutside = document.getElementById("FinalImageOutside")
    FinalImageOutside.style.display = "block"
    FinalImage.style.display = "block"
    FinalImage.src = image
}

function DownloadImage(image) {
    var a = document.createElement("a")
    a.href = image
    a.download = "Image.png"
    a.click()
}

function ReturnToMain() {
    location.reload();
}

function ReadFileDrop(input) {
        var filePath = input.name;

        // Allowing file type
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        
        var WarningText = document.getElementById("warningText") // Get the text that displays the warning for the file

        if (!allowedExtensions.exec(filePath))
        {
            WarningText.innerHTML = "Wrong file format, must be (.jpg, .jpeg, .png, .gif)"
            var FileImage = document.getElementById("FileImage")
            FileImage.src = "image.svg"
            filePath = ""
        }
        else {
            WarningText.innerHTML = "" // Remove the file warning
            var reader = new FileReader();

            reader.onload = function (e) {
                image = reader.result
                $('#FileImage')
                    .attr('src', e.target.result)
            };

            reader.readAsDataURL(input);

            // Change button value:
            var button = document.getElementById("uploadfile")
            button.innerHTML = "Change file"
        }
}

function OnFinalImageHover() {
    var zoomIcon = document.getElementById("ZoomIcon")
    var img = document.getElementById("FinalImage")
    zoomIcon.style.display = "block"
    img.style.filter = "brightness(60%)"
}

function OnFinalImageClick() {
    var img = document.getElementById("FinalImage")
    var zoomImage = document.getElementById("ZoomIcon")
    img.style.transition = "transform 0.25s ease";
    if (FinalImageSwitch == true)
    {
        img.style.transform = "scale(2)"
        FinalImageSwitch = false
        zoomImage.src = "zoomOut.png"
    }
    else 
    {
        img.style.transform = "scale(1)"
        FinalImageSwitch = true
        zoomImage.src = "zoomIn.png"
    }
}

function OnFinalImageUnHover() {
    var zoomIcon = document.getElementById("ZoomIcon")
    zoomIcon.style.display = "none"
    var img = document.getElementById("FinalImage")
    img.style.filter = "brightness(100%)"
}

function ReadFile(input) {
    if (input.files && input.files[0]) {
        // Check if files is present and is in image format:
        var fileInput = document.getElementById('upload');
        var filePath = fileInput.value;

        // Allowing file type
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        
        var WarningText = document.getElementById("warningText") // Get the text that displays the warning for the file

        if (!allowedExtensions.exec(filePath))
        {
            WarningText.innerHTML = "Wrong file format, must be (.jpg, .jpeg, .png, .gif)"
            var FileImage = document.getElementById("FileImage")
            FileImage.src = "image.svg"
            fileInput.value = ""
        }
        else {
            WarningText.innerHTML = "" // Remove the file warning
            var reader = new FileReader();

            reader.onload = function (e) {
                image = reader.result
                $('#FileImage')
                    .attr('src', e.target.result)
            };
            reader.readAsDataURL(input.files[0]);

            // Change button value:
            var button = document.getElementById("uploadfile")
            button.innerHTML = "Change file"
        }
    }
}