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
npm run compilecss # Compile the bootstrap css files
node server.js
```