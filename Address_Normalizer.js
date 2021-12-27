const axios = require('axios');
const accesskey='6e4165d5a1f13957f7a431240eec591b';
const fs = require('fs');
const readline = require('readline');
const allAddress = [];
var count = 0;
var finalres = {"addresses": []};
var loc_and_state={locality:"nil",state:"nil", city: "nil"};

const file = readline.createInterface({
    input: fs.createReadStream('address.txt'),
    output: process.stdout,
    terminal: false
});


async function getGeoCode(address){
    const params = {
        access_key: accesskey,
        query: address
      }
      var response=await axios.get('http://api.positionstack.com/v1/forward', {params});

      if(response.status!==200)
        console.log("error");
    else{
        var a=response.data;
        var geocode = {latitude: 0, longitude: 0,state:0,city:0};
        
        if(typeof a !== 'undefined' && a['data'].length !==0) {
            var lat=a['data'][0].latitude;
            var long=a['data'][0].longitude;
            var state=a['data'][0].region;
            var city=a['data'][0].name;
          
            geocode={
                latitude:lat,
                longitude:long,
                state:state,
                city:city
            };
        }
        else{
            geocode.city = await getCity(address);
        }
        return geocode;
    }
}

async function getlocality(pincode)
{
    var url="https://api.postalpincode.in/pincode/"+String(pincode);
    var response=await axios.get(url);
    if(response.status!==200)
        console.log("error");
    else{
    if(typeof response!=='undefined' && response.data.length!==0){
    var obj={locality:"",state:"", city: ""};
    obj['locality']=response['data'][0].PostOffice[0].Name;
    obj['state']=response['data'][0].PostOffice[0].State;
    obj['city'] = response['data'][0].PostOffice[0].Division;
    return obj;
    }
    }
}

SplitAddress = (address) => {
    var arr = address.split(" ");
    var lenarr = arr.length-4;
    var address1 = "";
    var address2 = "";
    for (var i=0;i<lenarr;i++){
        if(arr[i]!==","){
            if(i<lenarr/2){
                address1 += arr[i];
                if(i!==lenarr/2-1)
                    address1 += " ";
            }
            else{
                address2 += arr[i];
                if(i!==lenarr-1)
                    address2 += " ";
            }
        }
    }
    return [address1, address2];
}

getCity = (address) => {
    return -1;
}

getState = (address) => {
    var allWords = address.split(" ");
    return allWords[allWords.length-3] + ", ";
}

getPostalCode = (line) => {
    var pin = line.slice(-6);
    if(pin.includes(" ")){
        pin = line.slice(-7);
        var index = pin.indexOf(' ');
        pin = pin.slice(0,index) + pin.slice(index+1);
    }
    if(pin.includes('-')){
        pin = line.slice(-7);
        var index = pin.indexOf('-');
        pin = pin.slice(0,index) + pin.slice(index+1);
    }
    return pin;
}

getJson = async(address) => {
    geoCode = await getGeoCode(address);
    var addresses= SplitAddress(address);
    var address1 = addresses[0];
    var address2 = addresses[1];
    postalCode = await getPostalCode(address);
    //check if postal code is a number
    if(!isNaN(postalCode)){
        loc_and_state = await getlocality(postalCode);
        var locality = loc_and_state.locality;
        var state = loc_and_state.state;
    }
    var cityval = geoCode.city;
    var geocoderes = geoCode.latitude + "," + geoCode.longitude; 
    if(cityval==-1 || cityval===state || cityval.length>30)
      cityval = loc_and_state.city;
    data = {
        "addressline1": address1,
        "addressline2": address2,
        "locality": locality,
        "city": cityval,
        "state": state,
        "pincode": postalCode,
        "geocodes": geocoderes
    }
    return data; 
}

main = async() => {
    await file.on('line', async(line) => {
        allAddress.push(line);
    });
    setTimeout(myfun, 30000);
}

async function  myfun(){
    for(var i=63; i<4800; i++){
        var line = allAddress[i];
        var json = await getJson(line);
        console.log(json);
        finalres['addresses'].push(json);
        await fs.writeFile ("finalres.json", JSON.stringify(finalres), function(err) {
            if (err) throw err;
            console.log('complete');
        });
    }
}

main();