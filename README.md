
███████╗██╗   ██╗██╗     ██╗         ███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝██║   ██║██║     ██║         ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
█████╗  ██║   ██║██║     ██║         ███████╗   ██║   ███████║██║     █████╔╝ 
██╔══╝  ██║   ██║██║     ██║         ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
██║     ╚██████╔╝███████╗███████╗    ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚═╝      ╚═════╝ ╚══════╝╚══════╝    ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝

How to fix errors after pulling
1. run `npm install`
    This will create the node_modules files and install all the dependencies

2. run `npm run build:dev`
    This will create the build folder for program to run
   
3. create database according to database config file under "src/config/database-config.js"
   1. Open MySQL
   2. Open up local instance 
   3. Right click on the empty space under schemas 
   4. Create a schema called wirela and click apply
   5. Click administration, then users and privileges
   6. Click add account
   7. Set login name as "wirela-admin", and password as "W1rela"
      1. under administrative roles tick DBA    
      2. Click Apply

4. to run server `npm run dev` 

=======
Notes
=======