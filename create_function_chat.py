import json
import ollama
#import asyncio

tools_global=[
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
            },
            'required': ['name', 'description'],
          },
        },
      },
    ]

created_functions_global=[]

temperature_global = 0.0
seed_global = 0

#debug = True
debug = False

#num_ctx_global = 2048
#num_ctx_global = 4096
num_ctx_global = 8192

messages_global = []
chat = True
#chat = False

#chat_in_create_function = True
chat_in_create_function = False


# Simulates an API call to get flight times
# In a real application, this would fetch data from a live database or API
#async def create_function(name: str, description: str) -> str:
#async def create_function(**data) -> str:
def create_function(**data) -> str:
  name = data['name']
  description = data['description']
  global client_global
  global model_global
  global messages_global
  messages = []
  if chat and chat_in_create_function:
    messages = messages_global
  client = client_global
  model = model_global
#  messages = [{'role': 'user', 'content': 'Write python async function '+name+' which makes: "'+description+'", and next write in json format which parameters was used to call that function if any. '}]

  function =  {
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
      },

#  messages = [{'role': 'user', 'content': 'Write just python async function '+name+' which makes: "'+description+'", function must return string type, and next write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'}]
#  messages = [{'role': 'user', 'content': 'Write just python async function '+name+' which makes: "'+description+'", and next write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'}]
#  messages = [{'role': 'user', 'content': 'Write just python async function '+name+' which makes: "'+description+'", function must return string type, and next write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'}]
#  messages = [{'role': 'user', 'content': 'Write, without main and loop, just python async function '+name+' which makes: "'+description+'", and next write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'}]
#  messages = [{'role': 'user', 'content': 'Write, without main and loop, python async function '+name+' which makes: "'+description+'", and write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'}]

#  messages = [{'role': 'user', 'content': 'Write, without main and loop, returning string type, python async function '+name+' which makes: "'+description+'", and write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'}]
  
#  messages_global.append({'role': 'user', 'content': 'Write, without main and loop, returning string type, python async function '+name+' which makes: "'+description+'", and write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'})

#  messages_global.append({'role': 'user', 'content': 'Write, without main, with required imports, returning string type, python function '+name+' which makes: "'+description+'", and write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'})

#  messages_global.append({'role': 'user', 'content': 'Write, returning string type, python function '+name+' which makes: "'+description+'", and write in json format which parameters was used to call that function if any, like this example: "'+json.dumps(function)+'"'})

#  messages_global.append({'role': 'user', 'content': 'Write, returning string type, python function '+name+' which makes: "'+description+'", and write which parameters was used to call that function if any, using example: "'+json.dumps(function)+'"'})

#  messages.append({'role': 'user', 'content': 'Write python function '+name+' which makes "'+description+'" and returns string type, \n next in separate json format block show how to write which parameters was used to call that function if any, using example "'+json.dumps(function)+'"'})
  messages.append({'role': 'user', 'content': 'Write python function '+name+' which makes "'+description+'" and returns string type, \n then after end of python format block, in separate json format block show how to write which parameters was used to call that function if any, using example "'+json.dumps(function)+'"'})
#  messages.append({'role': 'user', 'content': 'Write python function '+name+' which makes: "'+description+'" and returns json, and write which parameters was used to call that function if any using example: "'+json.dumps(function)+'"'})
#  messages.append({'role': 'user', 'content': 'Write python function '+name+' which makes: "'+description+'" and returns string type, and write which parameters was used to call that function if any using example: "'+json.dumps(function)+'"'})
  
  # First API call: Send the query and function description to the model
  global tools_global
#  print('tools_global: ', tools_global)
  global temperature_global
  global seed_global
  global num_ctx_global
  options = {'temperature': temperature_global, 'seed': seed_global, 'num_ctx': num_ctx_global}
#  response = await client.chat(
  response = client.chat(
    model=model,
#    messages=messages_global,
    messages=messages,
#    tools=tools_global,
    options=options,
  )

  # Add the model's response to the conversation history
  messages.append(response['message'])
#  messages_global.append(response['message'])
  if chat:
    messages_global = messages_global + messages
  response_message = response['message']
  if debug:
    print('response_message: ', response_message)
    print("response_message['content']: ", response_message['content'])
  
#  print('split: ', response_message['content'].split("```"))
  created_function = ""
  created_function_parameters = ""
  for response_message_content_split in response_message['content'].split("```"):
    split_python = response_message_content_split.split("python\n")
#    print("split_python: ", split_python)
    if len(split_python)>1 and len(split_python[0])==0 and len(created_function)==0:
      created_function = split_python[1]
    split_json = response_message_content_split.split("json\n")
#    print("split_json: ", split_json)
    if len(split_json)>1 and len(split_json[0])==0 and len(created_function_parameters)==0:
      created_function_parameters = split_json[1]
  
#  created_function = response_message['content'].split("```")[1].split("python")[1]

#  created_function_parameters = response_message['content'].split("```")[3].split("json")[1]
  
#  print('split: ', response_message['content'].split("```"))
  
  if debug:
    print('created_function: ', created_function)
    print('created_function_parameters: ', created_function_parameters)
  created_function_parameters_json = json.loads(created_function_parameters)
  if isinstance(created_function_parameters_json, (list, tuple)):
      created_function_parameters_json = created_function_parameters_json[0]
  if debug:
    print('created_function_parameters_json: ', created_function_parameters_json)
#  indent = '    '
#  created_function = created_function.replace('\n', '\n' + indent)
#  created_function = "async def "+name+"(**data) -> str:" + created_function

  if True:
#      print('created_function: ', created_function)
      created_function_cut = []
      created_function_def_started = False
      for created_function_split in created_function.split("\n"):
          if created_function_split[0:7] == 'import ':
              created_function_cut.append(created_function_split)
          elif created_function_split[0:5] == 'from ':
              created_function_cut.append(created_function_split)
          elif created_function_split[0:1] == '#':
              created_function_cut.append(created_function_split)
          elif len(created_function_split) == 0:
              created_function_cut.append(created_function_split)
          elif created_function_split[0:4] == 'def ':
              created_function_def_started = True
              created_function_cut.append(created_function_split)
          elif (created_function_split[0:1] == ' ') and created_function_def_started:
              created_function_cut.append(created_function_split)
          elif created_function_def_started:
              break
      created_function = '\n'.join(created_function_cut)
      
      exec(created_function, globals())
#      global tools_global
      tools_global.append(
       {
        'type': 'function',
        'function': created_function_parameters_json,
       })
  global created_functions_global
#  created_functions_global.append(created_function)
  created_functions_global.append(created_function)
  
  return created_function


#async def run(model: str, message: str):
def run(model: str, message: str):
  global client_global
  global model_global
  global messages_global
  messages = []
  if chat:
    messages = messages_global
  model_global = model
#  client = ollama.AsyncClient()
  client = ollama.Client()
  client_global = client
  # Initialize conversation with a user query
#  messages = [{'role': 'user', 'content': message}]
#  messages_global.append({'role': 'user', 'content': message})
  messages.append({'role': 'user', 'content': message})
  
#  messages = [{'role': 'user', 'content': 'Create function named print_hello_world (print_hello_world) described as (print hello world)'}]

  # First API call: Send the query and function description to the model
  global tools_global
  global temperature_global
  global seed_global
  global num_ctx_global
  options = {'temperature': temperature_global, 'seed': seed_global, 'num_ctx': num_ctx_global}
#  response = await client.chat(
  response = client.chat(
    model=model,
#    messages=messages_global,
    messages=messages,
    tools=tools_global,
    options=options,
  )

  # Add the model's response to the conversation history
#  messages_global.append(response['message'])
  messages.append(response['message'])

  # Check if the model decided to use the provided function
  if not response['message'].get('tool_calls'):
    print("The model didn't use the function. Its response was:")
    print(response['message']['content'])
    return

  # Process function calls made by the model
  if response['message'].get('tool_calls'):
#    available_functions = {
#      'create_function': create_function,
#    }
    for tool in response['message']['tool_calls']:
#      function_to_call = available_functions[tool['function']['name']]
      if debug:
        print("tool['function']['name']: ", tool['function']['name'])
#        print("type(tool['function']['arguments']): ", type(tool['function']['arguments']))
        print("tool['function']['arguments']: ", tool['function']['arguments'])
      data = tool['function']['arguments']
#      function_response = await globals()[tool['function']['name']](**data)
      function_response = globals()[tool['function']['name']](**data)
      if debug:
        print("function_response: ", function_response)
#      function_response = await globals()[tool['function']['name']](**tool['function']['arguments']['name'])
#      function_response = await globals()[tool['function']['name']](tool['function']['arguments']['name'], tool['function']['arguments']['description'])
#      function_response = await function_to_call(tool['function']['arguments']['name'], tool['function']['arguments']['description'])
      

      # Add function response to the conversation
#      messages_global.append({'role': 'tool','content': function_response,})
      messages.append({'role': 'tool','content': function_response,})

#  if tool['function']['name'] == 'add_two_numbers':
#    await add_two_numbers(**data)
  # Second API call: Get final response from the model
#  final_response = await client.chat(model=model, messages=messages)
#  final_response = await client.chat(model=model, messages=messages_global)
#  final_response = client.chat(model=model, messages=messages_global)
  final_response = client.chat(model=model, messages=messages)
  print(final_response['message']['content'])
  if chat:
    messages_global = messages_global + messages
  
#  print('running created function:')
#  await print_hello_world()

# Run the async function
#asyncio.run(run('llama3.1'))

import sys
if debug:
  print ('argument list:', sys.argv)
#for argument_message in sys.argv[1:]:
#    print(">>> ", argument_message)
#    asyncio.run(run('mistral-nemo', argument_message))

argument_count = 1
while True:
    if argument_count < len(sys.argv):
        message = sys.argv[argument_count]
        print(">>>", message)
        argument_count = argument_count + 1
    else:
        message = input(">>> ")

    if message == "/exit":
        break
    elif len(message) > 0:
#        asyncio.run(run('llama3.1', message))
#        asyncio.run(run('llama3.1:8b-instruct-q8_0', message))
#        asyncio.run(run('mistral-nemo', message))
#        asyncio.run(run('mistral-nemo:12b-instruct-2407-q6_K', message))
        run('mistral-nemo:12b-instruct-2407-q6_K', message)
#        run('mistral-nemo', message)
#        run('llama3.1', message)
#        run('llama3.1:8b-instruct-q8_0', message)
#        run('mistral', message)
#        run('llama3-groq-tool-use', message)

