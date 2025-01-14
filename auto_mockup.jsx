// Constants
const WINDOW_TITLE = "Auto Mockup Images123";
const MOCKUPEXTENSIONS = /\.(psd|psdt)$/i;
const IMAGEEXTENSIONS = /\.(jpg|jpeg|png|gif|tiff|webp)$/i;

// Create a new window
var win = new Window("dialog", WINDOW_TITLE);

// Function to process each image
function processImage(imageFile, mockupFile, outputFolder) {
  var mockup = app.open(mockupFile); // Open the mockup file
  var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
  var desc = new ActionDescriptor();
  desc.putPath(charIDToTypeID("null"), new File(imageFile)); // Set the image file path
  executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO); // Place the image into the mockup

  // Define a global counter at the beginning of the script
var fileCounter = 1; // Start from 1

// Loop through your mockup and image processing logic here
while (true) {
    // Generate a unique identifier based on the counter
    var uniqueIdentifier = ("000" + fileCounter).slice(-3); // Format the number to three digits, e.g., 001, 002, etc.

    // Construct the output file path with the numbered file name
    var outputFile = new File(outputFolder + "/" + mockupFile.displayName.replace(/\.(psd|psdt)$/i, "") + "_" + uniqueIdentifier + ".jpg");

    // Check if the file already exists
    if (!outputFile.exists) {
        // Save the mockup as a new file
        var saveOptions = new JPEGSaveOptions();
        saveOptions.quality = 12;
        mockup.saveAs(outputFile, saveOptions, true, Extension.LOWERCASE);
        mockup.close(SaveOptions.DONOTSAVECHANGES); // Close the file without saving changes

        // Increment the counter for the next file
        fileCounter++;
        break; // Exit the loop for this image
    } else {
        // Increment the counter and try again if the file already exists
        fileCounter++;
    }
}


// Function to select a folder and update the corresponding text field
function selectFolder(prompt, textField) {
    var folder = Folder.selectDialog(prompt);
    if (folder) {
        textField.text = folder.fsName;
        return folder;
    }
    return null;
}

// Add input folder panel
var inputPanel = win.add("panel", undefined, "Input Folder");
inputPanel.alignment = "fill";
var inputFolderBtn = inputPanel.add("button", undefined, "Select Input Folder");
var inputFolderText = inputPanel.add("edittext", undefined, "");
inputFolderText.alignment = "fill";
inputFolderBtn.onClick = function() {
    inputFolder = selectFolder("Select a folder with images to process:", inputFolderText);
};

// Add output folder panel
var outputPanel = win.add("panel", undefined, "Output Folder");
outputPanel.alignment = "fill";
var outputFolderBtn = outputPanel.add("button", undefined, "Select Output Folder");
var outputFolderText = outputPanel.add("edittext", undefined, "");
outputFolderText.alignment = "fill";
outputFolderBtn.onClick = function() {
    outputFolder = selectFolder("Select a folder to save the processed images:", outputFolderText);
};

// Add mockup folder panel
var mockupPanel = win.add("panel", undefined, "Mockup Folder");
mockupPanel.alignment = "fill";
var mockupFolderBtn = mockupPanel.add("button", undefined, "Select Mockup Folder");
var mockupFolderText = mockupPanel.add("edittext", undefined, "");
mockupFolderText.alignment = "fill";
mockupFolderBtn.onClick = function() {
    mockupFolder = selectFolder("Select the folder containing mockup files:", mockupFolderText);
    if (mockupFolder) {
        mockupFiles = mockupFolder.getFiles();
        // Filter out non-PSD files
        mockupFiles = mockupFiles.filter(function(file) {
            return file.name.match(MOCKUPEXTENSIONS);
        });
    }
};

// Add process button
var processBtn = win.add("button", undefined, "Process Images");
processBtn.alignment = "center";
processBtn.onClick = function() {
    if (inputFolder && outputFolder && mockupFolder) {
        var imageFiles = inputFolder.getFiles(IMAGEEXTENSIONS);
        for (var m = 0; m < mockupFiles.length; m++) {
            for (var i = 0; i < imageFiles.length; i++) {
                processImage(imageFiles[i], mockupFiles[m], outputFolder);
            }
        }
        alert("Processing complete.");
    } else {
        alert("Please select input, output, and mockup folders.");
    }
};

// Add exit button
var exitBtn = win.add("button", undefined, "Exit");
exitBtn.alignment = "center";
exitBtn.onClick = function() {
    win.close();
};

// Show the window
win.show();
