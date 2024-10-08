# create_function_chat

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/neuroidss/create_function_chat/blob/main/create_function_chat.ipynb)

-----
```
python create_function_chat.py \
"call Create function with description=\"with setup_string as parameter do following, import json; import skip; setup = json.loads(setup_string);  sch=skip.Schematic(setup['schematic_in']); for symbol in setup['symbols']:;    sch_symbol=sch.symbol.reference_matches(symbol['symbol_to_clone'])[0].clone();    sch_symbol.setAllReferences(symbol['reference']);    sch_symbol.move([sch_symbol.at.value[0]+symbol['clone_move'][0], sch_symbol.at.value[1]+symbol['clone_move'][1]], sch_symbol.at.value[2]+symbol['clone_move'][2]); sch_symbol.property.Footprint.setValue(symbol['footprint']); for label_count, label in enumerate(symbol['labels']):;    sch_label=sch.label.new();    sch_label.value=label;    sch_label.move(sch_symbol.pin[symbol['pin_prefix']+str(label_count+1)].location.value); sch.write(setup['schematic_out'])\" name='create_symbols_from_json_string' use_cache=true" \
"call Create function with description='load json from json_file_name, and then output as json string without whitespaces' name='read_json_file' use_cache=true" \
'call read_json_file with json_file_name="09.json" as json with minimum indents, not cut json content' \
'call create_symbols_from_json_string with response json content as setup_string json string with single space indent, double check that you use correct number and order of brackets in json' \
"call Create function with description=\"with kicad_sch_filename, net_filename, kicad_pcb_filename as parameters do in shell following, 'kicad-cli sch export netlist kicad_sch_filename --output net_filename', set environment variable KICAD7_FOOTPRINT_DIR=/usr/share/kicad/footprints/, 'kinet2pcb -i net_filename --output kicad_pcb_filename'\" name='kicad_sch_to_net_to_pcb' use_cache=true" \
"call kicad_sch_to_net_to_pcb with kicad_sch_filename=09_out/09_out.kicad_sch, net_filename=09_out/09_out.net, kicad_pcb_filename=09_out/09_out.kicad_pcb"
```
![made schematics and added components to board in kicad](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-09-03%2010-36-57.png)
[![made schematics and added components to board in kicad](https://img.youtube.com/vi/zwM2IGk3sNg/0.jpg)](https://www.youtube.com/watch?v=zwM2IGk3sNg)
```
from create_function_kicad import *; model='mistral-nemo:12b-instruct-2407-q6_K'; message="call Create function with description=\"with setup_string as parameter do following, import json; setup = json.loads(setup_string); import sys; sys.path.append('git/kicad-python/'); from kicad.pcbnew.board import Board; import pcbnew; pcb=Board.from_editor(); for symbol in setup['symbols']:;    footprint=pcb.footprints[symbol['reference']];  footprint.x=symbol['footprint_move'][0];  footprint.y=symbol['footprint_move'][1];  footprint.rotation = symbol['footprint_move'][2]; for pcb_edge_cut in setup['pcb_edge_cuts']:    if 'add_circle' in pcb_edge_cut:         pcb.add_circle((pcb_edge_cut['add_circle'][0][0],pcb_edge_cut['add_circle'][0][1]),pcb_edge_cut['add_circle'][1],'Edge.Cuts');  for ref in setup['remove_refs']:    pcb.remove(pcb.footprints[ref]); pcbnew.Refresh(); pcb.save(); for plugin in setup['KICAD_PLUGINS']:    if plugin=='app_freerouting_kicad-plugin':        pcbnew.KICAD_PLUGINS[plugin]['ModuleName'].plugin.FreeroutingPlugin().Run(); else:        pcbnew.KICAD_PLUGINS[plugin]['ModuleName'].plugin.Run();\" name='setup_pcb_from_string' use_cache=true"; run(model, message); message="call Create function with description='load json from json_file_name, and then output as json string without whitespaces' name='read_json_file' use_cache=true"; run(model, message); message='call read_json_file with json_file_name="09_out.json" as json with minimum indents, not cut json content'; run(model, message); message='call setup_pcb_from_string with response json content as params_string json string with single space indent, double check that you use correct number and order of brackets in json'; run(model, message);
```
![placed components, routed board in kicad and sent to PCBWay](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-09-03%2010-42-06.png)
[![placed components, routed board in kicad and sent to PCBWay](https://img.youtube.com/vi/gN0P96MXh-8/0.jpg)](https://www.youtube.com/watch?v=gN0P96MXh-8)
-----
```
python create_function_chat.py \
"call Create function with description='read timeflux yaml_file, output content as json string without whitespaces' name='read_timeflux_yaml_as_json' use_cache=true" \
"call Create function with description='parse response_json string content, and write as timeflux json_file as json with single indent' name='write_timeflux_json' use_cache=true" \
"call Create function with description='in venv path as parameter start bin/python -m timeflux json_file, and use Popen and stdout.readline to stream its output to console' name='start_timeflux_json' use_cache=true" \
"call Create function with description='import ollama; read bioarxiv neuroscience rss from url=https://connect.biorxiv.org/biorxiv_xml.php?subject=neuroscience, output feed items to chromadb using client.get_or_create_collection name=bioarxiv_neuroscience_rss and without metadata, use template collection.add(ids=[extract link value between last / and ?], documents=[title plus new line plus summary], embedding = ollama.embeddings(model=\"nomic-embed-text\", prompt=title_summary)[\"embedding\"]); output data = \"\\n\".join(collection.query(query_embeddings=[ollama.embeddings(prompt=prompt,model=\"nomic-embed-text\")[\"embedding\"]],n_results=n_results)[\"documents\"][0]), with prompt and n_results as parameters' name='read_biorxiv_neuroscience_rss_to_chromadb_and_search' use_cache=true" \
'call read biorxiv neuroscience rss to chromadb and search with prompt="increase working memory using EEG neurofeedback", n_results=5, and then choose from these articles only one, which most useable for increase working memory using EEG below 40 Hz neurofeedback and return propose which EEG channels locations used in article to use later in LocQuery params key and which band with exact EEG frequencies used in article to use later in IIRFilter bandpass, skip ideas if they are not directly for increase working memory using EEG below 40 Hz' \
"read timeflux examples/timeflux_brainflow_freeeeg32_ttyUSB0_filter.yaml as json with single indent" \
"call write_timeflux_json json content as response_json and examples/timeflux_brainflow_freeeeg32_ttyUSB0_filter_test.json as output_file, with single indent, replace LocQuery params key to channels proposed in arxiv article analysis but leave acquire params channels as is, replace IIRFilter frequencies to bandpass proposed in biorxiv article analysis, double check that you use correct number and order of brackets in json, no version number, no empty edges" \
"in venv_path='venv' start timeflux examples/timeflux_brainflow_freeeeg32_ttyUSB0_filter_test.json"
```
![rag search in bioarxiv feed 'increase working memory using EEG neurofeedback' yaml to json to timeflux](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-26%2023-23-44.png)

-----
```
python create_function_chat.py \
"call Create function with description='read timeflux yaml_file, output content as json string without whitespaces' name='read_timeflux_yaml_as_json' use_cache=true" \
"call Create function with description='parse response_json string content, and write as timeflux json_file as json with single indent' name='write_timeflux_json' use_cache=true" \
"call Create function with description='in venv path as parameter start bin/python -m timeflux json_file, and use Popen and stdout.readline to stream its output to console' name='start_timeflux_json' use_cache=true" \
"call Create function 'description':'Search for articles on arxiv via api, use parameters search_query=, start=0, max_results=10', 'name':'search_arxiv_articles', use_cache=true" \
"search on arxiv about 'increase working memory using EEG neurofeedback' max_results=1 start=7, also propose which channels locations used in this article to use later in LocQuery params key and which band with exact frequencies used in this article to use later in IIRFilter bandpass" \
"read timeflux examples/timeflux_brainflow_freeeeg32_ttyUSB0_filter.yaml as json with single indent" \
"write response_json content as timeflux examples/timeflux_brainflow_freeeeg32_ttyUSB0_filter_test.json with single indent, replace LocQuery params key to channels proposed in arxiv article analysis but leave acquire params channels as is, replace IIRFilter frequencies to bandpass proposed in arxiv article analysis, double check that you use correct number and order of brackets in json, no version number" \
"in venv_path='venv' start timeflux examples/timeflux_brainflow_freeeeg32_ttyUSB0_filter_test.json"
```
![search in arxiv 'increase working memory using EEG neurofeedback' yaml to json to timeflux](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-19%2000-20-01.png)

-----
```
python create_function_chat.py \
"call Create function with description='read timeflux yaml_file, output content as json string without whitespaces' name='read_timeflux_yaml' use_cache=true" \
"call Create function with description='parse response_json string content, and write as timeflux json_file as json with indents' name='write_timeflux_json' use_cache=true" \
"call Create function with description='in venv path as parameter start bin/python -m timeflux json_file, and use Popen and stdout.readline to stream its output to console' name='start_timeflux_json' use_cache=true" \
"read timeflux examples/timeflux_brainflow_freeeeg32_beta_ttyUSB0_cut2.yaml" \
"write response_json content as timeflux examples/timeflux_brainflow_freeeeg32_beta_ttyUSB0_cut2_test.json, check correct number of brackets" \
"in venv_path='venv' start timeflux examples/timeflux_brainflow_freeeeg32_beta_ttyUSB0_cut2_test.json"
```
![yaml to json to timeflux](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-17%2019-39-46.png)

-----
```
python create_function_chat.py \
"call Create function with description 'import ollama; client=ollama.Client(); client.chat(model=model, messages=messages,); return response as json string'" \
"call Create function with description 'create new directory provided as parameter and in this directory overwrite new index.html file with content provided as parameter'" \
"call ollama chat model='mistral-nemo:12b-instruct-2407-q6_K', 'Create Snake game in HTML, CSS, JS, in single file.'" \
"call write new index.html file with content from html block of llm response in new directory './Snake'"

python create_function_chat.py \
"call Create function with description 'Starts a http.server from the specified directory and port, Access-Control-Allow-Origin: *'" \
"start http server from ./ 8080"
```
![play snake game](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screencast%20from%2008-12-2024%2012-08-58%20PM.gif)

-----
```
http://127.0.0.1:8080/?query=call create function with seed 2, temperature 0.2, description 'in existing div element with id output, create implementation of game snake'&query=call game snake
```
[http://127.0.0.1:8080/?query=call create function with seed 2, temperature 0.2, description 'in existing div element with id output, create implementation of game snake'&query=call game snake](http://127.0.0.1:8080/?query0=call%20create%20function%20with%20seed%202,%20temperature%200.2,%20description%20%27in%20existing%20div%20element%20with%20id%20output,%20create%20implementation%20of%20game%20snake%27&query0=call%20game%20snake)
![game snake](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-10%2011-55-43.png)

-----
```
node create_function_chat.js \
"call Create function described as Search for articles on arxiv by default 2 maximum results start from 0" \
"call Create function described as Send a message using the Telegram Bot API, using token and chat_id." \
'call Create function with description "Via telegram web api read last message id, using token and chat_id"' \
'call Create function with description "Via telegram web api read messages every second until message id will be different that provided as parameter, using token and chat_id, return json string"' \
'send telegram bot message "which science articles to search?" via web api, token=<YOUR_TOKEN>, chat_id=<YOUR_CHAT_ID>' \
'read last message id via telegram web api' 'then use that last message id to get new message' \
'search 2 articles on arxiv about what user sent in last message' \
'send telegram bot message about these 2 last articles via web api'
```
![search 2 articles on arxiv as request to telegram bot](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-07%2023-27-15.png)

-----
```
python create_function_chat.py \
"call Create function described as Search for articles on arxiv" \
"call Create function described as Send a message using the Telegram Bot API." \
'call Create function with description "Via telegram web api read last message id, using token and chat_id, do not use telegram library"' \
'call Create function with description "Via telegram web api read messages every second until message id will be different that provided as parameter, using token and chat_id, do not use telegram library, return json string"' \
'send telegram bot message "which science articles to search?" via web api, token=<YOUR_TOKEN>, chat_id=<YOUR_CHAT_ID>' \
'read last message id' 'then use that last message id to get new message' 'search 2 articles on arxiv about what user sent in last message' \
'send telegram bot message Summary about these 2 last articles via web api'
```
![search 2 articles on arxiv as request to telegram bot](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-06%2018-52-48.png)

-----
```
python create_function_chat.py \
"Create function to search on arxiv via api" \
"search in arxiv 'increase working memory using EEG'" \
"/exit"
```
![search in arxiv 'increase working memory using EEG'](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-02%2009-24-25.png)

-----
```
python create_function_chat.py \
"call create_function with name='search_usb_devices' description='search connected usb devices via lsusb'" \
"call search usb devices" \
"/exit"
```
![search usb devices](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-02%2009-25-14.png)

-----
```
python create_function_chat.py \
'Create function with description: read some FreeEEG32 data via brainflow from brainflow.board_shim import BoardShim, BrainFlowInputParams, BoardIds params=BrainFlowInputParams() params.serial_port="/dev/ttyUSB0" board=BoardShim(BoardIds.FREEEEG32_BOARD,params) board.prepare_session() board.start_stream() time.sleep(10)' \
'read FreeEEG32 data /dev/ttyUSB0'
```
![read some FreeEEG32 data via brainflow](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-02%2012-18-40.png)

-----
```
python create_function_chat.py \
"Create function named write_created_functions_global_json and described: 'Writes the content of existed global variable created_functions_global into a JSON file named created_functions_global.json." \
"Create function named read_created_functions_global_json and described: 'Reads the content to existed global variable created_functions_global from a JSON file named created_functions_global.json. exec with globals() all created_functions_global array elements as python code.'" \
"Create function named write_tools_global_json and described: 'Writes the content of the global variable 'tools_global' into a JSON file named 'tools_global.json'." \
"Create function named read_tools_global_from_json and described: 'Reads the content of a JSON file named 'tools_global.json' into the global variable 'tools_global'.'" \
'write tools_global json' \
'read json tools_global json' \
'write created_functions_global json' \
'read json created_functions_global json'
```
![write and read tools and created_functions json'](https://github.com/neuroidss/create_function_chat/blob/main/Screenshots/Screenshot%20from%202024-08-03%2015-12-01.png)
