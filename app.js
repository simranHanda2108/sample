var restify = require('restify');var builder = require('botbuilder');var fs=require('fs');var util = require('util');var request = require('sync-request');


var connector = new builder.ChatConnector({    appId: '',    appPassword: ''});var bot = new builder.UniversalBot(connector);
var server = restify.createServer();server.listen(process.env.port || process.env.PORT || 3978,'localhost', function () {   console.log('%s listening to %s', server.name, server.url); });server.use(restify.acceptParser(server.acceptable));server.use(restify.jsonp());server.use(restify.bodyParser({ mapParams: false }));server.post('/api/messages', connector.listen());


bot.dialog('/', [function (session){
session.send (''+'Hello');
builder.Prompts.choice(session, 'Select the topic you are interested', "Sales Order|License Updates|Training Details");
},function (session, results) {switch (results.response.entity) {  case "Sales Order": session.replaceDialog("/so"); break; case "License Updates": session.replaceDialog("/license"); break; case "Training Details": session.replaceDialog("/training"); break; default:session.replaceDialog("/");break;}}]);
bot.dialog('/so', [function (session){
builder.Prompts.text (session, 'What is your Sales Order Number?');
},function (session, results){
session.sendTyping();
session.send (''+'Please wait... Fetching your details for Sales Order Number '+results.response);
var reswebservice_10 = request('POST', 'http://alepocbot.azurewebsites.net/service/rma/api40/order/getOrderDetails',{"headers": {"Content-Type":"application/json","Accept":"application/json"},json:{"soNumber":results.response}});var webservice_10=JSON.parse(reswebservice_10.getBody('utf8'));
session.send (''+'Status of your SO is '+webservice_10.status+' and license has been emailed to your email address.\n\nHere is the order summary');
session.send (''+'Status :  '+webservice_10.status+' \n\nShipped Date: '+webservice_10.shippedDate+' \n\nSubmitted To :  '+webservice_10.submittedToOrg+' \n\nPO :  '+webservice_10.ponumber);
builder.Prompts.choice(session, 'Do you want to check the status of another Sales Number?', "yes|no");
},function (session, results) {switch (results.response.entity) {  case "yes": session.replaceDialog("/so"); break; case "no": session.replaceDialog("/restart"); break; default:session.replaceDialog("/");break;}}]);
bot.dialog('/training', [function (session){
builder.Prompts.text (session, 'What is your training module name?');
},function (session, results){
session.sendTyping();
session.send (''+'Please wait... Fetching your details for '+results.response+' training');
var reswebservice_18 = request('GET', 'https://mktplace2-tridium.cs87.force.com/services/apexrest/myservice?name='+results.response,{"headers": {"Accept":"application/json"}});var webservice_18=JSON.parse(reswebservice_18.getBody('utf8'));
session.send (''+'Below are the schedules for '+results.response+' training');
session.send (''+'Training Name : '+webservice_18[0].Course_Name__c+' \n\nDate : '+webservice_18[0].Course_Date__c+' \n\nCourse content & enrollment : [Click here](https://mktplace2-tridium.cs87.force.com'+webservice_18[0].attributes.url+')');
builder.Prompts.choice(session, 'Do you want to check availability of another training?', "yes|no");
},function (session, results) {switch (results.response.entity) {  case "yes": session.replaceDialog("/training"); break; case "no": session.replaceDialog("/restart"); break; default:session.replaceDialog("/");break;}}]);
bot.dialog('/license', [function (session){
builder.Prompts.text (session, 'What is your license Host ID?');
},function (session, results){
session.sendTyping();
session.send (''+'Please wait... Fetching your details for Host ID '+results.response);
var reswebservice_26 = request('POST', 'http://alepocbot.azurewebsites.net/service/rma/api40/license/getLicenseDetails',{"headers": {"Accept":"application/json","Content-Type":"application/json"},json:{"hostId":results.response}});var webservice_26=JSON.parse(reswebservice_26.getBody('utf8'));
session.send (''+'Is is '+webservice_26.nics+' NIC\n\nBelow are further details');
session.send (''+'Model : '+webservice_26.model+' \n\nBrand : '+webservice_26.brand+' \n\nSerial No : '+webservice_26.serialno+' \n\nOwner : '+webservice_26.owner+' \n\nNICS : '+webservice_26.nics+' \n\nExpiration : '+webservice_26.expiration);
builder.Prompts.choice(session, 'Do you want to check for another license?', "yes|no");
},function (session, results) {switch (results.response.entity) {  case "yes": session.replaceDialog("/license"); break; case "no": session.replaceDialog("/restart"); break; default:session.replaceDialog("/");break;}}]);
bot.dialog('/restart', [function (session){
builder.Prompts.choice(session, 'Do you need any other assistance?', "yes|no");
},function (session, results) {switch (results.response.entity) {  case "yes": session.replaceDialog("/"); break; case "no": session.replaceDialog("/end"); break; default:session.replaceDialog("/");break;}}]);
bot.dialog('/end', [function (session){
session.send (''+'Have a nice time!!!');
session.endConversation();
}]);
