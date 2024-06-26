require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");


console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUDNAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);


cloudinary.config({ 
  cloud_name: "dr8vhgwlz",
  api_key: "536367633223639",
  api_secret: "PitDEOZrCnoV3QNPpzfGU6JDsUM"
});
console.log("Cloudinary config:", cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
    console.log("inside the upload cloudinary method ") 
    console.log("local path is ", localFilePath)

    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
       
       
        fs.unlinkSync(localFilePath)
        console.log("file is deleted ", localFilePath)
        console.log("file is uploaded on cloudinary ", response.url)
        return response;

    } catch (error) {
        console.log("error while uploading on cloudinary ", error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}


// export {uploadOnCloudinary}
module.exports = uploadOnCloudinary



// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     console.log("inside the upload cloudinary method "); 
//     console.log("local path is ", localFilePath);

//     try {
//         if (!localFilePath) return null;
//         // Upload the file to Cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });
//         // File has been uploaded successfully
//         console.log("file is uploaded on cloudinary ", response.url);
//         fs.unlinkSync(localFilePath); // Remove local file
//         return response;

//     } catch (error) {
//         console.error("Error uploading to Cloudinary:", error);
//         fs.unlinkSync(localFilePath); // Remove local file on error
//         return null;
//     }
// };

// module.exports = { uploadOnCloudinary };
