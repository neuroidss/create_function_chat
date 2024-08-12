# create_function_chat

python create_function_chat.py "call Create function with description 'import ollama; client=ollama.Client(); client.chat(model=model, messages=messages,); return response as json string'" "call Create function with description 'create new directory provided as parameter and in this directory overwrite new index.html file with content provided as parameter'" \ "call ollama chat model='mistral-nemo:12b-instruct-2407-q6_K', 'Create Snake game in HTML, CSS, JS, in single file.'" "call write new index.html file with content from html block of llm response in new directory './Snake" "call Create function with description 'Starts a http.server from the specified directory, Access-Control-Allow-Origin: *'" "start http server from / 8080"

![play snake game](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-12%2010-42-29.png)

-----

[http://127.0.0.1:8080/?query=call create function with seed 2, temperature 0.2, description 'in existing div element with id output, create implementation of game snake'&query=call game snake](http://127.0.0.1:8080/?query0=call%20create%20function%20with%20seed%202,%20temperature%200.2,%20description%20%27in%20existing%20div%20element%20with%20id%20output,%20create%20implementation%20of%20game%20snake%27&query0=call%20game%20snake)

![game snake](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-10%2011-55-43.png)

-----

node create_function_chat.js "call Create function described as Search for articles on arxiv by default 2 maximum results start from 0" "call Create function described as Send a message using the Telegram Bot API, using token and chat_id." 'call Create function with description "Via telegram web api read last message id, using token and chat_id"' 'call Create function with description "Via telegram web api read messages every second until message id will be different that provided as parameter, using token and chat_id, return json string"' 'send telegram bot message "which science articles to search?" via web api, token=<YOUR_TOKEN>, chat_id=<YOUR_CHAT_ID>' 'read last message id via telegram web api' 'then use that last message id to get new message' 'search 2 articles on arxiv about what user sent in last message' 'send telegram bot message about these 2 last articles via web api'

![search 2 articles on arxiv as request to telegram bot](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-07%2023-27-15.png)

-----

python create_function_chat.py "call Create function described as Search for articles on arxiv" "call Create function described as Send a message using the Telegram Bot API." 'call Create function with description "Via telegram web api read last message id, using token and chat_id, do not use telegram library"' 'call Create function with description "Via telegram web api read messages every second until message id will be different that provided as parameter, using token and chat_id, do not use telegram library, return json string"' 'send telegram bot message "which science articles to search?" via web api, token=<YOUR_TOKEN>, chat_id=<YOUR_CHAT_ID>' 'read last message id' 'then use that last message id to get new message' 'search 2 articles on arxiv about what user sent in last message' 'send telegram bot message Summary about these 2 last articles via web api'

![search 2 articles on arxiv as request to telegram bot](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-06%2018-52-48.png)

-----

python create_function_chat.py "Create function to search on arxiv via api" "search in arxiv 'increase working memory using EEG'" "/exit"

![search in arxiv 'increase working memory using EEG'](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-02%2009-24-25.png)

-----

python create_function_chat.py "Create function to search on usb via lsusb" "search usb devices" "/exit"

![search usb devices](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-02%2009-25-14.png)

-----

python create_function_chat.py 'Create function with description: read some FreeEEG32 data via brainflow from brainflow.board_shim import BoardShim, BrainFlowInputParams, BoardIds params=BrainFlowInputParams() params.serial_port="/dev/ttyUSB0" board=BoardShim(BoardIds.FREEEEG32_BOARD,params) board.prepare_session() board.start_stream() time.sleep(10)' 'read FreeEEG32 data /dev/ttyUSB0'

![read some FreeEEG32 data via brainflow](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-02%2012-18-40.png)

-----

python create_function_chat.py "Create function named write_created_functions_global_json and described: 'Writes the content of existed global variable created_functions_global into a JSON file named created_functions_global.json." "Create function named read_created_functions_global_json and described: 'Reads the content to existed global variable created_functions_global from a JSON file named created_functions_global.json. exec with globals() all created_functions_global array elements as python code.'" "Create function named write_tools_global_json and described: 'Writes the content of the global variable 'tools_global' into a JSON file named 'tools_global.json'." "Create function named read_tools_global_from_json and described: 'Reads the content of a JSON file named 'tools_global.json' into the global variable 'tools_global'.'" 'write tools_global json' 'read json tools_global json' 'write created_functions_global json' 'read json created_functions_global json'

![write and read tools and created_functions json'](https://github.com/neuroidss/create_function_chat/blob/main/Screenshot%20from%202024-08-03%2015-12-01.png)
