# panel
A manager dashboard for ptero/pelican panel.

# quick dev docs
```sql
CREATE DATABASE panelmgr;
CREATE USER 'panelmgruser'@'localhost' IDENTIFIED BY 'panelmgrpassword';
GRANT ALL PRIVILEGES ON panelmgr.* TO 'panelmgruser'@'localhost';
FLUSH PRIVILEGES;
exit
```

```sh
npm run css # Build the tailwind css files [production]
npm run css-watch # Rebuilding the css files during changes [development]
node server.js
```