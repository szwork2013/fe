# Zauzoo frontend
 - react + babel + es6 + webpack

### Develoment 
*Dependencies*
 - tested on node 0.12.7 (did not tried on node 4 yet)
 - recommended npm 3 : `npm install -g npm@v3.x-next` and then see https://github.com/felixrieseberg/npm-windows-upgrade

*Installation*
 - `npm install`

*Running (dev server)*
 - `npm run watch` then go to `http://localhost:3000`

*Building*
 - `npm run build` or `npm run build-linux`

*Running on Apache httpd* 
 - this is config file when running production build on local apache httpd server:

    Alias / c:/zauzoo/fe/build/
    ```
    <Directory "c:/zauzoo/fe/build/">
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>
    
    <Location "/">
      Header set X-UA-Compatible "IE=edge"
      ExpiresByType image/gif  "access plus 1 year"
      ExpiresByType image/png  "access plus 1 year"
      ExpiresByType image/jpeg  "access plus 1 year"
      ExpiresByType text/css  "access plus 1 year"
      ExpiresByType text/javascript "access plus 1 year"
      ExpiresByType application/javascript "access plus 1 year"
      ExpiresByType application/x-javascript "access plus 1 year"
      ExpiresByType image/gif  "access plus 1 year"
    </Location>
    
    <LocationMatch "/">
      AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
    </LocationMatch>
    
    RewriteEngine  on
    
    RewriteCond %{REQUEST_URI} !index
    RewriteCond %{REQUEST_URI} !api
    RewriteCond %{REQUEST_URI} !.*\.(html|js|ts|css|svg|jp(e?)g|png|gif|eot|woff|ttf|map)
    RewriteRule ^/(.*) /index.html [P,QSA,L]
```

dd
 
