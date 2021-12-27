# Xpressathon-Submission-Challenge-1
Address Normalization Challenge Submission by Team Red Ross

## Our Solution
Our solution basically involves using two publicly available APIs for the purpose of geocoding the given address and getting the details about the state, locality and city directly from the pincode. We have run our code on 150 examples of the given address due to limits in API and processing capabilities from our end. The generated JSON file is named final_addresses.json, whcich has been generated from the first 150 examples. 

## APIs Used
- Position Stack -> This API is used for getting the gecodes from a given address. 
- Postal Pincode API -> This API is used for getting information about the state, locality and city from the given pincode. 

## Other Fields
- For getting the pincode from the text, we have scraped through the text to identify the pincode. 
- Sometimes, when our scraping doesn't yield the pincode, our Position Stack API also returns the pincode of the given location after which we use that. 

## Running the code
### Method 1
- Clone this repositiory. 
- Run the code using node compiler by executing the command node <file_name.js> on your terminal.  

### Method 2
- Use npm init to initalize an npm project inside your working folder. 
- Then install necessary packages such as Axios (needed to interact with the API), bodyparser, fs (needed for file handling) using npm install <package_name>
- Now run the js file by using the command node <file_name> on your terminal. 
