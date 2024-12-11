# pluto_tv_scraper
This will generate an m3u8 playlist and xmltv file for pluto TV.

## Supported node versions
Only node 16 and above is supported. This script may run with other versions, but it may not.

## Docker support
If you'd like to use this within a docker image, head over to David Claeys' repo here: https://git.claeyscloud.com/david/pluto_tv_scraper-docker

## Configuring
configuration is read from config.json in the current working directory

#### the output directory
edit the config.json file to provide an output directory for the m3u8 and xml file
#### the client ID
edit the config.json file and provide a new (unique) UUID. If not provided, a random UUID will be generated automatically.
#### the regional mapping
edit the config.json file and provide a region key and a geo located IP address to automatically generate an m3u8 and xml file for that region

## Building
Note: before running `npm install` you need to `cd` to the `pluto_tv_scraper` directory (the directory with this `README.md` file in it.
```
npm install
```

## Installation from npmjs
```
npm install -g plutotv-scraper
```

## Docker support
If you'd like to use this within a docker image, head over to David Claeys' repo here: https://git.claeyscloud.com/david/pluto_tv_scraper-docker

## Installation from source
Note: before running `npm install -g .` you need to `cd` to the `pluto_tv_scraper` directory (the directory with this `README.md` file in it.
This can be installed globally using the following command:
```
npm install -g .
```
Installing will create a command called `plutotv-scraper` that can be executed on the command line.
Note: take notice of the final `.` (indicating to npm to globall install the current package, and not globally install the dependencies)

## Running
Note: before running `node ./index.js` you need to `cd` to the `pluto_tv_scraper` directory (the directory with this `README.md` file in it.
```
node ./index.js
```

OR running globally
Note: if installed globally, there's no need to `cd` to the `pluto_tv_scraper` directory. As long as your system (npm) is set up correctly, the `plutotv-scraper` command will be found within the `PATH`
```
plutotv-scraper --help
```
### Commandline options:
```
  Options:
    --config <configfile>      : Provide the location to the configuration file
    --mapping <region,IP>      : Provide a region and IP address to process instead of the mapping
    --outdir <outdir>          : Provide the destination directory
    --clientid <clientid>      : Provide a client id
    --all                      : Merge all regions into a single playlist and epg
    --chno <num>               : Start channel numbering at the provided value, spans all regions
    --group [genre|country]    : Specify the grouping within the playlist (default is "genre")
    --regionalize              : Append the country code to the channel id
    --exclude-groups <regex>   : Exclude the groups that match the regular expression
    --exclude-channels <regex> : Exclude the channels that match the regular expression
    --port <num>               : Start a small web server to serve the generated files
    --refresh <seconds>        : Automatically refetch the files at the provided interval
    --unique-clientid          : Generate a unique id for each client requesting the playlist via
                                 the inbuilt server
    --random-clientid          : Generate a random id for each request of the playlist via the
                                 inbuilt server
    --x-tvg-url <url>          : Specify a custom x-tvg-url value in the EXTM3U header
    --ondemand                 : Generate a playlist and xml for ondemand movies
    --vlcopts                  : Includes the VLCOPTS m3u8 entries
    --pipeopts                 : Includes the piped headers in the m3u8 urls

    --help                     : Display this help
```

Note:
- if the url provided to `--x-tvg-url` ends with a `/`, the corresponding xml filename will be appended.
- the first run to capture the ondemand data is slow, the data is cached so subsequent runs are quicker. We don't want to DoS pluto TV, nor do we want to be detected.
- vlcopts will add referrer and user agent EXTVLCOPTS
- pipeopts will add x-forwarded-for and user agent headers in the stream urls
- if both vlcopts and pipeopts is provided, only vlcopts is used

## Serving up the files
There is now a feature where the generate files can be served up using a built in web server. The web server mode is invoked by providing the `--port <num>` commandline option. Note that in this mode, the files are not generated.

This mode will continue to read the config.json from the current working directory, unless the `--config` option is provided.

If the command to generate the files utilises the `--config` option, it is wise to also include it when launching in server mode. eg:

If the scripts are generated with:
```
node ./index.js --config /some/config.json
```
The server mode should be invoked with:
```
node ./index.js --config /some/config.json --port 8080
```

### More options for server mode
The server mode can do two other things:
- The first is the `--unique-clientid` option to generate a new clientID (based on the callers IP address) to ensure multiple clients have different client IDs.
- The second is the `--refresh <seconds>` option, which will refecth the playlists and xml files the files at (at least) one hour intervals

### Regular expression exclusions of groups
The `--exclude-groups` option utilizes regular expression matching to determine what groups should be excluded. Some examples of regular expressions:

`Note: do take note of the single quotes, they're required to ensure the shell does not do any expansion of wildcards`

#### Excluding a single group (exact matching)
```
--exclude-groups "^Local News$"
```
This regular expression will remove all the channels that are in the group 'Local News'.

#### Excluding all groups with a word in it (partial matching)
```
--exclude-groups "Español"
```
This regular expression will remove all the channels that are in groups with 'Español' in the name.

#### Excluding multiple groups (exact matching)
```
--exclude-groups "^(Local News|En Español)$"
```
This regular expression will remove all the channels that are in the groups 'Local News' or 'En Español'.

#### Excluding multiple groups (partital matching)
```
--exclude-groups "(News|Español)"
```
This regular expression will remove all the channels that are in groups with 'News' or 'Español' in the name.

#### Further reading
Mozilla developer documents provide good documentation on regular expressions in javascript. The document can be found here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions

## Notes for Windows users
- Download and install nodejs from https://nodejs.org/en/download/ and install it
- Checkout the source code for for the pluto_tv_scraper
- Open cmd.exe
- cd to the pluto_tv_scraper directory
- install the dependencies with `npm install`
- run the script with `node ./index.js`
- to get some help, run `node ./index.js --help`

#### Pipes in regular expressions in Windows
It appears that command.exe does not utilise single quotes as "a single argument". As such, regular expressions must be enclosed in double quotes ("). This is especially true if the regular expresion conains the PIPE (|).
