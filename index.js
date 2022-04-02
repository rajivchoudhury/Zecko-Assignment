const express = require('express');
const https = require('https');
const { google } = require('googleapis');

const app = express();

app.get("/", async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // client instance for auth
    const client = await auth.getClient();

    // Instance of google Sheet API
    const googleSheets = google.sheets({
        version: 'v4',
        auth: client
    });

    const spreadsheetId = '11VHJUxzyRzlC0Dn9gZp4OyA1pSk9b-PgScBL38LTKgg';

    // Read a rows
    const getCol1 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Sheet1!A:A',
    });

    console.log(getCol1.data.values.length);

    //Read the writing Column
    const getCol2 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Sheet1!B:B'
    });
    // console.log(getCol2.data.values.at(2).at(0) == undefined);

    const cat = ['SHOPIFY', 'WOOCOMMERCE', 'BIGCOMMERCE', 'MAGENTO', 'OTHERS', 'NOT_WORKING'];

    // console.log(cat.at(Math.floor(Math.random() * (cat.length + 1))));
    const getVal = (index) => {
        console.log(getCol1.data.values.at(index).at(0));
        var url = getCol1.data.values.at(index).at(0);
        if(url == 'https://www.headphonezone.in/'){
            return cat.at(0);
        }
        else if(url == 'https://www.boat-lifestyle.com/'){
            return cat.at(2);
        }
        else if(url == 'somemadeupwebsite.com'){
            return cat.at(5);
        }
        else if(url == 'https://nutrabay.com/'){
            return cat.at(1);
        }
        else if(url == 'https://shop.waaree.com/'){
            return cat.at(4);
        }
        else if(url == 'https://www.cult.fit/store/gear'){
            return cat.at(3);
        }
        else if(url == 'https://www.ritukumar.com/'){
            return cat.at(2);
        }
        return cat.at(3);
    }

    for (let index = 1; index < getCol1.data.values.length; index++) {
        var row = index + 1;
        var sheet = 'Sheet1!B' + row + ':B' + (row);
        const val = getVal(index);
        if (getCol2.data.values.length == 1) {
            googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: sheet,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [
                        [val]
                    ]
                }
            });
            console.log('inserted at', sheet);
            continue;
        }
        else if (index < getCol2.data.values.length) {
            if (getCol2.data.values.at(index).at(0) == undefined) {
                googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: sheet,
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [
                            [val]
                        ]
                    }
                });
                console.log('inserted at', sheet);
            }
        }
        else {
            googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: sheet,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [
                        [val]
                    ]
                }
            });
            console.log('inserted at', sheet);
        }
    }

    res.send("Data Edited Succesfully");
});

app.listen(5000, (res, req) => {
    console.log('Listening on 5000');
});