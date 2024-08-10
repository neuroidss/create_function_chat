//import ollama from 'https://cdn.jsdelivr.net/npm/ollama@0.5.6/+esm'
//import {  Ollama } from 'https://cdn.jsdelivr.net/npm/ollama@0.5.6/+esm'

//import {  Ollama } from 'https://esm.run/ollama';
//const ollama = new Ollama();

//import ollama from '/dist/browser'
import ollama from '/dist/browser.mjs'
//import ollama from '/ollama/browser'
//import { Ollama } from 'ollama'
//const { default: ollama } = require('ollama'); 

//const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })


let tools_global=[
      {
        'type': 'function',
        'function': {
          'name': 'create_function',
          'description': 'Create function',
          'parameters': {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string',
                'description': 'Function name',
              },
              'description': {
                'type': 'string',
                'description': 'Function description',
              },
              'temperature': {
                'type': 'float',
                'description': 'Function temperature',
              },
              'seed': {
                'type': 'int',
                'description': 'Function seed',
              },
            },
            'required': ['name', 'description'],
          },
        },
      },
    ];

let created_functions_global=[];

//let temperature_global = 1.0;
//let temperature_global = 0.9;
//let temperature_global = 0.8;
//let temperature_global = 0.7;
//let temperature_global = 0.6;
//let temperature_global = 0.5;
//let temperature_global = 0.4;
//let temperature_global = 0.3;
//let temperature_global = 0.2;
//let temperature_global = 0.1;
let temperature_global = 0.0;
let seed_global = 0;
let stream_global = false;

let model_global = "";

let debug = true;
//let debug = false;

//num_ctx_global = 2048;
//num_ctx_global = 4096;
let num_ctx_global = 8192;

let messages_global = [];
let chat = true;
//chat = False;

//chat_in_create_function = True;
let chat_in_create_function = false;


async function create_function(data) {
//  console.log('data: ', data);
  let name = data['name'];
  let description = data['description'];
  let temperature = temperature_global;
//  console.log('data: ', data);
  if (data.hasOwnProperty('temperature')) {
    temperature = data['temperature'];
  }
  let seed = seed_global;
  if (data.hasOwnProperty('seed')) {
    seed = data['seed'];
  }
  let messages = [];
  if(chat && chat_in_create_function){
    messages = messages_global;
  }
//  client = client_global;
  let model = model_global;

  let _function =  {
          'name': 'function_name',
          'description': 'function description',
          'parameters': {
            'type': 'object',
            'properties': {
              'first_parameter_name': {
                'type': 'string',
                'description': 'first parameter description',
              },
              'second_parameter_name': {
                'type': 'string',
                'description': 'second parameter description',
              },
            },
            'required': ['first_parameter_name', 'second_parameter_name'],
          },
      };

  messages.push({'role': 'user', 'content': 'Write javascript async function '+name+' which makes "'+description+'", gets parameters as named array and returns string type, \n then after end of python format block, in separate json format block show how to write which parameters was used to call that function if any, using example "'+JSON.stringify(_function)+'"'});
//  messages.push({'role': 'user', 'content': 'Write javascript async function '+name+' which makes "'+description+'", not use "require", gets parameters as named array and returns string type, \n then after end of python format block, in separate json format block show how to write which parameters was used to call that function if any, using example "'+JSON.stringify(_function)+'"'});
//  messages.push({'role': 'user', 'content': 'Write javascript, not typescript, async function '+name+' which makes "'+description+'", dets parameters as named array and returns string type, \n then after end of python format block, in separate json format block show how to write which parameters was used to call that function if any, using example "'+JSON.stringify(_function)+'"'});
//  messages.push({'role': 'user', 'content': 'Write javascript async function '+name+' which makes "'+description+'" and returns string type, \n then after end of python format block, in separate json format block show how to write which parameters was used to call that function if any, using example "'+JSON.stringify(_function)+'"'});
  
  // First API call: Send the query and function description to the model
  let options = {'temperature': temperature, 'seed': seed, 'num_ctx': num_ctx_global};
  let response = await ollama.chat({
    model:model,
    messages:messages,
//    tools=tools_global,
    options:options,
    stream:stream_global,
  });

  // Add the model's response to the conversation history
  messages.push(response['message']);
  if(chat){
    messages_global = messages_global + messages;
  }
  let response_message = response['message'];
  if(debug){
    console.log('response_message: ', response_message);
    console.log("response_message['content']: ", response_message['content']);
  }
  
  let created_function = "";
  let created_function_parameters = "";
  for(let response_message_content_split of response_message['content'].split("```")){
    let split_javascript = response_message_content_split.split("javascript\n");
    if(((split_javascript.length)>1) && ((split_javascript[0].length)==0) && ((created_function.length)==0)){
      created_function = split_javascript[1];
    }
    let split_json = response_message_content_split.split("json\n");
    if(((split_json.length)>1) && ((split_json[0].length)==0) && ((created_function_parameters.length)==0)){
      created_function_parameters = split_json[1];
    }
  }
  
  if(debug){
    console.log('created_function: ', created_function);
    console.log('created_function_parameters: ', created_function_parameters);
  }
  let created_function_parameters_json = JSON.parse(created_function_parameters);
  if(Array.isArray(created_function_parameters_json)){
      created_function_parameters_json = created_function_parameters_json[0];
  }
  if(debug){
    console.log('created_function_parameters_json: ', created_function_parameters_json);
  }

  if(true){
      let created_function_cut = [];
      let created_function_def_started = false;
      for(let created_function_split of created_function.split("\n")){
          if(created_function_split.substring(0,7) == 'import '){
              created_function_cut.push(created_function_split);
          } else if(created_function_split.substring(0,3) == '/**'){
              created_function_cut.push(created_function_split);
          } else if(created_function_split.substring(0,2) == ' *'){
              created_function_cut.push(created_function_split);
          } else if(created_function_split.substring(0,3) == ' */'){
              created_function_cut.push(created_function_split);
          } else if((created_function_split.length) == 0){
              created_function_cut.push(created_function_split);
          } else if(created_function_split.substring(0,15) == 'async function '){
              created_function_def_started = true;
              created_function_cut.push(created_function_split);
          } else if((created_function_split.substring(0,1) == ' ') && created_function_def_started){
              created_function_cut.push(created_function_split);
          } else if((created_function_split.substring(0,1) == '}') && created_function_def_started){
              created_function_cut.push(created_function_split);
          } else if(created_function_def_started){
              break;
          }
      }
      created_function = created_function_cut.join('\n');
      
        eval.call(null, created_function);
//      eval(created_function);
      tools_global.push(
       {
        'type': 'function',
        'function': created_function_parameters_json,
       });
  }
  created_functions_global.push(created_function);
  
  return created_function;
}

async function run(model, message){
  let messages = [];
  if(chat){
    messages = messages_global;
  }
  model_global = model;
//  client = ollama.Client();
//  client_global = ollama;
//  console.log("messages: ", messages);
  messages.push({'role': 'user', 'content': message});
  
  // First API call: Send the query and function description to the model
  let options = {'temperature': temperature_global, 'seed': seed_global, 'num_ctx': num_ctx_global};
//  console.log("run() "+model+' '+messages+' '+tools_global+' '+options);
  let response = await ollama.chat({
    model:model,
    messages:messages,
    tools:tools_global,
    options:options,
    stream:stream_global,
  });

  // Add the model's response to the conversation history
  messages.push(response['message'])

  // Check if the model decided to use the provided function
  if(! response['message']['tool_calls']){
    console.log("The model didn't use the function. Its response was:");
    console.log(response['message']['content']);
    return;
  }

  // Process function calls made by the model
// console.log("response['message']: ", response['message']);
  if(response['message']['tool_calls']){
    for(let tool of response['message']['tool_calls']){
      if(debug){
//        console.log("tool: ", tool);
        console.log("tool['function']['name']: ", tool['function']['name']);
        console.log("tool['function']['arguments']: ", tool['function']['arguments']);
      }
      let data = tool['function']['arguments'];
      let function_response = await eval(tool['function']['name'])(data);
      if(tool['function']['name'] == 'create_function'){
//        eval(function_response);
//        eval.call(null,function_response);
      }
      if(debug){
        console.log("function_response: ", function_response);
      }
      

      // Add function response to the conversation
      messages.push({'role': 'tool','content': function_response,});
    }
  }

  // Second API call: Get final response from the model
  let final_response = await ollama.chat({model:model, messages:messages, stream:stream_global});
  console.log(final_response['message']['content']);
  if(chat){
    messages_global = messages;
//    messages_global = messages_global + messages;
  }
  return messages;
//  console.log("run() end");
}  

window.onload = function () {

  //TODO: encodeURIComponent()
  const searchParams = new URLSearchParams(window.location.search);

//  if(searchParams.has('query')){
    //console.log(searchParams.get('query'));
//  }

//  for (const param of searchParams) {
//    console.log(param);
//  }

  let param_values = [];
  for (const param_value of searchParams.values()) {
    param_values.push(param_value);
  }
  function param_values_iterate() {
      let param_value = param_values.shift();
      if((param_value.length) > 0){
          console.log(">>>", param_value);
//          console.log("waiting result");
          run('mistral-nemo:12b-instruct-2407-q6_K', param_value).then(output_value => {
              output.value = JSON.stringify(output_value, null, 1);
              if(param_values.length>0){
                  param_values_iterate();
              }
          });
      }
  }
  if(param_values.length>0){
      param_values_iterate();
  }

  var div_input = document.createElement("div");
  var input = document.createElement("input");
//  input.setAttribute('type', 'text');
  var div_output = document.createElement("div");
  var output = document.createElement("textarea");
//  output.setAttribute('type', 'text');

//(()=>{
//  const console_log = window.console.log;
//  window.console.log = function(...args){
//    console_log(...args);
//    textarea = output;
//    if(!textarea) return;
//    args.forEach(arg=>textarea.value += `${JSON.stringify(arg)}\n`);
//  }
//})();

  var container = document.getElementById("container");
//  console.log("container: ", container);
  div_input.appendChild(input);
  div_output.appendChild(output);
  container.appendChild(div_input);
  input.focus();
  container.appendChild(div_output);
//  input.setAttribute('type', 'MainButton');
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      var message = event.target.value;
      console.log(">>>", message);
      input.value = "";
      if(message == "/exit"){
//          break;
      } else if((message.length) > 0){
          run('mistral-nemo:12b-instruct-2407-q6_K', message).then(output_value => {
//          run('llama3.1:8b-instruct-q8_0', message).then(output_value => {
              output.value = JSON.stringify(output_value, null, 1);
//              console.log(result);
          });
      }
//        console.log(event.target.value);
    }
  });

//  var main_btn = document.createElement("button");
//  main_btn.setAttribute('type', 'MainButton');
//  main_btn.setAttribute('id', 'main_btn');
//  container.appendChild(main_btn);
};


//var args = process.argv.slice(2);
//import sys
//if(debug){
//  console.log ('argument list:', args);
//}

//import * as readline from 'node:readline/promises';  // This uses the promise-based APIs
//import { stdin as input, stdout as output } from 'node:process';

//const rl = readline.createInterface({ input, output });

//const answer = await rl.question('What do you think of Node.js? ');

//console.log(`Thank you for your valuable feedback: ${answer}`);

//const readline = require('readline-sync');


//let argument_count = 0;
//let message = "";
//let message = "/exit";
//let message = "test";
//while(true){
//  console.log("args.length: "+args.length);
//    if(argument_count < (args.length)){
//        message = args[argument_count];
//        console.log(">>>", message);
//        argument_count = argument_count + 1;
//    } else {
//        const rl = readline.createInterface({ input, output });
//        message = await rl.question(">>> ");
//        rl.close();
//    }

//  console.log("message.length: "+message.length);
//    if(message == "/exit"){
//        break;
//    } else if((message.length) > 0){
//        await run('mistral-nemo:12b-instruct-2407-q6_K', message);
//    }
//}

